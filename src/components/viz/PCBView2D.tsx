"use client";

import { motion } from "framer-motion";
import { type ComparisonResult } from "@/lib/powerLogic";

interface PCBView2DProps {
  comparison: ComparisonResult;
  showHeatmap: boolean;
}

const FLOAT: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function PCBView2D({ comparison, showHeatmap }: PCBView2DProps) {
  const { lotus, standard } = comparison;

  // Scale factors (mm → SVG units), clamped so things stay in frame
  const scale = 8;
  const standardWidth = Math.min(standard.width * scale, 200);
  const standardHeight = Math.min(standard.height * scale, 160);
  const lotusWidth = Math.min(lotus.width * scale, 100);
  const lotusHeight = Math.min(lotus.height * scale, 80);

  const svgWidth = 520;
  const svgHeight = 340;

  const standardX = svgWidth * 0.3;
  const standardY = svgHeight * 0.48;
  const lotusX = svgWidth * 0.7;
  const lotusY = svgHeight * 0.48;

  // Thermal intensity (0–1)
  const stdThermalIntensity = Math.min(standard.tempRise / 80, 1);
  const lotusThermalIntensity = Math.min(lotus.tempRise / 80, 1);

  return (
    <svg
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className="w-full h-full max-h-[400px]"
      style={{ fontFamily: "JetBrains Mono, monospace" }}
    >
      <defs>
        <pattern id="pcb-grid" width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M 16 0 L 0 0 0 16" fill="none" style={{ stroke: "var(--border-thin)" }} strokeWidth="0.25" />
        </pattern>
        <radialGradient id="thermal-std" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#FF0000" stopOpacity={stdThermalIntensity * 0.8} />
          <stop offset="40%" stopColor="#FF5F00" stopOpacity={stdThermalIntensity * 0.5} />
          <stop offset="80%" stopColor="#FFAA00" stopOpacity={stdThermalIntensity * 0.2} />
          <stop offset="100%" stopColor="#FFAA00" stopOpacity={0} />
        </radialGradient>
        <radialGradient id="thermal-lotus" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#FF5F00" stopOpacity={lotusThermalIntensity * 0.6} />
          <stop offset="50%" stopColor="#FFAA00" stopOpacity={lotusThermalIntensity * 0.2} />
          <stop offset="100%" stopColor="#FFAA00" stopOpacity={0} />
        </radialGradient>
      </defs>

      <rect width={svgWidth} height={svgHeight} fill="url(#pcb-grid)" />

      {/* Column labels */}
      <text x={standardX} y={24} textAnchor="middle" fontSize="10" letterSpacing="0.15em" style={{ fill: "var(--silicon-grey)" }}>
        STANDARD
      </text>
      <text x={lotusX} y={24} textAnchor="middle" fontSize="10" letterSpacing="0.15em" style={{ fill: "var(--silicon-grey)" }}>
        LOTUS SOI
      </text>

      {/* Thermal heatmap */}
      {showHeatmap && (
        <>
          <motion.ellipse cx={standardX} cy={standardY} rx={standardWidth * 1.2} ry={standardHeight * 1.2}
            fill="url(#thermal-std)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} />
          <motion.ellipse cx={lotusX} cy={lotusY} rx={lotusWidth * 1.2} ry={lotusHeight * 1.2}
            fill="url(#thermal-lotus)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} />
        </>
      )}

      {/* Standard footprint — discrete components */}
      <motion.g initial={false}
        animate={{ x: standardX - standardWidth / 2, y: standardY - standardHeight / 2 }}
        transition={{ duration: 0.6, ease: FLOAT }}>
        {/* PMIC */}
        <motion.rect fill="#555555"
          animate={{ width: standardWidth * 0.4, height: standardHeight * 0.5 }}
          transition={{ duration: 0.6, ease: FLOAT }} />
        <text x={standardWidth * 0.2} y={standardHeight * 0.28} textAnchor="middle" fontSize="7" fill="#AAAAAA">PMIC</text>
        {/* Inductor */}
        <motion.rect fill="#444444"
          animate={{ x: standardWidth * 0.45, width: standardWidth * 0.5, height: standardHeight * 0.55 }}
          transition={{ duration: 0.6, ease: FLOAT }} />
        <text x={standardWidth * 0.7} y={standardHeight * 0.3} textAnchor="middle" fontSize="7" fill="#AAAAAA">IND</text>
        {/* Input caps */}
        <motion.rect fill="#666666"
          animate={{ y: standardHeight * 0.6, width: standardWidth * 0.3, height: standardHeight * 0.35 }}
          transition={{ duration: 0.6, ease: FLOAT }} />
        {/* Output caps */}
        <motion.rect fill="#666666"
          animate={{ x: standardWidth * 0.35, y: standardHeight * 0.6, width: standardWidth * 0.3, height: standardHeight * 0.35 }}
          transition={{ duration: 0.6, ease: FLOAT }} />
        {/* Feedback resistors */}
        <motion.rect fill="#888888"
          animate={{ x: standardWidth * 0.7, y: standardHeight * 0.65, width: standardWidth * 0.15, height: standardHeight * 0.08 }}
          transition={{ duration: 0.6, ease: FLOAT }} />
        <motion.rect fill="#888888"
          animate={{ x: standardWidth * 0.7, y: standardHeight * 0.78, width: standardWidth * 0.15, height: standardHeight * 0.08 }}
          transition={{ duration: 0.6, ease: FLOAT }} />
      </motion.g>

      {/* Standard area label */}
      <text x={standardX} y={standardY + standardHeight / 2 + 20} textAnchor="middle" fontSize="11" fontWeight="500" style={{ fill: "var(--silicon-grey)" }}>
        {standard.area.toFixed(1)} mm²
      </text>
      {showHeatmap && (
        <text x={standardX} y={standardY + standardHeight / 2 + 34} textAnchor="middle" fontSize="9" fill="#FF3300">
          +{standard.tempRise.toFixed(1)}°C
        </text>
      )}

      {/* Lotus footprint — single integrated module */}
      <motion.rect fill="var(--signal-orange)"
        animate={{ width: lotusWidth, height: lotusHeight, x: lotusX - lotusWidth / 2, y: lotusY - lotusHeight / 2 }}
        transition={{ duration: 0.6, ease: FLOAT }} />
      {/* Pin markings */}
      {[0.2, 0.4, 0.6, 0.8].map((frac) => (
        <motion.line key={frac} stroke="var(--signal-orange)" strokeWidth="0.5"
          x1={lotusX - lotusWidth / 2} x2={lotusX - lotusWidth / 2 - 3}
          animate={{
            y1: lotusY - lotusHeight / 2 + lotusHeight * frac,
            y2: lotusY - lotusHeight / 2 + lotusHeight * frac,
          }}
          transition={{ duration: 0.6, ease: FLOAT }} />
      ))}
      {/* Chip label on module */}
      <text x={lotusX} y={lotusY + 3} textAnchor="middle" fontSize="7" fill="#FFFFFF" opacity="0.8">
        LBK
      </text>

      {/* Lotus area label */}
      <text x={lotusX} y={lotusY + lotusHeight / 2 + 20} textAnchor="middle" fontSize="11" fontWeight="500" style={{ fill: "var(--signal-orange)" }}>
        {lotus.area.toFixed(1)} mm²
      </text>
      {showHeatmap && (
        <text x={lotusX} y={lotusY + lotusHeight / 2 + 34} textAnchor="middle" fontSize="9" style={{ fill: "var(--signal-orange)" }}>
          +{lotus.tempRise.toFixed(1)}°C
        </text>
      )}

      {/* Divider */}
      <line x1={svgWidth / 2} y1={40} x2={svgWidth / 2} y2={svgHeight - 20}
        style={{ stroke: "var(--border-thin)" }} strokeWidth="0.5" strokeDasharray="4 4" />

      {/* Component count */}
      <text x={standardX} y={svgHeight - 24} textAnchor="middle" fontSize="9" style={{ fill: "var(--silicon-grey)" }} opacity="0.6">
        {standard.componentCount} COMPONENTS
      </text>
      <text x={lotusX} y={svgHeight - 24} textAnchor="middle" fontSize="9" style={{ fill: "var(--signal-orange)" }} opacity="0.8">
        {lotus.componentCount} MODULE{lotus.componentCount > 1 ? "S" : ""}
      </text>

      {/* Area savings */}
      <text x={svgWidth / 2} y={svgHeight - 6} textAnchor="middle" fontSize="10" letterSpacing="0.15em" style={{ fill: "var(--signal-orange)" }}>
        {comparison.areaReduction.toFixed(0)}% AREA REDUCTION
      </text>
    </svg>
  );
}
