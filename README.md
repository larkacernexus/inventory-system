# Inventory Management System

A role-based inventory system built with Laravel 11 + Next.js 14 + MySQL.

---

## Why I Built It This Way

**Split frontend/backend** — Laravel handles the API and business logic, Next.js handles the UI. Keeps concerns separated and lets each side scale or be swapped independently.

**Token auth (Sanctum) instead of sessions** — the frontend and backend run on different origins. Bearer tokens work across origins without cookie/CORS headaches.

**Role-based access on the backend** — every protected route sits behind middleware. The frontend hides what users shouldn't see for UX, but the backend is the real security boundary. Anyone bypassing the UI still gets a 403.

**Three roles, not a boolean** — Admin / Manager / Staff covers real-world needs (managers can help with staff but not with other managers). Adding a fourth role later is trivial; refactoring from `is_admin` would not be.

**Audit trail on stock** — every quantity change writes to `stock_movements` inside a DB transaction, so history never loses sync with current stock.

**Factories + seeders** — demo data (products, users, movements) spins up in one command, so anyone can clone and run it in minutes.

---

## Setup

### Backend

```bash
cd inventory-api
composer install
cp .env.example .env
php artisan key:generate