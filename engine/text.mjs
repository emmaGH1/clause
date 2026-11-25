export const NOT_FOUND = "Kane couldn't find this on the pages it checked";
export const INCOMPLETE = "Check incomplete";

export function normalize(value) {
  return String(value ?? "").replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/\s+/g, " ").trim();
}

// Keep the sender's original whitespace and punctuation after locating the excerpt.
export function exactExcerpt(message, excerpt) {
  const target = normalize(excerpt);
  if (!target) return null;
  const offset = normalize(message).indexOf(target);
  if (offset < 0) return null;
  const characters = [...message.matchAll(/\s+|[^\s]/gu)];
  if (characters[0]?.[0].trim() === "") characters.shift();
  let start;
  let position = 0;
  for (const match of characters) {
    if (position === offset) start = match.index;
    position += match[0].trim() ? match[0].length : 1;
    if (start !== undefined && position === offset + target.length) {
      return message.slice(start, match.index + match[0].length);
    }
  }
  return null;
}

export function publicUrl(value) {
  try {
    const url = new URL(value);
    if (!["https:", "http:"].includes(url.protocol) || url.username || url.password || url.port) return null;
    if (!/^[a-z0-9-]+(?:\.[a-z0-9-]+)*\.[a-z][a-z0-9-]*$/i.test(url.hostname)) return null;
    if (/\.(?:localhost|local|internal|lan|test|invalid|example|onion)$/i.test(url.hostname)) return null;
    url.hash = "";
    return url;
  } catch {
    return null;
  }
}
