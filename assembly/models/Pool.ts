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
    this.id = math.hash32<string>(name);
    this.owner = context.sender;
    this.name = name;
    this.description = description;
    this.deleted = deleted;
  }

  static insert(poolProps: PoolConstructorParameters): Pool {
    const pool = new Pool(poolProps);
    pools.set(pool.id, pool);
    return pool;
  }

  static get(id: u32): Pool {
    return pools.getSome(id);
  }

  static getList(offset: u32, limit: u32): Pool[] {
    return pools.values(offset, offset + limit);
  }

  static markAsDeleted(id: u32) {
    const pool = Pool.get(id);
    pool.deleted = true;
    pools.set(pool.id, pool);
  }

  addOption(optionId: Option["id"]) {
    if (this.options.includes(optionId)) {
      throw new Error("option already added");
    }
    this.options.push(optionId);
    // pools.set(this.id, this);
  }
  removeOption(optionId: Option["id"]) {
    this.options = this.options.filter((op) => op === optionId);
  }
}
