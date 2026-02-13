"""
API routes for Fluxora prototype backend.

Simple FastAPI router that wires together:
- graph_engine for optimal routes
- congestion_model for simulated congestion + heatmap
- database for lightweight in-memory analytics
"""

from __future__ import annotations

from typing import Dict, Any

from fastapi import APIRouter
from pydantic import BaseModel

from graph_engine import get_optimal_route, get_multiple_routes, set_emergency_mode, get_emergency_mode
from congestion_model import update_congestion as calculate_congestion, get_heatmap_data
from database import log_route, log_incentive, get_dashboard_stats
from event_simulation import simulate_event_scenario, get_post_event_insights


router = APIRouter()


class RouteRequest(BaseModel):
    """Request body for /route endpoint."""

    source: str
    destination: str


class EmergencyModeRequest(BaseModel):
    """Request body for emergency mode endpoint."""
    
    enabled: bool


class EventSimulationRequest(BaseModel):
    """Request body for event simulation endpoint."""
    
    event_type: str = "festival"


@router.get("/")
def health_check() -> Dict[str, str]:
    """Basic health check endpoint."""
    return {"status": "ok", "service": "Fluxora API"}


@router.post("/route")
def calculate_route(payload: RouteRequest) -> Dict[str, Any]:
    """
    Calculate an optimal route between two points.

    - First, update congestion to simulate changing traffic.
    - Then, compute the optimal route using graph_engine.
    - Log route stats in the in-memory "database".
    - If congestion is low enough, grant a simple incentive.
    """
    # Update simulated congestion before each calculation
    calculate_congestion()

    # Call graph engine to get best route using current congestion
    result = get_optimal_route(payload.source, payload.destination)

    # If the graph engine could not find a route, just return the error shape
    if "error" in result:
        return result

    congestion_score = float(result.get("congestion_score", 1.0))

    # Log that we calculated a route with this congestion level
    log_route(congestion_score)

    # Simple incentive rule: reward points for low congestion routes
    reward_points = 0
    if congestion_score < 1.3:
        reward_points = 15  # High reward for very low congestion
    elif congestion_score < 1.6:
        reward_points = 10  # Medium reward for moderate congestion
    elif congestion_score < 2.0:
        reward_points = 5   # Small reward for any route
        
    if reward_points > 0:
        log_incentive(result.get("route", []), reward_points)

    response: Dict[str, Any] = dict(result)
    if reward_points > 0:
        response["reward_points"] = reward_points

    return response


@router.post("/routes/multiple")
def calculate_multiple_routes(payload: RouteRequest) -> Dict[str, Any]:
    """
    Calculate multiple route options between two points.

    - Returns up to 3 different route options
    - Each route uses different optimization strategy
    - Provides alternatives for users to choose from
    """
    # Update simulated congestion before each calculation
    calculate_congestion()

    # Get multiple route options
    results = get_multiple_routes(payload.source, payload.destination)

    # Log the best route for analytics
    if results and len(results) > 0 and "error" not in results[0]:
        best_route = results[0]  # First route is typically the fastest
        congestion_score = float(best_route.get("congestion_score", 1.0))
        log_route(congestion_score)

        # Check for incentives on the best route
        reward_points = 0
        if congestion_score < 1.3:
            reward_points = 15  # High reward for very low congestion
        elif congestion_score < 1.6:
            reward_points = 10  # Medium reward for moderate congestion
        elif congestion_score < 2.0:
            reward_points = 5   # Small reward for any route
            
        if reward_points > 0:
            log_incentive(best_route.get("route", []), reward_points)
        
        # Add reward points to the best route
        if reward_points > 0:
            best_route["reward_points"] = reward_points

    return {
        "routes": results,
        "total_options": len(results)
    }


@router.get("/heatmap")
def get_heatmap() -> Dict[str, Any]:
    """
    Return simple congestion heatmap data.

    Frontend can use this to color roads based on congestion factor.
    """
    data = get_heatmap_data()
    return {"heatmap": data}


@router.get("/dashboard")
def get_dashboard() -> Dict[str, Any]:
    """
    Return prototype analytics for the dashboard.

    Includes total routes calculated, incentives given, and average congestion.
    """
    stats = get_dashboard_stats()
    return stats


@router.post("/emergency-mode")
def set_emergency_mode_endpoint(payload: EmergencyModeRequest) -> Dict[str, Any]:
    """
    Enable or disable emergency mode.
    
    When enabled, increases congestion penalties near critical zones
    like hospitals and highways.
    """
    set_emergency_mode(payload.enabled)
    return {
        "emergency_mode": get_emergency_mode(),
        "message": f"Emergency mode {'enabled' if payload.enabled else 'disabled'}"
    }


@router.get("/emergency-mode")
def get_emergency_mode_endpoint() -> Dict[str, Any]:
    """Get current emergency mode status."""
    return {
        "emergency_mode": get_emergency_mode()
    }


@router.post("/event/simulate")
def simulate_event_endpoint(payload: EventSimulationRequest) -> Dict[str, Any]:
    """
    Simulate an event scenario and return time-window recommendations.
    
    Analyzes current traffic patterns and suggests optimal arrival times
    to minimize congestion during events.
    """
    return simulate_event_scenario(payload.event_type)


@router.get("/event/post-insights")
def get_post_event_insights_endpoint() -> Dict[str, Any]:
    """
    Get post-event analysis metrics.
    
    Returns estimated impact metrics including congestion reduction,
    time saved, and environmental benefits after an event.
    """
    return get_post_event_insights()


__all__ = ["router"]

