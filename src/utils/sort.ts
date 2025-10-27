import type { SortMode } from '../types';
import { parseColor, rgbToHsl } from './colorConversion';

export function sortColors(
	lines: readonly string[],
	sortMode: SortMode,
): readonly string[] {
	const filteredLines = lines.filter((line) => line.trim().length > 0);

	switch (sortMode) {
		case 'off':
			return Object.freeze([...lines]);
		case 'hex-asc':
			return Object.freeze(filteredLines.sort((a, b) => a.localeCompare(b)));
		case 'hex-desc':
			return Object.freeze(filteredLines.sort((a, b) => b.localeCompare(a)));
		case 'hue-asc':
			return sortByHue(filteredLines, 'asc');
		case 'hue-desc':
			return sortByHue(filteredLines, 'desc');
		case 'saturation-asc':
			return sortBySaturation(filteredLines, 'asc');
		case 'saturation-desc':
			return sortBySaturation(filteredLines, 'desc');
		case 'lightness-asc':
			return sortByLightness(filteredLines, 'asc');
		case 'lightness-desc':
			return sortByLightness(filteredLines, 'desc');
		default:
			return Object.freeze(filteredLines);
	}
}

function sortByHue(
	lines: string[],
	direction: 'asc' | 'desc',
): readonly string[] {
	const sorted = lines.sort((a, b) => {
		const hueA = extractHue(a);
		const hueB = extractHue(b);

		if (direction === 'asc') {
			return hueA - hueB;
		}

		return hueB - hueA;
	});

	return Object.freeze(sorted);
}

function sortBySaturation(
	lines: string[],
	direction: 'asc' | 'desc',
): readonly string[] {
	const sorted = lines.sort((a, b) => {
		const satA = extractSaturation(a);
		const satB = extractSaturation(b);

		if (direction === 'asc') {
			return satA - satB;
		}

		return satB - satA;
	});

	return Object.freeze(sorted);
}

function sortByLightness(
	lines: string[],
	direction: 'asc' | 'desc',
): readonly string[] {
	const sorted = lines.sort((a, b) => {
		const lightA = extractLightness(a);
		const lightB = extractLightness(b);

		if (direction === 'asc') {
			return lightA - lightB;
		}

		return lightB - lightA;
	});

	return Object.freeze(sorted);
}

function extractHue(color: string): number {
	const rgb = parseColor(color);
	if (!rgb) {
		return 0;
	}

	const hsl = rgbToHsl(rgb);
	return hsl.h;
}

function extractSaturation(color: string): number {
	const rgb = parseColor(color);
	if (!rgb) {
		return 0;
	}

	const hsl = rgbToHsl(rgb);
	return hsl.s;
}

function extractLightness(color: string): number {
	const rgb = parseColor(color);
	if (!rgb) {
		return 0;
	}

	const hsl = rgbToHsl(rgb);
	return hsl.l;
}
