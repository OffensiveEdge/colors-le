import * as nls from 'vscode-nls';
import { getConfiguration } from '../config/config';
import type { Color, ExtractionResult, FileType, ParseError } from '../types';
import { createEnhancedError } from '../utils/errorHandling';
import {
	createPerformanceTracker,
	shouldCancelBasedOnPerformance,
} from '../utils/performance';
import { extractFromCss } from './formats/css';
import { extractFromHtml } from './formats/html';
import { extractFromJavaScript } from './formats/javascript';
import { extractFromLESS } from './formats/less';
import { extractFromSCSS } from './formats/scss';
import { extractFromStylus } from './formats/stylus';
import { extractFromSvg } from './formats/svg';

const localize = nls.config({ messageFormat: nls.MessageFormat.file })();

export interface ExtractionOptions {
	readonly filepath?: string;
	readonly showProgress?: boolean;
	readonly includeMetadata?: boolean;
	readonly maxColors?: number;
	readonly timeoutMs?: number;
	readonly enablePerformanceMonitoring?: boolean;
}

export async function extractColors(
	content: string,
	languageId: string,
	options: ExtractionOptions = {},
): Promise<ExtractionResult> {
	const startTime = Date.now();
	const fileType = determineFileType(languageId);

	const performanceTracker = initializePerformanceTracker(options, content);

	const isEmpty = !content || content.trim().length === 0;
	if (isEmpty) {
		return createEmptyExtractionResult(
			fileType,
			content,
			startTime,
			options,
			performanceTracker,
		);
	}

	const lines = content.split('\n');
	const extractionContext = {
		colors: [] as Color[],
		errors: [] as ParseError[],
		warnings: [] as string[],
		processedLines: 0,
	};

	const shouldCancel = shouldCancelBasedOnPerformance(
		startTime,
		0,
		options.timeoutMs || 30000,
	);
	if (shouldCancel) {
		extractionContext.warnings.push(
			localize(
				'runtime.extraction.cancelled',
				'Operation cancelled due to performance constraints',
			),
		);
		return buildExtractionResult(
			extractionContext,
			fileType,
			lines,
			startTime,
			options,
			performanceTracker,
		);
	}

	performExtraction(content, fileType, languageId, extractionContext);
	extractionContext.processedLines = lines.length;

	applyColorLimits(extractionContext, options);
	checkTimeout(extractionContext, startTime, options);
	checkPerformanceLimits(extractionContext, startTime, options);

	return buildExtractionResult(
		extractionContext,
		fileType,
		lines,
		startTime,
		options,
		performanceTracker,
	);
}

function initializePerformanceTracker(
	options: ExtractionOptions,
	content: string,
) {
	if (!options.enablePerformanceMonitoring) {
		return null;
	}

	const tracker = createPerformanceTracker(getConfiguration());
	tracker.start('extract-colors', content.length);
	return tracker;
}

function createEmptyExtractionResult(
	fileType: FileType,
	content: string,
	startTime: number,
	options: ExtractionOptions,
	performanceTracker: ReturnType<typeof createPerformanceTracker> | null,
): ExtractionResult {
	const error = createEnhancedError(
		new Error(
			localize(
				'runtime.extraction.empty-content',
				'Content is empty or invalid',
			),
		),
		'validation',
		{ contentLength: content.length },
		{
			recoverable: false,
			severity: 'low',
		},
	);

	const metrics = performanceTracker?.end(0, 0, 0, 1);

	return Object.freeze({
		success: false,
		colors: Object.freeze([]),
		errors: Object.freeze([
			{
				type: 'validation-error' as const,
				message: error.userMessage,
				filepath: options.filepath,
			},
		]),
		warnings: Object.freeze([]),
		metadata: options.includeMetadata
			? Object.freeze({
					fileType,
					totalLines: content.split('\n').length,
					processedLines: 0,
					processingTimeMs: Date.now() - startTime,
					performanceMetrics: metrics || undefined,
				})
			: undefined,
	});
}

interface ExtractionContext {
	colors: Color[];
	errors: ParseError[];
	warnings: string[];
	processedLines: number;
}

function performExtraction(
	content: string,
	fileType: FileType,
	languageId: string,
	context: ExtractionContext,
): void {
	try {
		const extractedColors = extractColorsByFileType(
			content,
			fileType,
			languageId,
		);
		context.colors.push(...extractedColors);
	} catch (error) {
		const enhancedError = createExtractionError(
			error,
			fileType,
			languageId,
			content,
		);
		context.errors.push({
			type: 'parse-error',
			message: enhancedError.userMessage,
		});
	}
}

function extractColorsByFileType(
	content: string,
	fileType: FileType,
	languageId: string,
): readonly Color[] {
	switch (fileType) {
		case 'css':
			return extractFromCss(content);
		case 'scss':
			return extractFromSCSS(content);
		case 'less':
			return extractFromLESS(content);
		case 'stylus':
			return extractFromStylus(content);
		case 'html':
			return extractFromHtml(content);
		case 'javascript':
		case 'typescript':
			return extractFromJavaScript(content);
		case 'svg':
			return extractFromSvg(content);
		default:
			// Fallback to CSS extraction for unknown types
			console.warn(
				localize(
					'runtime.extraction.fallback',
					'Unknown file type "{0}", using CSS extraction as fallback',
					languageId,
				),
			);
			return extractFromCss(content);
	}
}

function createExtractionError(
	error: unknown,
	fileType: FileType,
	languageId: string,
	content: string,
) {
	if (error instanceof Error) {
		return createEnhancedError(
			error,
			'parse',
			{
				fileType,
				contentLength: content.length,
				languageId,
			},
			{
				recoverable: true,
				severity: 'medium',
				suggestion: localize(
					'runtime.extraction.parse-error.suggestion',
					'Try checking file syntax or using a different file format',
				),
			},
		);
	}

	return createEnhancedError(
		new Error(
			localize('runtime.extraction.unknown-error', 'Unknown parsing error'),
		),
		'parse',
		{ fileType, languageId },
		{
			recoverable: true,
			severity: 'medium',
		},
	);
}

function applyColorLimits(
	context: ExtractionContext,
	options: ExtractionOptions,
): void {
	if (!options.maxColors) {
		return;
	}

	const exceedsLimit = context.colors.length > options.maxColors;
	if (!exceedsLimit) {
		return;
	}

	context.warnings.push(
		localize(
			'runtime.extraction.color-limit',
			'Color count ({0}) exceeds limit ({1}), truncating results',
			context.colors.length,
			options.maxColors,
		),
	);

	context.colors.splice(
		0,
		context.colors.length,
		...context.colors.slice(0, options.maxColors),
	);
}

function checkTimeout(
	context: ExtractionContext,
	startTime: number,
	options: ExtractionOptions,
): void {
	if (!options.timeoutMs) {
		return;
	}

	const processingTime = Date.now() - startTime;
	const exceededTimeout = processingTime > options.timeoutMs;

	if (!exceededTimeout) {
		return;
	}

	context.warnings.push(
		localize(
			'runtime.extraction.timeout',
			'Processing time ({0}ms) exceeded timeout ({1}ms)',
			processingTime,
			options.timeoutMs,
		),
	);
}

function checkPerformanceLimits(
	context: ExtractionContext,
	startTime: number,
	options: ExtractionOptions,
): void {
	const shouldCancel = shouldCancelBasedOnPerformance(
		startTime,
		context.colors.length,
		options.timeoutMs || 30000,
	);

	if (!shouldCancel) {
		return;
	}

	context.warnings.push(
		localize(
			'runtime.extraction.performance-cancelled',
			'Operation cancelled due to performance limits',
		),
	);
}

function buildExtractionResult(
	context: ExtractionContext,
	fileType: FileType,
	lines: readonly string[],
	startTime: number,
	options: ExtractionOptions,
	performanceTracker: ReturnType<typeof createPerformanceTracker> | null,
): ExtractionResult {
	const metrics = performanceTracker?.end(
		context.colors.length,
		context.colors.length,
		context.warnings.length,
		context.errors.length,
	);

	const hasErrors = context.errors.length > 0;

	return Object.freeze({
		success: !hasErrors,
		colors: Object.freeze(context.colors),
		errors: Object.freeze(context.errors),
		warnings: Object.freeze(context.warnings),
		metadata: options.includeMetadata
			? Object.freeze({
					fileType,
					totalLines: lines.length,
					processedLines: context.processedLines,
					processingTimeMs: Date.now() - startTime,
					performanceMetrics: metrics || undefined,
				})
			: undefined,
	});
}

function determineFileType(languageId: string): FileType {
	switch (languageId) {
		case 'css':
			return 'css';
		case 'scss':
			return 'scss';
		case 'less':
			return 'less';
		case 'stylus':
			return 'stylus';
		case 'html':
			return 'html';
		case 'javascript':
			return 'javascript';
		case 'typescript':
			return 'typescript';
		case 'xml':
		case 'svg':
			return 'svg';
		default:
			return 'unknown';
	}
}
