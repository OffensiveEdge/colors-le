import * as vscode from 'vscode';
import * as nls from 'vscode-nls';
import type { Configuration } from '../types';
import { createEnhancedError, type EnhancedError } from './errorHandling';

const localize = nls.config({ messageFormat: nls.MessageFormat.file })();

export interface SafetyResult {
	readonly proceed: boolean;
	readonly message: string;
	readonly error?: EnhancedError;
	readonly warnings: readonly string[];
}

export interface SafetyCheckOptions {
	readonly showProgress?: boolean;
	readonly allowOverride?: boolean;
	readonly customThresholds?: {
		readonly fileSizeBytes?: number;
		readonly lineCount?: number;
		readonly colorCount?: number;
	};
}

export function handleSafetyChecks(
	document: vscode.TextDocument,
	config: Configuration,
	options: SafetyCheckOptions = {},
): SafetyResult {
	if (!config.safetyEnabled) {
		return Object.freeze({
			proceed: true,
			message: '',
			warnings: Object.freeze([]),
		});
	}

	const content = document.getText();
	const fileSizeThreshold =
		options.customThresholds?.fileSizeBytes ?? config.safetyFileSizeWarnBytes;

	const exceedsFileSize = content.length > fileSizeThreshold;
	if (exceedsFileSize) {
		const error = createEnhancedError(
			new Error(
				localize(
					'runtime.safety.file-size',
					'File size ({0} bytes) exceeds safety threshold ({1} bytes)',
					content.length,
					fileSizeThreshold,
				),
			),
			'safety',
			{
				fileSize: content.length,
				threshold: fileSizeThreshold,
				fileName: document.fileName,
			},
			{
				recoverable: false,
				severity: 'high',
				suggestion: localize(
					'runtime.safety.file-size.suggestion',
					'Consider splitting the file or increasing the safety threshold in settings',
				),
			},
		);

		return Object.freeze({
			proceed: false,
			message: error.userMessage,
			error,
			warnings: Object.freeze([]),
		});
	}

	const warnings = collectSafetyWarnings(content, config, options);
	const hasWarnings = warnings.length > 0;
	const message = hasWarnings
		? localize(
				'runtime.safety.warnings',
				'Safety checks passed with {0} warnings',
				warnings.length,
			)
		: localize('runtime.safety.passed', 'Safety checks passed');

	return Object.freeze({
		proceed: true,
		message,
		warnings: Object.freeze(warnings),
	});
}

function collectSafetyWarnings(
	content: string,
	config: Configuration,
	options: SafetyCheckOptions,
): string[] {
	const warnings: string[] = [];
	const lines = content.split('\n');
	const lineCountThreshold =
		options.customThresholds?.lineCount ??
		config.safetyLargeOutputLinesThreshold;

	const exceedsLineCount = lines.length > lineCountThreshold;
	if (exceedsLineCount) {
		warnings.push(
			localize(
				'runtime.safety.line-count.warning',
				'Large file detected: {0} lines (threshold: {1})',
				lines.length,
				lineCountThreshold,
			),
		);
	}

	const estimatedColors = estimateColorCount(content);
	const hasManyColors = estimatedColors > 1000;
	if (hasManyColors) {
		warnings.push(
			localize(
				'runtime.safety.color-count.warning',
				'Large number of colors detected: estimated {0} colors',
				estimatedColors,
			),
		);
	}

	const complexPatterns = countComplexPatterns(content);
	const hasComplexPatterns = complexPatterns > 100;
	if (hasComplexPatterns) {
		warnings.push(
			localize(
				'runtime.safety.complex-patterns.warning',
				'Complex CSS patterns detected: {0} patterns',
				complexPatterns,
			),
		);
	}

	return warnings;
}

export async function handleSafetyChecksWithUserConfirmation(
	document: vscode.TextDocument,
	config: Configuration,
	options: SafetyCheckOptions = {},
): Promise<SafetyResult> {
	const result = handleSafetyChecks(document, config, options);

	const canProceed = result.proceed;
	if (canProceed) {
		return result;
	}

	const allowsOverride = options.allowOverride === true;
	if (!allowsOverride) {
		return result;
	}

	const continueLabel = localize(
		'runtime.safety.override.continue',
		'Continue Anyway',
	);
	const cancelLabel = localize('runtime.safety.override.cancel', 'Cancel');

	const userChoice = await vscode.window.showWarningMessage(
		result.message,
		{
			modal: true,
			detail: localize(
				'runtime.safety.override.detail',
				'This operation may take a long time or consume significant resources. Do you want to continue?',
			),
		},
		continueLabel,
		cancelLabel,
	);

	const userApproved = userChoice === continueLabel;
	if (!userApproved) {
		return result;
	}

	return Object.freeze({
		...result,
		proceed: true,
		message: localize(
			'runtime.safety.override.approved',
			'Safety override approved by user',
		),
	});
}

/**
 * Estimate the number of colors in the content
 */
function estimateColorCount(content: string): number {
	const hexMatches = content.match(/#[0-9a-fA-F]{3,8}/g);
	const hexColors = hexMatches?.length ?? 0;

	const rgbMatches = content.match(/rgb\([^)]+\)/g);
	const rgbColors = rgbMatches?.length ?? 0;

	const rgbaMatches = content.match(/rgba\([^)]+\)/g);
	const rgbaColors = rgbaMatches?.length ?? 0;

	const hslMatches = content.match(/hsl\([^)]+\)/g);
	const hslColors = hslMatches?.length ?? 0;

	const hslaMatches = content.match(/hsla\([^)]+\)/g);
	const hslaColors = hslaMatches?.length ?? 0;

	return hexColors + rgbColors + rgbaColors + hslColors + hslaColors;
}

/**
 * Count complex CSS patterns that might be slow to parse
 */
function countComplexPatterns(content: string): number {
	const selectorMatches = content.match(/[.#][^{]*\{[^}]*\{/g);
	const complexSelectors = selectorMatches?.length ?? 0;

	const mediaMatches = content.match(/@media[^{]*\{/g);
	const mediaQueries = mediaMatches?.length ?? 0;

	const keyframeMatches = content.match(/@keyframes[^{]*\{/g);
	const keyframes = keyframeMatches?.length ?? 0;

	const functionMatches = content.match(/@function[^{]*\{/g);
	const functions = functionMatches?.length ?? 0;

	const mixinMatches = content.match(/@mixin[^{]*\{/g);
	const mixins = mixinMatches?.length ?? 0;

	return complexSelectors + mediaQueries + keyframes + functions + mixins;
}

/**
 * Check if operation should be cancelled based on safety thresholds
 */
export function shouldCancelOperation(
	processedItems: number,
	threshold: number,
	startTime: number,
	maxTimeMs: number = 30000,
): boolean {
	const exceedsThreshold = processedItems > threshold;
	if (exceedsThreshold) {
		return true;
	}

	const elapsedTime = Date.now() - startTime;
	const exceedsTimeout = elapsedTime > maxTimeMs;
	return exceedsTimeout;
}

/**
 * Create safety warning for display
 */
export function createSafetyWarning(
	message: string,
	details: Readonly<Record<string, unknown>> = {},
): EnhancedError {
	const error = new Error(message);
	const suggestion = localize(
		'runtime.safety.warning.suggestion',
		'Consider adjusting safety settings or breaking down the operation',
	);

	return createEnhancedError(error, 'safety', details, {
		severity: 'medium',
		recoverable: true,
		suggestion,
	});
}

void localize;
