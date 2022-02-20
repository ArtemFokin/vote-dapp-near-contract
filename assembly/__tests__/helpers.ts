import { VMContext } from "near-sdk-as";
import { createPoolWithOptions } from "..";
import { _getPoolVotes } from "../helpers";
import { Vote } from "../models/Vote";

describe("helpers", () => {
  it("_getPoolVotes - should return votes for current pool", () => {
    const r = createPoolWithOptions("pool", "question", ["op1", "op2"]);
    const votes = [Vote.insert(r.options[0].id), Vote.insert(r.options[1].id)];
    VMContext.setSigner_account_id("alice");
    votes.push(Vote.insert(r.options[0].id));
    votes.push(Vote.insert(r.options[1].id));

    const result = _getPoolVotes(r.pool.id);

    expect(result).toStrictEqual(votes);
  });
});
