// The entry file of your WebAssembly module.

import { Vote } from "./models/Vote";
import { Option } from "./models/Option";
import { Pool, PoolConstructorParameters } from "./models/Pool";

export function createPool(
  poolProps: PoolConstructorParameters,
  optionsProps: Option["value"][]
): { pool: Pool; options: Option[] } {
  const pool = Pool.insert(poolProps);
  const options = optionsProps.map((optionProp) =>
    Option.insert(pool.id, optionProp)
  );

  return {
    pool,
    options,
  };
}

export function getPool(id: Pool["id"]): Pool {
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
  return pool.options.map((option) => Option.getSome(option));
}

export function getPoolVotes(poolId: u32): Vote[] {
  const poolOptions = getPoolOptions(poolId).map((op) => op.id);
  return poolOptions.map((option) => Vote.getSome(option));
}
