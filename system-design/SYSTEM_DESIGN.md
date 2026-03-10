# 🏗️ System Design
## How to Design Large-Scale Systems

> *"System design is not about memorising architectures. It is about learning to reason about trade-offs under constraints."*

---

## The Framework (Use for Every Design Interview)

### The 7-Step System Design Process

```
1. CLARIFY REQUIREMENTS        (5 minutes)
2. ESTIMATE SCALE              (3 minutes)
3. DEFINE THE API              (5 minutes)
4. DESIGN THE DATA MODEL       (5 minutes)
5. DRAW THE HIGH-LEVEL DESIGN  (10 minutes)
6. DEEP DIVE INTO COMPONENTS   (15 minutes)
7. IDENTIFY AND DISCUSS BOTTLENECKS (7 minutes)
```

Never skip straight to drawing boxes. Interviewers watch how you think, not just what you draw.

---

## STEP 1: Clarify Requirements

Ask questions before you design. This shows seniority.

**Always ask:**
```
- How many users? (1,000? 1 million? 1 billion?)
- Read-heavy or write-heavy? (ratio matters)
- What are the core features? (don't design everything)
- Consistency requirements? (can users see stale data?)
- Latency requirements? (p99 < 100ms?)
- Availability requirements? (99.9% = 8.7 hrs/year downtime)
- Global or regional? (multi-region complexity)
```

---

## STEP 2: Estimate Scale (Back-of-Envelope)

Interviewers want to see that you can reason about numbers.

**Key numbers to memorise:**
```
1 million users × 1 request/day = ~12 requests/second
1 million users × 10 requests/day = ~120 requests/second
Twitter: ~500 million tweets/day = ~5,800 tweets/second

1 KB  = 1,000 bytes
1 MB  = 1,000 KB
1 GB  = 1,000 MB
1 TB  = 1,000 GB

A tweet: ~300 bytes
A profile photo: ~300 KB
1 million tweets: ~300 MB
1 billion tweets: ~300 GB
```

**Latency numbers (approximate):**
```
L1 cache:        0.5 ns
Main memory:     100 ns
SSD:             100 μs    (0.1 ms)
HDD:             10 ms
Network (same DC): 0.5 ms
Network (cross-continent): 150 ms
```

---

## STEP 3: Define the API

Write out the core API endpoints. This forces clarity about what the system actually does.

```
// For a URL shortener:
POST /shorten
  Body: { url: "https://very-long-url.com/article/..." }
  Response: { shortUrl: "https://short.ly/abc123" }

GET /:shortCode
  Response: 302 Redirect to original URL

GET /analytics/:shortCode
  Response: { clicks: 1423, countries: [...], devices: [...] }
```

---

## STEP 4: Design the Data Model

Think about what data you need, its shape, and what queries you will run on it.

```sql
-- URL Shortener
CREATE TABLE urls (
  id         BIGINT PRIMARY KEY,
  short_code VARCHAR(7) UNIQUE NOT NULL,
  long_url   TEXT NOT NULL,
  user_id    BIGINT,
  created_at TIMESTAMP,
  expires_at TIMESTAMP,
  click_count BIGINT DEFAULT 0
);

-- Short code generation: base62 encoding of auto-increment ID
-- 7 characters × 62 possible chars = 62^7 = ~3.5 trillion unique URLs
```

---

## STEP 5: High-Level Design

Draw these components and explain each:

```
Client → Load Balancer → Application Servers → Cache (Redis) → Database

For async work:
Application Servers → Message Queue → Workers → Database

For files/media:
Application Servers → Object Storage (S3) → CDN → Client
```

---

## CASE STUDY 1: Design a URL Shortener (like bit.ly)

### Requirements
- Shorten long URLs to short codes (~7 characters)
- Redirect short URLs to original
- 100 million URLs created per day
- 10 billion redirects per day (100:1 read:write ratio)
- URLs should never expire (or optionally expire after N days)

### Scale Estimation
```
Writes:  100M / 86,400s ≈ 1,200 writes/second
Reads:   10B / 86,400s ≈ 115,000 reads/second

Storage (5 years):
  100M/day × 365 × 5 = 182 billion URLs
  Each URL ≈ 500 bytes
  Total: 182B × 500B ≈ 91 TB
```

### The Core Problem: Short Code Generation
```
Option 1: MD5 hash of long URL → take first 7 chars
  ✓ Deterministic (same URL → same code)
  ✗ Collisions possible
  ✗ Hard to guarantee uniqueness at scale

Option 2: Auto-increment ID → encode in Base62
  ✓ Guaranteed uniqueness
  ✓ Short and predictable length
  ✗ Sequential IDs are guessable (security concern)
  ✓ Can use distributed ID generator (Snowflake)

Option 3: Random UUID → take 7 chars → check DB for collision
  ✓ Unpredictable
  ✗ DB lookup needed for every creation
```

**Recommended: Base62 encoding of a distributed ID (Snowflake algorithm)**

```javascript
// Base62 encoding
const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function encode(num) {
  let result = '';
  while (num > 0) {
    result = CHARS[num % 62] + result;
    num = Math.floor(num / 62);
  }
  return result.padStart(7, '0');
}
// encode(1000000000) → "15FTGg"
```

### Architecture
```
[Client]
    ↓
[Load Balancer] (HAProxy / AWS ALB)
    ↓
[Application Servers] (Node.js, stateless, horizontally scalable)
    ↓         ↓
[Redis Cache]  [PostgreSQL Master]
  (hot URLs)     ↓           ↓
              [Read      [Read
              Replica 1] Replica 2]
```

### The Redirect Flow
```
Client: GET /abc123
  → Check Redis cache first
    → HIT:  Increment counter async, return 301 redirect
    → MISS: Query DB, store in Redis (TTL: 24hrs), return 302 redirect
```

**301 vs 302:**
- `301 Permanent`: Browser caches the redirect. Fewer requests to your server. BUT analytics break.
- `302 Temporary`: Browser always asks your server. Analytics work. More server load.

### Bottlenecks and Solutions
```
Bottleneck 1: Single database write point
  Solution: Sharding by short code (range or hash-based)

Bottleneck 2: Hot URLs causing cache stampede
  Solution: Probabilistic early expiration, mutex on cache miss

Bottleneck 3: Analytics writes on every click
  Solution: Buffer in Redis, batch-write to analytics DB async
```

---

## CASE STUDY 2: Design a Twitter Feed (News Feed)

### Requirements
- Users can post tweets (280 chars)
- Users can follow other users
- Each user sees a feed of tweets from people they follow
- Tweets should appear in reverse-chronological order
- 300 million active users
- 500 million tweets per day
- Feed load in < 200ms

### The Core Problem: Feed Generation

**Option 1: Pull Model (Fan-out on Read)**
```
When user opens feed:
  → Get list of people they follow
  → Query tweets from each person
  → Merge and sort
  → Return top N

Pros: No precomputation, always fresh
Cons: VERY slow for users following 1,000 people
     Heavy DB queries on every feed load
```

**Option 2: Push Model (Fan-out on Write)**
```
When user posts tweet:
  → Look up all their followers
  → Write tweet ID to each follower's feed cache

When user opens feed:
  → Read pre-built feed from cache
  → Instant return

Pros: Feed reads are O(1) — just read from cache
Cons: Writing to millions of follower feeds for celebrities is slow
     Obama has 130 million followers — 1 tweet = 130M writes
```

**Option 3: Hybrid (What Twitter Actually Does)**
```
Regular users (< 10K followers): Push model — precompute feeds
Celebrity users (> 10K followers): Pull model — merge at read time

At read time:
  → Load pre-built feed for followed regular users (from cache)
  → Fetch recent tweets from followed celebrities (from DB)
  → Merge the two lists
  → Return top N
```

### Data Model
```sql
CREATE TABLE tweets (
  id          BIGINT PRIMARY KEY,  -- Snowflake ID (timestamp + server + sequence)
  user_id     BIGINT NOT NULL,
  content     VARCHAR(280),
  created_at  TIMESTAMP
);

CREATE TABLE follows (
  follower_id  BIGINT,
  followee_id  BIGINT,
  PRIMARY KEY (follower_id, followee_id)
);

-- Feed cache in Redis:
-- Key: feed:{userId}
-- Value: Sorted set of tweet IDs, scored by timestamp
```

### Architecture
```
[Client]
    ↓
[API Gateway + Load Balancer]
    ↓
[Tweet Service]    [Feed Service]     [User Service]
    ↓                   ↓                  ↓
[Tweet DB]       [Redis Feed Cache]   [User DB]
    ↓
[Message Queue] → [Fan-out Workers] → [Redis Feed Cache]
```

---

## CASE STUDY 3: Design a Chat System (like WhatsApp)

### Requirements
- 1-on-1 messaging
- Group chats (up to 500 members)
- Message delivery receipts (sent, delivered, read)
- Online presence indicator
- 50 billion messages per day

### The Core Problem: Real-Time Delivery

HTTP is request-response. For real-time messaging, you need a persistent connection.

**Options:**
```
Short Polling:  Client asks "any new messages?" every 1 second
  ✗ 1 second delay, massive server load

Long Polling:   Client asks, server holds request until message arrives
  ✓ Near real-time
  ✗ Server keeps connection open for each user

WebSockets:     Bidirectional persistent connection
  ✓ True real-time, low latency
  ✓ Both server and client can push messages
  ✓ Used by WhatsApp, Slack, Discord

Server-Sent Events (SSE): Server pushes to client (one-way)
  ✓ Simpler than WebSockets for server-to-client only
```

### Message Storage Strategy
```
Hot storage (Redis):
  → Last 30 days of messages per conversation
  → Fast access for recent chats

Cold storage (Cassandra or S3):
  → Older messages
  → Optimised for sequential writes and range queries by time

Why Cassandra for chat?
  → Write-heavy workload (50B messages/day)
  → Messages are immutable (no updates)
  → Queried by conversation_id + timestamp (perfect for Cassandra's partition key + clustering key)
```

### Delivery Receipts
```
Message states:
  1. sent       → server received the message
  2. delivered  → recipient's device received it
  3. read       → recipient opened the conversation

Implementation:
  → WebSocket connection used for all state updates
  → If recipient offline: push notification (APNs/FCM)
  → On reconnect: fetch missed messages from server
```

---

## CASE STUDY 4: Design YouTube (Video Platform)

### The Core Problems

**1. Video Upload and Processing**
```
Raw video from user → too large, too many formats
→ Upload to object storage (S3)
→ Message queue triggers transcoding workers
→ Convert to multiple resolutions: 360p, 720p, 1080p, 4K
→ Store each version back to S3
→ CDN distributes to edge servers globally
```

**2. Video Delivery**
```
Video streaming ≠ downloading the whole file
→ HTTP Adaptive Bitrate Streaming (HLS/DASH)
→ Video split into ~10-second segments
→ Client starts with low quality, upgrades as bandwidth is measured
→ If network degrades, drops to lower quality automatically
→ This is why YouTube video quality changes while you watch
```

**3. View Count at Scale**
```
Problem: 1 billion views per day. Cannot write to DB on every view.

Solution: Approximate counter
  → Buffer view events in Redis (INCR is O(1) and atomic)
  → Batch-write to database every 30 seconds
  → Display view count with ~30s lag (acceptable)
  → For precise counts: Kafka stream → Flink processing → analytics DB
```

---

## The Trade-Offs You Must Know

| Decision | Option A | Option B | Choose A when... |
|----------|----------|----------|-----------------|
| SQL vs NoSQL | PostgreSQL | Cassandra | You need ACID, joins, complex queries |
| Sync vs Async | Direct API call | Message queue | Real-time response required |
| Cache TTL | Short (1 min) | Long (24 hrs) | Data changes frequently |
| Consistency | Strong | Eventual | Correctness is critical (money) |
| Storage | On-server | Object storage (S3) | Files > 1MB or need CDN |
| Auth | Sessions | JWT | Microservices / horizontal scaling |
| Polling vs WebSocket | Polling | WebSocket | Real-time bidirectional needed |

---

## Interview Scoring Rubric

Interviewers evaluate system design on these dimensions:

```
1. Problem clarification       — Did you ask the right questions?
2. Scale awareness             — Do you understand the numbers?
3. Trade-off reasoning         — Do you explain WHY, not just WHAT?
4. Component knowledge         — Do you know what Redis, Kafka, CDN etc. actually do?
5. Bottleneck identification   — Can you find the weak points?
6. Practical grounding         — Is this a real system, not a theoretical fantasy?
7. Communication               — Can you explain your thinking clearly?
```

---

*Design is not about drawing the perfect diagram. It is about demonstrating that you can reason clearly under ambiguity.*
