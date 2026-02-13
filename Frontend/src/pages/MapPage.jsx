import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { calculateRoute, calculateMultipleRoutes } from "../api/routes";
import Map from "../components/Map";
import RouteForm, { PROTOTYPE_LOCATIONS } from "../components/RouteForm";
import RouteInfo from "../components/RouteInfo";
import MultipleRoutes from "../components/MultipleRoutes";
import PointsIcon from "../components/PointsIcon";
import usePointsStore from "../stores/usePointsStore";


function MapPage() {
  // PROTOTYPE_MODE: restrict routing to fixed smart city locations (A–D)
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [multipleRoutes, setMultipleRoutes] = useState([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [showMultipleRoutes, setShowMultipleRoutes] = useState(false);
  
  const { addPoints } = usePointsStore();

  const { mutate: getSingleRoute, isPending: isSinglePending } = useMutation({
    mutationFn: () => {
      return calculateRoute({ source: source, destination: destination });
    },
    onSuccess: (data) => {
      setMultipleRoutes([data]);
      setSelectedRouteIndex(0);
      setShowMultipleRoutes(false);
      
      // Add points if reward earned
      if (data.reward_points) {
        addPoints(data.reward_points);
      }
    }
  });

  const { mutate: getMultipleRouteOptions, isPending: isMultiplePending } = useMutation({
    mutationFn: () => {
      return calculateMultipleRoutes({ source: source, destination: destination });
    },
    onSuccess: (data) => {
      setMultipleRoutes(data.routes);
      setSelectedRouteIndex(0);
      setShowMultipleRoutes(true);
      
      // Add points if any route has rewards
      const routeWithRewards = data.routes.find(route => route.reward_points);
      if (routeWithRewards) {
        addPoints(routeWithRewards.reward_points);
      }
    },
    onError: (error) => {
      console.error('Mutation error:', error);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Clear previous results
    setMultipleRoutes([]);
    setShowMultipleRoutes(false);
    
    // Get multiple route options for better user experience
    getMultipleRouteOptions();
  };

  const handleSelectRoute = (index) => {
    setSelectedRouteIndex(index);
  };

  // Get current selected route data
  const currentRoute = multipleRoutes[selectedRouteIndex] || {};
  const route = currentRoute.route || [];
  const congestion = currentRoute.congestion_score;
  const rewardPoints = currentRoute.reward_points;
  const totalTime = currentRoute.total_time;
  const error = currentRoute.error;
  const isLoading = isMultiplePending;

  return (
    <section className="mx-auto max-w-6xl px-4 space-y-6">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Smart Route</h2>
          <p className="text-sm text-slate-400">
            Prototype mode: choose from fixed smart city locations to explore optimized routes.
          </p>
        </div>
        <RouteForm
          sourceId={source}
          destinationId={destination}
          onChangeSource={setSource}
          onChangeDestination={setDestination}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>

      {/* Always show the map */}
      <div className="grid lg:grid-cols-[2fr,1fr] gap-6 items-start">
        <div className="space-y-4">
          <Map 
            routeNodes={route} 
            congestionScore={congestion} 
          />
          
          {/* Show multiple routes options when available */}
          {showMultipleRoutes && multipleRoutes.length > 0 && (
            <MultipleRoutes
              routes={multipleRoutes}
              onSelectRoute={handleSelectRoute}
              selectedRouteIndex={selectedRouteIndex}
            />
          )}
        </div>
        
        {/* Always show RouteInfo */}
        <RouteInfo
          route={route}
          totalTime={totalTime}
          congestionScore={congestion}
          rewardPoints={rewardPoints}
          error={error}
        />
      </div>
    </section>
  );
}

// Wrap MapPage with PointsIcon
function MapPageWithPoints() {
  return (
    <>
      <MapPage />
      <PointsIcon />
    </>
  );
}

export default MapPageWithPoints;
