Below is your full document converted into **professional `ARCHITECTURE.md` GitHub format** — clean, structured, and ready to commit.

---

```markdown
# 🧩 TruEstate Sales System — Architecture Documentation

## 1️⃣ System Overview
The **TruEstate Sales Management System** is a full-stack large-scale retail sales application built for **high-performance querying**, enabling users to search, filter, sort, export, and paginate transactional data efficiently.  
The system follows a **client-server architecture** with emphasis on **scalability, modularity, and performance** through:
- Optimized SQL queries
- Redis caching
- Asynchronous API handling
- Separation of concerns across layers

---

## 2️⃣ Technology Stack

### 🔙 Backend
| Category | Technology |
|---------|------------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | PostgreSQL |
| Cache Layer | Redis |
| Security | Helmet, CORS |
| Performance | Compression middleware |
| Data Export | json2csv |

### 🎨 Frontend
| Category | Technology |
|----------|------------|
| Framework | React |
| Build Tool | Vite |
| HTTP Client | Fetch API |
| State Control | URL-synced state via Custom Hooks |
| Error Handling | React Error Boundaries |

### 🛠 Development Tools
- ES6 Modules
- dotenv for env configuration
- csv-parser for seeding utilities

---

## 3️⃣ Architectural Patterns

### 🧱 Backend — Layered Architecture
```

Routes → Controllers → Services → Data Access Layer → Database

```

#### Presentation Layer (Routes)
- Defines REST API endpoints
- Attaches middleware for validation & rate limiting
- Delegates flow to controllers

#### Business Logic Layer (Controllers + Services)
- Controllers handle input/output mapping
- Services perform reusable logic for:
  - Searching
  - Filtering
  - Sorting
  - Pagination
  - Caching

#### Data Access Layer
- PostgreSQL connection pooling
- Prepared statements (SQL injection-safe)
- Index-optimized query patterns

### 🧩 Service Responsibilities
| Service | Responsibility |
|---------|---------------|
| Search Service | ILIKE-based full-text search across name & phone |
| Filter Service | Dynamic SQL WHERE clause builder |
| Sort Service | Maps sort keys to SQL ORDER BY |
| Cache Service | Redis cache for filter metadata (TTL = 1 hr) |

---

## 4️⃣ Frontend Architecture

### ⚛ Component-Based Design
| Component | Role |
|----------|------|
| SalesPage | Main orchestrator and state manager |
| SearchBar | Debounced case-insensitive search |
| FilterPanel | Multi-select & range filters |
| SortControls | Dropdown sorting |
| SalesTable | Paginated result table |
| Pagination | Page navigation preserving state |
| FullTableModal | Lazy-loaded large dataset preview |

### 🪝 Custom Hooks
| Hook | Responsibility |
|-------|--------------|
| `useURLState` | Synchronize filters/search/sort with browser URL |
| `useSalesData` | Fetch & refresh paginated API data |
| `useFilterOptions` | Cache filter metadata client-side |
| `useDebounce` | Delay expensive operations like search |

---

## 5️⃣ Data Flow

### 🔁 Request Lifecycle
```

User action →
React URL state update →
API call triggered →
Validation middleware →
Controller extracts params →
Services generate SQL →
PostgreSQL executes query →
Paginated response returned →
React UI updates

```

### 🧮 Filter Evaluation Order
1. Search (ILIKE)
2. Categorical Filters (`IN`)
3. Range Filters (`BETWEEN`)
4. Array Filters (Postgres `&&`)
5. All conditions combined using `AND`

---

## 6️⃣ Optimization Techniques

### ⚡ Backend
| Optimization | Benefit |
|-------------|---------|
| Index-aware SQL queries | Faster lookups |
| Pagination via LIMIT + OFFSET | Scalability |
| Redis cache | Reduced DB load |
| Prepared statements | Safe + faster execution |
| Compression middleware | Reduced payload size |
| Rate limiting | Abuse & DoS prevention |

### ⚡ Frontend
| Optimization | Benefit |
|-------------|---------|
| Search input debouncing | Reduces API calls |
| URL-based state | Shareable/bookmarkable pages |
| Lazy loading | On-demand heavy UI rendering |
| Error boundaries | Prevent UI crashes |

---

## 7️⃣ Database Schema Overview

### 📌 Sales Table Structure
| Column Type | Examples |
|-------------|----------|
| Primary Key | `transaction_id` |
| Indexed | `date`, `customer_region`, `product_category`, `payment_method` |
| Arrays | `tags` (PostgreSQL ARRAY) |
| Numeric | Decimal for financial values |

📌 A **denormalized structure** is used intentionally to reduce JOIN overhead for analytical-style queries.

---

## 8️⃣ Security Considerations

### 🔐 API Security
- Parameterized SQL queries → Prevent SQL injection
- Helmet → Secure HTTP headers
- CORS restrictions → Restrict origins
- Input validation middleware → Checks for numeric + regex formats
- Rate limiting → Blocks abusive API usage

### 🚫 Error Exposure
- Server logs contain detailed error stacks
- Client receives generic error messages to prevent information leakage

---

## 9️⃣ Scalability

### Already Supported
| Capability | Mechanism |
|------------|-----------|
| Horizontal scaling | Stateless backend |
| DB Stability | Connection pooling |
| Cache efficiency | Redis |
| Efficient reads | Request pagination |

### Future Scaling Paths
- PostgreSQL Read Replicas
- Redis Cluster
- Load Balancer for backend instances
- CDN for static frontend assets

---

## 🔟 Future Scope

### 🧠 Performance Ideas
- Query result caching for frequent filter combos
- Cursor-based pagination for deep offsets
- Virtual scroll in modal table

### 🔧 Feature Additions
- WebSocket live updates
- RBAC (Role-based Access Control)
- Audit logging & traceability
- Analytics dashboard
- Bulk dataset operations

### 🎯 Architecture Expansion
- Microservices migration
- GraphQL API
- SSR / Next.js adoption
- PWA offline support

---

## 🔥 Module Map

### Backend
```

/controllers → Handle request orchestration
/services → Search, filter, sort, pagination, caching
/middleware → Validation, rate limiting
/database → Schema, seeds, pooling

```

### Frontend
```

/components → Reusable visual modules
/hooks → Custom reusable logic
/services → API abstraction

```

---

## ✔ Summary
The **TruEstate Sales System** is engineered for:
- 🔍 Fast & flexible querying
- ⚡ High performance under large datasets
- 🧱 Clean modular architecture
- 🚀 Future scalability

---

```

---

