export type QueryValue = string | number | boolean;

/**
 * Converts a typed params object into a query object, dropping undefined
 * values. Accepts interfaces (which lack an index signature) safely.
 */
export function toQueryParams(params?: object): Record<string, QueryValue> {
  if (!params) return {};

  return Object.fromEntries(
    Object.entries(params).filter(
      (entry): entry is [string, QueryValue] => entry[1] !== undefined,
    ),
  );
}
