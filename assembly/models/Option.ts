import { PersistentUnorderedMap, math } from "near-sdk-as";
import { Vote } from "./Vote";
import { Pool } from "./Pool";

export const options = new PersistentUnorderedMap<u32, Option>("o");

@nearBindgen
export class Option {
  id: u32;
  poolId: u32;
  value: string;
  votes: u32[] = [];

  constructor(poolId: u32, value: string) {
    this.id = math.hash32<string>(poolId.toString() + value);
    this.poolId = poolId;
    this.value = value;
  }

  static insert(poolId: u32, value: string): Option {
    const option = new Option(poolId, value);
    if (Option.get(option.id)) {
      throw new Error("Option already exist");
    }
    Pool.addOption(poolId, option.id);
    options.set(option.id, option);
    return option;
  }

  static remove(id: u32): void {
    const option = Option.getSome(id);
    Pool.removeOption(option.poolId, option.id);
    options.delete(id);
  }

  static get(id: u32): Option | null {
    return options.get(id);
  }

  static getSome(id: u32): Option {
    return options.getSome(id);
  }

  static addVote(id: u32, voteId: u32): void {
    const option = Option.getSome(id);

    if (option.votes.includes(voteId)) {
      throw new Error("Vote already exist");
    }

    option.votes.push(voteId);

    options.set(option.id, option);
  }
}
