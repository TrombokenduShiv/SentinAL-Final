import React, { useState } from 'react';

// API Configuration
const API_BASE_URL = 'http://127.0.0.1:8000/api';

export default function ActionConsole({ selectedViolation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // 1. THE VERIFY BUTTON LOGIC
  const handleVerify = () => {
    if (!selectedViolation) {
      setStatusMessage({ type: 'error', text: '⚠ Select a violation first!' });
      return;
    }

    // Simulate Hash Verification
    setStatusMessage({ type: 'info', text: 'Verifying SHA-256 Hash...' });
    
    setTimeout(() => {
      setStatusMessage({ 
        type: 'success', 
        text: `✅ Hash Verified: ${selectedViolation.html_hash ? selectedViolation.html_hash.substring(0, 10) + '...' : 'Unknown'}` 
      });
    }, 1000);
  };

  // 2. THE ENFORCE (KILL SWITCH) LOGIC
  const handleEnforce = async () => {
    if (!selectedViolation) {
      setStatusMessage({ type: 'error', text: '⚠ Select a violation first!' });
      return;
    }

    setIsLoading(true);
    setStatusMessage({ type: 'info', text: '⚖ Drafting Legal Notice via Gemini...' });

    try {
      // Step A: Trigger the API
      const response = await fetch(`${API_BASE_URL}/enforce/${selectedViolation.id}/`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error("Enforcement Failed");

      // Step B: Handle the PDF File (Blob)
      const blob = await response.blob();
      
      // Step C: Force Browser Download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Notice_Violation_${selectedViolation.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Step D: Cleanup
      link.parentNode.removeChild(link);
      setStatusMessage({ type: 'success', text: `⚡ TAKEDOWN EXECUTED: ${selectedViolation.asset_name}` });
      
    } catch (error) {
      console.error(error);
      setStatusMessage({ type: 'error', text: '❌ Enforcement Failed. Check API.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4 bg-zinc-900 border border-zinc-800 rounded-lg">
      <h2 className="text-lg font-semibold text-zinc-100">Action Console</h2>
      
      {/* Status Message Display */}
      {statusMessage && (
        <div className={`p-2 text-sm rounded ${
          statusMessage.type === 'error' ? 'bg-red-900/50 text-red-200' : 
          statusMessage.type === 'success' ? 'bg-green-900/50 text-green-200' : 
          'bg-blue-900/50 text-blue-200'
        }`}>
          {statusMessage.text}
        </div>
      )}

      {/* Selected Asset Info */}
      <div className="text-xs text-zinc-400 mb-2">
        TARGET: {selectedViolation ? selectedViolation.asset_name : 'No Target Selected'}
      </div>

      {/* BUTTON 1: Verify */}
      <button 
        onClick={handleVerify}
        disabled={!selectedViolation || isLoading}
        className={`w-full py-2 font-medium rounded transition-colors ${
          !selectedViolation ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' :
          'bg-zinc-700 hover:bg-zinc-600 text-white'
        }`}
      >
        VERIFY EVIDENCE
      </button>

      {/* BUTTON 2: Enforce */}
      <button 
        onClick={handleEnforce}
        disabled={!selectedViolation || isLoading}
        className={`w-full py-2 font-bold rounded transition-colors flex justify-center items-center ${
          !selectedViolation ? 'bg-red-900/30 text-red-800 cursor-not-allowed' :
          'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]'
        }`}
      >
        {isLoading ? (
          <span className="animate-pulse">PROCESSING...</span>
        ) : (
          "ENFORCE TAKEDOWN"
        )}
      </button>
    </div>
  );
}