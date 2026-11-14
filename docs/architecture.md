# System Architecture - AstroGuardian-AI

AstroGuardian-AI is engineered with a modular, decoupled architecture to ensure real-time responsiveness, safety compliance, and seamless collaboration across AI, backend, and frontend domains.

## System Workflow Diagram

```mermaid
graph TD
    UI[React Frontend Dashboard] --> API[FastAPI Backend]
    API --> AI[AI Core Engine]
    
    AI --> HRP[NASA HRP Guidelines]
    AI --> Data[Telemetry CSV Data]
    AI --> Tests[Pytest Suite]

    subgraph System Architecture
        UI
        API
        AI
    end