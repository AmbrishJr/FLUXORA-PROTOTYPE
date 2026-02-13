import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Mapbox access token from environment variables
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || "your-mapbox-token-here";

// Prototype locations with real coordinates
const LOCATIONS = {
  A: { name: "Anna Nagar", coordinates: [80.2185, 13.0878] },
  B: { name: "T Nagar", coordinates: [80.2341, 13.0418] },
  C: { name: "Guindy", coordinates: [80.2209, 13.0067] },
  D: { name: "Velachery", coordinates: [80.2180, 12.9791] }
};

/**
 * Map component - Real road routing with Mapbox Directions API
 */
function Map({ routeNodes, congestionScore }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [persistentRoute, setPersistentRoute] = useState(null);
  const [mapInitialized, setMapInitialized] = useState(false);

  // Initialize map ONCE
  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    try {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [80.2185, 13.0878], // Anna Nagar center
        zoom: 12,
        pitch: 50,
        bearing: -20
      });

      map.addControl(new mapboxgl.NavigationControl(), "top-right");
      mapRef.current = map;

      map.on("load", () => {
        // Add route source (empty initially)
        map.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: []
            }
          }
        });

        // Add route layer (realistic road style)
        map.addLayer({
          id: "route-main",
          type: "line",
          source: "route",
          layout: {
            "line-cap": "round",
            "line-join": "round"
          },
          paint: {
            "line-color": "#3b82f6",
            "line-width": 6,
            "line-opacity": 0.9
          }
        });

        setMapInitialized(true);
      });

      map.on("error", (e) => {
        console.error('Map error:', e);
      });

      return () => {
        try {
          map.remove();
        } catch (error) {
          console.warn('Error removing map:', error);
        }
        mapRef.current = null;
      };
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, []);

  // Fetch real route from Mapbox Directions API when routeNodes changes
  useEffect(() => {
    if (!mapInitialized || !mapRef.current || !routeNodes || routeNodes.length < 2) {
      return;
    }

    const fetchRealRoute = async () => {
      try {
        const startLocation = LOCATIONS[routeNodes[0]];
        const endLocation = LOCATIONS[routeNodes[routeNodes.length - 1]];
        
        if (!startLocation || !endLocation) {
          console.error('Invalid location nodes');
          return;
        }

        const [lng1, lat1] = startLocation.coordinates;
        const [lng2, lat2] = endLocation.coordinates;

        // Build Mapbox Directions API URL
        const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${lng1},${lat1};${lng2},${lat2}?geometries=geojson&overview=full&access_token=${mapboxgl.accessToken}`;

        const response = await fetch(directionsUrl);
        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const coordinates = route.geometry.coordinates;
          
          // Store persistent route
          setPersistentRoute(coordinates);

          // Update map with real road geometry
          const routeSource = mapRef.current.getSource("route");
          if (routeSource) {
            routeSource.setData({
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: coordinates
              }
            });
          }

          // Clear old markers and add new ones
          markersRef.current.forEach(marker => marker.remove());
          markersRef.current = [];

          // Add start marker
          const startEl = document.createElement("div");
          startEl.className = "h-4 w-4 rounded-full bg-emerald-400 border-2 border-white shadow-lg";
          startEl.title = startLocation.name;
          const startMarker = new mapboxgl.Marker(startEl)
            .setLngLat([lng1, lat1])
            .addTo(mapRef.current);

          // Add end marker
          const endEl = document.createElement("div");
          endEl.className = "h-4 w-4 rounded-full bg-rose-400 border-2 border-white shadow-lg";
          endEl.title = endLocation.name;
          const endMarker = new mapboxgl.Marker(endEl)
            .setLngLat([lng2, lat2])
            .addTo(mapRef.current);

          markersRef.current = [startMarker, endMarker];

          // Fit map to route bounds
          const bounds = coordinates.reduce(
            (b, c) => b.extend(c),
            new mapboxgl.LngLatBounds(coordinates[0], coordinates[0])
          );
          mapRef.current.fitBounds(bounds, { padding: 80, duration: 1000 });
        }
      } catch (error) {
        console.error('Error fetching route:', error);
      }
    };

    fetchRealRoute();
  }, [routeNodes, mapInitialized]);

  // Keep route persistent - NO AUTO-REMOVAL
  useEffect(() => {
    if (!mapInitialized || !mapRef.current || !persistentRoute) return;

    const map = mapRef.current;
    const routeSource = map.getSource("route");
    
    if (routeSource && persistentRoute.length > 0) {
      // Ensure route stays visible
      routeSource.setData({
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: persistentRoute
        }
      });
    }
  }, [persistentRoute, mapInitialized]);

  return (
    <div className="w-full h-[60vh] md:h-[70vh] rounded-3xl overflow-hidden border border-slate-800 shadow-[0_0_40px_rgba(15,23,42,0.9)] bg-slate-900">
      <div ref={mapContainerRef} className="w-full h-full min-h-[400px]" />
    </div>
  );
}

export default Map;
