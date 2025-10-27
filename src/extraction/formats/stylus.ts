import type { Color } from '../../types';

/**
 * Extract colors from Stylus files
 */
export function extractFromStylus(content: string): readonly Color[] {
	const colors: Color[] = [];
	const lines = content.split('\n');

	// Stylus color patterns
	const patterns = [
		// Variables: primary-color = #ff0000 or $primary-color = #ff0000
		/(?:^|\s)([\w-]+|\$[\w-]+)\s*[=:]\s*(#[0-9a-f]{3,8}|rgb\([^)]+\)|rgba\([^)]+\)|hsl\([^)]+\)|hsla\([^)]+\)|[a-z]+)\s*$/gim,
		// Properties: color #ff0000 or color: #ff0000
		/(?:color|background|border|outline|box-shadow|text-shadow)\s*:?\s*([^;\n]+)/gi,
		// Functions: lighten(#ff0000, 10%)
		/(?:lighten|darken|saturate|desaturate|adjust-hue|mix|rgba)\s*\(\s*([^,)]+)/gi,
		// Hex colors anywhere
		/#[0-9a-f]{3,8}/gi,
		// RGB/RGBA functions
		/rgba?\s*\([^)]+\)/gi,
		// HSL/HSLA functions
		/hsla?\s*\([^)]+\)/gi,
	];

	for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
		const line = lines[lineIndex];
		if (!line) {
			continue;
		}

		for (const pattern of patterns) {
			let match: RegExpExecArray | null;
			pattern.lastIndex = 0; // Reset regex state

			while ((match = pattern.exec(line)) !== null) {
				const matchedValue = match[2] || match[1] || match[0];
				const matchIndex = match.index;

				// Guard: ensure value and index exist
				if (!matchedValue || matchIndex === undefined) continue;

				const colorValue = matchedValue.trim();
				if (!colorValue) continue;

				if (isValidColorValue(colorValue)) {
					const format = determineColorFormat(colorValue);

					colors.push(
						Object.freeze({
							value: colorValue,
							format,
							position: Object.freeze({
								line: lineIndex + 1,
								column: matchIndex,
							}),
							context: `Stylus ${getContextType(line)}`,
						}),
					);
				}
			}
		}
	}

	return Object.freeze(colors);
}

/**
 * Determine if a value is a valid color
 */
function isValidColorValue(value: string): boolean {
	if (!value) return false;

	// Skip Stylus variables and functions that aren't colors
	if (value.includes('(') && !value.match(/^(rgb|rgba|hsl|hsla)\(/)) {
		return false;
	}

	// Check for valid color formats
	const colorPatterns = [
		/^#[0-9a-f]{3,8}$/i, // hex
		/^rgb\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/i, // rgb
		/^rgba\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/i, // rgba
		/^hsl\s*\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/i, // hsl
		/^hsla\s*\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*,\s*[\d.]+\s*\)$/i, // hsla
	];

	return (
		colorPatterns.some((pattern) => pattern.test(value)) || isNamedColor(value)
	);
}

/**
 * Determine the format of a color value
 */
function determineColorFormat(value: string): Color['format'] {
	if (value.startsWith('#')) return 'hex';
	if (value.startsWith('rgb(')) return 'rgb';
	if (value.startsWith('rgba(')) return 'rgba';
	if (value.startsWith('hsl(')) return 'hsl';
	if (value.startsWith('hsla(')) return 'hsla';
	if (isNamedColor(value)) return 'named';
	return 'unknown';
}

/**
 * Check if a value is a named color
 */
function isNamedColor(value: string): boolean {
	const namedColors = [
		'aliceblue',
		'antiquewhite',
		'aqua',
		'aquamarine',
		'azure',
		'beige',
		'bisque',
		'black',
		'blanchedalmond',
		'blue',
		'blueviolet',
		'brown',
		'burlywood',
		'cadetblue',
		'chartreuse',
		'chocolate',
		'coral',
		'cornflowerblue',
		'cornsilk',
		'crimson',
		'cyan',
		'darkblue',
		'darkcyan',
		'darkgoldenrod',
		'darkgray',
		'darkgreen',
		'darkkhaki',
		'darkmagenta',
		'darkolivegreen',
		'darkorange',
		'darkorchid',
		'darkred',
		'darksalmon',
		'darkseagreen',
		'darkslateblue',
		'darkslategray',
		'darkturquoise',
		'darkviolet',
		'deeppink',
		'deepskyblue',
		'dimgray',
		'dodgerblue',
		'firebrick',
		'floralwhite',
		'forestgreen',
		'fuchsia',
		'gainsboro',
		'ghostwhite',
		'gold',
		'goldenrod',
		'gray',
		'green',
		'greenyellow',
		'honeydew',
		'hotpink',
		'indianred',
		'indigo',
		'ivory',
		'khaki',
		'lavender',
		'lavenderblush',
		'lawngreen',
		'lemonchiffon',
		'lightblue',
		'lightcoral',
		'lightcyan',
		'lightgoldenrodyellow',
		'lightgray',
		'lightgreen',
		'lightpink',
		'lightsalmon',
		'lightseagreen',
		'lightskyblue',
		'lightslategray',
		'lightsteelblue',
		'lightyellow',
		'lime',
		'limegreen',
		'linen',
		'magenta',
		'maroon',
		'mediumaquamarine',
		'mediumblue',
		'mediumorchid',
		'mediumpurple',
		'mediumseagreen',
		'mediumslateblue',
		'mediumspringgreen',
		'mediumturquoise',
		'mediumvioletred',
		'midnightblue',
		'mintcream',
		'mistyrose',
		'moccasin',
		'navajowhite',
		'navy',
		'oldlace',
		'olive',
		'olivedrab',
		'orange',
		'orangered',
		'orchid',
		'palegoldenrod',
		'palegreen',
		'paleturquoise',
		'palevioletred',
		'papayawhip',
		'peachpuff',
		'peru',
		'pink',
		'plum',
		'powderblue',
		'purple',
		'red',
		'rosybrown',
		'royalblue',
		'saddlebrown',
		'salmon',
		'sandybrown',
		'seagreen',
		'seashell',
		'sienna',
		'silver',
		'skyblue',
		'slateblue',
		'slategray',
		'snow',
		'springgreen',
		'steelblue',
		'tan',
		'teal',
		'thistle',
		'tomato',
		'turquoise',
		'violet',
		'wheat',
		'white',
		'whitesmoke',
		'yellow',
		'yellowgreen',
		'transparent',
	];

	return namedColors.includes(value.toLowerCase());
}

/**
 * Get the context type from a line of Stylus
 */
function getContextType(line: string): string {
	if (line.includes('=') || line.includes('$')) return 'variable';
	if (line.includes('()') || line.includes('(')) return 'function';
	if (line.includes(':')) return 'property';
	return 'declaration';
}
