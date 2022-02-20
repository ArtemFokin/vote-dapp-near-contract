import { Option } from "./models/Option";
import { Pool } from "./models/Pool";
import { Vote } from "./models/Vote";

// how to protect, only account with vote in this pool can view
export function _getPoolVotes(poolId: u32): Vote[] {
  const pool = Pool.getSome(poolId);
  const options = Option.getByPool(pool.id);
  let result: Vote[] = [];

  for (let i = 0; i < options.length; i++) {
    const option = options[i];
    const votes = Vote.getOptionVotes(option.id);
    result = result.concat(votes);
  }
  return result;
}
