import { useConsistency } from "../context/ConsistencyContext";

export default function ConsistencyBanner() {
  const { consistencyResult, clearResult } = useConsistency();

  if (!consistencyResult) return null;

  const hasContradictions =
    consistencyResult.contradictions && consistencyResult.contradictions.length > 0;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 w-96 max-h-[70vh] overflow-y-auto bg-[#0d0f1e] border border-amber-500/40 rounded-xl shadow-2xl"
      style={{ fontFamily: "'Cinzel', serif" }}
    >
      <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-amber-500/20">
        <h3 className="text-amber-300 text-xs tracking-widest uppercase">
          AI Consistency Check
        </h3>
        <button
          onClick={clearResult}
          className="text-white/40 hover:text-white/80 transition-colors text-lg leading-none"
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>

      <div className="p-4">
        {!hasContradictions ? (
          <p className="text-amber-200/60 text-xs" style={{ fontFamily: "sans-serif" }}>
            No issues found. Your world is consistent!
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {consistencyResult.contradictions.map((item, i) => (
              <div key={i} className="flex flex-col gap-1">
                <p
                  className="text-amber-100/80 text-xs leading-relaxed"
                  style={{ fontFamily: "sans-serif" }}
                >
                  {item.description}
                </p>
                {item.elements_involved && item.elements_involved.length > 0 && (
                  <p className="text-amber-400/60 text-xs" style={{ fontFamily: "sans-serif" }}>
                    Involves: {item.elements_involved.join(", ")}
                  </p>
                )}
                {item.suggestion && (
                  <p
                    className="text-amber-300/70 text-xs italic"
                    style={{ fontFamily: "sans-serif" }}
                  >
                    {item.suggestion}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
