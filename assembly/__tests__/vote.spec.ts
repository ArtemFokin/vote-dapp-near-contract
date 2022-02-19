import { VMContext } from "near-sdk-as";
import { Vote, votes } from "../models/Vote";

describe("Vote model static methods", () => {
  it("insert - should add vote to storage", () => {
    const vote = Vote.insert(1);
    expect(votes.values()[0]).toStrictEqual(vote);
  });
  it("insert - should throw error if vote alerady exist", () => {
    Vote.insert(1);
    expect(() => {
      Vote.insert(1);
    }).toThrow();
  });
  it("insert - two different users can insert same vote", () => {
    const vote1 = Vote.insert(1);
    VMContext.setSigner_account_id("alice");
    const vote2 = Vote.insert(2);
    const votesInStorage = votes.values();
    expect(votesInStorage[0]).toStrictEqual(vote1);
    expect(votesInStorage[1]).toStrictEqual(vote2);
  });
  it("get - should return vote instance if exist", () => {
    const vote = Vote.insert(1);
    expect(Vote.get(vote.id)).toStrictEqual(vote);
  });
  it("get - should return undefined if vote not found", () => {
    expect(Vote.get(1)).toBe(null);
  });
  it("getSome - should return vote instance if exist", () => {
    const vote = Vote.insert(1);
    expect(Vote.getSome(vote.id)).toStrictEqual(vote);
  });
  it("getSome - should throw error if vote not found", () => {
    expect(() => Vote.getSome(1)).toThrow();
  });
  it("getOptionVotes - should return votes for specific option", () => {
    const vote11 = Vote.insert(1);
    const vote12 = Vote.insert(2);
    VMContext.setSigner_account_id("alice");
    const vote21 = Vote.insert(1);
    const vote22 = Vote.insert(2);
    const result = Vote.getOptionVotes(1);

    expect(result).toStrictEqual([vote11, vote21]);
  });
});
