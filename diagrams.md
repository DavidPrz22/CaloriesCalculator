Based on the codebase analysis, here are the diagrams I'd recommend for your README:
High Priority

1. Authentication & Security Flow (Sequence Diagram) x
- Shows JWT access/refresh token lifecycle
- Frontend interceptors → Backend validation → Token refresh cycle
- HttpOnly cookie handling for refresh tokens
- This is complex and well-implemented - worth visualizing

2. Application Routing Architecture (Flowchart) x
- Frontend routes with auth guards (RequireAuth wrapper)
- Backend public vs private route separation
- Visual distinction between protected and public endpoints
- Maps to your existing route tables nicely

3. User Journey Flow (Flowchart)
- Search foods → Select items → Calculate nutrition → Save consumption
- Shows the core business logic flow
- Connects frontend features (Search, Results, Consumption)

4. System Architecture Overview (High-level)
- Frontend (React + Zustand + TanStack Query) ↔ Backend (Express + Prisma) ↔ PostgreSQL
- External APIs (USDA FoodData, DeepL)
- Shows the full stack at a glance



Write a mermaid C4 flowchart in  for:

4. System Architecture Overview
- Frontend (React + Zustand + TanStack Query) ↔ Backend (Express + Prisma) ↔ PostgreSQL
- External APIs (USDA FoodData, DeepL)
- Shows the full stack at a glance




### Rules for High-Level Architecture Flowcharts:

1. DIRECTION: Always use `flowchart LR` (Left-to-Right). Position the user/client on the far left, intermediate services in the middle, and databases/external dependencies on the far right.
2. SYSTEM BOUNDARIES: Always group internal components inside a named `subgraph` block representing your core infrastructure boundary. Keep users and third-party APIs outside of this subgraph.
3. TECHNOLOGY EXPLICITNESS: Every node name MUST include its explicit technology stack or framework underneath the title using a newline character (\n). (e.g., "⚙️ Backend API\n(Node.js / Express)").
4. SHAPE CONSISTENCY: Enforce a strict visual system language using these exact node shapes:
   - Square Rectangles [ ] : For internal compute services, APIs, and frontends.
   - Cylinders [( )] : Strictly and exclusively reserved for databases, caches, and data stores.
   - Rounded Rectangles ( ) : For external third-party integrations and APIs (e.g., Stripe, Auth0).
5. PROTOCOL LABELS: Every single connector arrow MUST be explicitly labeled with the data communication protocol or format used. Never leave an arrow blank. (e.g., -->| "HTTPS / JSON" | or -->| "gRPC" |).
