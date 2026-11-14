# System Architecture - AstroGuardian-AI

```mermaid
graph TD
    %% Frontend Layer
    UI[React Frontend Dashboard] -->|REST API / JSON| API[FastAPI Backend]

    %% Backend Layer
    API -->|Python Calls| AI[AI Core Engine]

    %% AI Core & Data Layers
    AI -->|Validates against| HRP[NASA HRP Guidelines]
    AI -->|Reads Telemetry| Data[(sample_health_data.csv)]
    AI -->|Runs Unit Tests| Tests[Pytest Suite]

    subgraph System Architecture
        UI
        API
        AI
    end