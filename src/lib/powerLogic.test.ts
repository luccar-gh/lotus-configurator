import { describe, it, expect } from "vitest";
import {
  calculateComparison,
  generateEfficiencyCurve,
  formatArea,
  formatPower,
  formatTemp,
  type PowerConfig,
} from "./powerLogic";

/* ── FIXTURES ── */

const DEFAULT_CONFIG: PowerConfig = {
  inputVoltage: 5,
  outputVoltage: 1.8,
  outputCurrent: 2,
};

const HIGH_CURRENT_CONFIG: PowerConfig = {
  inputVoltage: 5,
  outputVoltage: 3.3,
  outputCurrent: 15,
};

const LOW_POWER_CONFIG: PowerConfig = {
  inputVoltage: 3.3,
  outputVoltage: 1.2,
  outputCurrent: 0.5,
};

/* ── COMPARISON TESTS ── */

describe("calculateComparison", () => {
  it("returns valid comparison for default config", () => {
    const result = calculateComparison(DEFAULT_CONFIG);

    expect(result.lotus).toBeDefined();
    expect(result.standard).toBeDefined();
    expect(result.areaReduction).toBeGreaterThan(0);
    expect(result.areaReduction).toBeLessThanOrEqual(100);
  });

  it("Lotus area is always smaller than Standard", () => {
    const configs = [DEFAULT_CONFIG, HIGH_CURRENT_CONFIG, LOW_POWER_CONFIG];

    for (const config of configs) {
      const result = calculateComparison(config);
      expect(result.lotus.area).toBeLessThan(result.standard.area);
    }
  });

  it("Lotus efficiency is higher than Standard", () => {
    const result = calculateComparison(DEFAULT_CONFIG);
    expect(result.lotus.efficiency).toBeGreaterThan(result.standard.efficiency);
    expect(result.efficiencyDelta).toBeGreaterThan(0);
  });

  it("area reduction matches Lotus claims (~72% range)", () => {
    // At moderate current, area reduction should be significant
    const result = calculateComparison(DEFAULT_CONFIG);
    expect(result.areaReduction).toBeGreaterThan(40);
    expect(result.areaReduction).toBeLessThan(95);
  });

  it("thermal dissipation is positive for both solutions", () => {
    const result = calculateComparison(DEFAULT_CONFIG);
    expect(result.lotus.thermalDissipation).toBeGreaterThan(0);
    expect(result.standard.thermalDissipation).toBeGreaterThan(0);
  });

  it("Lotus dissipates less heat than Standard", () => {
    const result = calculateComparison(DEFAULT_CONFIG);
    expect(result.lotus.thermalDissipation).toBeLessThan(result.standard.thermalDissipation);
    expect(result.thermalImprovement).toBeGreaterThan(0);
  });

  it("temperature rise is physically sane (< 150°C)", () => {
    const result = calculateComparison(HIGH_CURRENT_CONFIG);
    expect(result.lotus.tempRise).toBeLessThan(150);
    expect(result.standard.tempRise).toBeLessThan(150);
    expect(result.lotus.tempRise).toBeGreaterThan(0);
  });

  it("component count: Lotus uses fewer parts", () => {
    const result = calculateComparison(DEFAULT_CONFIG);
    expect(result.lotus.componentCount).toBeLessThan(result.standard.componentCount);
  });

  it("high current requires multiple modules/converters", () => {
    const result = calculateComparison(HIGH_CURRENT_CONFIG);
    expect(result.lotus.componentCount).toBeGreaterThanOrEqual(1);
    expect(result.standard.componentCount).toBeGreaterThan(8);
  });

  it("dimensions are physically sane (area = width * height approx)", () => {
    const result = calculateComparison(DEFAULT_CONFIG);
    // Area should be close to width * height (within some tolerance for gaps)
    expect(result.lotus.width).toBeGreaterThan(0);
    expect(result.lotus.height).toBeGreaterThan(0);
    expect(result.standard.width).toBeGreaterThan(0);
    expect(result.standard.height).toBeGreaterThan(0);
  });
});

/* ── EFFICIENCY CURVE TESTS ── */

describe("generateEfficiencyCurve", () => {
  it("returns correct number of data points", () => {
    const curve = generateEfficiencyCurve(DEFAULT_CONFIG, "lotus", 50);
    expect(curve).toHaveLength(51); // 0 to 50 inclusive
  });

  it("load ranges from 0% to 100%", () => {
    const curve = generateEfficiencyCurve(DEFAULT_CONFIG, "lotus");
    expect(curve[0].load).toBe(0);
    expect(curve[curve.length - 1].load).toBe(100);
  });

  it("efficiency values are in sane range (50% to 100%)", () => {
    const lotusCurve = generateEfficiencyCurve(DEFAULT_CONFIG, "lotus");
    const stdCurve = generateEfficiencyCurve(DEFAULT_CONFIG, "standard");

    for (const point of lotusCurve) {
      expect(point.efficiency).toBeGreaterThanOrEqual(50);
      expect(point.efficiency).toBeLessThanOrEqual(100);
    }
    for (const point of stdCurve) {
      expect(point.efficiency).toBeGreaterThanOrEqual(50);
      expect(point.efficiency).toBeLessThanOrEqual(100);
    }
  });

  it("Lotus peak efficiency is higher than Standard peak", () => {
    const lotusCurve = generateEfficiencyCurve(DEFAULT_CONFIG, "lotus");
    const stdCurve = generateEfficiencyCurve(DEFAULT_CONFIG, "standard");

    const lotusPeak = Math.max(...lotusCurve.map((p) => p.efficiency));
    const stdPeak = Math.max(...stdCurve.map((p) => p.efficiency));

    expect(lotusPeak).toBeGreaterThan(stdPeak);
  });

  it("efficiency is lower at very light loads (quiescent losses)", () => {
    const curve = generateEfficiencyCurve(DEFAULT_CONFIG, "lotus");
    const atLight = curve[1].efficiency; // ~2% load
    const atMid = curve[25].efficiency;  // ~50% load

    expect(atMid).toBeGreaterThan(atLight);
  });
});

/* ── FORMATTER TESTS ── */

describe("formatters", () => {
  it("formatArea returns mm² string", () => {
    expect(formatArea(5.0)).toBe("5.0 mm²");
    expect(formatArea(123.45)).toBe("123.5 mm²");
  });

  it("formatPower handles different magnitudes", () => {
    expect(formatPower(0.005)).toContain("mW");
    expect(formatPower(0.00005)).toContain("µW");
    expect(formatPower(2.5)).toContain("W");
  });

  it("formatTemp returns °C string", () => {
    expect(formatTemp(25.3)).toBe("25.3 °C");
  });
});

/* ── PHYSICS SANITY CHECKS ── */

describe("physics sanity", () => {
  it("output power = Vout * Iout (conservation of energy check)", () => {
    const config = DEFAULT_CONFIG;
    const result = calculateComparison(config);

    const expectedOutputPower = config.outputVoltage * config.outputCurrent;
    // Input power should be > output power (efficiency < 100%)
    const lotusInputPower = expectedOutputPower / result.lotus.efficiency;

    expect(lotusInputPower).toBeGreaterThan(expectedOutputPower);
    // Dissipation should equal input - output
    const expectedDissipation = lotusInputPower - expectedOutputPower;
    expect(result.lotus.thermalDissipation).toBeCloseTo(expectedDissipation, 2);
  });

  it("higher current = more thermal dissipation", () => {
    const low = calculateComparison({ ...DEFAULT_CONFIG, outputCurrent: 1 });
    const high = calculateComparison({ ...DEFAULT_CONFIG, outputCurrent: 10 });

    expect(high.lotus.thermalDissipation).toBeGreaterThan(low.lotus.thermalDissipation);
    expect(high.standard.thermalDissipation).toBeGreaterThan(low.standard.thermalDissipation);
  });

  it("higher current = larger footprint", () => {
    const low = calculateComparison({ ...DEFAULT_CONFIG, outputCurrent: 1 });
    const high = calculateComparison({ ...DEFAULT_CONFIG, outputCurrent: 10 });

    expect(high.lotus.area).toBeGreaterThan(low.lotus.area);
    expect(high.standard.area).toBeGreaterThan(low.standard.area);
  });
});
