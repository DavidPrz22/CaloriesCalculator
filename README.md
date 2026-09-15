# CaloriesTracker

**Track your nutrition with precision — A bilingual food consumption and caloric analysis platform.**

![Build](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-ISC-blue)
![Version](https://img.shields.io/badge/version-1.0.0-orange)

---

## Table of Contents

- [About The Project](#about-the-project)
- [Tech Stack](#tech-stack)
- [Software Architecture](#software-architecture)
- [Business Logic](#business-logic)
- [Key Features](#key-features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage & Routes](#usage--routes)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## About The Project

CaloriesTracker is a comprehensive nutrition tracking application that empowers users to monitor their daily food consumption and caloric intake. The platform solves the challenge of accurate nutritional tracking by integrating with the USDA FoodData Central API, providing reliable food data while supporting both English and Spanish interfaces.

The application enables users to search for foods by category, calculate precise nutritional values based on consumption amounts, and maintain a detailed history of their dietary intake. With full macronutrient breakdown (calories, protein, carbohydrates, and fats), CaloriesTracker provides the data-driven insights needed for informed dietary decisions.

---

## Tech Stack

### Frontend
- **Framework**: React 19.2 with TypeScript
- **Build Tool**: Vite 8.0
- **Styling**: Tailwind CSS 4.3
- **UI Components**: Shadcn UI, Radix UI, Base UI
- **State Management**: Zustand 5.0
- **Data Fetching**: TanStack React Query 5.101
- **Routing**: React Router 8.0
- **Forms**: React Hook Form 7.80 with Zod validation
- **Charts**: Recharts 3.8
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Internationalization**: Custom i18n implementation

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express 5.2
- **ORM**: Prisma 7.8
- **Database**: PostgreSQL 8.22
- **Authentication**: JWT (jose library) with refresh tokens
- **Security**: bcrypt for password hashing, CORS
- **Validation**: Zod
- **Development**: tsx for hot reloading

### Development Tools
- **Package Manager**: pnpm
- **Type Checking**: TypeScript 6.0
- **Linting**: ESLint with TypeScript support
- **API Testing**: HTTP client files

---

## Software Architecture

### System Architecture Overview

![System Architecture Overview](./driagrams/System%20Architecture%20Overview.svg)

### Frontend Architecture

The frontend follows a **feature-based architecture** with clear separation of concerns:

```
src/
├── api/              # API client configuration
├── components/       # Reusable UI components
├── features/         # Feature modules (Consumption, FoodRecords, Search, UserAuth)
├── hooks/            # Custom React hooks
├── lib/              # Utility libraries (i18n, etc.)
├── pages/            # Route-level page components
├── schemas/          # Zod validation schemas
├── types/            # TypeScript type definitions
├── utils/            # Helper functions
└── ZustandStores/    # Global state management stores
```

**Key Patterns:**
- **Component Composition**: Modular, reusable components with Shadcn UI
- **Feature-Sliced Design**: Each feature encapsulates its own logic, components, and state
- **Protected Routes**: Authentication-gated routes using `RequireAuth` wrapper
- **Optimistic Updates**: TanStack Query for efficient server state management
- **Type Safety**: Full TypeScript coverage with strict mode

### Backend Architecture

The backend implements a **domain-driven modular structure**:

```
backend/
├── Calories/         # Food and nutrition domain
│   ├── controllers.ts
│   ├── routes.ts
│   ├── services/
│   ├── types.ts
│   └── zod.ts
├── Users/            # Authentication domain
│   ├── controller.ts
│   ├── routes.ts
│   ├── services/
│   ├── type.ts
│   └── zod.ts
└── nodeApp/          # Application bootstrap
    ├── app.ts
    ├── routes.ts
    ├── constants.ts
    └── apis/         # External API integrations
```

**Architectural Patterns:**
- **Layered Architecture**: Routes → Controllers → Services → Database
- **Dependency Injection**: Prisma client injected across modules
- **Middleware Chain**: CORS, JSON parsing, JWT validation, request logging
- **Public/Private Route Separation**: Clear distinction between authenticated and public endpoints

### Database Design

The database schema follows a **relational model** optimized for nutritional tracking:

```
┌─────────────┐
│    User     │
├─────────────┤
│ id          │
│ username    │
│ password    │
│ refreshToken│
└──────┬──────┘
       │ 1:N
       │
       ▼
┌──────────────────┐
│  DataConsumo     │
├──────────────────┤
│ id               │
│ calorias_consumidas│
│ proteinas_consumidas│
│ carbohidratos_consumidos│
│ grasas_consumidas│
│ timestamp        │
│ userId (FK)      │
└──────┬───────────┘
       │ 1:N
       │
       ▼
┌──────────────────────┐
│ DataConsumoDetalle   │
├──────────────────────┤
│ id                   │
│ comidaId (FK)        │
│ cantidad_consumida   │
│ calorias_consumida   │
│ proteinas_consumidas │
│ carbohidratos_consumidos│
│ grasas_consumidas    │
│ dataConsumoId (FK)   │
└──────────────────────┘

┌─────────────┐         ┌─────────────┐
│  Categoria  │         │   Medida    │
├─────────────┤         ├─────────────┤
│ id          │         │ id          │
│ nameES      │         │ nameES      │
│ nameEN      │         │ nameEN      │
└──────┬──────┘         │ abbreviation│
       │ 1:N            └──────┬──────┘
       │                       │ 1:N
       └───────────┐           │
                   ▼           ▼
            ┌──────────────────────┐
            │      Comida          │
            ├──────────────────────┤
            │ id                   │
            │ FDCID (unique)       │
            │ nameES               │
            │ nameEN               │
            │ calories             │
            │ protein              │
            │ carbs                │
            │ fat                  │
            │ categoriaId (FK)     │
            │ medidaId (FK)        │
            └──────────────────────┘
```

**Design Principles:**
- **Bilingual Support**: All user-facing fields have ES/EN variants
- **Normalization**: Separate tables for categories and measures to avoid duplication
- **Cascade Deletes**: DataConsumoDetalle records deleted when parent DataConsumo is removed
- **Unique Constraints**: FDCID ensures no duplicate food entries from USDA database

### API Design

**RESTful Architecture:**
- Resource-based endpoints (`/calories`, `/users`)
- HTTP verbs for actions (GET, POST, PUT, DELETE)
- Consistent response formats with proper status codes
- Query parameter validation with Zod schemas

**Authentication Flow:**

![Authentication & Security Flow](./driagrams/Authentication%20%26%20Security%20Flow.svg)

1. User registers/logs in → receives JWT access token (2h expiry) + refresh token (httpOnly cookie)
2. Access token sent in `Authorization: Bearer <token>` header
3. Refresh token automatically rotated on each use
4. Protected routes validate JWT via middleware

---

## Business Logic

### Core Domain Logic

#### 1. Nutritional Calculation Algorithm

The system calculates nutritional values using a **proportional scaling algorithm**:

```typescript
nutrient_value = (nutrient_per_100g × amount_consumed) / 100
```

**Workflow:**
1. User selects foods and specifies consumption amounts
2. System retrieves base nutritional data (per 100g) from database
3. For each food item, calculate scaled nutrients:
   - Calories: `(calories_per_100g × amount) / 100`
   - Protein: `(protein_per_100g × amount) / 100`
   - Carbohydrates: `(carbs_per_100g × amount) / 100`
   - Fats: `(fat_per_100g × amount) / 100`
4. Aggregate totals across all selected items
5. Return detailed breakdown + summary totals

#### 2. Food Search & Filtering

**Search Logic:**
- Minimum query length: 2 characters
- Case-insensitive substring matching
- Language-aware search (searches `nameEN` or `nameES` based on user preference)
- Category filtering (category ID 1 = "All Categories")
- Results include full nutritional profile and measurement unit

**Query Flow:**
```
User Input → Validate Length → Select Language Column → 
Apply Category Filter → Execute Case-Insensitive Search → 
Return Enriched Results
```

#### 3. Consumption Tracking

![User Journey Flow](./driagrams/User%20Journey%20Flow.svg)

**State Transitions:**
```
[Search Foods] → [Select Items] → [Enter Amounts] → 
[Calculate Nutrition] → [Review Results] → [Save Consumption] → 
[Record in Database]
```

**Save Workflow:**
1. Validate input data with Zod schemas
2. Map FDCIDs to internal database IDs
3. Create `DataConsumo` record with aggregated totals
4. Create related `DataConsumoDetalle` records for each item
5. Return complete consumption record with timestamp

#### 4. Authentication State Machine

```
[Unauthenticated] 
    ↓ (login/signup)
[Authenticated] ←→ [Token Expired]
    ↓ (logout)         ↓ (refresh-token)
[Unauthenticated]    [Authenticated]
```

**Token Management:**
- **Access Token**: Short-lived (2h), sent in headers, contains user ID and username
- **Refresh Token**: Long-lived, stored in httpOnly cookie, rotated on each use
- **Token Refresh**: Automatic via `/refresh-token` endpoint
- **Logout**: Clears refresh token from database and cookie

### Key Algorithms

#### Nutrient Aggregation
```typescript
calculateTotalNutrition(items: Nutrition[]): Nutrition {
    return items.reduce(
        (acc, item) => ({
            calories: acc.calories + item.calories,
            protein: acc.protein + item.protein,
            carbs: acc.carbs + item.carbs,
            fat: acc.fat + item.fat,
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
}
```

#### Paginated Data Retrieval
```typescript
skip = (page - 1) × limit
totalPages = ⌈total_records / limit⌉
```

---

## Key Features

### Core Functionality
- **Bilingual Food Search**: Search foods in English or Spanish with category filtering
- **Precise Nutritional Calculation**: Calculate calories, protein, carbs, and fats based on consumption amount
- **Consumption History**: Track and review past food consumption with detailed breakdowns
- **User Authentication**: Secure JWT-based authentication with automatic token refresh
- **Food Database Management**: CRUD operations for food items (admin functionality)
- **Responsive Design**: Mobile-first UI with modern component library
- **Data Visualization**: Charts and graphs for nutritional trends (via Recharts)
- **Real-time Validation**: Client-side form validation with Zod schemas
- **Optimistic UI Updates**: Fast, responsive interface with TanStack Query
- **Cascade Data Integrity**: Automatic cleanup of related records on deletion

### Technical Features
- **Type Safety**: Full TypeScript coverage across frontend and backend
- **API Validation**: Runtime type checking with Zod on all endpoints
- **Request Logging**: Middleware for tracking API performance
- **CORS Protection**: Configured allowed origins for security
- **Password Security**: Bcrypt hashing with salt rounds
- **HttpOnly Cookies**: Secure refresh token storage
- **Modular Architecture**: Feature-based code organization
- **Hot Reloading**: Fast development with tsx and Vite

---

## Getting Started

### Prerequisites

**Required Software:**
- **Node.js**: v18.0 or higher
- **pnpm**: v11.1.1 or higher
- **PostgreSQL**: v14.0 or higher
- **Git**: v2.30 or higher

**Optional:**
- **USDA FDC API Key**: For fetching fresh food data (optional if using pre-populated database)

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/CaloriesTracker.git
cd CaloriesTracker
```

#### 2. Install Dependencies

**Root dependencies:**
```bash
pnpm install
```

**Backend dependencies:**
```bash
cd backend/CaloriesTrackerBackend
pnpm install
```

**Frontend dependencies:**
```bash
cd frontend/CaloriesUI
pnpm install
```

#### 3. Database Setup

**Create PostgreSQL database:**
```bash
createdb calories_tracker
```

**Configure environment variables:**

Create `.env` file in `backend/CaloriesTrackerBackend/`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/calories_tracker"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=3000
NODE_ENV=development
```

**Run database migrations:**
```bash
cd backend/CaloriesTrackerBackend
pnpm prisma migrate dev
```

**Generate Prisma client:**
```bash
pnpm prisma generate
```

#### 4. Environment Configuration

**Frontend environment** (optional, create `.env` in `frontend/CaloriesUI/`):
```env
VITE_API_BASE_URL=http://localhost:3000
```

---

## Usage & Routes

![Application Routing Architecture](./driagrams/Application%20Routing%20Architecture.svg)

### Development Scripts

**Start Backend Server:**
```bash
cd backend/CaloriesTrackerBackend
pnpm dev
```
Server runs on `http://localhost:3000`

**Start Frontend Development Server:**
```bash
cd frontend/CaloriesUI
pnpm dev
```
Application runs on `http://localhost:5173`

**Build for Production:**
```bash
# Backend
cd backend/CaloriesTrackerBackend
pnpm build

# Frontend
cd frontend/CaloriesUI
pnpm build
```

**Lint Code:**
```bash
cd frontend/CaloriesUI
pnpm lint
```

### Frontend Routes

| Route | Component | Description | Auth Required |
|-------|-----------|-------------|---------------|
| `/` | `Home` | Main search page | No |
| `/login` | `AuthPage` | User login | No |
| `/signup` | `AuthPage` | User registration | No |
| `/foods` | `Foods` | Food database browser | No |
| `/results` | `Results` | Nutritional calculation results | No |
| `/consumption` | `Consumption` | Consumption history | **Yes** |
| `*` | `NotFound` | 404 error page | No |

### Backend API Endpoints

#### Public Endpoints

**Food Categories**
```http
GET /api/calories/categories
```
Returns all food categories (bilingual)

**Measurement Units**
```http
GET /api/calories/units
```
Returns all measurement units (bilingual)

**Search Foods**
```http
GET /api/calories/search-food?query=apple&lang=EN&categoriaId=1
```
**Query Parameters:**
- `query`: Search term (min 2 characters)
- `lang`: Language code (`EN` or `ES`)
- `categoriaId`: Category filter (1 = all categories)

**Paginated Food List**
```http
GET /api/calories/comida?page=1&limit=50&search=banana
```
**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 50)
- `search`: Optional search filter

**Calculate Nutrition**
```http
POST /api/calories/calculate
Content-Type: application/json

[
  { "fdcId": 12345, "amount": 150 },
  { "fdcId": 67890, "amount": 200 }
]
```
Returns detailed nutritional breakdown for specified foods and amounts

**User Authentication**
```http
POST /api/users/signup
Content-Type: application/json

{
  "username": "johndoe",
  "password": "securepassword123"
}
```

```http
POST /api/users/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "securepassword123"
}
```

```http
POST /api/users/refresh-token
Cookie: refreshToken=<token>
```

#### Protected Endpoints (Require JWT)

**Get Consumption History**
```http
GET /api/calories/consumptions?page=1&limit=50&startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <access_token>
```

**Get Consumption Detail**
```http
GET /api/calories/consumptions/:id
Authorization: Bearer <access_token>
```

**Save Consumption**
```http
POST /api/calories/save-consumption
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "calorias_consumidas": 450,
  "proteinas_consumidas": 25,
  "carbohidratos_consumidos": 60,
  "grasas_consumidas": 15,
  "detalles": [
    {
      "comidaId": 12345,
      "cantidad_consumida": 150,
      "calorias_consumida": 300,
      "proteinas_consumida": 15,
      "carbohidratos_consumida": 40,
      "grasas_consumida": 10
    }
  ]
}
```

**Delete Consumption**
```http
DELETE /api/calories/consumptions/:id
Authorization: Bearer <access_token>
```

**User Profile**
```http
GET /api/users/profile
Authorization: Bearer <access_token>
```

**Logout**
```http
POST /api/users/logout
Cookie: refreshToken=<token>
```

**Food Management (Admin)**
```http
POST /api/calories/comida
PUT /api/calories/comida/:id
DELETE /api/calories/comida/:id
Authorization: Bearer <access_token>
```

---

## Roadmap

- [ ] Implement daily caloric goals and progress tracking
- [ ] Add nutritional trend charts and analytics dashboard
- [ ] Integrate barcode scanning for quick food lookup
- [ ] Export consumption data to CSV/PDF
- [ ] Implement meal planning and recipe tracking
- [ ] Add social features (sharing meals, friend comparisons)
- [ ] Mobile app development (React Native)
- [ ] Offline mode with local storage sync
- [ ] Integration with fitness trackers (Fitbit, Apple Health)
- [ ] Advanced macronutrient breakdown (micronutrients, vitamins)
- [ ] Multi-language support beyond English/Spanish
- [ ] Role-based access control (admin, user, guest)
- [ ] Email notifications and reminders
- [ ] Custom food entry with manual nutritional input

---

## Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow

1. **Fork the Repository**
   ```bash
   git clone https://github.com/yourusername/CaloriesTracker.git
   cd CaloriesTracker
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
   Branch naming convention: `feature/`, `fix/`, `docs/`, `refactor/`

3. **Make Your Changes**
   - Follow existing code style and conventions
   - Write clear, descriptive commit messages
   - Add tests for new functionality
   - Update documentation as needed

4. **Test Your Changes**
   ```bash
   # Backend
   cd backend/CaloriesTrackerBackend
   pnpm build
   
   # Frontend
   cd frontend/CaloriesUI
   pnpm lint
   pnpm build
   ```

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```
   Commit message format: `type: description` (types: feat, fix, docs, style, refactor, test, chore)

6. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Submit a Pull Request**
   - Open a PR against the `main` branch
   - Provide a clear description of changes
   - Reference any related issues
   - Ensure all checks pass

### Code Style Guidelines

- **TypeScript**: Strict mode enabled, no `any` types
- **Formatting**: Use Prettier (if configured)
- **Linting**: Run `pnpm lint` before committing
- **Component Naming**: PascalCase for components, camelCase for functions
- **File Organization**: Follow feature-based structure
- **Comments**: Write self-documenting code; comment only when necessary

### Reporting Issues

- Use the GitHub issue tracker
- Provide clear steps to reproduce
- Include environment details (OS, Node version, etc.)
- Add screenshots if applicable

---

## License

Distributed under the ISC License. See `LICENSE` file for more information.

---

## Contact

**Project Maintainer**: [Your Name]  
**Email**: [your-email@example.com]  
**GitHub**: [@yourusername](https://github.com/yourusername)

**Project Link**: [https://github.com/yourusername/CaloriesTracker](https://github.com/yourusername/CaloriesTracker)

---

<div align="center">

**Built with passion for healthier living**

[Back to Top](#table-of-contents)

</div>
