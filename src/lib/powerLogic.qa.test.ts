import { describe, it, expect } from "vitest";
import { calculateComparison, generateEfficiencyCurve, type PowerConfig } from "./powerLogic";

/**
 * QA Tests — Product Sense Validation
 * Verifies the numbers shown to users are credible and tell the right story.
 */

describe("Product QA — Real-world scenarios", () => {
  it("LBK0504 typical use case: 5V→1.8V, 2A — matches datasheet claims", () => {
    const config: PowerConfig = { inputVoltage: 5, outputVoltage: 1.8, outputCurrent: 2 };
    const result = calculateComparison(config);

    // Lotus area should be close to 5mm² (single LBK0504 module)
    expect(result.lotus.area).toBeCloseTo(5.0, 0);

    // Lotus efficiency should be high (near 95%)
    expect(result.lotus.efficiency).toBeGreaterThan(0.88);

    // Area reduction claim: "up to 72%"
    expect(result.areaReduction).toBeGreaterThan(50);

    // Standard solution needs more components
    expect(result.standard.componentCount).toBeGreaterThan(result.lotus.componentCount);
  });

  it("High current 15A scenario — multiple modules, still advantageous", () => {
    const config: PowerConfig = { inputVoltage: 5, outputVoltage: 3.3, outputCurrent: 15 };
    const result = calculateComparison(config);

    // Multiple lotus modules needed
    expect(result.lotus.componentCount).toBeGreaterThan(1);

    // Still smaller than standard
    expect(result.lotus.area).toBeLessThan(result.standard.area);

    // Area advantage should hold even at scale
    expect(result.areaReduction).toBeGreaterThan(30);
  });

  it("Low power IoT: 3.3V→1.2V, 0.5A — where SOI quiescent current shines", () => {
    const config: PowerConfig = { inputVoltage: 3.3, outputVoltage: 1.2, outputCurrent: 0.5 };
    const result = calculateComparison(config);

    // Very small lotus footprint
    expect(result.lotus.area).toBeLessThan(10);

    // Efficiency should be good even at light load
    expect(result.lotus.efficiency).toBeGreaterThan(0.8);

    // Thermal should be minimal
    expect(result.lotus.tempRise).toBeLessThan(5);
  });

  it("Efficiency curves cross-check: Lotus always above Standard at mid-load", () => {
    const configs: PowerConfig[] = [
      { inputVoltage: 5, outputVoltage: 1.8, outputCurrent: 2 },
      { inputVoltage: 5, outputVoltage: 3.3, outputCurrent: 8 },
      { inputVoltage: 3.3, outputVoltage: 1.2, outputCurrent: 1 },
    ];

    for (const config of configs) {
      const lotus = generateEfficiencyCurve(config, "lotus");
      const standard = generateEfficiencyCurve(config, "standard");

      // At 50% load, Lotus should be more efficient
      const midIdx = Math.floor(lotus.length / 2);
      expect(lotus[midIdx].efficiency).toBeGreaterThan(standard[midIdx].efficiency);
    }
  });

  it("Power conservation: input power > output power for all configs", () => {
    const configs: PowerConfig[] = [
      { inputVoltage: 5, outputVoltage: 1.8, outputCurrent: 2 },
      { inputVoltage: 5.5, outputVoltage: 3.3, outputCurrent: 10 },
      { inputVoltage: 3.3, outputVoltage: 1.0, outputCurrent: 0.5 },
    ];

    for (const config of configs) {
      const result = calculateComparison(config);
      const outputPower = config.outputVoltage * config.outputCurrent;

      // Thermal dissipation must equal Ploss = Pout/eff - Pout
      const lotusExpectedLoss = outputPower / result.lotus.efficiency - outputPower;
      expect(result.lotus.thermalDissipation).toBeCloseTo(lotusExpectedLoss, 3);

      const stdExpectedLoss = outputPower / result.standard.efficiency - outputPower;
      expect(result.standard.thermalDissipation).toBeCloseTo(stdExpectedLoss, 3);
    }
  });

  it("No negative or NaN values in any output", () => {
    const configs: PowerConfig[] = [
      { inputVoltage: 2, outputVoltage: 0.4, outputCurrent: 0.5 },
      { inputVoltage: 5.5, outputVoltage: 4.0, outputCurrent: 20 },
      { inputVoltage: 5, outputVoltage: 1.8, outputCurrent: 4 },
    ];

    for (const config of configs) {
      const result = calculateComparison(config);

      // No NaN
      expect(Number.isNaN(result.lotus.area)).toBe(false);
      expect(Number.isNaN(result.lotus.efficiency)).toBe(false);
      expect(Number.isNaN(result.lotus.thermalDissipation)).toBe(false);
      expect(Number.isNaN(result.lotus.tempRise)).toBe(false);
      expect(Number.isNaN(result.standard.area)).toBe(false);
      expect(Number.isNaN(result.areaReduction)).toBe(false);

      // No negative values
      expect(result.lotus.area).toBeGreaterThan(0);
      expect(result.lotus.efficiency).toBeGreaterThan(0);
      expect(result.lotus.thermalDissipation).toBeGreaterThanOrEqual(0);
      expect(result.lotus.tempRise).toBeGreaterThanOrEqual(0);
      expect(result.standard.area).toBeGreaterThan(0);
      expect(result.areaReduction).toBeGreaterThanOrEqual(0);
    }
  });

  it("Extreme edge cases don't crash", () => {
    // Min everything
    expect(() => calculateComparison({ inputVoltage: 2, outputVoltage: 0.4, outputCurrent: 0.5 })).not.toThrow();
    // Max everything
    expect(() => calculateComparison({ inputVoltage: 5.5, outputVoltage: 4.0, outputCurrent: 20 })).not.toThrow();
  });
});

describe("Product QA — Knowledge Base", () => {
  it("searchKnowledge returns results for common queries", async () => {
    const { searchKnowledge } = await import("@/data/lotusKnowledge");

    expect(searchKnowledge("LBK0504").length).toBeGreaterThan(0);
    expect(searchKnowledge("input voltage range").length).toBeGreaterThan(0);
    expect(searchKnowledge("SOI technology").length).toBeGreaterThan(0);
    expect(searchKnowledge("quiescent current 5V").length).toBeGreaterThan(0);
    expect(searchKnowledge("thermal dissipation").length).toBeGreaterThan(0);
    expect(searchKnowledge("compare lotus standard").length).toBeGreaterThan(0);
  });

  it("searchKnowledge returns empty for gibberish", async () => {
    const { searchKnowledge } = await import("@/data/lotusKnowledge");
    expect(searchKnowledge("xyzzy plugh").length).toBe(0);
  });
});
