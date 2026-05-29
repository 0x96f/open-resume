import { describe, expect, it } from "vitest";
import { parsePersistedStateFromJson } from "@/lib/schemas/resume";
import { initialResume, initialSettings } from "@/features/resume/state/defaults";

describe("parsePersistedStateFromJson", () => {
  it("returns null for invalid payloads", () => {
    expect(parsePersistedStateFromJson(null)).toBeNull();
    expect(parsePersistedStateFromJson({})).toBeNull();
    expect(parsePersistedStateFromJson({ foo: "bar" })).toBeNull();
  });

  it("parses resume and settings with defaults", () => {
    const parsed = parsePersistedStateFromJson({
      resume: { profile: { name: "Jane Doe" } },
      settings: { themeColor: "#000000" },
    });

    expect(parsed?.resume.profile.name).toBe("Jane Doe");
    expect(parsed?.resume.workExperiences.length).toBeGreaterThan(0);
    expect(parsed?.settings.themeColor).toBe("#000000");
    expect(parsed?.settings.fontFamily).toBe(initialSettings.fontFamily);
  });

  it("accepts partial resume-only payloads", () => {
    const parsed = parsePersistedStateFromJson({
      resume: initialResume,
    });

    expect(parsed?.resume.profile.name).toBe(initialResume.profile.name);
    expect(parsed?.settings.documentSize).toBe(initialSettings.documentSize);
  });
});
