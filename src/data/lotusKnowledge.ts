/**
 * Lotus Microsystems Technical Knowledge Base
 * Used by the Technical Copilot sidebar for Q&A.
 */

export interface KnowledgeEntry {
  keywords: string[];
  question: string;
  answer: string;
  category: "spec" | "technology" | "thermal" | "comparison" | "general";
}

export const knowledgeBase: KnowledgeEntry[] = [
  // ── LBK0504 SPECS ──
  {
    keywords: ["lbk0504", "buck", "step-down", "converter", "product"],
    question: "What is the LBK0504?",
    answer:
      "The LBK0504 is a miniaturized step-down converter featuring a 2.0mm x 2.5mm x 1.1mm package. It integrates the PMIC and inductor, delivering up to 4A continuous output current with 95% peak efficiency at 6MHz switching frequency.",
    category: "spec",
  },
  {
    keywords: ["input", "voltage", "vin", "range"],
    question: "What is the input voltage range?",
    answer:
      "The LBK0504 supports an input voltage range of 2.0V to 5.5V. Output voltage is configurable from 0.4V to VIN-0.6V via I2C interface.",
    category: "spec",
  },
  {
    keywords: ["output", "current", "iout", "amp", "maximum"],
    question: "What is the maximum output current?",
    answer:
      "Continuous output current is rated at 4.0A with a peak current limit of 7.0A. For higher current requirements, multiple modules can be parallelized using the Lotus Power Interposer.",
    category: "spec",
  },
  {
    keywords: ["frequency", "switching", "fsw", "mhz", "clock"],
    question: "What is the switching frequency?",
    answer:
      "The nominal switching frequency is 6MHz with a synchronization range of 4-8MHz. The I2C interface supports clock frequencies from 10kHz to 1000kHz for configuration.",
    category: "spec",
  },
  {
    keywords: ["efficiency", "percent", "peak", "loss"],
    question: "What is the peak efficiency?",
    answer:
      "Peak efficiency is 95% under optimal loading conditions (approximately 50-80% of rated load). The SOI technology and high switching frequency enable superior light-load efficiency compared to standard solutions.",
    category: "spec",
  },
  {
    keywords: ["quiescent", "iq", "standby", "shutdown", "sleep"],
    question: "What is the quiescent current?",
    answer:
      "Shutdown current is 30µA. The device features ultra-low quiescent current in sleep mode, making it suitable for battery-powered applications where standby efficiency is critical.",
    category: "spec",
  },
  {
    keywords: ["size", "package", "footprint", "dimension", "area", "mm"],
    question: "What is the package size?",
    answer:
      "The LBK0504 package measures 2.0mm x 2.5mm x 1.1mm (5.0mm² footprint). This represents up to 72% footprint reduction compared to equivalent discrete solutions that typically require 18-43mm² for PMIC + inductor + capacitors.",
    category: "spec",
  },
  {
    keywords: ["noise", "psrr", "ripple", "rejection"],
    question: "What is the noise performance?",
    answer:
      "The LBK0504 achieves 70dB Power Supply Rejection Ratio (PSRR) and is characterized as ultra low-noise, making it suitable for sensitive RF and analog circuits.",
    category: "spec",
  },
  // ── TECHNOLOGY ──
  {
    keywords: ["soi", "silicon", "insulator", "technology", "process"],
    question: "What is SOI technology?",
    answer:
      "Silicon-on-Insulator (SOI) is a semiconductor fabrication technique where transistors are built on a thin silicon layer separated from the bulk substrate by an insulating oxide layer. This eliminates parasitic junction capacitances, enabling higher switching frequencies (6MHz+), lower leakage currents, and better thermal isolation.",
    category: "technology",
  },
  {
    keywords: ["interposer", "power interposer", "integration", "packaging"],
    question: "What is the Lotus Power Interposer?",
    answer:
      "The Lotus Power Interposer™ is a proprietary technology — the industry's first power silicon interposer. It enables silicon interposers in power applications, carrying higher currents and withstanding higher voltages than signal interposers. Benefits: best-in-class power density, superior thermal performance, high efficiency, and heterogeneous integration of PMIC + inductor in a single package.",
    category: "technology",
  },
  {
    keywords: ["ltg", "thermal", "guide", "jumper", "smt"],
    question: "What is the LTG thermal guide?",
    answer:
      "The LTG family consists of Thermal Guide Electrically-Isolated SMT Thermal Jumpers. These provide efficient heat spreading paths from hot components to PCB thermal relief areas without electrical connection, critical for managing thermal dissipation in compact power designs.",
    category: "thermal",
  },
  {
    keywords: ["lmu20p1", "boost", "step-up"],
    question: "What is the LMU20P1?",
    answer:
      "The LMU20P1 is a miniaturized step-up (boost) power supply in package. It's a 100mA synchronous boost converter designed for low-power applications requiring voltage step-up in a compact form factor.",
    category: "spec",
  },
  // ── THERMAL ──
  {
    keywords: ["thermal", "dissipation", "heat", "temperature", "junction"],
    question: "How does Lotus handle thermal management?",
    answer:
      "Lotus SOI technology provides inherent thermal advantages: (1) The insulator layer provides controlled thermal paths, (2) Higher efficiency means less waste heat (95% vs 90% = 50% less dissipation at same output), (3) The Power Interposer acts as an integrated heat spreader, (4) Optional LTG thermal jumpers route heat to PCB thermal pads.",
    category: "thermal",
  },
  {
    keywords: ["protection", "ovp", "uvp", "otp", "overcurrent"],
    question: "What protection features are included?",
    answer:
      "The LBK0504 includes: cycle-by-cycle current limiting, input under-voltage lockout (UVLO), over-temperature protection (OTP), output over-voltage protection (OVP), and output under-voltage protection (UVP). The device is RoHS compliant.",
    category: "spec",
  },
  // ── COMPARISON ──
  {
    keywords: ["compare", "vs", "versus", "standard", "traditional", "ti", "competitor"],
    question: "How does Lotus compare to standard solutions?",
    answer:
      "vs Standard TI-class buck converters: (1) Area: 5.0mm² vs 18-34mm² (up to 72% reduction), (2) Efficiency: 95% vs 88-90% peak, (3) Frequency: 6MHz vs 0.5-2MHz (smaller passives), (4) Components: 1 integrated module vs 6-10 discrete parts, (5) Thermal: ~20°C/W vs ~55°C/W junction-to-board resistance — SOI interposer provides integrated heat spreading.",
    category: "comparison",
  },
  {
    keywords: ["advantage", "benefit", "why", "better"],
    question: "What are the key advantages of Lotus?",
    answer:
      "Key advantages: (1) 72% smaller PCB footprint — critical for mobile and wearable devices, (2) 5% higher peak efficiency — longer battery life, (3) Single-component BOM — simplified supply chain and assembly, (4) Higher switching frequency — enables smaller external components if needed, (5) Superior thermal management through SOI isolation.",
    category: "comparison",
  },
  // ── GENERAL ──
  {
    keywords: ["company", "lotus", "about", "who", "founded"],
    question: "Who is Lotus Microsystems?",
    answer:
      "Lotus Microsystems is a fabless semiconductor manufacturer founded in 2020 by three Ph.D. graduates from the Technical University of Denmark (DTU) with expertise in nanofabrication, IC design, and power electronics. Mission: 'Silicon-based power for the next frontier.' They specialize in highly-integrated power modules using SOI technology and the Lotus Power Interposer.",
    category: "general",
  },
  {
    keywords: ["application", "use", "market", "target", "optical", "800g"],
    question: "What are the target applications?",
    answer:
      "Primary applications: (1) 800G+ optical transceivers — vertical LTG integration, (2) Mobile and wearable devices — space-constrained power delivery, (3) AI accelerators — high-density power for compute, (4) IoT sensors — ultra-low quiescent current for battery life, (5) RF systems — low noise PSRR for sensitive analog circuits.",
    category: "general",
  },
  {
    keywords: ["i2c", "interface", "configure", "program", "digital"],
    question: "How is the device configured?",
    answer:
      "The LBK0504 is configured via I2C interface (10-1000kHz clock). Configurable parameters include: output voltage (0.4V to VIN-0.6V), switching frequency synchronization (4-8MHz range), soft-start timing, and protection thresholds. This eliminates the need for external resistor dividers used in analog-configured converters.",
    category: "spec",
  },
];

/**
 * Search the knowledge base for relevant answers.
 * Returns entries sorted by keyword match relevance.
 */
export function searchKnowledge(query: string): KnowledgeEntry[] {
  const terms = query.toLowerCase().split(/\s+/).filter((t) => t.length > 2);

  const scored = knowledgeBase.map((entry) => {
    let score = 0;
    for (const term of terms) {
      for (const keyword of entry.keywords) {
        if (keyword.includes(term) || term.includes(keyword)) {
          score += 2;
        }
      }
      if (entry.question.toLowerCase().includes(term)) score += 1;
      if (entry.answer.toLowerCase().includes(term)) score += 0.5;
    }
    return { entry, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.entry);
}
