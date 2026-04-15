interface ViewToggleProps {
  view: "2d" | "3d";
  onChange: (view: "2d" | "3d") => void;
}

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="flex border border-border">
      <button
        onClick={() => onChange("2d")}
        className={`px-2x py-1x text-label uppercase tracking-technical font-sans transition-colors ${
          view === "2d"
            ? "bg-orange text-static-white"
            : "bg-white text-silicon hover:bg-linen"
        }`}
      >
        2D
      </button>
      <button
        onClick={() => onChange("3d")}
        className={`px-2x py-1x text-label uppercase tracking-technical font-sans border-l border-border transition-colors ${
          view === "3d"
            ? "bg-orange text-static-white"
            : "bg-white text-silicon hover:bg-linen"
        }`}
      >
        3D
      </button>
    </div>
  );
}
