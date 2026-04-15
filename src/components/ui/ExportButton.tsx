"use client";

import { type ComparisonResult } from "@/lib/powerLogic";
import { type PowerConfig } from "@/lib/powerLogic";
import { formatArea, formatPower, formatTemp, LOTUS_SPEC, STANDARD_SPEC } from "@/lib/powerLogic";

interface ExportButtonProps {
  config: PowerConfig;
  comparison: ComparisonResult;
}

function generateReportHTML(config: PowerConfig, comparison: ComparisonResult): string {
  const { lotus, standard } = comparison;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Lotus Power Architect — Configuration Report</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; border-radius: 0; }
    body { font-family: 'Helvetica Neue', 'Inter', sans-serif; color: #2D2D2D; padding: 48px; max-width: 800px; margin: 0 auto; }
    .header { border-bottom: 0.5px solid #E5E5E5; padding-bottom: 16px; margin-bottom: 32px; display: flex; justify-content: space-between; align-items: center; }
    .logo { font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; }
    .label { font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: #2D2D2D; margin-bottom: 4px; }
    .value { font-family: 'JetBrains Mono', monospace; font-weight: 500; font-size: 20px; }
    .value-sm { font-family: 'JetBrains Mono', monospace; font-weight: 500; font-size: 14px; }
    .orange { color: #FF5F00; }
    .green { color: #00AA30; }
    .section { margin-bottom: 32px; }
    .section-title { font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: #FF5F00; border-bottom: 0.5px solid #E5E5E5; padding-bottom: 8px; margin-bottom: 16px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
    .card { border: 0.5px solid #E5E5E5; padding: 16px; }
    .card.accent { background: #F2F2F2; }
    .divider { border: none; border-top: 0.5px solid #E5E5E5; margin: 24px 0; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th { text-align: left; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; padding: 8px; border-bottom: 0.5px solid #E5E5E5; }
    td { padding: 8px; border-bottom: 0.5px solid #E5E5E5; font-family: 'JetBrains Mono', monospace; font-size: 12px; }
    .footer { margin-top: 48px; border-top: 0.5px solid #E5E5E5; padding-top: 16px; font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase; color: #999; display: flex; justify-content: space-between; }
    @media print { body { padding: 24px; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">LOTUS MICROSYSTEMS</div>
      <div class="label" style="margin-top: 4px;">Power Architect Configuration Report</div>
    </div>
    <div style="text-align: right;">
      <div class="label">Generated</div>
      <div class="value-sm">${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Input Parameters</div>
    <div class="grid">
      <div class="card">
        <div class="label">Input Voltage</div>
        <div class="value">${config.inputVoltage.toFixed(1)}V</div>
      </div>
      <div class="card">
        <div class="label">Output Voltage</div>
        <div class="value">${config.outputVoltage.toFixed(1)}V</div>
      </div>
      <div class="card">
        <div class="label">Output Current</div>
        <div class="value">${config.outputCurrent.toFixed(1)}A</div>
      </div>
      <div class="card">
        <div class="label">Duty Cycle</div>
        <div class="value">${(Math.min(config.outputVoltage, config.inputVoltage * 0.95) / config.inputVoltage * 100).toFixed(0)}%</div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Key Advantages — Lotus SOI</div>
    <div class="grid-3">
      <div class="card accent">
        <div class="label">Area Reduction</div>
        <div class="value orange">${comparison.areaReduction.toFixed(0)}%</div>
      </div>
      <div class="card accent">
        <div class="label">Efficiency Gain</div>
        <div class="value orange">+${comparison.efficiencyDelta.toFixed(1)}pp</div>
      </div>
      <div class="card accent">
        <div class="label">Thermal Improvement</div>
        <div class="value orange">${comparison.thermalImprovement.toFixed(0)}%</div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Detailed Comparison</div>
    <table>
      <thead>
        <tr><th>Parameter</th><th>Standard Solution</th><th>Lotus SOI</th><th>Advantage</th></tr>
      </thead>
      <tbody>
        <tr>
          <td style="font-family: inherit;">PCB Footprint</td>
          <td>${formatArea(standard.area)}</td>
          <td class="orange">${formatArea(lotus.area)}</td>
          <td class="green">-${(standard.area - lotus.area).toFixed(1)} mm²</td>
        </tr>
        <tr>
          <td style="font-family: inherit;">Dimensions</td>
          <td>${standard.width.toFixed(1)} x ${standard.height.toFixed(1)} mm</td>
          <td class="orange">${lotus.width.toFixed(1)} x ${lotus.height.toFixed(1)} mm</td>
          <td></td>
        </tr>
        <tr>
          <td style="font-family: inherit;">Efficiency</td>
          <td>${(standard.efficiency * 100).toFixed(1)}%</td>
          <td class="orange">${(lotus.efficiency * 100).toFixed(1)}%</td>
          <td class="green">+${comparison.efficiencyDelta.toFixed(1)}pp</td>
        </tr>
        <tr>
          <td style="font-family: inherit;">Thermal Dissipation</td>
          <td>${formatPower(standard.thermalDissipation)}</td>
          <td class="orange">${formatPower(lotus.thermalDissipation)}</td>
          <td class="green">-${comparison.thermalImprovement.toFixed(0)}%</td>
        </tr>
        <tr>
          <td style="font-family: inherit;">Temperature Rise</td>
          <td>${formatTemp(standard.tempRise)}</td>
          <td class="orange">${formatTemp(lotus.tempRise)}</td>
          <td class="green">-${(standard.tempRise - lotus.tempRise).toFixed(1)}°C</td>
        </tr>
        <tr>
          <td style="font-family: inherit;">Component Count</td>
          <td>${standard.componentCount} parts</td>
          <td class="orange">${lotus.componentCount} module${lotus.componentCount > 1 ? "s" : ""}</td>
          <td class="green">-${standard.componentCount - lotus.componentCount} parts</td>
        </tr>
        <tr>
          <td style="font-family: inherit;">Package Height</td>
          <td>${standard.depth.toFixed(1)} mm</td>
          <td class="orange">${lotus.depth.toFixed(1)} mm</td>
          <td class="green">-${(standard.depth - lotus.depth).toFixed(1)} mm</td>
        </tr>
        <tr>
          <td style="font-family: inherit;">Switching Frequency</td>
          <td>${STANDARD_SPEC.switchingFreq} MHz</td>
          <td class="orange">${LOTUS_SPEC.switchingFreq} MHz</td>
          <td class="green">${LOTUS_SPEC.switchingFreq / STANDARD_SPEC.switchingFreq}x faster</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="section">
    <div class="section-title">Technology</div>
    <table>
      <tbody>
        <tr><td style="font-family: inherit; width: 160px;">Platform</td><td>Silicon-on-Insulator (SOI)</td></tr>
        <tr><td style="font-family: inherit;">Integration</td><td>Lotus Power Interposer™ — PMIC + Inductor in single package</td></tr>
        <tr><td style="font-family: inherit;">Reference Product</td><td>LBK0504 — 2.0-5.5V input, 4A, 6MHz, 95% peak efficiency</td></tr>
        <tr><td style="font-family: inherit;">Package</td><td>2.0 x 2.5 x 1.1 mm</td></tr>
      </tbody>
    </table>
  </div>

  <div class="footer">
    <span>Lotus Microsystems — Silicon-based power for the next frontier</span>
    <span>Generated by Lotus Power Architect v1.0</span>
  </div>
</body>
</html>`;
}

export function ExportButton({ config, comparison }: ExportButtonProps) {
  function handleExport() {
    const html = generateReportHTML(config, comparison);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const win = window.open(url, "_blank");
    if (win) {
      win.onload = () => {
        setTimeout(() => {
          win.print();
          URL.revokeObjectURL(url);
        }, 500);
      };
    }
  }

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-[6px] px-2x py-[6px] border text-[10px] font-mono tracking-technical uppercase transition-colors border-border hover:border-silicon"
      style={{ color: "var(--silicon-grey)" }}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="0.8">
        <path d="M2 8v2h8V8M6 1v7M3 5l3 3 3-3" />
      </svg>
      EXPORT PDF
    </button>
  );
}
