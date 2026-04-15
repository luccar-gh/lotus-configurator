"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { type ComparisonResult } from "@/lib/powerLogic";

interface PCBView3DProps {
  comparison: ComparisonResult;
  showHeatmap: boolean;
}

function PCBBoard() {
  return (
    <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[14, 8]} />
      <meshStandardMaterial color="#e8e4df" />
    </mesh>
  );
}

function GridLines() {
  const lines = [];
  for (let i = -7; i <= 7; i++) {
    lines.push(
      <mesh key={`v${i}`} position={[i, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.01, 8]} />
        <meshBasicMaterial color="#c8c4bf" />
      </mesh>
    );
  }
  for (let i = -4; i <= 4; i++) {
    lines.push(
      <mesh key={`h${i}`} position={[0, -0.04, i]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 0.01]} />
        <meshBasicMaterial color="#c8c4bf" />
      </mesh>
    );
  }
  return <>{lines}</>;
}

/* Standard discrete components (PMIC + inductor + caps) */
function StandardComponents({
  position,
  totalWidth,
  totalDepth,
  thermalIntensity,
  showHeatmap,
}: {
  position: [number, number, number];
  totalWidth: number;
  totalDepth: number;
  thermalIntensity: number;
  showHeatmap: boolean;
}) {
  const pmicW = totalWidth * 0.4;
  const pmicD = totalDepth * 0.5;
  const indW = totalWidth * 0.5;
  const indD = totalDepth * 0.55;
  const capW = totalWidth * 0.28;
  const capD = totalDepth * 0.3;

  return (
    <group position={position}>
      {showHeatmap && (
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[Math.max(totalWidth, totalDepth) * 0.8, 32]} />
          <meshBasicMaterial color="#FF3300" transparent opacity={thermalIntensity * 0.3} />
        </mesh>
      )}

      {/* PMIC */}
      <mesh position={[-totalWidth * 0.2, 0.12, -totalDepth * 0.15]}>
        <boxGeometry args={[pmicW, 0.24, pmicD]} />
        <meshStandardMaterial color="#2d2d2d" flatShading />
      </mesh>

      {/* Inductor */}
      <mesh position={[totalWidth * 0.15, 0.15, -totalDepth * 0.12]}>
        <boxGeometry args={[indW, 0.3, indD]} />
        <meshStandardMaterial color="#3a3a3a" flatShading />
      </mesh>

      {/* Input cap */}
      <mesh position={[-totalWidth * 0.2, 0.06, totalDepth * 0.3]}>
        <boxGeometry args={[capW, 0.12, capD]} />
        <meshStandardMaterial color="#4a4a4a" flatShading />
      </mesh>

      {/* Output cap */}
      <mesh position={[totalWidth * 0.1, 0.06, totalDepth * 0.3]}>
        <boxGeometry args={[capW, 0.12, capD]} />
        <meshStandardMaterial color="#4a4a4a" flatShading />
      </mesh>

      {/* Small feedback resistors */}
      <mesh position={[totalWidth * 0.35, 0.03, totalDepth * 0.3]}>
        <boxGeometry args={[0.1, 0.06, 0.05]} />
        <meshStandardMaterial color="#5a5a5a" flatShading />
      </mesh>
      <mesh position={[totalWidth * 0.35, 0.03, totalDepth * 0.2]}>
        <boxGeometry args={[0.1, 0.06, 0.05]} />
        <meshStandardMaterial color="#5a5a5a" flatShading />
      </mesh>
    </group>
  );
}

/* Lotus single integrated module */
function LotusModule({
  position,
  width,
  depth,
  thermalIntensity,
  showHeatmap,
}: {
  position: [number, number, number];
  width: number;
  depth: number;
  thermalIntensity: number;
  showHeatmap: boolean;
}) {
  return (
    <group position={position}>
      {showHeatmap && (
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[Math.max(width, depth) * 1.2, 32]} />
          <meshBasicMaterial color="#FF5F00" transparent opacity={thermalIntensity * 0.2} />
        </mesh>
      )}

      {/* Module body */}
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[width, 0.16, depth]} />
        <meshStandardMaterial color="#FF5F00" flatShading />
      </mesh>

      {/* Pin marks */}
      {[-1, 1].map((side) =>
        [0.25, 0.5, 0.75].map((frac) => (
          <mesh key={`${side}-${frac}`}
            position={[side * (width / 2 + 0.04), 0.02, depth * (frac - 0.5)]}
            rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.08, 0.04]} />
            <meshBasicMaterial color="#CC4400" />
          </mesh>
        ))
      )}
    </group>
  );
}

export function PCBView3D({ comparison, showHeatmap }: PCBView3DProps) {
  const { lotus, standard } = comparison;

  const scale = 0.25;
  const stdThermal = Math.min(standard.tempRise / 80, 1);
  const lotusThermal = Math.min(lotus.tempRise / 80, 1);

  return (
    <Canvas camera={{ position: [0, 7, 9], fov: 38 }} className="w-full h-full">
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 10, 5]} intensity={0.6} />
      <directionalLight position={[-3, 8, -2]} intensity={0.3} />

      <PCBBoard />
      <GridLines />

      {/* Standard solution — discrete components */}
      <StandardComponents
        position={[-3, 0, 0]}
        totalWidth={standard.width * scale}
        totalDepth={standard.height * scale}
        thermalIntensity={stdThermal}
        showHeatmap={showHeatmap}
      />

      {/* Lotus SOI — single module */}
      <LotusModule
        position={[3, 0, 0]}
        width={lotus.width * scale}
        depth={lotus.height * scale}
        thermalIntensity={lotusThermal}
        showHeatmap={showHeatmap}
      />

      {/* Labels — matching 2D precision */}
      <Text position={[-3, 0.01, 3.2]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.18} color="#2d2d2d" letterSpacing={0.08}>
        STANDARD
      </Text>
      <Text position={[-3, 0.01, 2.6]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.2} color="#2d2d2d">
        {standard.area.toFixed(1)} mm²
      </Text>
      <Text position={[-3, 0.01, 2.2]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.14} color="#555555">
        {standard.componentCount} components
      </Text>

      <Text position={[3, 0.01, 3.2]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.18} color="#FF5F00" letterSpacing={0.08}>
        LOTUS SOI
      </Text>
      <Text position={[3, 0.01, 2.6]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.2} color="#FF5F00">
        {lotus.area.toFixed(1)} mm²
      </Text>
      <Text position={[3, 0.01, 2.2]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.14} color="#cc4a00">
        {lotus.componentCount} module{lotus.componentCount > 1 ? "s" : ""}
      </Text>

      {/* Area reduction */}
      <Text position={[0, 0.01, -3.2]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.18} color="#FF5F00" letterSpacing={0.08}>
        {comparison.areaReduction.toFixed(0)}% AREA REDUCTION
      </Text>

      <OrbitControls enableZoom enablePan={false}
        minPolarAngle={Math.PI / 8} maxPolarAngle={Math.PI / 2.5}
        minDistance={6} maxDistance={16} />
    </Canvas>
  );
}
