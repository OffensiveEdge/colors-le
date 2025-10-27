export function dedupeColors(lines: readonly string[]): readonly string[] {
	const seen = new Set<string>();
	const result: string[] = [];

	for (const line of lines) {
		const trimmed = line.trim();

		const isEmpty = !trimmed;
		if (isEmpty) {
			continue;
		}

		const alreadySeen = seen.has(trimmed);
		if (alreadySeen) {
			continue;
		}

		seen.add(trimmed);
		result.push(line);
	}

	return Object.freeze(result);
}
