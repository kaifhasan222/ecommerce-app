"use client";

import { tooltipBox, tooltipWrapper } from "@/styles/styles";
import React, { useState } from "react";

export default function Tooltip({
  text,
  children,
}: {
  text: string;
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className={tooltipWrapper}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && <div className={tooltipBox}>{text}</div>}
    </div>
  );
}
