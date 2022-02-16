import { PersistentUnorderedMap, math } from "near-sdk-as";
import {Pool} from './Pool';

export const options = new PersistentUnorderedMap<u32, Option>('o')

export class Option{
  id: u32;
  poolId: u32;
  value: string;

  constructor(poolId:u32, value: string){
    this.id = math.hash32<string>(poolId + value);
    this.poolId = poolId;
    this.value = value;
  }

  static insert(poolId: u32, value: string){
    const option = new Option(poolId, value);
    const pool = Pool.get(poolId);
    pool.addOption(option.id);
    options.set(option.id, option);
    return option;
  }

  static remove(id: u32){
    const option = Option.get(id)
    const pool = Pool.get(option.poolId);
    pool.removeOption(id);
    options.delete(id);
  }

  static get(id: u32){
    return options.getSome(id);
  }
}