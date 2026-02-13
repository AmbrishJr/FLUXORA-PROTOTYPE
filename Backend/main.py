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


# Allow local frontend apps to talk to this API during development
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
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

