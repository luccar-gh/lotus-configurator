"use client";

import { motion, AnimatePresence } from "framer-motion";
import { TechnicalLabel } from "./TechnicalLabel";

interface ParameterSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
}

const FLOAT: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function ParameterSlider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: ParameterSliderProps) {
  return (
    <div className="flex flex-col gap-1x">
      <TechnicalLabel>{label}</TechnicalLabel>

      <motion.span
        key={value.toFixed(1)}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: FLOAT }}
        className="font-mono font-medium text-data text-silicon"
      >
        {value.toFixed(1)}
        <span className="text-label ml-[4px] opacity-60">{unit}</span>
      </motion.span>

      <div className="relative w-full h-[24px] flex items-center">
        {/* Track background */}
        <div className="absolute w-full h-[1px] bg-border" />

        {/* Filled track */}
        <motion.div
          className="absolute h-[1px] bg-orange"
          style={{ width: `${((value - min) / (max - min)) * 100}%` }}
          transition={{ duration: 0.15, ease: FLOAT }}
        />

        {/* Native range input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full h-[24px] opacity-0 cursor-pointer z-10"
        />

        {/* Custom thumb */}
        <motion.div
          className="absolute w-[12px] h-[12px] bg-orange border-0"
          style={{ left: `calc(${((value - min) / (max - min)) * 100}% - 6px)` }}
          transition={{ duration: 0.15, ease: FLOAT }}
          whileHover={{ scale: 1.3 }}
          whileTap={{ scale: 0.9 }}
        />
      </div>

      <div className="flex justify-between">
        <TechnicalLabel>
          {min}
          {unit}
        </TechnicalLabel>
        <TechnicalLabel>
          {max}
          {unit}
        </TechnicalLabel>
      </div>
    </div>
  );
}
