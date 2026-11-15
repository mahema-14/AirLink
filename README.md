# ✈️ Skyward AirLink — Hybrid Commercial Airline Reservation System

**Skyward AirLink** is a full-stack commercial flight booking and operations platform engineered with a **hybrid database architecture**. It combines **MySQL (InnoDB)** for ACID-compliant transactional reservations, ticketing, and payment auditing with **Neo4j** for graph-based multi-hop flight pathfinding.

---

##  Tech Stack

* **Frontend:** Next.js 15 (App Router), React, TypeScript, Tailwind CSS, Lucide Icons
* **Relational Database:** MySQL 8.0 (`mysql2` connection pooling, normalized 11-table schema, stored procedures, triggers, and views)
* **Graph Database:** Neo4j (`neo4j-driver` over Bolt protocol, Cypher shortest-path route traversal)

---

##  Hybrid Database Architecture

### 1. Relational Model (MySQL)
Designed in Third Normal Form (3NF) to guarantee data integrity, prevent double-booking, and maintain immutable financial logs:
* **Core Entities:** `users`, `airports`, `aircraft`, `passengers`, `seats`, `flights`
* **Transactional & Audit Tables:** `bookings`, `tickets`, `seat_reservations`, `payments`, `booking_audit`
* **Database Logic:** Atomic multi-table transactions (`BEGIN` / `COMMIT` / `ROLLBACK`), check constraints, foreign key cascades, and stored procedures (`sp_GenerateFlightManifest`, `sp_CalculateMonthlyRevenue`).

### 2. Graph Model (Neo4j)
Models the aviation network as a directed property graph for low-latency connection discovery:
* **Nodes:** `(:Airport {code, name, city, country})`
* **Relationships:** `-[:HAS_FLIGHT {flight_number, duration, fare}]->`
* **Traversal:** Executes Cypher `shortestPath()` queries across up to 3 hops to compute multi-leg itineraries.

---

##  Key Features

* **Dual-Engine Flight Search:** Toggle seamlessly between **Direct SQL** schedule lookups and **Neo4j Graph** multi-hop route pathfinding.
* **Interactive Cabin Seat Map:** Real-time seat availability grid (`Airbus A320` layout) that locks selected seats during checkout.
* **Atomic Booking Transactions:** Simultaneously creates passenger records, reserves seats, generates PNR & ticket numbers, and logs payment transactions.
* **Passenger Portal (`/my-bookings`):** Displays issued e-tickets, PNR references, seat assignments, and payment receipts.
* **Admin Operations Hub (`/admin`):** Monitors live SQL revenue aggregations, Neo4j node counts, and executes MySQL stored procedures directly from the UI.

---

## 📂 Project Structure

```text
airlink/
├── database/                  # SQL schema, seed data, views, procedures, triggers & Cypher scripts
└── src/
    ├── app/
    │   ├── admin/             # Admin Operations Hub UI
    │   ├── api/               # Next.js App Router API endpoints
    │   │   ├── airports/      # Airport lookup API
    │   │   ├── auth/          # Login & registration handlers
    │   │   ├── bookings/      # Atomic booking transaction & history API
    │   │   ├── flights/       # Hybrid MySQL + Neo4j search endpoint
    │   │   ├── payments/      # Payment records API
    │   │   ├── seats/         # Real-time cabin seat availability API
    │   │   └── test-db/       # Database health check endpoint
    │   ├── booking/           # Interactive seat selection & checkout page
    │   ├── flights/           # Full flight schedule directory
    │   ├── login/             # User authentication page
    │   ├── my-bookings/       # Passenger ticket & PNR history
    │   ├── profile/           # User account details
    │   └── register/          # Account registration page
    ├── components/            # Reusable UI components (Navbar, FlightSearch, FlightCard, SeatMap, BookingCard, Footer)
    ├── lib/                   # MySQL pool, Neo4j driver, formatters & validators
    ├── styles/                # Custom CSS design tokens
    └── types/                 # TypeScript interfaces
```

---

##  Getting Started

### Prerequisites
* **Node.js** (v18 or higher)
* **MySQL Server** (v8.0+)
* **Neo4j Desktop** or **Neo4j AuraDB** instance

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/<your-username>/airlink.git
cd airlink
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory and add your database credentials:
```env
# MySQL Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=airlink

# Neo4j Configuration
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_neo4j_password
```

### 3. Initialize Databases
1. **MySQL:** Execute the SQL scripts inside `database/` sequentially (`01` through `10`) to build the `airlink` schema, sample flights, views, stored procedures, and triggers.
2. **Neo4j:** Run the Cypher seed script in Neo4j Browser to populate `(:Airport)` nodes and `[:HAS_FLIGHT]` relationships.

### 4. Start the Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser to explore the application.

## Project done by:
1) P Mahema Sai - PES2UG24AM107
2) Namitha N Reddy - PES2UG24AM098
