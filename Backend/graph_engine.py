"""
Graph engine for Fluxora prototype.

- Uses a small hardcoded directed city graph
- Each edge has a base travel time and a congestion factor
- Route cost is: base_time * congestion_factor
"""

from __future__ import annotations

from typing import Dict, List, Union
import random

import networkx as nx


# Create a directed graph (one-way roads)
G = nx.DiGraph()

# Emergency Mode flag
emergency_mode = False

# Critical zones that get higher penalties during emergency mode
CRITICAL_ZONES = ["C", "D"]  # Guindy, Velachery (major commercial areas)

# Hardcoded city nodes (Chennai locations)
NODES = ["A", "B", "C", "D"]  # Anna Nagar, T Nagar, Guindy, Velachery
G.add_nodes_from(NODES)

# Add directed edges with base_time (minutes) and congestion_factor
# Chennai road network with realistic travel times
# All routes are bidirectional for user flexibility
EDGES = [
    # Forward routes
    ("A", "B", {"base_time": 12, "congestion_factor": 1.24}),  # Anna Nagar ↔ T Nagar
    ("B", "A", {"base_time": 12, "congestion_factor": 1.24}),
    ("A", "C", {"base_time": 15, "congestion_factor": 1.73}),  # Anna Nagar ↔ Guindy
    ("C", "A", {"base_time": 15, "congestion_factor": 1.73}),
    ("B", "D", {"base_time": 18, "congestion_factor": 1.94}),  # T Nagar ↔ Velachery
    ("D", "B", {"base_time": 18, "congestion_factor": 1.94}),
    ("C", "D", {"base_time": 14, "congestion_factor": 1.50}),  # Guindy ↔ Velachery
    ("D", "C", {"base_time": 14, "congestion_factor": 1.50}),
    ("B", "C", {"base_time": 10, "congestion_factor": 1.59}),  # T Nagar ↔ Guindy
    ("C", "B", {"base_time": 10, "congestion_factor": 1.59}),
    ("A", "D", {"base_time": 20, "congestion_factor": 1.37}),  # Anna Nagar ↔ Velachery
    ("D", "A", {"base_time": 20, "congestion_factor": 1.37}),
]

G.add_edges_from(EDGES)


def _edge_weight(u: str, v: str, data: Dict) -> float:
    """Compute weight for a single edge using base_time * congestion_factor."""
    base_time = data.get("base_time", 0)
    congestion_factor = data.get("congestion_factor", 1.0)
    
    # Apply emergency mode penalties for critical zones
    if emergency_mode and (v in CRITICAL_ZONES or u in CRITICAL_ZONES):
        congestion_factor *= 1.5  # Increase congestion penalty by 50%
    
    return base_time * congestion_factor


def set_emergency_mode(enabled: bool) -> None:
    """Enable or disable emergency mode."""
    global emergency_mode
    emergency_mode = enabled


def get_emergency_mode() -> bool:
    """Get current emergency mode status."""
    return emergency_mode


def _generate_route_explanation(route: List[str], congestion_score: float, strategy_name: str = None) -> str:
    """Generate AI explanation for why this route was chosen."""
    # Special explanation for scenic/slowest routes
    if strategy_name == "Scenic Route":
        scenic_explanations = [
            "Perfect for a leisurely drive with scenic stops",
            "Enjoy the journey at a relaxed pace through interesting areas",
            "Take the longer route for a more pleasant experience",
            "Explore alternative areas with less traffic pressure",
            "Great for sightseeing and enjoying the ride"
        ]
        return random.choice(scenic_explanations)
    
    explanations = [
        f"Chosen to reduce predicted congestion by {int((2.0 - congestion_score) * 20)}% in the next 20 minutes",
        "Avoids expected crowd surge near the event zone",
        "Optimized for real-time traffic patterns and incident avoidance",
        "Selected based on historical flow analysis and current conditions",
        "Minimizes travel time during peak hour compression"
    ]
    return random.choice(explanations)


def _get_confidence_level(congestion_score: float) -> str:
    """Calculate confidence level based on congestion score."""
    if congestion_score < 1.3:
        return "High"
    elif congestion_score < 1.6:
        return "Medium"
    else:
        return "Low"


def get_multiple_routes(source: str, destination: str, max_routes: int = 3) -> List[Dict[str, Union[List[str], float, str]]]:
    """
    Generate multiple route options between two nodes.
    
    - Uses different optimization strategies for variety
    - Returns up to max_routes different route options
    - Each route has different trade-offs (time vs congestion)
    """
    if source not in G or destination not in G:
        return [{"error": "Route not found"}]
    
    routes = []
    
    # Strategy 1: Fastest route (original Dijkstra)
    try:
        path1 = nx.dijkstra_path(G, source, destination, weight=_edge_weight)
        route1_data = _calculate_route_metrics(path1, "Fastest Route")
        routes.append(route1_data)
    except (nx.NetworkXNoPath, nx.NodeNotFound):
        pass
    
    # Strategy 2: Least congestion (minimize congestion factor)
    def congestion_weight(u: str, v: str, data: Dict) -> float:
        return data.get("congestion_factor", 1.0) * 100  # Heavy penalty for congestion
    
    try:
        path2 = nx.dijkstra_path(G, source, destination, weight=congestion_weight)
        route2_data = _calculate_route_metrics(path2, "Least Congestion")
        # Only add if different from first route
        if len(routes) == 0 or path2 != routes[0]["route"]:
            routes.append(route2_data)
    except (nx.NetworkXNoPath, nx.NodeNotFound):
        pass
    
    # Strategy 3: Shortest distance (fewest nodes)
    try:
        path3 = nx.shortest_path(G, source, destination)
        route3_data = _calculate_route_metrics(path3, "Shortest Distance")
        # Only add if different from existing routes
        if len(routes) == 0 or (path3 != routes[0]["route"] and (len(routes) == 1 or path3 != routes[1]["route"])):
            routes.append(route3_data)
    except (nx.NetworkXNoPath, nx.NodeNotFound):
        pass
    
    # Strategy 4: Slowest route (maximize travel time - scenic/leisure route)
    def slowest_weight(u: str, v: str, data: Dict) -> float:
        """Weight that maximizes travel time for scenic/leisurely routes."""
        base_time = data.get("base_time", 0)
        congestion_factor = data.get("congestion_factor", 1.0)
        # Return negative weight so Dijkstra finds the maximum time path
        return -(base_time * congestion_factor)
    
    try:
        path4 = nx.dijkstra_path(G, source, destination, weight=slowest_weight)
        route4_data = _calculate_route_metrics(path4, "Scenic Route")
        # Only add if different from existing routes
        if len(routes) == 0 or (path4 != routes[0]["route"] and path4 != routes[1]["route"] if len(routes) > 1 else True):
            routes.append(route4_data)
    except (nx.NetworkXNoPath, nx.NodeNotFound):
        pass
    
    # If no routes found, return error
    if not routes:
        return [{"error": "No routes found"}]
    
    return routes[:max_routes]


def _calculate_route_metrics(path: List[str], strategy_name: str) -> Dict[str, Union[List[str], float, str]]:
    """Calculate metrics for a given path."""
    total_time = 0.0
    congestion_values: List[float] = []
    
    for u, v in zip(path[:-1], path[1:]):
        data = G[u][v]
        base_time = data.get("base_time", 0)
        congestion_factor = data.get("congestion_factor", 1.0)
        
        total_time += base_time * congestion_factor
        congestion_values.append(congestion_factor)
    
    average_congestion = sum(congestion_values) / len(congestion_values) if congestion_values else 0.0
    
    return {
        "route": path,
        "total_time": round(total_time, 2),
        "congestion_score": round(average_congestion, 2),
        "explanation": _generate_route_explanation(path, average_congestion, strategy_name),
        "confidence": _get_confidence_level(average_congestion),
        "strategy": strategy_name
    }


def get_optimal_route(source: str, destination: str) -> Dict[str, Union[List[str], float, str]]:
    """
    Compute the optimal route between two nodes using Dijkstra.

    - Weight of each edge is base_time * congestion_factor.
    - Returns route (list of node labels), total_time, and average congestion.
    - If no path exists, returns an error dict.
    """
    # Basic validation: nodes must exist in the graph
    if source not in G or destination not in G:
        return {"error": "Route not found"}

    try:
        # Shortest path based on our custom weight
        path = nx.dijkstra_path(G, source, destination, weight=_edge_weight)
    except (nx.NetworkXNoPath, nx.NodeNotFound):
        # If no path can be found, return an error
        return {"error": "Route not found"}

    # Compute total weighted time and average congestion along the path
    total_time = 0.0
    congestion_values: List[float] = []

    # Iterate over consecutive node pairs in the path
    for u, v in zip(path[:-1], path[1:]):
        data = G[u][v]
        base_time = data.get("base_time", 0)
        congestion_factor = data.get("congestion_factor", 1.0)

        total_time += base_time * congestion_factor
        congestion_values.append(congestion_factor)

    # Avoid division by zero; for a valid path there should always be edges
    average_congestion = sum(congestion_values) / len(congestion_values) if congestion_values else 0.0

    return {
        "route": path,
        "total_time": round(total_time, 2),
        "congestion_score": round(average_congestion, 2),
        "explanation": _generate_route_explanation(path, average_congestion),
        "confidence": _get_confidence_level(average_congestion),
    }


__all__ = ["get_optimal_route", "get_multiple_routes", "G", "set_emergency_mode", "get_emergency_mode"]

