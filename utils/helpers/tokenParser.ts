/**
 * Helpers for working with bearer tokens. ReqRes returns an opaque token, so
 * these helpers intentionally support both opaque tokens and JWTs.
 */
export function extractBearerToken(headerValue?: string | null): string | null {
  if (!headerValue) return null;

  const match = /^Bearer\s+(.+)$/i.exec(headerValue.trim());
  return match?.[1] ?? null;
}

export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const segments = token.split('.');
  if (segments.length !== 3) return null;

  try {
    const payload = Buffer.from(segments[1], 'base64url').toString('utf8');
    const parsed: unknown = JSON.parse(payload);
    return parsed !== null && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export function isJwt(token: string): boolean {
  return decodeJwtPayload(token) !== null;
}

/**
 * Returns null when the token is not a JWT or has no `exp` claim, otherwise
 * reports whether the expiry has passed.
 */
export function isJwtExpired(token: string, clockSkewSeconds = 0): boolean | null {
  const payload = decodeJwtPayload(token);
  const expiry = payload?.exp;

  if (typeof expiry !== 'number') return null;
  return expiry * 1000 <= Date.now() - clockSkewSeconds * 1000;
}
