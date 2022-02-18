import { PersistentUnorderedMap, math, context } from "near-sdk-as";
import { Option } from "./Option";

const votes = new PersistentUnorderedMap<u32, Vote>("v");

@nearBindgen
export class Vote {
  id: u32;
  owner: string;
  optionId: u32;

  constructor(optionId: u32) {
    this.owner = context.sender;
    this.optionId = optionId;
    this.id = math.hash32<string>(optionId.toString() + this.owner);
  }

  static insert(optionId: u32): Vote {
    const vote = new Vote(optionId);
    if (Vote.get(vote.id)) {
      throw new Error("Vote already exist");
    }
    Option.addVote(optionId, vote.id);
    votes.set(vote.id, vote);
    return vote;
  }

  static get(id: u32): Vote | null {
    return votes.get(id);
  }

  static getSome(id: u32): Vote {
    return votes.getSome(id);
  }
}
