import { Pool, pools } from "../models/Pool";

describe("Pool model", () => {
  it("Insert - should add item to pools storage", () => {
    const pool = Pool.insert("pool 1", "is it pool 1 ?");
    expect(pools.values()[0]).toStrictEqual(pool);
  });
  it("insert - should throw error if user already create pool with same name", () => {
    Pool.insert("pool 1", "is it pool 1 ?");
    expect(() => {
      Pool.insert("pool 1", "is it pool 1 ?");
    }).toThrow();
  });
  it("get - should return pool instance if exist", () => {
    const pool = Pool.insert("pool 1", "is it pool 1 ?");
    expect(Pool.get(pool.id)).toStrictEqual(pool);
  });
  it("get - should return undefined if pool not found", () => {
    expect(Pool.get(1)).toBe(null);
  });
  it("getSome - should return pool instance if exist", () => {
    const pool = Pool.insert("pool 1", "is it pool 1 ?");
    expect(Pool.getSome(pool.id)).toStrictEqual(pool);
  });
  it("getSome - should throw error if pool not found", () => {
    expect(() => Pool.getSome(1)).toThrow();
  });
  it("getList - should return 'limit' of pools start's from 'offset'", () => {
    const poolsList = [
      Pool.insert("pool 1", ""),
      Pool.insert("pool 2", ""),
      Pool.insert("pool 3", ""),
    ];

    const list = Pool.getList(0, 2);
    expect(list.length).toBe(2);
    expect(list).toStrictEqual(poolsList.slice(0, 2));
  });
  it("getList - should return 'limit'(or less) of pools start's from 'offset'", () => {
    const poolsList = [
      Pool.insert("pool 1", ""),
      Pool.insert("pool 2", ""),
      Pool.insert("pool 3", ""),
    ];

    let list = Pool.getList(0, poolsList.length - 1);
    expect(list.length).toBe(2);
    expect(list).toStrictEqual(poolsList.slice(0, poolsList.length - 1));

    list = Pool.getList(0, poolsList.length + 1);
    expect(list.length).toBe(poolsList.length);
    expect(list).toStrictEqual(poolsList);
  });

  it("markAsDeleted - should set 'deleted' property to true, if pool exist", () => {
    let pool = Pool.insert("pool 1", "", false);
    Pool.markAsDeleted(pool.id);
    pool = Pool.getSome(pool.id);
    expect(pool.deleted).toBeTruthy();
  });
  it("markAsDeleted - should throw error if pool not found", () => {
    expect(() => {
      Pool.markAsDeleted(1);
    }).toThrow();
  });
});
