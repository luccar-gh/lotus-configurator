"use client";

import { useState, useMemo } from "react";
import {
  calculateComparison,
  formatArea,
  formatPower,
  formatTemp,
  LOTUS_SPEC,
  STANDARD_SPEC,
  type PowerConfig,
} from "@/lib/powerLogic";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import { Section } from "@/components/ui/Section";
import { ParameterSlider } from "@/components/ui/ParameterSlider";
import { MetricCard } from "@/components/ui/MetricCard";
import { IconVoltage, IconThermal } from "@/components/ui/Icons";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ExportButton } from "@/components/ui/ExportButton";
import { PCBView2D } from "@/components/viz/PCBView2D";
import { PCBView3D } from "@/components/viz/PCBView3D";
import { ViewToggle } from "@/components/viz/ViewToggle";
import { EfficiencyCurve } from "@/components/viz/EfficiencyCurve";
import { TechCopilot } from "@/components/copilot/TechCopilot";

export default function Home() {
  const [inputVoltage, setInputVoltage] = useState(5);
  const [outputCurrent, setOutputCurrent] = useState(2);
  const [outputVoltage, setOutputVoltage] = useState(1.8);
  const [view, setView] = useState<"2d" | "3d">("2d");
  const [showHeatmap, setShowHeatmap] = useState(false);

  const config: PowerConfig = useMemo(
    () => ({ inputVoltage, outputVoltage, outputCurrent }),
    [inputVoltage, outputVoltage, outputCurrent]
  );

  const comparison = useMemo(() => calculateComparison(config), [config]);

  // Clamp Vout max to Vin - 0.6V
  const voutMax = Math.max(inputVoltage - 0.6, LOTUS_SPEC.voutMin + 0.1);

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── TOP BAR ── */}
      <header className="flex items-center justify-between px-3x py-2x border-b border-border min-w-0">
        <div className="flex items-center gap-2x min-w-0 overflow-hidden">
          <span className="font-mono font-medium text-[14px] tracking-technical text-silicon whitespace-nowrap">
            LOTUS MICROSYSTEMS
          </span>
          <span className="text-border select-none hidden sm:inline">|</span>
          <TechnicalLabel className="hidden sm:block">POWER ARCHITECT</TechnicalLabel>
        </div>
        <div className="flex items-center gap-2x flex-shrink-0">
          <ExportButton config={config} comparison={comparison} />
          <ThemeToggle />
          <TechnicalLabel className="text-orange hidden sm:block">v1.0</TechnicalLabel>
        </div>
      </header>

      {/* ── WARNINGS ── */}
      {comparison.warnings.length > 0 && (
        <div className="px-3x py-1x border-b border-orange" style={{ background: "var(--ui-linen)" }}>
          {comparison.warnings.map((w, i) => (
            <div key={i} className="flex items-center gap-1x">
              <span className="text-orange font-mono text-[10px]">WARNING</span>
              <span className="font-mono text-[11px] text-silicon">{w}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── MAIN GRID ── */}
      <main className="flex-1 grid grid-cols-12">
        {/* LEFT PANEL — INPUTS (3 cols) */}
        <Section className="col-span-3 border-r border-border p-3x flex flex-col gap-3x overflow-y-auto">
          <div className="flex items-center gap-1x">
            <IconVoltage size={14} className="text-orange" />
            <TechnicalLabel>PARAMETERS</TechnicalLabel>
          </div>

          <ParameterSlider
            label="INPUT VOLTAGE"
            value={inputVoltage}
            min={LOTUS_SPEC.vinMin}
            max={LOTUS_SPEC.vinMax}
            step={0.1}
            unit="V"
            onChange={(v) => {
              setInputVoltage(v);
              // Auto-clamp Vout if it exceeds new Vin - 0.6
              if (outputVoltage > v - 0.6) {
                setOutputVoltage(Math.max(LOTUS_SPEC.voutMin, v - 0.6));
              }
            }}
          />

          <ParameterSlider
            label="OUTPUT VOLTAGE"
            value={outputVoltage}
            min={LOTUS_SPEC.voutMin}
            max={voutMax}
            step={0.1}
            unit="V"
            onChange={setOutputVoltage}
          />

          <ParameterSlider
            label="OUTPUT CURRENT"
            value={outputCurrent}
            min={0.5}
            max={20}
            step={0.1}
            unit="A"
            onChange={setOutputCurrent}
          />

          {/* ── OPERATING POINTS ── */}
          <div className="border-t border-border pt-2x">
            <TechnicalLabel>OPERATING FREQUENCY</TechnicalLabel>
            <div className="grid grid-cols-2 gap-1x mt-1x">
              <div className="p-1x border border-border">
                <TechnicalLabel>LOTUS</TechnicalLabel>
                <div className="font-mono text-[14px] text-orange font-medium">{LOTUS_SPEC.switchingFreq} MHz</div>
              </div>
              <div className="p-1x border border-border">
                <TechnicalLabel>{STANDARD_SPEC.name}</TechnicalLabel>
                <div className="font-mono text-[14px] text-silicon font-medium">{STANDARD_SPEC.switchingFreq} MHz</div>
              </div>
            </div>
            <div className="font-mono text-[9px] mt-[4px] opacity-50" style={{ color: "var(--silicon-grey)" }}>
              Each solution operates at its native frequency
            </div>
          </div>

          {/* ── METRICS ── */}
          <div className="border-t border-border pt-2x">
            <div className="flex items-center gap-1x mb-2x">
              <IconThermal size={14} className="text-orange" />
              <TechnicalLabel>
                {LOTUS_SPEC.name} vs {STANDARD_SPEC.name}
              </TechnicalLabel>
            </div>

            <div className="grid grid-cols-2 gap-1x">
              <MetricCard
                label="LOTUS AREA"
                value={formatArea(comparison.lotus.area)}
                accent
              />
              <MetricCard
                label="STD AREA"
                value={formatArea(comparison.standard.area)}
              />
              <MetricCard
                label="AREA SAVED"
                value={`${comparison.areaReduction.toFixed(0)}%`}
                delta={`-${(comparison.standard.area - comparison.lotus.area).toFixed(1)} mm²`}
                accent
              />
              <MetricCard
                label="EFF. DELTA"
                value={`+${comparison.efficiencyDelta.toFixed(1)}pp`}
                delta={`${(comparison.lotus.efficiency * 100).toFixed(1)}% vs ${(comparison.standard.efficiency * 100).toFixed(1)}%`}
              />
              <MetricCard
                label="LOTUS HEAT"
                value={formatPower(comparison.lotus.thermalDissipation)}
                delta={formatTemp(comparison.lotus.tempRise) + " rise"}
                accent
              />
              <MetricCard
                label="STD HEAT"
                value={formatPower(comparison.standard.thermalDissipation)}
                delta={formatTemp(comparison.standard.tempRise) + " rise"}
              />
            </div>
          </div>

          {/* ── CTA ── */}
          <div className="border-t border-border pt-2x mt-auto">
            <TechnicalLabel>NEXT STEPS</TechnicalLabel>
            <div className="flex flex-col gap-1x mt-2x">
              <a
                href="https://www.lotus-microsystems.com/products/lbk0504"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-2x py-1x bg-orange text-static-white font-mono text-[10px] tracking-technical uppercase hover:opacity-90 transition-opacity"
              >
                VIEW {LOTUS_SPEC.name} DATASHEET
              </a>
              <a
                href="https://www.lotus-microsystems.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-2x py-1x border border-border text-silicon font-mono text-[10px] tracking-technical uppercase hover:border-orange hover:text-orange transition-colors"
              >
                REQUEST SAMPLE
              </a>
              <a
                href="https://www.lotus-microsystems.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-2x py-1x border border-border text-silicon font-mono text-[10px] tracking-technical uppercase hover:border-orange hover:text-orange transition-colors"
              >
                CONTACT SALES
              </a>
            </div>
          </div>
        </Section>

        {/* RIGHT PANEL — VISUALIZATION (9 cols) */}
        <Section className="col-span-9 flex flex-col">
          {/* Viz header */}
          <div className="flex flex-wrap items-center justify-between gap-1x px-3x py-2x border-b border-border">
            <div>
              <TechnicalLabel>PCB FOOTPRINT COMPARISON</TechnicalLabel>
              <span className="font-mono text-[9px] ml-2x opacity-50" style={{ color: "var(--silicon-grey)" }}>
                {LOTUS_SPEC.name} vs {STANDARD_SPEC.name}
              </span>
            </div>
            <div className="flex items-center gap-2x">
              <button
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={`flex items-center gap-[6px] px-2x py-[6px] border text-[10px] font-mono tracking-technical uppercase transition-colors ${
                  showHeatmap
                    ? "bg-orange text-static-white border-orange"
                    : "bg-white text-silicon border-border hover:border-silicon"
                }`}
              >
                <IconThermal size={12} />
                THERMAL
              </button>
              <ViewToggle view={view} onChange={setView} />
            </div>
          </div>

          {/* PCB Visualization */}
          <div className="flex-1 min-h-[360px] bg-linen flex items-center justify-center relative">
            {view === "2d" ? (
              <PCBView2D comparison={comparison} showHeatmap={showHeatmap} />
            ) : (
              <PCBView3D comparison={comparison} showHeatmap={showHeatmap} />
            )}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-between gap-1x px-3x py-1x border-t border-border">
            <div className="flex flex-wrap gap-2x">
              <div className="flex items-center gap-1x">
                <div className="w-[10px] h-[10px] flex-shrink-0" style={{ background: "#555555" }} />
                <TechnicalLabel>{STANDARD_SPEC.name} ({comparison.standard.componentCount} parts)</TechnicalLabel>
              </div>
              <div className="flex items-center gap-1x">
                <div className="w-[10px] h-[10px] flex-shrink-0 bg-orange" />
                <TechnicalLabel>{LOTUS_SPEC.name} ({comparison.lotus.componentCount} module{comparison.lotus.componentCount > 1 ? "s" : ""})</TechnicalLabel>
              </div>
            </div>
            {showHeatmap && (
              <TechnicalLabel className="text-orange">THERMAL OVERLAY</TechnicalLabel>
            )}
          </div>

          {/* Efficiency Curve */}
          <div className="border-t border-border px-3x py-2x">
            <div className="flex items-center gap-1x mb-2x">
              <TechnicalLabel>EFFICIENCY vs LOAD</TechnicalLabel>
              <span className="font-mono text-[9px] opacity-50" style={{ color: "var(--silicon-grey)" }}>
                D = {(Math.min(outputVoltage, inputVoltage * 0.95) / inputVoltage * 100).toFixed(0)}% duty cycle
              </span>
            </div>
            <EfficiencyCurve config={config} />
          </div>
        </Section>
      </main>

      {/* ── BOTTOM STATUS BAR ── */}
      <footer className="flex flex-wrap items-center justify-between gap-1x px-3x py-1x border-t border-border bg-linen">
        <TechnicalLabel className="hidden sm:block">SILICON-ON-INSULATOR TECHNOLOGY</TechnicalLabel>
        <div className="flex flex-wrap gap-2x">
          <TechnicalLabel>
            VIN: <span className="font-mono">{inputVoltage.toFixed(1)}V</span>
          </TechnicalLabel>
          <TechnicalLabel>
            VOUT: <span className="font-mono">{outputVoltage.toFixed(1)}V</span>
          </TechnicalLabel>
          <TechnicalLabel>
            IOUT: <span className="font-mono">{outputCurrent.toFixed(1)}A</span>
          </TechnicalLabel>
          <TechnicalLabel>
            D: <span className="font-mono">{(Math.min(outputVoltage, inputVoltage * 0.95) / inputVoltage * 100).toFixed(0)}%</span>
          </TechnicalLabel>
        </div>
      </footer>

      <TechCopilot />
    </div>
  );
}
