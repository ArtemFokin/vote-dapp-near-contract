import { PersistentUnorderedMap, math } from "near-sdk-as";

export const options = new PersistentUnorderedMap<u32, Option>("o");

@nearBindgen
export class Option {
  id: u32;
  poolId: u32;
  value: string;

  constructor(poolId: u32, value: string) {
    this.id = math.hash32<string>(poolId.toString() + value);
    if (Option.get(this.id)) {
      throw new Error("Option already exist");
    }
    this.poolId = poolId;
    this.value = value;
  }

  static insert(poolId: u32, value: string): Option {
    const option = new Option(poolId, value);
    options.set(option.id, option);
    return option;
  }

  static remove(id: u32): void {
    const option = Option.getSome(id);
    options.delete(id);
  }

  static get(id: u32): Option | null {
    return options.get(id);
  }

  static getSome(id: u32): Option {
    return options.getSome(id);
  }

  static getByPool(poolId: u32): Option[] {
    const result: Option[] = [];
    const values = options.values();
    for (let i = 0; i < values.length; i++) {
      const option = values[i];
      if (option.poolId === poolId) {
        result.push(option);
      }
    }
    return result;
  }
}
