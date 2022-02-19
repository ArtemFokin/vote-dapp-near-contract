import { Option, options } from "../models/Option";

describe("option model static methods", () => {
  it("insert - should add option to storage", () => {
    const option = Option.insert(1, "option");
    expect(options.values()[0]).toStrictEqual(option);
  });
  it("insert - should throw error if option alerady exist", () => {
    Option.insert(1, "option");
    expect(() => {
      Option.insert(1, "option");
    }).toThrow();
  });
  it("get - should return option instance if exist", () => {
    const option = Option.insert(1, "");
    expect(Option.get(option.id)).toStrictEqual(option);
  });
  it("get - should return undefined if option not found", () => {
    expect(Option.get(1)).toBe(null);
  });
  it("getSome - should return option instance if exist", () => {
    const option = Option.insert(1, "");
    expect(Option.getSome(option.id)).toStrictEqual(option);
  });
  it("getSome - should throw error if option not found", () => {
    expect(() => Option.getSome(1)).toThrow();
  });
  it("getByPool - should return options for specific pool", () => {
    const insertedOptions = [
      Option.insert(1, "option 1"),
      Option.insert(1, "option 2"),
      Option.insert(2, "option 1"),
      Option.insert(3, "option 1"),
    ];
    const optionsList = Option.getByPool(1);
    expect(optionsList).toStrictEqual(insertedOptions.slice(0, 2));
  });
  it("getByPool - should return empty array if pool not found", () => {
    expect(Option.getByPool(1)).toStrictEqual([]);
  });
});
