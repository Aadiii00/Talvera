import { useState } from "react";
import { cn } from "@/lib/utils";
import { toneColor, type StatusTone } from "@/talvera/lib/status";

export interface GraphNode {
  id: string;
  label: string;
  sublabel?: string;
  badge?: string;
  x: number; // 0-100 %
  y: number; // 0-100 %
  tone: StatusTone;
  emphasis?: boolean; // renders as a solid navy "core" node
}

export interface GraphEdge {
  from: string;
  to: string;
  color?: string;
}

export interface GraphColumn {
  label: string;
  x: number;
}

interface NetworkGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  columns?: GraphColumn[];
  height?: number;
  className?: string;
}

export function NetworkGraph({ nodes, edges, columns, height = 480, className }: NetworkGraphProps) {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const findNode = (id: string) => nodes.find((node) => node.id === id);

  // Find all connected node IDs for the currently hovered node
  const connectedNodeIds = new Set<string>();
  if (hoveredNodeId) {
    connectedNodeIds.add(hoveredNodeId);
    edges.forEach((edge) => {
      if (edge.from === hoveredNodeId) connectedNodeIds.add(edge.to);
      if (edge.to === hoveredNodeId) connectedNodeIds.add(edge.from);
    });
  }

  return (
    <div className={cn("relative w-full rounded-2xl border border-border/60 bg-card/50 p-4 backdrop-blur-sm", className)}>
      {/* Optional Column Headers */}
      {columns && columns.length > 0 && (
        <div className="relative mb-4 h-7 w-full border-b border-border/60">
          {columns.map((col) => (
            <div
              key={col.label}
              className="absolute -translate-x-1/2 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground/80"
              style={{ left: `${col.x}%` }}
            >
              <span className="rounded-full bg-secondary/80 px-2.5 py-0.5 border border-border/40">
                {col.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Canvas */}
      <div className="relative w-full" style={{ height }}>
        <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="edgeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--status-teal))" stopOpacity="0.8" />
              <stop offset="100%" stopColor="hsl(var(--status-purple))" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          {edges.map((edge) => {
            const from = findNode(edge.from);
            const to = findNode(edge.to);
            if (!from || !to) return null;

            const isHighlighted = hoveredNodeId === from.id || hoveredNodeId === to.id;
            const isDimmed = hoveredNodeId !== null && !isHighlighted;

            // Smooth cubic bezier curve
            const dx = Math.abs(to.x - from.x) * 0.45;
            const pathData = `M ${from.x} ${from.y} C ${from.x + dx} ${from.y}, ${to.x - dx} ${to.y}, ${to.x} ${to.y}`;

            return (
              <g key={`${edge.from}-${edge.to}`}>
                <path
                  d={pathData}
                  fill="none"
                  stroke={isHighlighted ? "url(#edgeGlow)" : "hsl(var(--border))"}
                  strokeWidth={isHighlighted ? 0.9 : 0.35}
                  strokeOpacity={isDimmed ? 0.15 : isHighlighted ? 1.0 : 0.5}
                  className="transition-all duration-300"
                />
              </g>
            );
          })}
        </svg>

        {/* Nodes */}
        {nodes.map((node) => {
          const isHovered = hoveredNodeId === node.id;
          const isConnected = connectedNodeIds.has(node.id);
          const isDimmed = hoveredNodeId !== null && !isConnected;

          return (
            <div
              key={node.id}
              onMouseEnter={() => setHoveredNodeId(node.id)}
              onMouseLeave={() => setHoveredNodeId(null)}
              className={cn(
                "absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 transition-all duration-200 cursor-pointer",
                isDimmed && "opacity-25 grayscale-[30%]",
                isHovered && "scale-105 z-20"
              )}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              <div
                className={cn(
                  "relative flex min-w-[115px] max-w-[155px] flex-col gap-0.5 rounded-xl border px-3 py-2 text-center shadow-sm transition-shadow hover:shadow-md",
                  node.emphasis && "border-primary/20 bg-primary text-primary-foreground shadow-md ring-2 ring-primary/20"
                )}
                style={
                  node.emphasis
                    ? undefined
                    : {
                        borderColor: toneColor[node.tone],
                        backgroundColor: `hsl(var(--status-${node.tone}-soft))`,
                        color: toneColor[node.tone],
                      }
                }
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[11px] font-bold leading-tight truncate">{node.label}</span>
                  {node.badge && (
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-1.5 py-0.2 text-[9px] font-bold uppercase",
                        node.emphasis ? "bg-white/20 text-white" : "bg-white/60 text-foreground"
                      )}
                    >
                      {node.badge}
                    </span>
                  )}
                </div>
                {node.sublabel && (
                  <span className="text-[10px] leading-tight opacity-80 truncate">{node.sublabel}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
