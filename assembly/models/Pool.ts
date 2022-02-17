import { PersistentUnorderedMap, context, math } from "near-sdk-as";
import { Option } from "./Option";

import { AccountId } from "../utils";

export const pools = new PersistentUnorderedMap<u32, Pool>("p");

export type PoolConstructorParameters = {
  name: string;
  description: string;
  deleted: boolean;
};

export class Pool {
  id: u32;
  name: string;
  description: string;
  owner: AccountId;
  deleted: boolean;
  options: Option["id"][] = [];

  constructor({
    name,
    description,
    deleted = false,
  }: PoolConstructorParameters) {
    this.owner = context.sender;
    this.name = name;
    this.description = description;
    this.deleted = deleted;
    this.id = math.hash32<string>(this.name + this.owner);
  }

  static insert(poolProps: PoolConstructorParameters): Pool {
    const pool = new Pool(poolProps);
    if (Pool.get(pool.id)) {
      throw new Error("Pool already exist");
    }
    pools.set(pool.id, pool);
    return pool;
  }

  static get(id: u32) {
    return pools.get(id);
  }

  static getSome(id: u32) {
    return pools.getSome(id);
  }

  static getList(offset: u32, limit: u32): Pool[] {
    return pools.values(offset, offset + limit);
  }

  static markAsDeleted(id: u32) {
    const pool = Pool.getSome(id);
    pool.deleted = true;
    pools.set(pool.id, pool);
  }

  static addOption(id: u32, optionId: u32) {
    const pool = Pool.getSome(id);

    if (pool.options.includes(optionId)) {
      throw new Error("Option already exist");
    }

    pool.options.push(optionId);
    pools.set(pool.id, pool);
  }

  static removeOption(id: u32, optionId: u32) {
    const pool = Pool.getSome(id);
    pool.options = pool.options.filter((op) => op === optionId);
    pools.set(pool.id, pool);
  }
}
