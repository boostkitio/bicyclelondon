import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Bicycle London — Independent Media & Creative Agency";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#08124d",
          padding: "90px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            color: "#ffffff",
            opacity: 0.8,
            fontSize: 26,
            letterSpacing: 6,
            marginBottom: 28,
          }}
        >
          INDEPENDENT MEDIA &amp; CREATIVE AGENCY
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            fontSize: 96,
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.05,
          }}
        >
          <span>BUILT ON THE POWER OF&nbsp;</span>
          <span style={{ color: "#00ff00" }}>AND</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
