# CRM Project Documentation

## Overview
A full-stack Customer Relationship Management (CRM) system with a React (Vite) frontend and a Node.js/Express backend. It supports user management, deals, leads, contacts, invoices, notifications, reports, and more.

## Features
- User authentication & roles (Admin, User, Client)
- Contact, Lead, Deal, and Invoice management
- File uploads (avatars, logos, invoices)
- Notifications & reports
- RESTful API
- Modern React frontend (Vite, HMR)
- Full unit & integration test skeletons (Jest)

## Project Structure
```
CRM/
  backend/      # Node.js/Express API, models, controllers, tests
  frontend/     # React app (Vite), components, assets
  README.md     # Project documentation (this file)
  docker-compose.yml, crmdb.sql, ...
```

## Setup & Installation
### Prerequisites
- Node.js (v18+ recommended)
- npm
- MySQL (for database)

### 1. Clone the repository
```sh
git clone <your-repo-url>
cd CRM
```

### 2. Database Setup
- Import `crmdb.sql` into your MySQL server:
  ```sh
  mysql -u <user> -p < database < crmdb.sql
  ```
- (Optional) Run `add_profile_picture_column.sql` for extra features.

### 3. Backend Setup
```sh
cd backend
npm install
cp .env.example .env   # Edit .env with your DB credentials
npm run dev            # Start backend (nodemon)
```

### 4. Frontend Setup
```sh
cd ../frontend
npm install
npm run dev            # Start frontend (Vite)
```

## Running the App
- Backend: http://localhost:5000 (default)
- Frontend: http://localhost:5173 (default)

## Testing
- All backend tests use Jest (ESM, supertest for routes)
- To run all backend tests:
  ```sh
  npm test --prefix backend
  ```
- Test files are in `backend/test/` and cover models, controllers, middleware, utils, and routes.

## API & Useful Links
- API endpoints: See `backend/routes/` for available endpoints
- Frontend: Modern React app in `frontend/`
- Database schema: See `crmdb.sql`

## Contribution & Support
- Fork and PRs welcome!
- For issues, open a GitHub issue or contact the maintainer.

---
**Enjoy using and extending your CRM!** 