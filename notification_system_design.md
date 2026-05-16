# System Design: Campus Notification Platform

## Stage 1: REST API Design

**Headers**
- `Authorization: Bearer <JWT_TOKEN>`
- `Content-Type: application/json`

**GET /api/notifications**
Fetches paginated notifications for the logged-in user.
```json
// Request
GET /api/notifications?page=1&limit=10&type=Placement

// Response
{
  "success": true,
  "data": {
    "total": 45,
    "page": 1,
    "results": [
      {
        "id": "notif_123",
        "type": "Placement",
        "message": "Google interview scheduled for tomorrow",
        "is_read": false,
        "timestamp": 1700000000
      }
    ]
  }
}
```

## Stage 2: Database Choice and Schema

**Choice:** PostgreSQL
**Reasoning:** Notifications have a strict, predictable structure. Relational DBs handle filtering (by type/user) and pagination very efficiently.

**Schema (`notifications` table):**
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `type` (VARCHAR: 'Placement', 'Result', 'Event', 'General')
- `message` (TEXT)
- `is_read` (BOOLEAN, default false)
- `created_at` (TIMESTAMP)

## Stage 3: Optimization and Indexing

To keep queries fast as the table grows:
- **Indexing:** Create a composite index on `(user_id, created_at DESC)`. This speeds up the default user feed query. Create another on `(user_id, type)` for quick filtering.
- **Pagination:** Instead of `OFFSET` (which slows down on deep pages), use cursor-based pagination (e.g., `WHERE created_at < last_timestamp LIMIT 10`) for large datasets.
- **Caching:** Cache the unread notification count in Redis to avoid hitting the DB every time a user loads the app.

## Stage 4: Real-Time Notifications

**Approach:** WebSockets (via Socket.io). 
Since campus events (like sudden Placement updates) are time-sensitive, WebSockets provide a persistent two-way connection to instantly push payloads to active clients without them polling the server.

## Stage 5: Bulk Notification Redesign (Scale)

Sending an alert to 10,000+ students in a single API loop will block the thread and crash the server.

**Redesign:** 
- Implement a **Message Queue** (like RabbitMQ or AWS SQS) and background worker services.
- The API instantly accepts the bulk request, chunks the student IDs, and pushes messages to the queue. 
- Worker nodes independently consume the queue and insert DB records/trigger WebSockets at a safe, steady rate.

**Retry Strategy:** 
Workers should implement exponential backoff. If a database insert or push notification fails, the worker waits (1s, 2s, 4s) before trying again. After 3 failures, it routes the message to a Dead Letter Queue (DLQ) for manual logging.

**Scalable Worker Pseudocode:**
```javascript
queue.process('send-bulk-notification', async (job) => {
  const { studentIds, messagePayload } = job.data;
  
  try {
    const formattedData = studentIds.map(id => ({ user_id: id, ...messagePayload }));
    await db.notifications.bulkInsert(formattedData);
    
    // Notify active users
    websocketServer.emitToUsers(studentIds, messagePayload);
  } catch (error) {
    if (job.attempts < 3) throw new Error('Retrying...');
    await dlq.push(job.data); // Move to Dead Letter Queue
  }
});
```

## Stage 6: Priority Inbox Design

**Logic:**
1. Placement (Weight 3)
2. Result (Weight 2)
3. Event (Weight 1)
- Within the same type, newer notifications rank higher.

**Time Complexity Discussion:**
To fetch the top 10 priority notifications dynamically from an array of size `N`:
- **Standard Sort:** `O(N log N)`. Fast enough for small in-memory arrays (e.g., filtering a recent feed of 100 items).
- **Optimized (Min-Heap):** `O(N log K)`. Using a Min-Heap of size `K` (where K is 10), we can find the top 10 much faster if `N` is huge.
- **Production DB Approach:** In a real DB, time complexity is `O(1)` or `O(log N)` if we use an indexed priority column: `ORDER BY priority_weight DESC, created_at DESC LIMIT 10`.
