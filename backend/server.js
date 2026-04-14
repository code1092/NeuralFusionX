const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// In-memory storage
let applications = [];

// Test route
app.get("/", (req, res) => {
  res.send("🚀 Advanced AI Fraud Detection Server Running");
});

// MAIN API
app.post("/check-fraud", (req, res) => {
  const data = req.body;

  let risk = 0;
  let reasons = [];
  let tags = [];

  // Normalize values
  const income = Number(data.income) || 0;
  const age = Number(data.age) || 0;
  const loan = Number(data.loanAmount) || 0;
  const applicationsCount = Number(data.applications) || 0;

  // =========================
  // 🔍 IDENTITY VALIDATION
  // =========================

  if (!data.aadhaar || !/^\d{12}$/.test(data.aadhaar)) {
    risk += 40;
    reasons.push("Invalid Aadhaar format (must be 12 digits)");
    tags.push("Identity Fraud");
  }

  if (data.mobile && !/^\d{10}$/.test(data.mobile)) {
    risk += 20;
    reasons.push("Invalid mobile number");
    tags.push("Fake Contact");
  }

  if (data.email && !data.email.includes("@")) {
    risk += 20;
    reasons.push("Invalid email format");
    tags.push("Fake Identity");
  }

  if (data.bank && data.bank.length < 3) {
    risk += 20;
    reasons.push("Invalid bank selection");
    tags.push("Bank Fraud");
  }

  // =========================
  // 🔁 DUPLICATE CHECKS
  // =========================

  const duplicateAadhaar = applications.find(app => app.aadhaar === data.aadhaar);
  if (duplicateAadhaar) {
    risk += 50;
    reasons.push("Same Aadhaar used multiple times");
    tags.push("Duplicate Identity");
  }

  const duplicateBank = applications.find(
    app => app.bank === data.bank && app.name !== data.name
  );
  if (duplicateBank) {
    risk += 40;
    reasons.push("Same bank account used by different users");
    tags.push("Money Mule");
  }

  // =========================
  // 💰 FINANCIAL ANALYSIS
  // =========================

  if (income > 500000) {
    risk += 30;
    reasons.push("Income exceeds eligibility criteria");
    tags.push("Eligibility Fraud");
  }

  if (income < 10000) {
    risk += 10;
    reasons.push("Very low declared income");
  }

  if (income > 0 && loan > income * 5) {
    risk += 40;
    reasons.push("Loan amount is too high compared to income");
    tags.push("Financial Fraud");
  }

  // =========================
  // 🧠 BEHAVIOR ANALYSIS
  // =========================

  if (applicationsCount > 3) {
    risk += 30;
    reasons.push("Too many applications submitted");
    tags.push("Spam Activity");
  }

  const repeated = applications.filter(app => app.aadhaar === data.aadhaar);
  if (repeated.length > 1) {
    risk += 20;
    reasons.push("Multiple rapid submissions detected");
    tags.push("Behavioral Fraud");
  }

  // =========================
  // 📍 LOCATION ANALYSIS
  // =========================

  const sameAddressCount = applications.filter(
    app => app.address === data.address
  ).length;

  if (sameAddressCount > 2) {
    risk += 20;
    reasons.push("Multiple applications from same address");
    tags.push("Fraud Network");
  }

  if (
    data.address &&
    data.address.toLowerCase().includes("bangalore") &&
    income < 15000
  ) {
    risk += 20;
    reasons.push("Income mismatch with high-cost city");
    tags.push("Anomaly Detection");
  }

  // =========================
  // 👶 AGE VALIDATION
  // =========================

  if (age < 18) {
    risk += 30;
    reasons.push("Applicant is underage");
    tags.push("Invalid Applicant");
  }

  if (age > 70) {
    risk += 15;
    reasons.push("Unusual age for loan application");
    tags.push("Suspicious Profile");
  }

  // =========================
  // 🏛️ GOVERNMENT SCHEME LOGIC (NEW)
  // =========================

  if (data.scheme === "PMAY (Housing)" && income > 300000) {
    risk += 30;
    reasons.push("Income too high for PMAY scheme");
    tags.push("Eligibility Fraud");
  }

  if (data.scheme === "Mudra Loan" && loan > income * 5) {
    risk += 30;
    reasons.push("Loan exceeds Mudra eligibility");
    tags.push("Financial Fraud");
  }

  if (data.scheme === "Pension Scheme" && age < 60) {
    risk += 40;
    reasons.push("Applicant not eligible for pension age");
    tags.push("Invalid Applicant");
  }

  if (data.scheme === "Scholarship" && age > 30) {
    risk += 25;
    reasons.push("Age exceeds scholarship eligibility");
    tags.push("Eligibility Fraud");
  }

  // =========================
  // 🧠 FINAL ADJUSTMENTS
  // =========================

  if (risk > 100) risk = 100;

  if (reasons.length === 0) {
    reasons.push("No suspicious activity detected");
  }

  if (tags.length === 0) {
    tags.push("Normal Behavior");
  }

  // Save application
  applications.push(data);

  // =========================
  // 📊 FINAL STATUS
  // =========================

  let status = "Safe ✅";
  let level = "Low Risk 🟢";

  if (risk > 70) {
    status = "Fraud 🚨";
    level = "High Risk 🔴";
  } else if (risk > 30) {
    status = "Suspicious ⚠️";
    level = "Medium Risk 🟠";
  }

  // Confidence
  let confidence = Math.min(100, 60 + risk / 2) + "%";

  // AI Explanation
  let explanation = `This application is classified as ${status} because ${reasons.join(", ")}.`;

  // FINAL RESPONSE
  res.json({
    riskScore: risk,
    status,
    level,
    confidence,
    reasons,
    tags,
    explanation
  });
});

// START SERVER
app.listen(5000, () => {
  console.log("🔥 Advanced Fraud Detection Server running on port 5000");
});