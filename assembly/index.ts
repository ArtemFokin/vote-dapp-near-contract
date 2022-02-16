// The entry file of your WebAssembly module.

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

export function getPool(id: Pool["id"]) {
  return Pool.get(id);
}

export function getPoolsList(offset: u32, limit: u32) {
  return Pool.getList(offset, limit);
}

export function getPoolOptions(poolId: u32) {
  const pool = Pool.get(poolId);
  return pool.options.map((option) => Option.get(option));
}

export function deletePool(poolId: u32) {
  Pool.markAsDeleted(poolId);
}
