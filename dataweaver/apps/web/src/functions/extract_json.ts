/**
 * Extracts and parses the first JSON object found in a string. Useful for
 * pulling structured data from LLM responses that may contain surrounding
 * markdown or prose.
 *
 * Uses balanced-brace scanning to find the smallest valid JSON object
 * starting from the first `{`, avoiding the greedy over-match that a
 * simple regex like `/\{[\s\S]*\}/` would produce.
 *
 * Returns the parsed value on success, or `undefined` if no valid JSON object
 * is found.
 *
 * @example
 * extractJson('Here is the result: {"a": 1}'); // { a: 1 }
 * extractJson('no json here'); // undefined
 */
export const extractJson = <T = unknown>(text: string): T | undefined => {
  const start = text.indexOf('{');
  if (start === -1) return undefined;

  let depth = 0;
  let inString = false;
  let isEscaped = false;

  for (let i = start; i < text.length; i++) {
    const char = text[i];

    if (isEscaped) {
      isEscaped = false;
      continue;
    }

    if (char === '\\' && inString) {
      isEscaped = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (char === '{') {
      depth++;
    } else if (char === '}') {
      depth--;
      if (depth === 0) {
        try {
          return JSON.parse(text.slice(start, i + 1)) as T;
        } catch {
          return undefined;
        }
      }
    }
  }

  return undefined;
};
