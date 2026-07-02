import { describe, expect, it } from "vitest";
import { contactSchema, sanitiseLine } from "@/lib/validation";

const valid = {
  name: "Matt West",
  email: "matt@example.com",
  company: "Example Ltd",
  enquiryType: "New business",
  message: "A test enquiry.",
};

describe("contactSchema", () => {
  it("parses a valid payload and trims whitespace", () => {
    const result = contactSchema.safeParse({
      ...valid,
      name: "  Matt West  ",
      message: "  Hello  ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Matt West");
      expect(result.data.message).toBe("Hello");
    }
  });

  it("rejects a missing name", () => {
    expect(contactSchema.safeParse({ ...valid, name: "" }).success).toBe(false);
  });

  it("rejects a missing message", () => {
    expect(contactSchema.safeParse({ ...valid, message: "" }).success).toBe(
      false,
    );
  });

  it("rejects an invalid email", () => {
    expect(
      contactSchema.safeParse({ ...valid, email: "not-an-email" }).success,
    ).toBe(false);
  });

  it("rejects an over-length message", () => {
    expect(
      contactSchema.safeParse({ ...valid, message: "x".repeat(5001) }).success,
    ).toBe(false);
  });

  it("rejects an oversized honeypot value", () => {
    expect(
      contactSchema.safeParse({ ...valid, website: "x".repeat(201) }).success,
    ).toBe(false);
  });

  it("defaults enquiryType to General enquiry", () => {
    const { enquiryType, ...rest } = valid;
    void enquiryType;
    const result = contactSchema.safeParse(rest);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.enquiryType).toBe("General enquiry");
    }
  });
});

describe("sanitiseLine", () => {
  it("strips CR/LF so headers cannot be injected", () => {
    expect(sanitiseLine("a\r\nb\nc")).toBe("a b c");
  });
});
