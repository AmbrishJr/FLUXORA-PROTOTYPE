## Fluxora Backend (Prototype)

This is the prototype backend for **Fluxora**, built with **FastAPI** and simple in-memory storage.  
It focuses on smart routing, simulated congestion, and lightweight dashboard analytics.

### Tech Stack
- **Python**
- **FastAPI**
- **NetworkX** (graph engine)
- **In-memory dictionaries** instead of a real database

### Project Structure
- `main.py` – FastAPI app entrypoint, CORS setup, includes routes.
- `routes.py` – API endpoints (`/`, `/route`, `/heatmap`, `/dashboard`).
- `graph_engine.py` – Directed city graph + `get_optimal_route`.
- `congestion_model.py` – Random congestion simulation + heatmap data.
- `database.py` – In-memory analytics store and helpers.

### Installation
From the `Backend` folder:

```bash
pip install fastapi uvicorn "networkx>=3.0"
```

### Running the API
From the `Backend` folder:

```bash
uvicorn main:app --reload
```

The API will be available at `http://127.0.0.1:8000` and docs at `http://127.0.0.1:8000/docs`.

### Notes
- Prototype only – data is stored in memory and reset on restart.
- No authentication, no external APIs, and no real database.

