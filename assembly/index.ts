// The entry file of your WebAssembly module.

import { Vote } from "./models/Vote";
import { Option } from "./models/Option";
import { Pool } from "./models/Pool";
import { AccountId } from "./utils";

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

  const options: Option[] = [];
  for (let i = 0; i < optionsValues.length; i++) {
    const option = Option.insert(pool.id, optionsValues[i]);
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
  return Option.getByPool(pool.id);
}

// how to protect, only account with vote in this pool can view
function _getPoolVotes(poolId: u32): Vote[] {
  const options = getPoolOptions(poolId);
  let result: Vote[] = [];

  for (let i = 0; i < options.length; i++) {
    const option = options[i];
    const votes = Vote.getOptionVotes(option.id);
    result = result.concat(votes);
  }
  return result;
}

export function getPoolVotes(poolId: u32, accountId: AccountId): Vote[] {
  if (checkAccountVote(poolId, accountId)) {
    return _getPoolVotes(poolId);
  }
  return [];
}

export function checkAccountVote(poolId: u32, accountId: AccountId): boolean {
  const votes = _getPoolVotes(poolId);
  for (let i = 0; i < votes.length; i++) {
    if (votes[i].owner == accountId) {
      return true;
    }
  }
  return false;
}
