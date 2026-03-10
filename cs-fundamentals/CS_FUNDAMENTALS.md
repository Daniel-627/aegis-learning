# 💻 CS Fundamentals
## The Foundations That Make Everything Else Make Sense

> *"You do not need a CS degree. But you do need to understand what a CS degree teaches."*

---

## SECTION 1: Memory — How Programs Store Data

### The Two Regions

**The Stack**
```
- Stores: Local variables, function call frames
- Size:   Fixed, small (usually 1-8 MB)
- Speed:  Very fast — just a pointer increment
- Managed by: The compiler/runtime automatically
- Lifetime: Variables exist only while their function is executing
- LIFO:   Last in, first out

What lives here:
  - Primitive values (numbers, booleans)
  - Function parameters
  - References/pointers to heap objects
  - Return addresses
```

**The Heap**
```
- Stores: Dynamically allocated objects and arrays
- Size:   Large, grows as needed (limited by RAM)
- Speed:  Slower — must find free memory, track allocations
- Managed by: Programmer (C/C++) or Garbage Collector (JS, Python, Java)
- Lifetime: Exists until explicitly freed or garbage collected

What lives here:
  - Objects: { name: "Aegis" }
  - Arrays: [1, 2, 3, 4, 5]
  - Strings (in most languages)
  - Anything created with `new` or allocated dynamically
```

**Visualisation:**
```javascript
function greet(name) {       // greet frame on STACK
  let greeting = "Hello";    // greeting: STACK (reference → HEAP string)
  let obj = { name: name };  // obj reference: STACK, { name: name }: HEAP
  return greeting + " " + obj.name;
}
// When greet returns:
//   Stack frame is popped (gone instantly)
//   Heap objects become eligible for GC (if no other references)
```

### Garbage Collection

**Mark and Sweep (used by most GCs)**
```
Phase 1 — Mark:
  Start from "roots" (global variables, stack variables)
  Traverse all reachable objects
  Mark every reachable object as "alive"

Phase 2 — Sweep:
  Walk through all heap memory
  Any object NOT marked as alive → free it

Problem: "Stop the world" — program pauses during GC
Solution: Incremental, concurrent, and generational GC
```

**Generational GC (V8 — Node.js, Chrome)**
```
Young Generation (New Space):
  - Short-lived objects
  - Collected frequently and quickly
  - Most objects die young (most allocations are temporary)

Old Generation (Old Space):
  - Objects that survived multiple collections
  - Collected infrequently
  - Larger, slower collection

Why this works:
  - 90%+ of objects die in the young generation
  - Rarely need to collect the old generation
  - Much lower average pause times
```

### Memory Leaks in JavaScript
```javascript
// LEAK 1: Global variables
function bad() {
  leak = "I'm not declared with let/const/var";  // goes to global scope
}

// LEAK 2: Forgotten timers
const interval = setInterval(() => {
  // holds reference to everything in its closure
}, 1000);
// Fix: clearInterval(interval) when done

// LEAK 3: DOM references after removal
let element = document.getElementById('btn');
document.body.removeChild(element);
// element variable STILL holds reference → heap object not collected
// Fix: element = null after removing

// LEAK 4: Closures holding references longer than needed
function outer() {
  const bigData = new Array(1000000).fill('data');
  return function inner() {
    return bigData[0];  // bigData cannot be GC'd as long as inner exists
  }
}
```

### Interview Dialogue
**Q: What is the difference between the stack and the heap?**

*"The stack stores local variables and function call information in a last-in, first-out structure. It is automatically managed, fast, and limited in size. The heap stores dynamically allocated objects and arrays. It is larger but slower, and managed by a garbage collector in languages like JavaScript and Python. When I write `const obj = { name: 'Aegis' }`, the reference `obj` lives on the stack, but the actual object `{ name: 'Aegis' }` lives on the heap. When the function returns and nothing else references that object, the garbage collector eventually reclaims that heap memory."*

---

## SECTION 2: Networking — How Data Travels

### The OSI Model (Simplified to 5 Layers)

```
Layer 5 — Application:  HTTP, HTTPS, DNS, FTP, SMTP
Layer 4 — Transport:    TCP (reliable), UDP (fast, unreliable)
Layer 3 — Network:      IP addresses, routing between networks
Layer 2 — Data Link:    MAC addresses, within a local network
Layer 1 — Physical:     Cables, radio signals, actual bits
```

### TCP vs UDP

**TCP (Transmission Control Protocol)**
```
Connection-oriented: requires handshake before data transfer
Reliable:            guarantees delivery and order
Flow control:        prevents overwhelming the receiver
Error checking:      checksums, retransmission of lost packets
Slower:              overhead of all the above

Three-way handshake:
  Client → SYN →       Server    ("I want to connect")
  Client ← SYN-ACK ←  Server    ("OK, I accept")
  Client → ACK →       Server    ("Great, let's go")
  [Connection established — data can flow both ways]

Used by: HTTP, HTTPS, SSH, email (SMTP, IMAP)
```

**UDP (User Datagram Protocol)**
```
Connectionless:  no handshake, fire and forget
Unreliable:      packets may be lost, reordered, duplicated
No flow control: sender can overwhelm receiver
Faster:          minimal overhead

Used by: DNS, video streaming, gaming, VoIP, WebRTC
Why streaming uses UDP: A dropped frame looks bad.
  A paused video waiting for retransmission looks worse.
```

### HTTP Request/Response Cycle

```
1. DNS Resolution
   Browser: "What is the IP of api.example.com?"
   DNS Server: "It's 203.0.113.42"
   Cached for TTL duration (could be seconds to hours)

2. TCP Handshake
   Three-way handshake with server at 203.0.113.42:443

3. TLS Handshake (for HTTPS)
   Negotiate encryption algorithm
   Exchange certificates
   Establish session keys
   Adds ~1-2 round trips

4. HTTP Request
   GET /api/users/123 HTTP/1.1
   Host: api.example.com
   Authorization: Bearer eyJhbGci...
   Accept: application/json

5. Server Processes Request
   Load balancer routes to available server
   Server authenticates JWT
   Server queries database
   Server builds response

6. HTTP Response
   HTTP/1.1 200 OK
   Content-Type: application/json
   Cache-Control: max-age=3600
   { "id": 123, "name": "Aegis" }

7. TCP Connection
   HTTP/1.1: may keep connection alive (Keep-Alive)
   HTTP/2:   multiplexes multiple requests on one connection
   HTTP/3:   uses QUIC (UDP-based) for lower latency
```

### DNS
```
Domain Name System: the phone book of the internet
Maps domain names → IP addresses

Resolution order:
  1. Browser cache
  2. OS cache (/etc/hosts on Linux/Mac)
  3. Router cache
  4. ISP's DNS resolver
  5. Root nameservers (.)
  6. TLD nameservers (.com, .org, .io)
  7. Authoritative nameserver (holds your record)

Record types:
  A:      domain → IPv4 address
  AAAA:   domain → IPv6 address
  CNAME:  alias → another domain
  MX:     mail server for domain
  TXT:    arbitrary text (SPF, DKIM, domain verification)
```

### HTTPS / TLS
```
TLS (Transport Layer Security) — what "S" in HTTPS means

Purpose:
  - Encryption:     data is unreadable to anyone intercepting
  - Authentication: certificate proves server identity
  - Integrity:      data cannot be tampered with in transit

How certificates work:
  - Your server has a private key (secret, never shared)
  - Certificate Authority (CA) signs your public key + domain
  - Browser trusts CAs (pre-installed list)
  - Browser verifies CA's signature on your certificate
  - Establishes that "api.example.com" is genuinely api.example.com
```

### Interview Dialogue
**Q: What happens when you type a URL into a browser?**

*"First, the browser resolves the domain name through DNS — checking its own cache first, then the OS, then querying DNS servers up the hierarchy until it gets an IP address. Then it establishes a TCP connection using the three-way handshake. For HTTPS, there is also a TLS handshake to negotiate encryption and verify the server's certificate. Once the secure connection is established, the browser sends the HTTP request — the method, path, headers, and optional body. The server processes the request, which might involve authenticating the user, querying a database, and building a response. The server sends back an HTTP response with a status code, headers, and body. The browser parses the response, renders the HTML, and makes additional requests for CSS, JavaScript, and images."*

---

## SECTION 3: Operating Systems — How Your Computer Manages Resources

### Processes vs Threads

**Process**
```
- Independent program in execution
- Has its own memory space (isolated from other processes)
- Creating a process is expensive (copy memory, set up file descriptors)
- If a process crashes, it does not affect other processes
- Inter-process communication is hard (pipes, sockets, shared memory)

Example: Each browser tab was once a separate process in Chrome
```

**Thread**
```
- Lightweight unit of execution within a process
- Shares memory space with other threads in the same process
- Cheap to create and switch between
- Can communicate easily (shared memory)
- But: shared memory = race conditions if not synchronized

Example: Node.js is single-threaded for JS execution,
         but uses a thread pool (libuv) for I/O operations
```

**Context Switch**
```
When CPU switches from running Thread A to Thread B:
  1. Save Thread A's state (registers, program counter) to memory
  2. Load Thread B's state from memory
  3. Resume Thread B

This takes microseconds but adds up at scale.
Too many threads = too much context switching = less actual work done.
```

### Concurrency vs Parallelism

```
Concurrency:  Dealing with multiple things at once (structure)
              One chef juggling multiple dishes
              JavaScript: single thread, non-blocking I/O

Parallelism:  Doing multiple things at once (execution)
              Multiple chefs, each cooking one dish
              Python: multiprocessing, Go goroutines

JavaScript is concurrent but NOT parallel (single thread).
It handles thousands of connections through the event loop,
not through multiple threads.
```

### The Node.js Event Loop (Deep Dive)

```
Node.js is single-threaded. How does it handle 10,000 concurrent requests?

Answer: Non-blocking I/O + Event Loop

Call Stack:   Where synchronous code executes
Web APIs:     Where async operations run (file I/O, network, timers)
              → Handled by libuv thread pool or OS kernel async I/O
Callback Queue: Where completed async operations wait
Microtask Queue: Where resolved Promises wait (higher priority)
Event Loop:   Continuously checks: "Is the call stack empty?
              If yes, move next callback from queue to stack."

Priority order:
  1. Call stack (synchronous code)
  2. Microtask queue (Promises, queueMicrotask)
  3. Macrotask queue (setTimeout, setInterval, I/O callbacks)

This is why Promises always resolve before setTimeout callbacks.
```

```javascript
console.log('1');

setTimeout(() => console.log('2'), 0);  // macrotask

Promise.resolve().then(() => console.log('3'));  // microtask

console.log('4');

// Output: 1, 4, 3, 2
// Why: 1 and 4 are synchronous (call stack)
//      3 is a microtask (runs before macrotask)
//      2 is a macrotask (runs last)
```

---

## SECTION 4: Database Internals

### How a B-Tree Index Works

```
B-Tree: Balanced tree where every leaf is at the same depth

For a table with 1 million rows:
  Without index: scan all 1M rows → O(n)
  With B-tree:   height ≈ log₂(1,000,000) ≈ 20 → O(log n)

Each page in a B-tree ≈ 16KB, holds ~100+ keys
1 million rows → B-tree height ≈ 3-4 levels
Read 3-4 disk pages → find any row in milliseconds
```

### ACID Transactions — How They Actually Work

**Write-Ahead Logging (WAL)**
```
Before any change is written to the actual data files:
  1. The change is written to the WAL (append-only log)
  2. WAL is flushed to disk (ensures durability)
  3. Then the actual data files are updated

On crash recovery:
  - If transaction was committed (WAL has COMMIT record): replay the changes
  - If transaction was not committed: ignore those WAL entries
  
This is how Durability and Atomicity are guaranteed.
```

**MVCC (Multi-Version Concurrency Control)**
```
Problem: How do you allow concurrent reads and writes without locking?

Solution: Keep multiple versions of each row
  - Writers create a NEW version of the row
  - Readers see the version that was current when their transaction started
  - No reader blocks a writer. No writer blocks a reader.
  - Old versions are cleaned up by a vacuum process

This is how PostgreSQL's Isolation is implemented.
```

### SQL Query Execution Order

```sql
-- You write:
SELECT name, COUNT(*) as total
FROM orders
WHERE status = 'completed'
GROUP BY name
HAVING COUNT(*) > 5
ORDER BY total DESC
LIMIT 10;

-- Database executes in this order:
1. FROM      → identify the table
2. WHERE     → filter rows
3. GROUP BY  → aggregate groups
4. HAVING    → filter groups
5. SELECT    → compute output columns
6. ORDER BY  → sort results
7. LIMIT     → return first N rows

Why this matters:
  - You CANNOT use aliases from SELECT in WHERE (alias not defined yet)
  - You CAN use aliases in ORDER BY (defined by then)
  - HAVING filters AFTER grouping; WHERE filters BEFORE grouping
```

---

## The CS Fundamentals Interview Questions

**Memory:**
- What is the difference between stack and heap memory?
- What is a memory leak and how do you prevent one?
- How does garbage collection work in JavaScript?

**Networking:**
- What happens when you type google.com into a browser?
- What is the difference between TCP and UDP?
- What is DNS and what does it do?
- Explain TLS in simple terms.

**OS/Concurrency:**
- What is the difference between a process and a thread?
- What is the difference between concurrency and parallelism?
- How does the Node.js event loop work?
- Why is JavaScript single-threaded and how does it handle async operations?

**Databases:**
- How does a database index work?
- What are ACID properties?
- What is the difference between a clustered and non-clustered index?
- What is MVCC?

---

*Understanding these fundamentals means you are not just using tools. You understand what the tools are doing for you.*
