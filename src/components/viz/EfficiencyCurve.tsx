"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import * as d3 from "d3";
import { generateEfficiencyCurve, type PowerConfig } from "@/lib/powerLogic";
import { useTheme } from "@/components/ui/ThemeProvider";

interface EfficiencyCurveProps {
  config: PowerConfig;
}

const MARGIN = { top: 24, right: 24, bottom: 40, left: 48 };
const WIDTH = 520;
const HEIGHT = 280;
const INNER_W = WIDTH - MARGIN.left - MARGIN.right;
const INNER_H = HEIGHT - MARGIN.top - MARGIN.bottom;

function getCSSVar(name: string): string {
  if (typeof window === "undefined") return "#f0f0f0";
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export function EfficiencyCurve({ config }: EfficiencyCurveProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { theme } = useTheme();
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    load: string;
    lotusEff: string;
    stdEff: string;
  } | null>(null);

  const lotusData = useMemo(() => generateEfficiencyCurve(config, "lotus"), [config]);
  const standardData = useMemo(() => generateEfficiencyCurve(config, "standard"), [config]);

  useEffect(() => {
    if (!svgRef.current) return;

    // Read theme-aware colors from CSS vars
    const textColor = getCSSVar("--silicon-grey");
    const gridColor = getCSSVar("--border-thin");
    const orangeColor = getCSSVar("--signal-orange");

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg
      .append("g")
      .attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);

    const x = d3.scaleLinear().domain([0, 100]).range([0, INNER_W]);
    const y = d3.scaleLinear().domain([50, 100]).range([INNER_H, 0]);

    // Grid
    g.append("g")
      .selectAll("line")
      .data(y.ticks(5))
      .enter()
      .append("line")
      .attr("x1", 0)
      .attr("x2", INNER_W)
      .attr("y1", (d) => y(d))
      .attr("y2", (d) => y(d))
      .attr("stroke", gridColor)
      .attr("stroke-width", 0.5);

    // X axis
    g.append("g")
      .attr("transform", `translate(0,${INNER_H})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat((d) => `${d}%`))
      .call((sel) => sel.select(".domain").attr("stroke", gridColor).attr("stroke-width", 0.5))
      .call((sel) => sel.selectAll(".tick text").attr("font-family", "JetBrains Mono, monospace").attr("font-size", 10).attr("fill", textColor))
      .call((sel) => sel.selectAll(".tick line").attr("stroke", gridColor));

    // Y axis
    g.append("g")
      .call(d3.axisLeft(y).ticks(5).tickFormat((d) => `${d}%`))
      .call((sel) => sel.select(".domain").attr("stroke", gridColor).attr("stroke-width", 0.5))
      .call((sel) => sel.selectAll(".tick text").attr("font-family", "JetBrains Mono, monospace").attr("font-size", 10).attr("fill", textColor))
      .call((sel) => sel.selectAll(".tick line").attr("stroke", gridColor));

    // Axis labels
    g.append("text").attr("x", INNER_W / 2).attr("y", INNER_H + 34).attr("text-anchor", "middle")
      .attr("font-size", 10).attr("letter-spacing", "0.15em").attr("fill", textColor).text("LOAD");
    g.append("text").attr("x", -INNER_H / 2).attr("y", -36).attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)").attr("font-size", 10).attr("letter-spacing", "0.15em").attr("fill", textColor).text("EFFICIENCY");

    const line = d3.line<{ load: number; efficiency: number }>()
      .x((d) => x(d.load))
      .y((d) => y(d.efficiency))
      .curve(d3.curveCatmullRom.alpha(0.5));

    // Standard line
    const stdPath = g.append("path").datum(standardData)
      .attr("fill", "none").attr("stroke", textColor).attr("stroke-width", 1.5).attr("d", line);
    const stdLen = stdPath.node()?.getTotalLength() || 0;
    stdPath.attr("stroke-dasharray", `${stdLen} ${stdLen}`).attr("stroke-dashoffset", stdLen)
      .transition().duration(1200).ease(d3.easeCubicOut).attr("stroke-dashoffset", 0);

    // Lotus line
    const lotusPath = g.append("path").datum(lotusData)
      .attr("fill", "none").attr("stroke", orangeColor).attr("stroke-width", 2).attr("d", line);
    const lotusLen = lotusPath.node()?.getTotalLength() || 0;
    lotusPath.attr("stroke-dasharray", `${lotusLen} ${lotusLen}`).attr("stroke-dashoffset", lotusLen)
      .transition().duration(1200).ease(d3.easeCubicOut).attr("stroke-dashoffset", 0);

    // Hover overlay
    g.append("rect").attr("width", INNER_W).attr("height", INNER_H).attr("fill", "transparent")
      .on("mousemove", (event) => {
        const [mx] = d3.pointer(event);
        const loadVal = x.invert(mx);
        const idx = Math.round((loadVal / 100) * (lotusData.length - 1));
        const clampIdx = Math.max(0, Math.min(idx, lotusData.length - 1));
        const lp = lotusData[clampIdx];
        const sp = standardData[clampIdx];
        setTooltip({
          x: x(lp.load) + MARGIN.left,
          y: Math.min(y(lp.efficiency), y(sp.efficiency)) + MARGIN.top - 8,
          load: `${lp.load.toFixed(0)}%`,
          lotusEff: `${lp.efficiency.toFixed(1)}%`,
          stdEff: `${sp.efficiency.toFixed(1)}%`,
        });
      })
      .on("mouseleave", () => setTooltip(null));
  }, [lotusData, standardData, theme]); // <-- redraws on theme change

  return (
    <div className="relative">
      <svg ref={svgRef} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" style={{ fontFamily: "JetBrains Mono, monospace" }} />
      {tooltip && (
        <div
          className="absolute pointer-events-none px-2x py-1x"
          style={{
            left: `${(tooltip.x / WIDTH) * 100}%`,
            top: `${(tooltip.y / HEIGHT) * 100}%`,
            transform: "translate(-50%, -100%)",
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 10,
            lineHeight: "16px",
            zIndex: 10,
            background: "var(--silicon-grey)",
            color: "var(--bg-white)",
            border: "0.5px solid var(--border-thin)",
          }}
        >
          <div style={{ opacity: 0.6 }}>LOAD {tooltip.load}</div>
          <div><span style={{ color: "var(--signal-orange)" }}>LOTUS</span> {tooltip.lotusEff}</div>
          <div><span style={{ opacity: 0.6 }}>STD</span> {tooltip.stdEff}</div>
        </div>
      )}
    </div>
  );
}
