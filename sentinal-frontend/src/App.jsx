
import React, { useState } from "react";
import useViolations from "./hooks/useViolations";
import LiveThreatLog from "./components/LiveThreatLog";
import MapVisualizer from "./components/MapVisualizer";
import ActionConsole from "./components/ActionConsole";

export default function App() {
  const [selectedViolation, setSelectedViolation] = useState(null);
  const { violations, loading, error } = useViolations();
  return (
    <div className="h-screen bg-black text-white grid grid-cols-12 gap-2 p-4 overflow-hidden">
      {/* Left Panel */}
      <div className="col-span-3 border border-zinc-800 rounded-lg h-full flex flex-col overflow-hidden">
        <LiveThreatLog 
          violations={violations}
          loading={loading}
          error={error}
          onSelect={setSelectedViolation}
        />
      </div>

      {/* Center Panel */}
      <div className="col-span-6 border border-zinc-800 rounded-lg h-full">
        <MapVisualizer violations={violations} />
      </div>

      {/* Right Panel */}
      <div className="col-span-3 border border-zinc-800 rounded-lg h-full">
        <ActionConsole selectedViolation={selectedViolation}/>
      </div>
    </div>
  );
}
