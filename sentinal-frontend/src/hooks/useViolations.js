import { useEffect, useState } from "react";
import { fetchViolations } from "../services/api";

// ✅ CUSTOM DATA: Changed from RU/CN to US/BR
const CUSTOM_DEMO_DATA = [
  {
    id: 1,
    asset_name: "Avengers: Endgame",
    location_code: "RU",       // Points to USA
    location: "Russia",
    type: "TERRITORY_BREACH",  // Orange Color
    status: "OPEN",
    timestamp: new Date().toISOString(),
  },
  {
    id: 2,
    asset_name: "Avengers: Infinity War",
    location_code: "AU",       // Points to Brazil
    location: "Australia",
    type: "PIRACY",            // Red Color
    status: "OPEN",
    timestamp: new Date().toISOString(),
  },
];

const USE_MOCK = false; // Tries to use Backend first

export default function useViolations() {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        let data;

        if (USE_MOCK) {
          data = CUSTOM_DEMO_DATA;
        } else {
          data = await fetchViolations();
        }

        if (isMounted) {
          setViolations(data);
          setLoading(false);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          // ⛑️ Graceful Fallback: Use our new Custom Data if API fails
          console.log("⚠️ API Failed, switching to Demo Data");
          setViolations(CUSTOM_DEMO_DATA);
          setLoading(false);
          setError("Using demo data");
        }
      }
    }

    load();
    const interval = setInterval(load, 2000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return { violations, loading, error };
}