import { Pool, pools } from "../models/Pool";
import { Vote, votes } from "../models/Vote";
import { Option, options } from "../models/Option";
import {
  createPoolWithOptions,
  getPool,
  deletePool,
  createVote,
  getPoolsList,
  getPoolOptions,
  getPoolVotes,
  checkAccountVote,
} from "..";
import { VMContext } from "near-sdk-as";

describe("contract methods", () => {
  it("createPoolWithOptions should store pool and options in storage", () => {
    const result = createPoolWithOptions("pool", "question", ["op1", "op2"]);

    expect(pools.values()[0]).toStrictEqual(result.pool);
    expect(options.values()[0]).toStrictEqual(result.options[0]);
    expect(options.values()[1]).toStrictEqual(result.options[1]);
  });

  it("createPoolWithOptions should throw error if user already create same pool", () => {
    const result = createPoolWithOptions("pool", "question", ["op1", "op2"]);
    expect(() => {
      createPoolWithOptions("pool", "question", ["op3", "op4"]);
    }).toThrow();
  });
  it("getPool should return pool if exist", () => {
    const pool = Pool.insert("t", "t");
    const result = getPool(pool.id);
    expect(result).toStrictEqual(pool);
  });
  it("getPool should throw error if pool not found", () => {
    expect(() => getPool(1)).toThrow();
  });
  it("deletePool should set deleted mark", () => {
    const pool = Pool.insert("t", "t", false);
    deletePool(pool.id);
    const sPool = Pool.getSome(pool.id);
    expect(sPool.deleted).toBeTruthy();
  });
  it("createVote should create vote", () => {
    const r = createPoolWithOptions("pool", "question", ["op"]);
    const vote = createVote(r.options[0].id);
    const sVote = Vote.get(vote.id);
    expect(sVote).toStrictEqual(vote);
  });
  it("getPoolsList - should return 'limit' of pools start's from 'offset'", () => {
    const poolsList = [
      Pool.insert("pool 1", ""),
      Pool.insert("pool 2", ""),
      Pool.insert("pool 3", ""),
    ];

    const list = getPoolsList(0, 2);
    expect(list.length).toBe(2);
    expect(list).toStrictEqual(poolsList.slice(0, 2));
  });
  it("getPoolsList - should return 'limit'(or less) of pools start's from 'offset'", () => {
    const poolsList = [
      Pool.insert("pool 1", ""),
      Pool.insert("pool 2", ""),
      Pool.insert("pool 3", ""),
    ];

    let list = getPoolsList(0, poolsList.length - 1);
    expect(list.length).toBe(2);
    expect(list).toStrictEqual(poolsList.slice(0, poolsList.length - 1));

    list = Pool.getList(0, poolsList.length + 1);
    expect(list.length).toBe(poolsList.length);
    expect(list).toStrictEqual(poolsList);
  });
  it("getPoolOptions - should return options for current pool", () => {
    const result1 = createPoolWithOptions("pool", "question", ["op1", "op2"]);
    createPoolWithOptions("pool2", "question2", ["op1", "op2"]);
    const optionsList = getPoolOptions(result1.pool.id);
    expect(optionsList).toStrictEqual(result1.options);
  });
  it("getPoolVotes - should return votes for current pool", () => {
    VMContext.setSigner_account_id("bob");
    const r = createPoolWithOptions("pool", "question", ["op1", "op2"]);
    const votes = [Vote.insert(r.options[0].id), Vote.insert(r.options[1].id)];
    VMContext.setSigner_account_id("alice");
    votes.push(Vote.insert(r.options[0].id));
    votes.push(Vote.insert(r.options[1].id));
    const result = getPoolVotes(r.pool.id, "bob").map<u32>((r) => r.id);

    for (let i = 0; i < votes.length; i++) {
      expect(result).toContain(votes[i].id);
    }
  });
  it("checkAccountVote - should return true if account has vote in this pool", () => {
    VMContext.setSigner_account_id("bob");
    const r = createPoolWithOptions("pool", "question", ["op1", "op2"]);
    Vote.insert(r.options[0].id);
    const result = checkAccountVote(r.pool.id, "bob");
    expect(result).toBeTruthy();
  });
  it("checkAccountVote - should return false if account hasn't vote in this pool", () => {
    VMContext.setSigner_account_id("bob");
    const r = createPoolWithOptions("pool", "question", ["op1", "op2"]);
    const result = checkAccountVote(r.pool.id, "bob");
    expect(result).toBeFalsy();
  });
});
