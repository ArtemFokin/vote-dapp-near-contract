import { PersistentUnorderedMap, context, math } from "near-sdk-as";

import { AccountId } from "../utils";

export const pools = new PersistentUnorderedMap<u32, Pool>("p");

@nearBindgen
export class Pool {
  id: u32;
  name: string;
  question: string;
  owner: AccountId;
  anonimous: boolean;
  deleted: boolean;

  constructor(name: string, question: string, deleted: boolean) {
    this.owner = context.sender;
    this.name = name;
    this.question = question;
    this.deleted = deleted;
    this.id = math.hash32<string>(this.name + this.owner);
    if (Pool.get(this.id)) {
      throw new Error("Pool already exist");
    }
  }

  static insert(
    name: string,
    question: string,
    deleted: boolean = false
  ): Pool {
    const pool = new Pool(name, question, deleted);
    pools.set(pool.id, pool);
    return pool;
  }

  static get(id: u32): Pool | null {
    return pools.get(id);
  }

  static getSome(id: u32): Pool {
    return pools.getSome(id);
  }

  static getList(offset: u32, limit: u32): Pool[] {
    return pools.values(offset, offset + limit).filter((v) => !v.deleted);
  }

  static markAsDeleted(id: u32): void {
    const pool = Pool.getSome(id);
    pool.deleted = true;
    pools.set(pool.id, pool);
  }
}
