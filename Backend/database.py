"""
Prototype in-memory "database" for Fluxora.

This is NOT a real database – just simple process-local
Python dictionaries for storing lightweight analytics.
Data is lost when the server restarts, which is fine for a hackathon.
"""

from __future__ import annotations

from typing import Any, Dict, List
from congestion_model import ROAD_CONGESTION


# Global stats dictionary used as our fake database.
APP_STATS: Dict[str, Any] = {
    "total_routes_calculated": 0,
    "total_incentives_given": 0,
    "total_congestion_accumulated": 0.0,
    "route_requests": [],  # list of {route, reward_points}
}


def log_route(congestion_score: float) -> None:
    """
    Record that a route was calculated.

    - Increment counter
    - Accumulate congestion for later averaging
    """
    APP_STATS["total_routes_calculated"] += 1
    APP_STATS["total_congestion_accumulated"] += float(congestion_score)


def log_incentive(route: List[str], reward_points: int) -> None:
    """
    Record that an incentive was given for a route.

    - Increment incentive counter
    - Store a simple record of the route and reward
    """
    APP_STATS["total_incentives_given"] += 1
    APP_STATS["route_requests"].append(
        {"route": list(route), "reward_points": int(reward_points)}
    )


def get_city_flow_stress_index() -> float:
    """
    Compute City Flow Stress Index as a scalar between 0 and 1.
    
    Based on:
    - Average congestion across all roads
    - Route density (total routes calculated)
    - Congestion variance (predictability)
    
    Higher values indicate more stressful traffic conditions.
    """
    # Calculate average congestion
    if ROAD_CONGESTION:
        avg_congestion = sum(ROAD_CONGESTION.values()) / len(ROAD_CONGESTION)
    else:
        avg_congestion = 1.0
    
    # Normalize congestion to 0-1 range (assuming max congestion of 2.0)
    congestion_factor = min(avg_congestion / 2.0, 1.0)
    
    # Add route density factor (more routes = more stress)
    route_density = min(APP_STATS["total_routes_calculated"] / 100.0, 0.3)
    
    # Calculate stress index
    stress_index = min(congestion_factor + route_density, 1.0)
    
    return round(stress_index, 2)


def get_dashboard_stats() -> Dict[str, float]:
    """
    Return lightweight analytics for dashboard display.

    avg_congestion = total_congestion_accumulated / total_routes_calculated
    If no routes have been calculated yet, avg_congestion is 0.
    """
    total_routes = APP_STATS["total_routes_calculated"]
    total_congestion = APP_STATS["total_congestion_accumulated"]

    if total_routes > 0:
        avg_congestion = total_congestion / total_routes
    else:
        avg_congestion = 0.0

    return {
        "total_routes_calculated": total_routes,
        "total_incentives_given": APP_STATS["total_incentives_given"],
        "avg_congestion": round(avg_congestion, 2),
        "city_flow_stress_index": get_city_flow_stress_index(),
    }


__all__ = ["APP_STATS", "log_route", "log_incentive", "get_city_flow_stress_index", "get_dashboard_stats"]

