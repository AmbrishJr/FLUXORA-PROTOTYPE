import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Mapbox access token from environment variables
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || "your-mapbox-token-here";

// Chennai locations
const LOCATIONS = {
  A: { name: "Anna Nagar", coordinates: [80.2185, 13.0878] },
  B: { name: "T Nagar", coordinates: [80.2341, 13.0418] },
  C: { name: "Guindy", coordinates: [80.2209, 13.0067] },
  D: { name: "Velachery", coordinates: [80.2180, 12.9791] }
};

// Test congestion data
const CONGESTION_DATA = [
  { road: "A-B", congestion: 1.24, from: "A", to: "B" },
  { road: "A-C", congestion: 1.73, from: "A", to: "C" },
  { road: "B-D", congestion: 1.94, from: "B", to: "D" },
  { road: "C-D", congestion: 1.50, from: "C", to: "D" },
  { road: "B-C", congestion: 1.59, from: "B", to: "C" },
  { road: "A-D", congestion: 1.37, from: "A", to: "D" }
];

function Heatmap({ roads, isLoading }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [showCongestion, setShowCongestion] = useState(false);

  // Initialize map
  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [80.2185, 13.0878],
      zoom: 12,
      pitch: 50,
      bearing: -20
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    mapRef.current = map;

    map.on("load", () => {
      // Add congestion source
      map.addSource("congestion-source", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] }
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Show/hide congestion
  const handleShowCongestion = () => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    const nextShow = !showCongestion;
    setShowCongestion(nextShow);

    if (nextShow) {
      // Create line features
      const features = CONGESTION_DATA.map(item => {
        const start = LOCATIONS[item.from];
        const end = LOCATIONS[item.to];
        
        if (!start || !end) return null;

        return {
          type: "Feature",
          properties: {
            congestion: item.congestion,
            road: item.road
          },
          geometry: {
            type: "LineString",
            coordinates: [start.coordinates, end.coordinates]
          }
        };
      }).filter(Boolean);

      // Update source
      const source = map.getSource("congestion-source");
      if (source) {
        source.setData({
          type: "FeatureCollection",
          features
        });
      }

      // Add layer
      map.addLayer({
        id: "congestion-layer",
        type: "line",
        source: "congestion-source",
        paint: {
          "line-color": [
            "case",
            ["<", ["get", "congestion"], 1.3], "#22c55e",
            ["<", ["get", "congestion"], 1.6], "#eab308",
            "#f97373"
          ],
          "line-width": 6,
          "line-opacity": 0.8
        }
      });

      // Fit map to show all lines
      if (features.length > 0) {
        const coords = features.flatMap(f => f.geometry.coordinates);
        const bounds = coords.reduce(
          (b, c) => b.extend(c),
          new mapboxgl.LngLatBounds(coords[0], coords[0])
        );
        map.fitBounds(bounds, { padding: 50, duration: 1000 });
      }
    } else {
      // Remove layer
      if (map.getLayer("congestion-layer")) {
        map.removeLayer("congestion-layer");
      }
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-slate-300">
        <p>{isLoading ? "Loading heatmap..." : "Click to show congestion visualization"}</p>
        
        <button
          type="button"
          onClick={handleShowCongestion}
          className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
            showCongestion
              ? "bg-accent text-slate-950 shadow-lg shadow-accent/20 hover:bg-accent/90"
              : "bg-slate-700 text-white hover:bg-slate-600 shadow-lg"
          }`}
        >
          {showCongestion ? "Hide Congestion" : "Show Congestion"}
        </button>
      </div>
      
      <div className="w-full h-[60vh] md:h-[70vh] rounded-3xl overflow-hidden border border-slate-800 shadow-[0_0_40px_rgba(15,23,42,0.9)] bg-slate-900">
        <div ref={mapContainerRef} className="w-full h-full min-h-[400px]" />
      </div>
    </div>
  );
}

export default Heatmap;
