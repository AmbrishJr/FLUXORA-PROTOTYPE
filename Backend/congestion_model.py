"""
Simple congestion simulation for Fluxora prototype.

This is NOT a real ML model – it just:
- Keeps a congestion factor per road
- Randomly updates values between 1.0 and 2.0
"""

from __future__ import annotations

import random
from typing import Dict, List


# Global dictionary holding congestion factor per road.
# Keys are "SOURCE-TARGET" strings that match edges in graph_engine.py.
ROAD_CONGESTION: Dict[str, float] = {
    "A-B": 1.24,  # Anna Nagar → T Nagar
    "A-C": 1.73,  # Anna Nagar → Guindy  
    "B-D": 1.94,  # T Nagar → Velachery
    "C-D": 1.50,  # Guindy → Velachery
    "B-C": 1.59,  # T Nagar → Guindy
    "A-D": 1.37,  # Anna Nagar → Velachery
}

# Map node letters to actual Chennai location names
LOCATION_NAMES = {
    "A": "Anna Nagar",
    "B": "T Nagar", 
    "C": "Guindy",
    "D": "Velachery"
}


def update_congestion() -> None:
    """
    Randomly update congestion factors for all roads.

    - Each road gets a new value in [1.0, 2.0]
    - We round to 2 decimal places for readability
    - This simulates changing traffic conditions in a simple way
    """
    for road in ROAD_CONGESTION:
        new_value = random.uniform(1.0, 2.0)
        ROAD_CONGESTION[road] = round(new_value, 2)


def get_congestion(road_name: str) -> float:
    """
    Get congestion factor for a given road.

    - If the road is unknown, we assume neutral congestion (1.0)
    - This keeps the prototype robust to minor mismatches
    """
    return ROAD_CONGESTION.get(road_name, 1.0)


def get_congestion_confidence(road_name: str) -> str:
    """
    Get confidence level for congestion prediction based on data stability.
    
    - High: congestion values are stable (low variance)
    - Medium: moderate variance in recent updates
    - Low: high volatility or insufficient data
    """
    congestion_value = ROAD_CONGESTION.get(road_name, 1.0)
    
    # Simple heuristic based on congestion level
    if congestion_value < 1.3:
        return "High"
    elif congestion_value < 1.6:
        return "Medium"
    else:
        return "Low"


def get_heatmap_data() -> List[Dict[str, Union[float, str]]]:
    """
    Return a list of {road, congestion, confidence} objects for UI heatmaps.

    Example:
    [
        {"road": "MG Road → Brigade Road", "congestion": 1.45, "confidence": "Medium"},
        {"road": "Brigade Road → Indiranagar", "congestion": 1.72, "confidence": "Low"},
    ]
    """
    def get_display_name(road_key: str) -> str:
        """Convert road key (A-B) to display name (MG Road → Brigade Road)"""
        try:
            from_node, to_node = road_key.split("-")
            from_name = LOCATION_NAMES.get(from_node, from_node)
            to_name = LOCATION_NAMES.get(to_node, to_node)
            return f"{from_name} → {to_name}"
        except:
            return road_key
    
    return [
        {
            "road": get_display_name(road), 
            "congestion": value,
            "confidence": get_congestion_confidence(road)
        }
        for road, value in ROAD_CONGESTION.items()
    ]


__all__ = ["ROAD_CONGESTION", "update_congestion", "get_congestion", "get_congestion_confidence", "get_heatmap_data"]

