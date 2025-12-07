Below is your project documentation rewritten in **professional GitHub README.md format** — clean, production-ready, and properly structured.

---

````markdown
# 🏢 TruEstate Sales Management System

A **high-performance full-stack retail sales management application** featuring advanced **search, filtering, sorting, and pagination** designed to efficiently handle **large-scale transactional data**.

---

## 🚀 Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Backend** | Node.js, Express.js, PostgreSQL, Redis, json2csv |
| **Frontend** | React, Vite, Custom Hooks, Fetch API |
| **Tools / Security / Utils** | Helmet, CORS, Compression, dotenv, csv-parser |

---

## 🔍 Features Overview

### 🔎 Full-Text Search
- Case-insensitive search using **PostgreSQL ILIKE**
- Supports **customer name & phone number**
- **Parameterized queries** prevent SQL injection
- **Debounced search** on frontend to minimize network calls
- **URL-synced search state** for bookmarkable results

### 🧩 Advanced Filters
Supports both **multi-select** and **range-based** filters:
- Region
- Gender
- Age range
- Product category
- Tags
- Payment method
- Date range

✔ Dynamically generated SQL `WHERE` clauses  
✔ Fully compatible with search, sorting, and pagination  
✔ **Filter options cached in Redis** (TTL = 1 hour)

### 🔄 Sorting System
| Sort Field | Order |
|------------|-------|
| Date | Newest first |
| Quantity | Asc/Desc |
| Customer Name | Alphabetical |

🔹 Server-side ordering using dynamic SQL `ORDER BY` mapping  
🔹 Sort state persists in URL and remains compatible with filters/search

### 📄 Pagination
- **Offset-based pagination**
- Default: **10 records/page**
- Maximum: **100 records/page**
- Response includes:
  - Current page
  - Total pages
  - Record count
  - Navigation flags (hasNext, hasPrev)
- Pagination preserves search, filters & sorting state

---

## ⚙️ Setup Instructions

### 📌 Prerequisites
- Node.js **18+**
- PostgreSQL **14+**
- Redis **6+**

---

### 🛠 Backend Setup

```bash
cd backend
npm install
````

Create `.env` file:

```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=truestate_sales
REDIS_HOST=localhost
REDIS_PORT=6379
CORS_ORIGIN=http://localhost:5173
```

Initialize database:

```bash
node src/database/setup.js
node src/database/seed.js
```

Start backend:

```bash
npm start
```

---

### 🖥 Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file:

```
VITE_API_URL=http://localhost:5000/api
```

Start development server:

```bash
npm run dev
```

Access the app at → **[http://localhost:5173](http://localhost:5173)**

---

## 📦 Production Build

```bash
npm run build
```

When configured, the backend serves static files from `dist/`.

---

## 📡 API Endpoints

| Method | Endpoint                    | Description                                              |
| ------ | --------------------------- | -------------------------------------------------------- |
| GET    | `/api/health`               | Health check                                             |
| GET    | `/api/sales`                | Paginated sales data (supports search, filters, sorting) |
| GET    | `/api/sales/export`         | CSV export                                               |
| GET    | `/api/sales/filter-options` | Filter metadata (Redis-cached)                           |

---

## 🏁 Status

✔ Active Development
🔜 Future enhancements: role-based authentication, invoice dashboard, analytics charts

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 💬 Support

For contributions or issues, open a ticket in the **Issues** section.

---

