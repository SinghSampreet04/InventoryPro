# 📦 InventoryPro

> A full-stack inventory management and analytics platform with secure authentication, product operations, stock alerts, category insights, and a responsive SaaS-style workspace.

---

## 📖 Overview

InventoryPro gives small operations teams a focused workspace for maintaining a product catalog and understanding current stock health. Users can create an account, manage inventory, identify replenishment risks, search and filter the catalog, and view live analytics calculated from persisted PostgreSQL data.

The project pairs a responsive React frontend with a secured Spring Boot REST API. JWT authentication protects inventory data, BCrypt hashes credentials, BigDecimal preserves monetary precision, and integration tests exercise the main authenticated workflow.

---

## ✨ Features

### 📋 Inventory Operations

- Create, View, Update, and Delete Products
- Unique SKU Enforcement
- Product Search by Name or SKU
- Category Filtering
- Stock Status Badges
- Low-Stock and Out-of-Stock Detection
- Server-Side Input Validation
- Structured API Error Responses
- Inventory Timestamps and Recent-First Sorting

### 📊 Analytics

- Total Inventory Value
- Total Products and On-Hand Units
- Average Product Price
- Healthy, Low-Stock, and Out-of-Stock Counts
- Inventory Value by Category
- Category Product and Unit Totals
- Replenishment Queue
- Responsive Bar and Donut Charts

### 🔐 Security and Accounts

- User Registration and Login
- JWT Bearer Authentication
- BCrypt Password Hashing
- Protected Product and Analytics Endpoints
- Stateless Spring Security Configuration
- Automatic Session Expiration Handling
- Persistent Display and Accessibility Preferences

### 🎨 User Experience

- Responsive Desktop and Mobile Navigation
- Command Palette with Keyboard Navigation
- Loading, Empty, Error, and Success States
- Accessible Forms and Focus Indicators
- Reduced-Motion Preference
- Lazy-Loaded Application Pages

---

## 🛠 Tech Stack

### Frontend

- React 19
- React Router
- Vite
- Axios
- Recharts
- Vitest
- React Testing Library

### Backend

- Java 17
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- JWT
- Maven

### Data and Testing

- PostgreSQL
- H2 for Integration Tests
- JUnit
- MockMvc

---

## 🏗 Architecture

```text
                     React / Vite Client
                              │
                    JWT-authenticated REST
                              │
                              ▼
                     Spring Boot API
                    Spring Security + JPA
                              │
               ┌──────────────┴──────────────┐
               │                             │
               ▼                             ▼
       PostgreSQL Database           Analytics Services
      Users and Inventory        Stock and Category Metrics
```

The API is the source of truth for authentication, products, stock status, and analytics. The React client attaches the active JWT to protected requests and refreshes the relevant views after inventory changes.

---

## 📂 Project Structure

```text
InventoryPro
│
├── backend
│   ├── src/main/java/com/sam/inventory/backend
│   │   ├── controller
│   │   ├── dto
│   │   ├── entity
│   │   ├── exception
│   │   ├── repository
│   │   ├── security
│   │   └── service
│   ├── src/test
│   └── pom.xml
│
├── frontend
│   ├── src
│   │   ├── api
│   │   ├── components
│   │   ├── pages
│   │   └── utils
│   ├── package.json
│   └── vite.config.js
│
├── docs/screenshots
├── compose.yaml
└── README.md
```

---

## ⚙️ Local Installation

### Prerequisites

- Java 17
- Node.js 20 or newer
- Docker Desktop or PostgreSQL 14+
- Git

### Clone the Repository

```bash
git clone https://github.com/SinghSampreet04/InventoryPro.git
cd InventoryPro
```

### Start PostgreSQL

With Docker:

```bash
docker compose up -d database
```

This creates an `inventorydb` database on port `5433` using the local development credentials defined in `compose.yaml`. The non-default host port avoids conflicts with an existing PostgreSQL installation.

### Run the Backend

```bash
cd backend
./mvnw spring-boot:run
```

Backend API:

```text
http://localhost:8085
```

The default configuration works with the included PostgreSQL container. For another environment, set:

```text
DATABASE_URL
DATABASE_USERNAME
DATABASE_PASSWORD
JWT_SECRET
CORS_ALLOWED_ORIGIN
```

Use a strong, private `JWT_SECRET` outside local development.

### Run the Frontend

Open another terminal:

```bash
cd frontend
npm ci
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Vite proxies API calls to `http://localhost:8085` during development. Set `VITE_API_URL` when the API is hosted elsewhere.

---

## 🔌 API Endpoints

### Authentication

```text
POST   /auth/register
POST   /auth/login
```

### Products

```text
GET    /api/products
POST   /api/products
PUT    /api/products/{id}
DELETE /api/products/{id}
GET    /api/products/low-stock
```

### Analytics

```text
GET    /analytics
GET    /analytics/categories
```

Product and analytics endpoints require:

```text
Authorization: Bearer <token>
```

---

## 🧪 Testing

Run the backend integration suite:

```bash
cd backend
./mvnw test
```

Run frontend component tests and create a production bundle:

```bash
cd frontend
npm test
npm run build
```

The backend suite verifies protected endpoints, registration, JWT access, product creation, analytics calculations, low-stock detection, and deletion against an isolated H2 database.

---

## 👨‍💻 Author

**Sampreet Singh**

GitHub: [SinghSampreet04](https://github.com/SinghSampreet04)

---

## ⭐ Support

If you find this project useful, consider giving the repository a star.
