# Campus Notification Platform

## Project Overview
This project is a full-stack web application designed for processing and displaying campus-related notifications (such as placement alerts, event updates, and results). It was built for a placement assessment and features a modular architecture consisting of a custom logging middleware, a Node/Express backend, and a React/Vite frontend.

## Features
- **Centralized Dashboard:** A clean, responsive interface to view all campus updates.
- **Priority Logic:** Automatically surfaces the most urgent notifications (e.g., Placement alerts) to the top.
- **Pagination & Filtering:** Filter notifications by type and navigate through paginated results.
- **Viewed State Persistence:** Visual distinction for read/unread notifications, persisted via `localStorage`.
- **Reusable Logging:** A standalone custom logging middleware integrated across both frontend and backend layers.

## Tech Stack
- **Frontend:** React, Vite, Material UI (MUI), Axios
- **Backend:** Node.js, Express.js, Axios
- **Middleware:** Custom CommonJS package

## Folder Structure
```text
22MIS7248/
├── logging_middleware/        # Standalone custom logging package
├── notification_app_be/       # Express.js backend API
├── notification_app_fe/       # React + Vite frontend
├── notification_system_design.md # System design & scalability document
└── .gitignore
```

## Logging Middleware Overview
A reusable package located in `logging_middleware`. It standardizes application logging and forwards events to an external API endpoint.
- Validates constraints (e.g., only allowed to log for specific stacks and packages like `api`, `controller`, `service`).
- Gracefully swallows errors to prevent application crashes if the logging server is down.
- Consumed by both the Node backend and the Vite frontend using local package linking.

## Backend APIs
The backend processes notifications strictly in-memory (to keep the assessment setup lightweight). It exposes two main endpoints:
- `GET /api/notifications`: Fetches all notifications with support for `?page`, `?limit`, and `?type` query parameters.
- `GET /api/notifications/top`: Returns a sorted list of the highest-priority notifications.

## Frontend Features
Built using Material UI, the frontend focuses on a practical and professional design:
- **Responsive Grid Layout:** Adapts from a two-column desktop layout to a single-column mobile view.
- **Dynamic Icons & Colors:** Visually categorizes notifications using distinct Material UI icons and colored chips.
- **Safe State Handling:** Parses `localStorage` cautiously to track which notifications the user has clicked and gray them out safely.

## Priority Notification Logic
Notifications are scored and sorted by urgency using a multi-level comparator:
1. **Type Weight:** `Placement` (High: 3), `Result` (Medium: 2), `Event` (Low: 1).
2. **Timestamp:** If two notifications share the same priority weight, the newer timestamp is ranked higher.

## System Design Highlights
A separate `notification_system_design.md` file is included in this repository. It covers:
- Theoretical PostgreSQL schema design and indexing optimization.
- Message Queues (RabbitMQ/SQS) and worker patterns for sending bulk notifications to 10,000+ students without blocking the main thread.
- Exponential backoff retry strategies and Dead Letter Queues (DLQ).

## Installation Steps

1. Clone this repository.
2. Install dependencies for the middleware first:
   ```bash
   cd logging_middleware
   npm install
   ```
3. Install backend dependencies:
   ```bash
   cd ../notification_app_be
   npm install
   ```
4. Install frontend dependencies:
   ```bash
   cd ../notification_app_fe
   npm install
   ```

## Running the Backend
Ensure you are in the `notification_app_be` directory:
```bash
npm start
```
The server will start on `http://localhost:3000`.

## Running the Frontend
Ensure you are in the `notification_app_fe` directory:
```bash
npm run dev
```
The React app will usually start on `http://localhost:5173`.

## Environment Variables
*(Optional)* You can set these variables. If missing, the app uses safe defaults or mock data.
- `NOTIFICATIONS_API_URL` (Backend): The external API to fetch notification data.
- `LOGGING_API_URL` (Middleware): The external API to receive logs.
- `LOGGING_AUTH_URL` (Middleware): Endpoint for logging authentication.

## Sample API Endpoints
**Fetch Placement Notifications (Page 1):**
```http
GET http://localhost:3000/api/notifications?page=1&limit=5&type=Placement
```

**Fetch Top Priority Alerts:**
```http
GET http://localhost:3000/api/notifications/top?limit=3
```

## Screenshots
*(Insert screenshots of the frontend dashboard, mobile view, and Postman API responses here prior to final submission)*

## Assumptions and Limitations
- **In-Memory Data:** Due to the constraints of the 3-hour assessment window, the backend falls back to an in-memory mock array if an external data source is unavailable.
- **Stateless Read Receipts:** The "viewed" status is stored in the browser's `localStorage` rather than a persistent database.

## Future Improvements
- Integrate a real PostgreSQL database with proper composite indexes `(user_id, type)`.
- Replace HTTP polling with WebSockets (Socket.io) for real-time notification pushing.
- Connect the logging middleware to a persistent logging sink (like ELK or Datadog).
