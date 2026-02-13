"""
Entry point for the Fluxora prototype backend.

Runs a simple FastAPI app that exposes:
- Route calculation
- Congestion heatmap
- Lightweight dashboard analytics
"""

from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import router as api_router


# Create FastAPI app with a simple title for docs/UI
app = FastAPI(title="Fluxora API")


# Allow local frontend apps and production apps to talk to this API
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://*.vercel.app",  # Allow all Vercel deployments
    "https://vercel.app",    # Allow root vercel domain
    "https://fluxora-prototype.onrender.com",  # Production Render frontend
    "https://fluxora-prototype-u6vu4l3rc-ambrishsaids2023-5783s-projects.vercel.app",  # Vercel deployment
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include all API routes defined in routes.py
app.include_router(api_router)


# Note:
# Run the server from the backend directory with:
#   uvicorn main:app --reload

