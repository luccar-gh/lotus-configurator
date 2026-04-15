"use client";

import { motion } from "framer-motion";
import { TechnicalLabel } from "./TechnicalLabel";

interface MetricCardProps {
  label: string;
  value: string;
  delta?: string;
  accent?: boolean;
}

const FLOAT: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function MetricCard({ label, value, delta, accent = false }: MetricCardProps) {
  return (
    <div className="p-2x border" style={{ borderColor: "var(--border-thin)", background: accent ? "var(--ui-linen)" : "var(--bg-white)" }}>
      <TechnicalLabel>{label}</TechnicalLabel>
      <motion.div
        key={value}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: FLOAT }}
        className="font-mono font-medium text-data mt-1x"
        style={{ color: accent ? "var(--signal-orange)" : "var(--silicon-grey)" }}
      >
        {value}
      </motion.div>
      {delta && (
        <motion.div
          key={delta}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="font-mono text-[11px] text-green mt-[4px]"
        >
          {delta}
        </motion.div>
      )}
    </div>
  );
}
