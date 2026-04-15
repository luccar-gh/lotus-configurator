interface DataValueProps {
  children: React.ReactNode;
  size?: "default" | "lg";
  className?: string;
}

export function DataValue({ children, size = "default", className = "" }: DataValueProps) {
  const sizeClass = size === "lg" ? "text-data-lg" : "text-data";

  return (
    <span className={`font-mono font-medium text-silicon ${sizeClass} ${className}`}>
      {children}
    </span>
  );
}
