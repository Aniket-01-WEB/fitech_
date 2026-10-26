import { ImageResponse } from "next/og";

// Generated at build time and reused for the Twitter/X card too, so
// sharing a link renders a branded card instead of a bare text preview.
// Mirrors the site's monochrome poster style: white paper, black ink,
// a hard outline and a mono footer strip.
export const alt =
  "Fincoders — Quantitative Finance & Financial Engineering Society, Adamas University";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#FFFFFF",
        color: "#0A0A0A",
        padding: 56,
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          border: "3px solid #0A0A0A",
          padding: "48px 56px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 22,
              letterSpacing: 6,
              color: "#4A4A4A",
              display: "flex",
            }}
          >
            ADAMAS UNIVERSITY · SOET CHAPTER
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 148,
              fontWeight: 800,
              letterSpacing: -4,
              lineHeight: 1,
              display: "flex",
            }}
          >
            Fincoders
          </div>
          <div
            style={{
              marginTop: 18,
              fontSize: 34,
              color: "#4A4A4A",
              lineHeight: 1.3,
              display: "flex",
            }}
          >
            Quantitative Finance &amp; Financial Engineering Society
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 22,
            letterSpacing: 3,
            color: "#4A4A4A",
          }}
        >
          <div style={{ display: "flex" }}>
            ALGORITHMIC TRADING · RISK MODELS · DEFI
          </div>
          <div style={{ display: "flex", color: "#0A0A0A" }}>BY CYCODERS</div>
        </div>
      </div>
    </div>,
    size,
  );
}
