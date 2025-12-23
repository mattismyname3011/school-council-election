// app/components/Snow.tsx
"use client";

import Snowfall from "react-snowfall";

export default function Snow() {
  return (
    <Snowfall
      snowflakeCount={150}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        pointerEvents: "none", // important
      }}
    />
  );
}
