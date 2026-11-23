const OPTIMIZED_IMAGE_HOSTS = new Set(['res.cloudinary.com', 'i.imgur.com', 'imgur.com']);
const URL_CANDIDATE_REGEX = /https?:\/\/[^\s"'<>]+/gi;
const TRAILING_PUNCTUATION_REGEX = /[),.;]+$/;

function isHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function normalizeCandidate(candidate: string): string {
  return candidate.trim().replace(TRAILING_PUNCTUATION_REGEX, '');
}

export function sanitizeImageSrc(raw: string | null | undefined, fallback: string): string {
  if (!raw || typeof raw !== 'string') return fallback;

  const trimmed = raw.trim();
  if (!trimmed) return fallback;

  if (trimmed.startsWith('/')) return trimmed;
  if (isHttpUrl(trimmed)) return trimmed;

  const matches = trimmed.match(URL_CANDIDATE_REGEX);
  if (!matches) return fallback;

  for (const match of matches) {
    const candidate = normalizeCandidate(match);
    if (isHttpUrl(candidate)) {
      return candidate;
    }
  }

  return fallback;
}

export function canOptimizeImageSrc(src: string): boolean {
  if (src.startsWith('/')) return true;

  try {
    const parsed = new URL(src);
    return OPTIMIZED_IMAGE_HOSTS.has(parsed.hostname);
  } catch {
    return false;
  }
}
