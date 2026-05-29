import { describe, expect, it } from "vitest";
import { cx } from "@/lib/cx";

describe("cx", () => {
  it("joins class names", () => {
    expect(cx("a", false && "b", "c")).toBe("a c");
  });
});
