/**
 * powerLogic.ts — Lotus Power Architect Physics Engine
 *
 * Calculates thermal dissipation, PCB area, and efficiency
 * for Lotus SOI solutions vs standard industry buck converters.
 *
 * Based on:
 *   - Lotus LBK0504: 2.0–5.5V in, 0.4–4.9V out, 4A, 6MHz, 95% peak eff, 2.0×2.5×1.1mm
 *   - Standard ref: TI TPS54302 (3.8–28V, 3A, 1MHz typ, ~90% peak, 3.5×3.5mm + inductor + caps)
 */

/* ── TYPES ── */

export interface PowerConfig {
  inputVoltage: number;   // V
  outputVoltage: number;  // V
  outputCurrent: number;  // A
}

export interface SolutionResult {
  area: number;
  width: number;
  height: number;
  depth: number;
  efficiency: number;
  thermalDissipation: number;
  tempRise: number;
  componentCount: number;
  switchingFreq: number;
}

export interface ComparisonResult {
  lotus: SolutionResult;
  standard: SolutionResult;
  areaReduction: number;
  efficiencyDelta: number;
  thermalImprovement: number;
  warnings: string[];
}

/* ── PRODUCT SPECS ── */

export const LOTUS_SPEC = {
  name: "LBK0504",
  vinMin: 2.0,
  vinMax: 5.5,
  voutMin: 0.4,
  maxCurrent: 4.0,
  peakCurrentLimit: 7.0,
  switchingFreq: 6.0,        // MHz
  peakEfficiency: 0.95,
  pkgWidth: 2.0,
  pkgHeight: 2.5,
  pkgDepth: 1.1,
  thermalResistance: 20,     // °C/W — SOI interposer with integrated heat spreading
  componentCount: 1,
  currentPerModule: 4.0,
};

export const STANDARD_SPEC = {
  name: "TI TPS54302",
  vinMin: 3.8,
  vinMax: 28,
  maxCurrent: 3.0,
  switchingFreq: 1.0,        // MHz — TPS54302 typical (620kHz–2.2MHz range)
  peakEfficiency: 0.90,
  pmicWidth: 3.5,
  pmicHeight: 3.5,
  inductorWidth: 4.0,
  inductorHeight: 4.0,
  capacitorArea: 6.0,
  pkgDepth: 2.5,
  thermalResistance: 55,     // °C/W
  componentCount: 8,
  currentPerConverter: 3.0,
};

/* ── VALIDATION ── */

export function getWarnings(config: PowerConfig): string[] {
  const w: string[] = [];

  if (config.inputVoltage < LOTUS_SPEC.vinMin) {
    w.push(`VIN ${config.inputVoltage.toFixed(1)}V below ${LOTUS_SPEC.name} minimum (${LOTUS_SPEC.vinMin}V)`);
  }
  if (config.inputVoltage > LOTUS_SPEC.vinMax) {
    w.push(`VIN ${config.inputVoltage.toFixed(1)}V exceeds ${LOTUS_SPEC.name} rated max (${LOTUS_SPEC.vinMax}V)`);
  }
  if (config.outputVoltage >= config.inputVoltage) {
    w.push(`VOUT must be less than VIN for a step-down converter`);
  }
  if (config.outputVoltage > config.inputVoltage - 0.6) {
    w.push(`VOUT too close to VIN — minimum dropout is 0.6V`);
  }
  if (config.outputVoltage < LOTUS_SPEC.voutMin) {
    w.push(`VOUT ${config.outputVoltage.toFixed(1)}V below minimum (${LOTUS_SPEC.voutMin}V)`);
  }

  return w;
}

/* ── EFFICIENCY MODEL ── */

/**
 * Efficiency depends on:
 * 1. Load fraction (quiescent losses dominate at light load)
 * 2. Duty cycle D = Vout/Vin (extreme ratios hurt efficiency)
 * 3. Switching frequency (higher = more switching losses)
 *
 * This is a simplified but physically-grounded model.
 */
function efficiencyAtLoad(
  loadFraction: number,
  peakEff: number,
  dutyCycle: number,
  freqMHz: number,
  optimalFreq: number
): number {
  // 1. Load curve: low at light load, peaks ~60-80% load
  let loadCurve: number;
  if (loadFraction < 0.05) {
    loadCurve = 0.55 + loadFraction * 4.0;
  } else if (loadFraction < 0.1) {
    loadCurve = 0.75 + (loadFraction - 0.05) * 3.0;
  } else {
    loadCurve = peakEff - 0.015 * Math.pow(1 - loadFraction / 0.7, 2);
  }

  // 2. Duty cycle penalty: worst at extreme D (very high or very low)
  //    Optimal D is around 0.3-0.5 for most topologies
  const dOpt = 0.4;
  const dPenalty = -0.03 * Math.pow((dutyCycle - dOpt) / 0.4, 2);

  // 3. Frequency deviation penalty
  const fPenalty = -0.005 * Math.abs(freqMHz - optimalFreq);

  const eff = loadCurve + dPenalty + fPenalty;

  return Math.min(Math.max(eff, 0.40), peakEff);
}

/**
 * Generate efficiency curve data points for charting.
 */
export function generateEfficiencyCurve(
  config: PowerConfig,
  solution: "lotus" | "standard",
  points: number = 50
): { load: number; efficiency: number }[] {
  const isLotus = solution === "lotus";
  const peak = isLotus ? LOTUS_SPEC.peakEfficiency : STANDARD_SPEC.peakEfficiency;
  const freq = isLotus ? LOTUS_SPEC.switchingFreq : STANDARD_SPEC.switchingFreq;
  const optFreq = freq; // each operates at its own optimal

  // Guard against Vout >= Vin
  const safeVout = Math.min(config.outputVoltage, config.inputVoltage * 0.95);
  const dutyCycle = safeVout / config.inputVoltage;

  const curve: { load: number; efficiency: number }[] = [];
  for (let i = 0; i <= points; i++) {
    const load = i / points;
    const eff = efficiencyAtLoad(load, peak, dutyCycle, freq, optFreq);
    curve.push({ load: load * 100, efficiency: eff * 100 });
  }

  return curve;
}

/* ── AREA & THERMAL ── */

function calculateLotusSolution(config: PowerConfig): SolutionResult {
  const modules = Math.ceil(config.outputCurrent / LOTUS_SPEC.currentPerModule);

  const width = LOTUS_SPEC.pkgWidth * modules + (modules - 1) * 0.3;
  const height = LOTUS_SPEC.pkgHeight;
  const area = width * height;

  const safeVout = Math.min(config.outputVoltage, config.inputVoltage * 0.95);
  const dutyCycle = safeVout / config.inputVoltage;
  const loadFraction = config.outputCurrent / (modules * LOTUS_SPEC.currentPerModule);

  const efficiency = efficiencyAtLoad(
    loadFraction, LOTUS_SPEC.peakEfficiency,
    dutyCycle, LOTUS_SPEC.switchingFreq, LOTUS_SPEC.switchingFreq
  );

  const outputPower = safeVout * config.outputCurrent;
  const inputPower = outputPower / efficiency;
  const thermalDissipation = inputPower - outputPower;
  const tempRise = thermalDissipation * (LOTUS_SPEC.thermalResistance / modules);

  return {
    area, width, height,
    depth: LOTUS_SPEC.pkgDepth,
    efficiency,
    thermalDissipation,
    tempRise,
    componentCount: LOTUS_SPEC.componentCount * modules,
    switchingFreq: LOTUS_SPEC.switchingFreq,
  };
}

function calculateStandardSolution(config: PowerConfig): SolutionResult {
  const converters = Math.ceil(config.outputCurrent / STANDARD_SPEC.currentPerConverter);

  const perArea = STANDARD_SPEC.pmicWidth * STANDARD_SPEC.pmicHeight
    + STANDARD_SPEC.inductorWidth * STANDARD_SPEC.inductorHeight
    + STANDARD_SPEC.capacitorArea;
  const area = perArea * converters;

  const width = (STANDARD_SPEC.pmicWidth + STANDARD_SPEC.inductorWidth + 1.0) * Math.ceil(converters / 2);
  const height = (STANDARD_SPEC.pmicHeight + STANDARD_SPEC.inductorHeight + 1.0) * Math.min(converters, 2);

  const safeVout = Math.min(config.outputVoltage, config.inputVoltage * 0.95);
  const dutyCycle = safeVout / config.inputVoltage;
  const loadFraction = config.outputCurrent / (converters * STANDARD_SPEC.currentPerConverter);

  const efficiency = efficiencyAtLoad(
    loadFraction, STANDARD_SPEC.peakEfficiency,
    dutyCycle, STANDARD_SPEC.switchingFreq, STANDARD_SPEC.switchingFreq
  );

  const outputPower = safeVout * config.outputCurrent;
  const inputPower = outputPower / efficiency;
  const thermalDissipation = inputPower - outputPower;
  const tempRise = thermalDissipation * (STANDARD_SPEC.thermalResistance / converters);

  return {
    area, width, height,
    depth: STANDARD_SPEC.pkgDepth,
    efficiency,
    thermalDissipation,
    tempRise,
    componentCount: STANDARD_SPEC.componentCount * converters,
    switchingFreq: STANDARD_SPEC.switchingFreq,
  };
}

/* ── MAIN ── */

export function calculateComparison(config: PowerConfig): ComparisonResult {
  const warnings = getWarnings(config);

  const lotus = calculateLotusSolution(config);
  const standard = calculateStandardSolution(config);

  const areaReduction = ((standard.area - lotus.area) / standard.area) * 100;
  const efficiencyDelta = (lotus.efficiency - standard.efficiency) * 100;
  const thermalImprovement =
    standard.thermalDissipation > 0
      ? ((standard.thermalDissipation - lotus.thermalDissipation) / standard.thermalDissipation) * 100
      : 0;

  return {
    lotus,
    standard,
    areaReduction: Math.max(areaReduction, 0),
    efficiencyDelta,
    thermalImprovement: Math.max(thermalImprovement, 0),
    warnings,
  };
}

/* ── FORMATTERS ── */

export function formatArea(mm2: number): string {
  return `${mm2.toFixed(1)} mm²`;
}

export function formatEfficiency(eff: number): string {
  return `${(eff * 100).toFixed(1)}%`;
}

export function formatPower(watts: number): string {
  if (watts < 0.001) return `${(watts * 1e6).toFixed(0)} µW`;
  if (watts < 1) return `${(watts * 1000).toFixed(1)} mW`;
  return `${watts.toFixed(2)} W`;
}

export function formatTemp(celsius: number): string {
  return `${celsius.toFixed(1)} °C`;
}
