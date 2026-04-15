interface TechnicalLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function TechnicalLabel({ children, className = "" }: TechnicalLabelProps) {
  return (
    <span className={`text-label uppercase tracking-technical font-sans ${className}`} style={{ color: className.includes("text-") ? undefined : "var(--silicon-grey)" }}>
      {children}
    </span>
  );
}
