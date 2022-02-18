// The entry file of your WebAssembly module.

import { Vote } from "./models/Vote";
import { Option } from "./models/Option";
import { Pool } from "./models/Pool";
import { context } from "near-sdk-as";

class PoolWithOptions {
  pool: Pool;
  options: Option[];
}

export function createPoolWithOptions(
  name: string,
  question: string,
  optionsValues: string[],
  deleted: boolean = false
): PoolWithOptions {
  const pool = Pool.insert(name, question, deleted);
  const poolId: u32 = pool.id;
  const options: Option[] = [];
  for (let i: i32 = 0; i < optionsValues.length; i++) {
    const option = Option.insert(poolId, optionsValues[i]);
    options.push(option);
  }

  return {
    pool,
    options,
  };
}

export function getPool(id: u32): Pool {
  return Pool.getSome(id);
}

export function deletePool(poolId: u32): void {
  Pool.markAsDeleted(poolId);
}

export function createVote(optionId: u32): Vote {
  return Vote.insert(optionId);
}

export function getPoolsList(offset: u32, limit: u32): Pool[] {
  return Pool.getList(offset, limit);
}

export function getPoolOptions(poolId: u32): Option[] {
  const pool = Pool.getSome(poolId);
  return pool.options.map<Option>((option) => Option.getSome(option));
}

export function getPoolVotes(poolId: u32): Vote[] {
  const options = getPoolOptions(poolId);
  // почему-то flat возвращает пустой массив
  const result: Vote[] = [];
  for (let i: i32 = 0; i < options.length; i++) {
    const optionVotesIds = options[i].votes;
    for (let j: i32 = 0; j < optionVotesIds.length; j++) {
      const vote = Vote.getSome(optionVotesIds[j]);
      result.push(vote);
    }
  }
  return result;
}

export function checkAccountVote(poolId: u32): boolean {
  const votes = getPoolVotes(poolId);
  return !!votes.some((vote) => vote.owner == context.sender);
}
