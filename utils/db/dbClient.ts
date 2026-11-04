export type EntityId = string | number;
export type DbRecord = Record<string, unknown> & { id: EntityId };

/**
 * Minimal in-memory data store for tests that need deterministic local state
 * without provisioning a real database. It mirrors the small surface area a
 * test fixture needs: insert, read, search, delete and reset.
 */
export class InMemoryDbClient {
  private readonly tables = new Map<string, Map<EntityId, DbRecord>>();

  insert<T extends { id: EntityId }>(table: string, record: T): T {
    const target = this.table(table);
    if (target.has(record.id)) {
      throw new Error(`Record with id "${record.id}" already exists in table "${table}"`);
    }

    target.set(record.id, { ...record } as DbRecord);
    return record;
  }

  upsert<T extends { id: EntityId }>(table: string, record: T): T {
    this.table(table).set(record.id, { ...record } as DbRecord);
    return record;
  }

  get<T extends { id: EntityId }>(table: string, id: EntityId): T | undefined {
    return this.table(table).get(id) as T | undefined;
  }

  find<T extends { id: EntityId }>(table: string, predicate: (record: T) => boolean): T[] {
    return this.all<T>(table).filter(predicate);
  }

  all<T extends { id: EntityId }>(table: string): T[] {
    return [...this.table(table).values()] as T[];
  }

  delete(table: string, id: EntityId): boolean {
    return this.table(table).delete(id);
  }

  count(table: string): number {
    return this.table(table).size;
  }

  clear(table?: string): void {
    if (table) {
      this.tables.delete(table);
      return;
    }

    this.tables.clear();
  }

  private table(table: string): Map<EntityId, DbRecord> {
    let target = this.tables.get(table);
    if (!target) {
      target = new Map<EntityId, DbRecord>();
      this.tables.set(table, target);
    }

    return target;
  }
}
