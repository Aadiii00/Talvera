import { cn } from "@/lib/utils";
import { toneColor, type StatusTone } from "@/talvera/lib/status";

export interface GraphNode {
  id: string;
  label: string;
  sublabel?: string;
  x: number; // 0-100 %
  y: number; // 0-100 %
  tone: StatusTone;
  emphasis?: boolean; // renders as a solid navy "core" node instead of a soft tone card
}

export interface GraphEdge {
  from: string;
  to: string;
}

interface NetworkGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  height?: number;
  className?: string;
}

export function NetworkGraph({ nodes, edges, height = 380, className }: NetworkGraphProps) {
  const findNode = (id: string) => nodes.find((node) => node.id === id);

  return (
    <div className={cn("relative w-full", className)} style={{ height }}>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {edges.map((edge) => {
          const from = findNode(edge.from);
          const to = findNode(edge.to);
          if (!from || !to) return null;
          return (
            <line
              key={`${edge.from}-${edge.to}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="hsl(var(--border))"
              strokeWidth={0.4}
            />
          );
        })}
      </svg>
      {nodes.map((node) => (
        <div
          key={node.id}
          className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 text-center"
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
        >
          <div
            className={cn(
              "flex min-w-[110px] max-w-[160px] flex-col gap-0.5 rounded-xl border px-3 py-2 shadow-sm",
              node.emphasis && "border-transparent bg-primary text-primary-foreground shadow-md"
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
            <span className="text-[11px] font-semibold leading-tight">{node.label}</span>
            {node.sublabel && <span className="text-[10px] leading-tight opacity-80">{node.sublabel}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
