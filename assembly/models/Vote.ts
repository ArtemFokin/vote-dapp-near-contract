import { PersistentUnorderedMap, math, context } from "near-sdk-as";
import { Option } from "./Option";

const votes = new PersistentUnorderedMap<u32, Vote>("v");

export class Vote {
  id: u32;
  owner: string;
  optionId: u32;

  constructor(optionId: u32) {
    this.owner = context.sender;
    this.optionId = optionId;
    this.id = math.hash32<string>(optionId + this.owner);
  }

  static insert(optionId: u32) {
    const vote = new Vote(optionId);
    if (Vote.get(vote.id)) {
      throw new Error("Vote already exist");
    }
    Option.addVote(optionId, vote.id);
    votes.set(vote.id, vote);
    return vote;
  }

  static get(id: u32) {
    return votes.get(id);
  }

  static getSome(id: u32) {
    return votes.getSome(id);
  }
}
