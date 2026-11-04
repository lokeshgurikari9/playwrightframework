import { test, expect } from '@playwright/test';
import { decodeJwtPayload, isJwt, isJwtExpired } from '../../../utils/helpers/tokenParser';

const encodeSegment = (value: Record<string, unknown>): string =>
  Buffer.from(JSON.stringify(value)).toString('base64url');

const buildJwt = (payload: Record<string, unknown>): string =>
  [encodeSegment({ alg: 'none', typ: 'JWT' }), encodeSegment(payload), 'signature'].join('.');

test.describe('Token parser', () => {
  test('@regression decodes JWT claims and detects expiry', () => {
    const futureToken = buildJwt({ sub: '42', exp: Math.floor(Date.now() / 1000) + 3600 });
    const expiredToken = buildJwt({ sub: '42', exp: Math.floor(Date.now() / 1000) - 3600 });

    expect(isJwt(futureToken)).toBe(true);
    expect(decodeJwtPayload(futureToken)).toMatchObject({ sub: '42' });
    expect(isJwtExpired(futureToken)).toBe(false);
    expect(isJwtExpired(expiredToken)).toBe(true);
  });

  test('@regression treats opaque tokens as non-JWT', () => {
    expect(isJwt('QpwL5tke4Pnpja7X4')).toBe(false);
    expect(decodeJwtPayload('not-a-jwt')).toBeNull();
    expect(isJwtExpired('not-a-jwt')).toBeNull();
  });
});
