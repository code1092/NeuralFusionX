# NeuralFusion Fraud Detection System

An AI-powered fraud detection dashboard for government scheme applications. It analyzes applicant data in real time and flags suspicious activity using rule-based risk scoring.

---

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- npm (comes with Node.js)

---

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd <project-folder>
```
### Make sure to split the terminal into two and in each terminal perform step 2 and step 3 seperately.
### 2. Start the Backend

```bash
cd backend
npm install
node server.js
```

The backend runs on `http://localhost:5000`. You should see:

```
🔥 Advanced Fraud Detection Server running on port 5000
```

### 3. Start the Frontend

Open a new terminal window:

```bash
cd frontend
npm install
npm start
```

The app opens at `http://localhost:3000` in your browser.

---

## Using the Interface

### Login / Register

- On first launch, click **"New Operator? Register Credentials"** to create an account.
- Enter a username and password, then click **"CREATE OPERATOR"**.
- Switch back to login and use those credentials to sign in.

### Submitting an Application for Analysis

Fill in the form fields on the left panel:

| Field | Description |
|---|---|
| Full Name | Applicant's legal name |
| Aadhaar ID | Must be exactly 12 digits |
| Annual Income | Declared income in ₹ |
| Age | Applicant's age |
| Mobile | 10-digit mobile number |
| Secure Email | Valid email address |
| Partner Bank | Select from HDFC, SBI, ICICI, PNB |
| Loan Scheme | Select the government scheme |

Click **"INITIATE FRAUD ANALYSIS"** to submit. Results appear on the right panel.

### Reading the Analysis Report

- **Risk Score (0–100%)** — higher means more suspicious
- **Status** — one of: `Safe ✅`, `Suspicious ⚠️`, or `Fraud 🚨`
- **Confidence** — model's certainty level
- **Detected Anomalies** — tags explaining what triggered the risk score
- **SHIELD-AI System Log** — plain-language explanation of the result
- **Action** — `VERIFIED` (approve) or `REJECT`

Click **"DOWNLOAD REPORT ↓"** to save the result as a `.txt` file.

### Admin Mode

Click the **🔓 USER** button in the top-right and enter:

- Admin ID: `admin`
- Security Token: `admin123`

Admin mode unlocks the stats panel showing total scans, fraud count, and verified count.

### Other Features

- **Search** — filter the registry table by name or Aadhaar number
- **Delete** — remove individual records with the 🗑️ button
- **PURGE** — wipe all stored data (irreversible)
- **Geospatial Map** — shows approximate locations of submitted applications
- **Live Feed** — real-time log of the last 10 analyses
- **Charts** — pie chart (fraud vs safe) and bar chart (risk score history)
- **Theme Toggle** — switch between dark and light mode using ☀️ / 🌙

---

## Project Structure

```
├── backend/
│   ├── server.js       # Express API with fraud detection logic
│   └── package.json
└── frontend/
    ├── src/
    │   └── App.js      # Full React dashboard UI
    └── package.json
```

---

## API Reference

`POST /check-fraud`

Accepts a JSON body with applicant fields and returns:

```json
{
  "riskScore": 75,
  "status": "Fraud 🚨",
  "level": "High Risk 🔴",
  "confidence": "97%",
  "reasons": ["Invalid Aadhaar format", "..."],
  "tags": ["Identity Fraud", "..."],
  "explanation": "This application is classified as..."
}
```
