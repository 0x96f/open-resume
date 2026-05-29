import { describe, expect, it } from "vitest";
import { makeObjectCharIterator } from "@/lib/make-object-char-iterator";

describe("makeObjectCharIterator", () => {
  it("iterates through string fields", () => {
    const iterator = makeObjectCharIterator(
      { name: "a", age: 1 },
      { name: "ab", age: 1 },
    );
    const first = iterator.next();
    expect(first.done).toBe(false);
    expect(first.value.name).toBe("a");
  });
});
