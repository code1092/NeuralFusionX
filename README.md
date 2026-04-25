<div align="center">

# 🛡️ GovShield AI

### AI Fraud Detection & Analytics for Government Welfare Schemes

[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Hackathon](https://img.shields.io/badge/FusionX_Hackathon-2026-8B5CF6?style=for-the-badge&logo=rocket&logoColor=white)]()
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**GovShield AI** is an internal intelligence platform for government officers, analysts, and auditors to detect fraudulent welfare scheme applications before approval — using real-time risk scoring, cluster analysis, geospatial monitoring, and analytics dashboards.

> 🏆 Built for **FusionX Hackathon 2026** · Track: **Big Data & Data Science** · Team: **Neural FusionX**

</div>

---

## 📌 Table of Contents

- [Problem Statement](#-problem-statement)
- [Our Solution](#-our-solution)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Folder Structure](#-folder-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Run Locally](#-run-locally)
- [Environment Variables](#-environment-variables)
- [Testing](#-testing)
- [Scalability](#-scalability)
- [Security](#-security)
- [Future Scope](#-future-scope)
- [Team](#-team)
- [License](#-license)

---

## 🚨 Problem Statement

Government welfare schemes — housing subsidies, agricultural loans, scholarships, pensions — process millions of applications annually. Manual verification at this scale is slow, error-prone, and vulnerable to systemic exploitation.

| Challenge | Impact |
|-----------|--------|
| Duplicate identity claims | Multiple payouts to the same individual |
| Fake or forged documentation | Ineligible applicants receiving benefits |
| Fraud rings & address clustering | Coordinated abuse across multiple entities |
| Income-to-loan anomalies | Financially impossible applications slipping through |
| Manual verification delays | Backlogs and delayed disbursements |
| Lack of real-time monitoring | Fraud detected only after financial leakage |
| No centralized audit trail | Accountability gaps across departments |

These gaps result in significant financial leakage, erode public trust, and divert resources away from genuinely eligible citizens.

---

## 💡 Our Solution

**GovShield AI** is a purpose-built internal platform that equips government officers and auditors with the tools to identify and act on suspicious applications — before approval.

- **Automated Risk Scoring** — every application is scored 0–100 based on weighted fraud indicators
- **Duplicate Identity Detection** — Aadhaar-level deduplication flags replay attacks and Sybil patterns
- **Cluster Analysis** — detects fraud rings by identifying shared addresses, phone nodes, and bank accounts across multiple entities
- **Eligibility Mismatch Checks** — validates scheme-specific criteria against submitted data
- **Loan vs. Income Anomaly Detection** — flags mathematically impossible debt-to-income ratios
- **Live Analytics Dashboard** — real-time telemetry, predictive intensity charts, and incident feeds
- **Geospatial Heatmap** — visualizes fraud concentration by geographic location
- **Downloadable Reports** — CSV/PDF exports for audit and compliance workflows
- **Officer Review Workflow** — structured review queue with status tracking per application

---

## ✨ Key Features

- 🔐 **Secure Login** — authenticated access restricted to authorized government personnel
- 🧠 **Fraud Scan Engine** — multi-phase rule-based analysis across identity, financial, network, and behavioral dimensions
- 📊 **Risk Score Output (0–100)** — quantified fraud probability per application
- 🚦 **Safe / Suspicious / Fraud Classification** — clear, actionable status labels
- 🗂️ **Registry Logs** — searchable, persistent record of all scanned entities with full audit trail
- 📈 **Dashboard Analytics** — live telemetry cards, area charts, and predictive intensity forecasting
- 🗺️ **Geospatial Heatmap** — Leaflet-powered interactive map with fraud marker overlays
- 📥 **CSV / PDF Reports** — exportable data for compliance, audits, and inter-department sharing
- 👥 **Role-Based Access Control** — differentiated access for officers, analysts, and administrators
- ✅ **Unit Tested Modules** — critical fraud logic and API endpoints covered by automated tests
- ⚡ **Horizontal Scaling Ready** — stateless API design supports multi-instance deployment
- 📦 **Vertical Scaling Ready** — resource-efficient architecture scales with infrastructure upgrades

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React.js 19, Axios, Chart.js, Recharts, Leaflet, Lucide React, CSS3 |
| **Backend** | Node.js 18+, Express.js 5, CORS |
| **Analytics Engine** | Rule-based scoring engine, Cluster analysis, Weighted multi-factor risk aggregation |
| **Testing** | Unit testing — fraud logic, API validation, edge case coverage |
| **Deployment** | Vercel (Frontend), Render (Backend) |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────┐
│              Data Sources                   │
│  (Application Forms, Identity Nodes, Docs)  │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│           React Frontend (Port 3000)        │
│  Login → Risk Engine → Dashboard → Map      │
└─────────────────┬───────────────────────────┘
                  │  REST API (Axios)
                  ▼
┌─────────────────────────────────────────────┐
│       Node.js + Express API (Port 5000)     │
│  /check-fraud  /history  /logs  /ai-summary │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│         Fraud Detection Engine              │
│                                             │
│  Phase 1: Identity Integrity Scan           │
│  Phase 2: Financial Disparity Analysis      │
│  Phase 3: Network Cluster Detection         │
│  Phase 4: Behavioral Biometrics             │
│  Phase 5: Risk Score Aggregation            │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│     Risk Output + Dashboard + Reports       │
│  Score │ Status │ Reasons │ Registry │ Map  │
└─────────────────────────────────────────────┘
```

---

## 📁 Folder Structure

```
GovShield-AI/
├── frontend/                  ← React application
│   ├── public/                ← Static assets, index.html
│   └── src/
│       ├── App.js             ← Main dashboard UI (all views)
│       ├── App.css            ← Global styles
│       └── index.js           ← React entry point
│
├── backend/                   ← Express API server
│   └── server.js              ← Routes, fraud engine, registry
│
└── README.md
```

**Frontend** handles all UI views: Login, Risk Engine, Intel Desk, Threat Map, and Registry Logs. It communicates with the backend exclusively via REST.

**Backend** exposes a stateless REST API. The fraud detection engine runs entirely server-side, maintaining an in-memory registry and telemetry log per session.

---

## ✅ Prerequisites

Ensure the following are installed before proceeding:

| Requirement | Version | Notes |
|-------------|---------|-------|
| [Node.js](https://nodejs.org/) | v18 or higher | Required for both frontend and backend |
| npm | v9 or higher | Bundled with Node.js |
| [Git](https://git-scm.com/) | Latest | For cloning the repository |
| Modern Browser | Chrome / Firefox / Edge | Required for map and chart rendering |
| Internet Connection | — | Required for map tile loading (OpenStreetMap) |

Verify your environment:
```bash
node -v
npm -v
git --version
```

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/govshield-ai.git
cd govshield-ai
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Install Backend Dependencies

```bash
cd ../backend
npm install
```

---

## ▶️ Run Locally

Run the backend and frontend in **two separate terminals**.

### Terminal 1 — Start the Backend

```bash
cd backend
node server.js
```

Expected output:
```
---------------------------------------------------
🛡️  SHIELDCORE NEURAL ENGINE v10.8 ONLINE
---------------------------------------------------
Registry: http://localhost:5000/history
Audit:    http://localhost:5000/logs
---------------------------------------------------
```

### Terminal 2 — Start the Frontend

```bash
cd frontend
npm start
```

The application opens automatically at **[http://localhost:3000](http://localhost:3000)**

> **Login credentials:** `admin` / `admin123`

---

## 🔧 Environment Variables

Create a `.env` file in the `frontend/` directory if you need to override the default API URL:

```env
REACT_APP_API_URL=http://localhost:5000
```

For the backend, the default port can be configured:

```env
PORT=5000
```

> The frontend is pre-configured to point to `http://localhost:5000`. No additional setup is required for local development.

---

## 🧪 Testing

GovShield AI includes unit tests covering critical fraud detection logic, API endpoint validation, and edge case handling.

```bash
# Run frontend tests
cd frontend
npm test

# Run backend tests
cd backend
npm test
```

**Test coverage includes:**
- Aadhaar structural validation
- Debt-to-income ratio thresholds
- Address cluster detection logic
- Duplicate identity (Sybil) detection
- API response schema validation

---

## 📐 Scalability

GovShield AI is designed with scalability in mind to support deployment at district, state, or national government scale.

### Horizontal Scaling
The backend API is **stateless by design**, enabling multiple instances to run behind a load balancer (e.g., Nginx, AWS ALB). Session data can be externalized to Redis for distributed deployments.

```
Load Balancer
├── Backend Instance 1 (Port 5000)
├── Backend Instance 2 (Port 5001)
└── Backend Instance 3 (Port 5002)
```

### Vertical Scaling
The fraud detection engine is CPU-bound and benefits directly from increased compute resources. Upgrading server CPU and RAM linearly improves throughput for high-volume scan operations.

---

## 🔒 Security

| Measure | Implementation |
|---------|---------------|
| Authentication | JWT-based session tokens (production-ready extension) |
| Input Validation | Server-side validation on all API endpoints |
| Transport Security | HTTPS-ready — deploy behind SSL termination proxy |
| Role-Based Access | Differentiated permissions for officers, analysts, admins |
| CORS Policy | Configured to restrict cross-origin requests to trusted origins |
| Audit Logging | All scan events logged with timestamps and operator identity |

---

## 🔭 Future Scope

- 🤖 **ML Anomaly Detection** — replace rule-based scoring with trained classification models (XGBoost, Random Forest) for adaptive fraud detection
- 🏛️ **Government Database Integration** — direct API connections to Aadhaar UIDAI, DigiLocker, and income tax databases for real-time verification
- 📱 **Mobile Officer App** — React Native companion app for field verification and on-site scanning
- 🌐 **Multi-Language Dashboard** — support for regional Indian languages to improve accessibility across states
- 🔔 **Predictive Alerts** — proactive notifications when fraud probability spikes in a region or scheme category
- 📊 **Advanced Reporting** — scheduled PDF reports, inter-department data sharing, and compliance exports
- 🗄️ **Persistent Database** — PostgreSQL or MongoDB integration to replace in-memory storage for production deployments

---

## 👥 Team

<div align="center">

### 🧠 Neural FusionX

*FusionX Hackathon 2026 — Big Data & Data Science Track*

</div>

---

## 📄 License

This project is submitted as part of **FusionX Hackathon 2026** and is intended for educational and demonstration purposes.

```
MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software.
```

---

<div align="center">

**Built with 🛡️ by Team Neural FusionX · FusionX Hackathon 2026**

*Protecting public resources through intelligent fraud detection.*

</div>
