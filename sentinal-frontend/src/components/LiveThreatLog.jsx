
export default function LiveThreatLog({ violations = [], loading, error, onSelect }) {
  return (
    <div className="p-4 space-y-3 h-full flex flex-col">
      <h2 className="text-lg font-semibold flex-shrink-0">Live Threat Log</h2>

      {loading && <div className="text-xs text-blue-400 flex-shrink-0">Loading...</div>}
      {error && <div className="text-xs text-red-400 flex-shrink-0">{error}</div>}

      <div className="flex-1 min-h-0 overflow-y-auto space-y-3">
        {violations.map((v) => (
          <div
            key={v.id}
            className="border border-zinc-800 rounded-lg p-3 bg-zinc-900 cursor-pointer hover:bg-zinc-800"
            onClick={() => onSelect && onSelect(v)}
          >
            <div className="flex justify-between items-center">
              <span
                className={`text-xs px-2 py-1 rounded font-semibold ${
                  v.status === "PIRACY"
                    ? "bg-red-600"
                    : "bg-orange-500"
                }`}
              >
                {v.status}
              </span>
              <span className="text-xs text-zinc-400">
                {v.timestamp ? (new Date(v.timestamp).toLocaleTimeString ? new Date(v.timestamp).toLocaleTimeString() : v.timestamp) : ''}
              </span>
            </div>

            <p className="mt-2 font-medium">{v.asset_name}</p>
            <p className="text-sm text-zinc-400">
              Server: {v.location}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
