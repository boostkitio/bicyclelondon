import { describe, expect, it } from "vitest";
import { serializeJsonLd } from "@/components/seo/json-ld";

describe("serializeJsonLd", () => {
  it("escapes < so a closing-script sequence cannot break out", () => {
    const out = serializeJsonLd({ a: "</script><img src=x>" });
    expect(out).not.toContain("<");
    expect(out).toContain("\\u003c");
  });

  it("round-trips awkward characters to the identical object", () => {
    const obj = {
      title: 'He said "<b>&</b>" > all',
      sep: `line one${String.fromCharCode(0x2028)}line two${String.fromCharCode(0x2029)}end`,
    };
    expect(JSON.parse(serializeJsonLd(obj))).toEqual(obj);
  });
});
