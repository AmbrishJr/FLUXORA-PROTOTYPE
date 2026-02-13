"""
Event simulation module for Fluxora prototype.

This module provides functionality to simulate traffic events
and generate insights for event planning and management.
"""

from __future__ import annotations

import random
from typing import Dict, Any, List
from datetime import datetime, timedelta


def simulate_event_scenario(event_type: str = "festival") -> Dict[str, Any]:
    """
    Simulate an event scenario and return time-window recommendations.
    
    Args:
        event_type: Type of event (festival, concert, sports, conference)
        
    Returns:
        Dictionary containing event simulation results and recommendations
    """
    # Event-specific parameters
    event_configs = {
        "festival": {
            "duration_hours": 8,
            "peak_attendance": 5000,
            "traffic_multiplier": 2.5,
            "setup_time_hours": 3,
            "cleanup_time_hours": 2
        },
        "concert": {
            "duration_hours": 4,
            "peak_attendance": 3000,
            "traffic_multiplier": 2.0,
            "setup_time_hours": 2,
            "cleanup_time_hours": 1
        },
        "sports": {
            "duration_hours": 3,
            "peak_attendance": 2000,
            "traffic_multiplier": 1.8,
            "setup_time_hours": 1,
            "cleanup_time_hours": 1
        },
        "conference": {
            "duration_hours": 6,
            "peak_attendance": 1000,
            "traffic_multiplier": 1.5,
            "setup_time_hours": 1,
            "cleanup_time_hours": 0.5
        }
    }
    
    config = event_configs.get(event_type, event_configs["festival"])
    
    # Generate optimal arrival windows
    base_time = datetime.now()
    setup_start = base_time + timedelta(hours=config["setup_time_hours"])
    
    arrival_windows = []
    current_time = setup_start
    
    # Create 3 arrival windows with different congestion levels
    for i in range(3):
        window_start = current_time + timedelta(hours=i * 2)
        window_end = window_start + timedelta(hours=1.5)
        
        # Calculate congestion for this window
        base_congestion = random.uniform(1.0, 1.3)
        if i == 0:  # Early window - less congestion
            congestion = base_congestion * 0.8
        elif i == 1:  # Middle window - moderate congestion
            congestion = base_congestion
        else:  # Late window - higher congestion
            congestion = base_congestion * 1.2
            
        arrival_windows.append({
            "window_start": window_start.strftime("%H:%M"),
            "window_end": window_end.strftime("%H:%M"),
            "congestion_level": round(congestion, 2),
            "recommended": i == 1,  # Middle window usually recommended
            "estimated_attendees": int(config["peak_attendance"] * (0.3 + i * 0.2))
        })
    
    return {
        "event_type": event_type,
        "event_duration": config["duration_hours"],
        "peak_attendance": config["peak_attendance"],
        "traffic_impact": config["traffic_multiplier"],
        "arrival_windows": arrival_windows,
        "setup_required": True,
        "setup_time": f"{config['setup_time_hours']} hours before event",
        "cleanup_time": f"{config['cleanup_time_hours']} hours after event",
        "recommendations": [
            f"Arrive during {arrival_windows[1]['window_start']}-{arrival_windows[1]['window_end']} for optimal traffic conditions",
            f"Expect {config['traffic_multiplier']}x normal traffic during peak hours",
            "Consider using alternative routes to avoid congestion hotspots",
            "Allow extra time for parking and venue access"
        ]
    }


def get_post_event_insights() -> Dict[str, Any]:
    """
    Generate post-event analysis metrics.
    
    Returns:
        Dictionary containing estimated impact metrics after an event
    """
    # Simulate post-event metrics with some randomness
    base_congestion_reduction = random.uniform(15, 25)  # percentage
    base_time_saved = random.uniform(8, 15)  # minutes per person
    base_co2_reduction = random.uniform(120, 200)  # kg
    
    # Calculate total impact based on assumed event size
    assumed_attendees = 3000
    total_time_saved = base_time_saved * assumed_attendees / 60  # hours
    total_co2_reduction = base_co2_reduction
    
    return {
        "congestion_reduction": f"{base_congestion_reduction:.1f}%",
        "average_time_saved": f"{base_time_saved:.1f} minutes per person",
        "total_time_saved": f"{total_time_saved:.1f} hours across all attendees",
        "co2_reduction": f"{total_co2_reduction:.1f} kg",
        "affected_routes": 12,
        "peak_congestion_avoided": "4.2x normal levels",
        "user_satisfaction": 87,  # percentage
        "system_efficiency": 92,  # percentage
        "insights": [
            "Smart routing reduced peak congestion by avoiding bottlenecks",
            "Early arrival recommendations helped distribute traffic flow",
            "Alternative route suggestions minimized travel delays",
            "Real-time adjustments improved overall system performance"
        ],
        "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }


__all__ = ["simulate_event_scenario", "get_post_event_insights"]
