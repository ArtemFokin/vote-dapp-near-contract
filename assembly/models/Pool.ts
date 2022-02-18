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

  constructor(name: string, question: string, deleted: boolean = false) {
    this.owner = context.sender;
    this.name = name;
    this.question = question;
    this.deleted = deleted;
    this.id = math.hash32<string>(this.name + this.owner);
  }

  static insert(name: string, question: string, deleted?: boolean): Pool {
    const pool = new Pool(name, question, deleted);
    if (Pool.get(pool.id)) {
      throw new Error("Pool already exist");
    }
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
    return pools.values(offset, offset + limit);
  }

  static markAsDeleted(id: u32): void {
    const pool = Pool.getSome(id);
    pool.deleted = true;
    pools.set(pool.id, pool);
  }
}
