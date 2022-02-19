import { PersistentUnorderedMap, math, context } from "near-sdk-as";

export const votes = new PersistentUnorderedMap<u32, Vote>("v");

@nearBindgen
export class Vote {
  id: u32;
  owner: string;
  optionId: u32;

  constructor(optionId: u32) {
    this.owner = context.sender;
    this.optionId = optionId;
    this.id = math.hash32<string>(optionId.toString() + this.owner);
    if (Vote.get(this.id)) {
      throw new Error("Vote already exist");
    }
  }

  static insert(optionId: u32): Vote {
    const vote = new Vote(optionId);
    votes.set(vote.id, vote);
    return vote;
  }

  static get(id: u32): Vote | null {
    return votes.get(id);
  }

  static getSome(id: u32): Vote {
    return votes.getSome(id);
  }

  static getOptionVotes(optionId: u32): Vote[] {
    const result: Vote[] = [];
    const values = votes.values();
    for (let i = 0; i < values.length; i++) {
      const vote = values[i];
      if (vote.optionId === optionId) {
        result.push(vote);
      }
    }
    return result;
  }
}
