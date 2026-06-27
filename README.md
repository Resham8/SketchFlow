<div align="center">

# 🎨 SketchFlow

A real-time, multiplayer whiteboard — inspired by Excalidraw. Draw shapes, sketch ideas, and watch every stroke sync live across everyone in the room.

**TypeScript · Turborepo · Next.js · Express · WebSocket · PostgreSQL · Prisma**

</div>

---

## Overview

SketchFlow is a collaborative drawing canvas where multiple users can join a shared "room" and see each other's shapes appear in real time. Every rectangle, circle, and pencil stroke is broadcast over a WebSocket connection and durably persisted, so a board picks up exactly where it left off even after everyone disconnects.

The project is a **Turborepo monorepo** with three independent services and a set of shared packages:

- **`apps/web`** — the Next.js canvas UI (drawing, toolbar, rooms, auth)
- **`apps/http-backend`** — an Express REST API for auth, rooms, and board history
- **`apps/ws`** — a WebSocket server that fans out live drawing events and persists them
- **`packages/`** — shared Prisma client, Zod schemas, UI components, and tooling configs used across all three apps

---

## ✨ Features

- **Real-time collaboration** — every shape you draw is pushed to everyone else in the room instantly over WebSocket
- **Persistent boards** — shapes are written to Postgres as they're drawn, so reopening a room replays its full history
- **JWT authentication** — signup/signin with bcrypt-hashed passwords; the same signed token authenticates both the REST API and the WebSocket connection
- **Rooms** — create a room, get a shareable slug, and invite others to draw on the same board
- **Drawing tools** — select/pan, freehand pencil, rectangle, circle, and an eraser
- **Canvas panning & zoom** — navigate large boards smoothly via click-drag and scroll
- **Type-safe across the stack** — Zod schemas and a shared Prisma client are published as internal workspace packages and consumed by every service

---

## 🏗️ Architecture

```
                 ┌──────────────────────┐
                 │   Next.js Web App    │
                 │  (Canvas + Toolbar)  │
                 └───────────┬──────────┘
                             │
           ┬─────────────────┴─────────────────┬
REST / JWT │                                   │ WebSocket
┌──────────┬─────────┐              ┌──────────┬─────────┐
│    HTTP Backend    │              │     WS Server      │
│  (Express + JWT)   │              │     (ws + JWT)     │
└──────────┬─────────┘              └──────────┬─────────┘
           │                                   │
           ┴─────────────────┬─────────────────┴
                             │ Prisma ORM
                  ┌──────────┬─────────┐
                  │     PostgreSQL     │
                  └────────────────────┘
```

The **web app** talks to the **HTTP backend** for auth and room/board history, and opens a **WebSocket** connection to the **WS server** (authenticated with the same JWT, passed as a query param) for live shape sync. Both backend services share one Postgres database through a single Prisma client package.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io/) (`npm install -g pnpm`)
- [PostgreSQL](https://www.postgresql.org/download/)

### 1. Clone the repo

```bash
git clone https://github.com/Resham8/SketchFlow.git
cd SketchFlow
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Create a `.env` in `packages/db` (for migrations) and in each app that needs it:

```env
# packages/db/.env
DATABASE_URL=postgres://postgres:yourpassword@localhost:5432/sketchflow

# apps/http-backend/.env and apps/ws/.env
JWT_SECRET=your-shared-secret
```

> The HTTP backend and WS server must use the **same** `JWT_SECRET` — tokens issued by `/signin` are verified by both.

### 4. Run database migrations

```bash
cd packages/db
npx prisma migrate dev
```

### 5. Start everything

From the repo root:

```bash
pnpm dev
```

Turborepo will start all three apps in parallel:

| Service | Default URL |
|---|---|
| Web app | `http://localhost:3000` |
| HTTP backend | `http://localhost:3001` |
| WebSocket server | `ws://localhost:8080` |

---

## 📡 HTTP API Reference

All routes are mounted under `/api/v1/user`. Authenticated routes expect:

```
Authorization: <jwt_token>
```

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/signup` | – | Create a new user |
| `POST` | `/signin` | – | Log in, returns a JWT |
| `POST` | `/room` | ✅ | Create a new room |
| `GET` | `/rooms` | ✅ | List rooms owned by the current user |
| `GET` | `/room/:slug` | ✅ | Look up a room by its slug |
| `GET` | `/chats/:roomId` | ✅ | Get the persisted shape history for a room |

## 🔌 WebSocket Protocol

Connect to `ws://localhost:8080?token=<jwt_token>`. Messages are JSON with a `type` field:

| Type | Direction | Payload | Description |
|---|---|---|---|
| `join_room` | client → server | `{ roomId }` | Subscribe to live updates for a room |
| `leave_room` | client → server | `{ roomId }` | Unsubscribe from a room |
| `chat` | both | `{ roomId, shape }` | A new shape is drawn; persisted and broadcast to everyone in the room |
| `delete` | both | `{ roomId, shapeId }` | A shape is erased; removed from Postgres and broadcast |

---


