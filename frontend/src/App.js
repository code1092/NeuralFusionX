import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Pie, Line } from "react-chartjs-2";
import "chart.js/auto";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for Leaflet default marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// ---------------------------------------------------------
// 1. GLOBAL LEGEND STYLES & ANIMATIONS
// ---------------------------------------------------------
const injectLegendStyles = () => {
  if (typeof document === "undefined") return;
  const style = document.createElement("style");
  style.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;500;700&family=Inter:wght@300;400;700;900&display=swap');
    
    body { margin: 0; font-family: 'Inter', sans-serif; overflow-x: hidden; }
    
    @keyframes scanline { 0% { bottom: 100%; } 100% { bottom: 0%; } }
    @keyframes glow { 0% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.2); } 50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.6); } 100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.2); } }
    @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
    @keyframes typing { from { width: 0 } to { width: 100% } }
    
    .legend-card { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); position: relative; overflow: hidden; }
    .legend-card:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(0,0,0,0.3); border-color: rgba(59, 130, 246, 0.5) !important; }
    
    .terminal-text { overflow: hidden; white-space: nowrap; border-right: 2px solid #3b82f6; animation: typing 3s steps(40, end), blink-caret .75s step-end infinite; }
    @keyframes blink-caret { from, to { border-color: transparent } 50% { border-color: #3b82f6 } }
    
    .glass-nav { backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.1); }
    .neon-text { text-shadow: 0 0 10px rgba(59, 130, 246, 0.8); }
    
    .custom-scroll::-webkit-scrollbar { width: 6px; }
    .custom-scroll::-webkit-scrollbar-track { background: transparent; }
    .custom-scroll::-webkit-scrollbar-thumb { background: #3b82f6; border-radius: 10px; }
    
    .leaflet-container { background: #f0f4f8 !important; border-radius: 15px; }

    .dashboard-bg {
      background-image: linear-gradient(rgba(5, 7, 10, 0.9), rgba(5, 7, 10, 0.9)), url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2000');
      background-size: cover;
      background-attachment: fixed;
      background-position: center;
    }

    .light-dashboard-bg {
      background-image: linear-gradient(rgba(240, 244, 248, 0.9), rgba(240, 244, 248, 0.9)), url('https://www.transparenttextures.com/patterns/cubes.png');
    }
  `;
  document.head.appendChild(style);
};
injectLegendStyles();

export default function App() {
  // ---------------------------------------------------------
  // 2. CORE SYSTEM STATE
  // ---------------------------------------------------------
  const [loggedIn, setLoggedIn] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [user, setUser] = useState({ username: "", password: "" });
  const [savedUser, setSavedUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [records, setRecords] = useState(JSON.parse(localStorage.getItem("records")) || []);
  const [liveFeed, setLiveFeed] = useState(JSON.parse(localStorage.getItem("liveFeed")) || []);
  const [history, setHistory] = useState(JSON.parse(localStorage.getItem("history")) || []);
  
  const [result, setResult] = useState(null);
  const [search, setSearch] = useState("");
  const [dark, setDark] = useState(true);
  const [loading, setLoading] = useState(false);
  const [terminalMsg, setTerminalMsg] = useState("System Standby...");

  const [form, setForm] = useState({
    name: "", aadhaar: "", income: "", age: "", address: "",
    mobile: "", email: "", bank: "", applicantType: "",
    scheme: "", loanAmount: "", applications: ""
  });

  // ---------------------------------------------------------
  // 3. SYSTEM LOGIC
  // ---------------------------------------------------------
  const handleLogout = () => {
    setLoggedIn(false);
    setResult(null);
    setTerminalMsg("Session Terminated. Secure Logout Complete.");
  };

  const downloadReport = () => {
    if (!result) return alert("Generate an analysis first!");
    const reportData = `
      SHIELD-AI FRAUD ANALYSIS REPORT
      --------------------------------
      TIMESTAMP: ${new Date().toLocaleString()}
      APPLICANT: ${form.name}
      AADHAAR: ${form.aadhaar}
      RISK SCORE: ${result.riskScore}%
      STATUS: ${result.status}
      CONFIDENCE: ${result.confidence}
      --------------------------------
      EXPLANATION: ${result.explanation}
      --------------------------------
      RECOMMENDATION: ${result.riskScore > 70 ? "REJECT" : "APPROVE"}
    `;
    const element = document.createElement("a");
    const file = new Blob([reportData], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Report_${form.name}.txt`;
    document.body.appendChild(element);
    element.click();
    setTerminalMsg("Report Generated and Exported.");
  };

  const handleSignup = () => {
    setSavedUser(user);
    setTerminalMsg("New User Encrypted and Saved...");
    alert("Biometric Data Registered.");
    setIsSignup(false);
  };

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      if (savedUser && user.username === savedUser.username && user.password === savedUser.password) {
        setLoggedIn(true);
        setTerminalMsg("Secure Session Established. Welcome Operator.");
      } else {
        alert("ACCESS DENIED: Unauthorized Credentials.");
      }
      setLoading(false);
    }, 1500);
  };

  const handleAdminToggle = () => {
    const u = prompt("ADMIN ID:");
    const p = prompt("SECURITY TOKEN:");
    if (u === "admin" && p === "admin123") {
      setIsAdmin(!isAdmin);
    } else alert("FIREWALL ACTIVE: Identification Failed.");
  };

  const handleDelete = (index) => {
    const updated = records.filter((_, i) => i !== index);
    setRecords(updated);
    localStorage.setItem("records", JSON.stringify(updated));
  };

  const handleClearAll = () => {
    if (window.confirm("CRITICAL: Execute data wipe? This cannot be undone.")) {
      setRecords([]); setLiveFeed([]); setHistory([]); localStorage.clear();
      setTerminalMsg("Database Purged Successfully.");
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setTerminalMsg("Scanning database for discrepancies...");
    try {
      const res = await axios.post("http://localhost:5000/check-fraud", form);
      const newRecord = {
        ...form, ...res.data,
        location: { lat: 12.97 + Math.random() * 0.08, lng: 77.59 + Math.random() * 0.08 }
      };

      setTimeout(() => {
        setResult(res.data);
        setRecords(prev => {
          const u = [...prev, newRecord];
          localStorage.setItem("records", JSON.stringify(u));
          return u;
        });
        setHistory(prev => {
          const u = [...prev, res.data.riskScore];
          localStorage.setItem("history", JSON.stringify(u));
          return u;
        });
        setLiveFeed(prev => {
          const u = [{ time: new Date().toLocaleTimeString(), ...res.data, name: form.name }, ...prev].slice(0, 10);
          localStorage.setItem("liveFeed", JSON.stringify(u));
          return u;
        });
        setLoading(false);
        setTerminalMsg("Analysis Complete: Threat Level Evaluated.");
      }, 2000);
    } catch {
      alert("NETWORK FAILURE: AI Server Node Offline.");
      setLoading(false);
    }
  };

  const fraud = records.filter(r => r.riskScore > 70).length;
  const safe = records.length - fraud;

  const theme = {
    bg: dark ? "#05070a" : "#f0f4f8",
    card: dark ? "rgba(13, 17, 23, 0.85)" : "rgba(255, 255, 255, 0.9)",
    input: dark ? "rgba(22, 27, 34, 0.8)" : "#ffffff",
    text: dark ? "#e6edf3" : "#1f2328",
    accent: "#3b82f6",
    border: dark ? "rgba(48, 54, 61, 0.8)" : "rgba(208, 215, 222, 0.5)",
    panel: dark ? "#0d1117" : "#ffffff"
  };

  // ---------------------------------------------------------
  // 4. LOGIN PAGE (CYBER VERSION)
  // ---------------------------------------------------------
  if (!loggedIn) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginBgOverlay} />
        <div style={{...styles.loginCard, ...styles.glass}} className="legend-card">
          <div style={styles.chip} />
          <h1 style={styles.loginTitle}>NEURALFUSION<span style={{color: '#3b82f6'}}> DETECTION </span></h1>
          <p style={styles.loginSub}>ADVANCED NEURAL FRAUD PROTECTION</p>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>OPERATOR USERNAME</label>
            <input 
              style={styles.loginInput} 
              placeholder="System Identity..." 
              onChange={e => setUser({ ...user, username: e.target.value })} 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>SECURITY KEY</label>
            <input 
              type="password" 
              style={styles.loginInput} 
              placeholder="••••••••" 
              onChange={e => setUser({ ...user, password: e.target.value })} 
            />
          </div>

          <button 
            style={styles.loginBtn} 
            onClick={isSignup ? handleSignup : handleLogin}
            disabled={loading}
          >
            {loading ? "INITIALIZING..." : isSignup ? "CREATE OPERATOR" : "ESTABLISH LINK"}
          </button>

          <p 
            style={styles.toggleText} 
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? "Back to Login Portal" : "New Operator? Register Credentials"}
          </p>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------
  // 5. MAIN DASHBOARD UI
  // ---------------------------------------------------------
  return (
    <div style={{ ...styles.app, color: theme.text }} className={dark ? "dashboard-bg" : "light-dashboard-bg"}>
      
      {/* ADVANCED HEADER */}
      <nav style={styles.nav} className="glass-nav">
        <div style={styles.navLeft}>
          <div style={styles.pulseDot} />
          <h2 style={styles.navLogo}>SHIELD<span style={{color: '#3b82f6'}}>CORE</span></h2>
          <div style={styles.terminalMini}>
            <span style={{color: '#3b82f6', marginRight: 8}}>$</span>
            <span className="terminal-text">{terminalMsg}</span>
          </div>
        </div>
        <div style={styles.navRight}>
          <div style={styles.navStat}>
            <small>UPTIME</small>
            <span>99.9%</span>
          </div>
          <button onClick={() => setDark(!dark)} style={styles.themeBtn}>
            {dark ? "☀️" : "🌙"}
          </button>
          <button onClick={handleAdminToggle} style={isAdmin ? styles.adminBtnActive : styles.adminBtn}>
            {isAdmin ? "🔒 ADMIN" : "🔓 USER"}
          </button>
          <button onClick={handleLogout} style={styles.logoutBtn}>LOGOUT ⏻</button>
        </div>
      </nav>

      <div style={styles.mainContent}>
        
        {/* TOP STATISTICS GRID */}
        {isAdmin && (
          <div style={styles.statsGrid}>
            <div style={styles.statCard(theme, "#3b82f6")} className="legend-card">
              <span style={styles.statTitle}>SCANNED ENTITIES</span>
              <h2 style={styles.statVal}>{records.length}</h2>
              <div style={styles.statTrend}>+12% vs last cycle</div>
            </div>
            <div style={styles.statCard(theme, "#ef4444")} className="legend-card">
              <span style={styles.statTitle}>CRITICAL THREATS</span>
              <h2 style={styles.statVal}>{fraud}</h2>
              <div style={{...styles.statTrend, color: "#ef4444"}}>Infiltration detected</div>
            </div>
            <div style={styles.statCard(theme, "#22c55e")} className="legend-card">
              <span style={styles.statTitle}>VERIFIED LEGITIMATE</span>
              <h2 style={styles.statVal}>{safe}</h2>
              <div style={{...styles.statTrend, color: "#22c55e"}}>Integrity Stable</div>
            </div>
          </div>
        )}

        <div style={styles.dashboardGrid}>
          
          {/* LEFT COLUMN: FORM & ANALYSIS */}
          <div style={styles.leftCol}>
            
            <div style={styles.cardLegend(theme)} className="legend-card">
              <h3 style={styles.cardHeader}>ENTITY DATA INPUT</h3>
              <div style={styles.formGrid}>
                <div style={styles.inputWrap}>
                  <label style={styles.label}>FULL NAME</label>
                  <input style={styles.input(theme)} placeholder="Legal Identity" onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div style={styles.inputWrap}>
                  <label style={styles.label}>AADHAAR ID</label>
                  <input style={styles.input(theme)} placeholder="0000 0000 0000" onChange={e => setForm({ ...form, aadhaar: e.target.value })} />
                </div>
                <div style={styles.inputWrap}>
                  <label style={styles.label}>ANNUAL INCOME</label>
                  <input style={styles.input(theme)} placeholder="₹ Value" onChange={e => setForm({ ...form, income: e.target.value })} />
                </div>
                <div style={styles.inputWrap}>
                  <label style={styles.label}>AGE</label>
                  <input style={styles.input(theme)} placeholder="Years" onChange={e => setForm({ ...form, age: e.target.value })} />
                </div>
              </div>

              <div style={{...styles.formGrid, marginTop: 20}}>
                <div style={styles.inputWrap}>
                  <label style={styles.label}>PARTNER BANK</label>
                  <select style={styles.input(theme)} onChange={e => setForm({ ...form, bank: e.target.value })}>
                    <option>Select Bank</option><option>HDFC</option><option>SBI</option><option>ICICI</option><option>PNB</option>
                  </select>
                </div>
                <div style={styles.inputWrap}>
                  <label style={styles.label}>LOAN SCHEME</label>
                  <select style={styles.input(theme)} onChange={e => setForm({ ...form, scheme: e.target.value })}>
                    <option>Select Program</option><option>PMAY (Housing)</option><option>Mudra Loan</option><option>Pension</option>
                  </select>
                </div>
              </div>

              <div style={{...styles.formGrid, marginTop: 20}}>
                <div style={styles.inputWrap}>
                  <label style={styles.label}>MOBILE</label>
                  <input style={styles.input(theme)} placeholder="+91" onChange={e => setForm({ ...form, mobile: e.target.value })} />
                </div>
                <div style={styles.inputWrap}>
                  <label style={styles.label}>SECURE EMAIL</label>
                  <input style={styles.input(theme)} placeholder="name@domain.com" onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
              </div>

              <button 
                style={styles.analyzeBtn(loading)} 
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "PROCESSING NEURAL SCAN..." : "INITIATE FRAUD ANALYSIS"}
              </button>
            </div>

            {/* LIVE DATA REGISTRY */}
            <div style={{...styles.cardLegend(theme), marginTop: 25}} className="legend-card">
              <div style={styles.registryHeader}>
                <h3 style={styles.cardHeader}>PROTECTED REGISTRY</h3>
                <div style={styles.registryActions}>
                  <input 
                    placeholder="Search Identity..." 
                    style={styles.searchBox(theme)} 
                    onChange={e => setSearch(e.target.value)} 
                  />
                  <button style={styles.purgeBtn} onClick={handleClearAll}>PURGE</button>
                </div>
              </div>
              <div style={styles.tableContainer} className="custom-scroll">
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.thRow(theme)}>
                      <th style={styles.th}>ENTITY</th>
                      <th style={styles.th}>SCHEME</th>
                      <th style={styles.th}>INCOME</th>
                      <th style={styles.th}>RISK SCORE</th>
                      <th style={styles.th}>STATUS</th>
                      <th style={styles.th}>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records
                      .filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.aadhaar.includes(search))
                      .map((r, i) => (
                        <tr key={i} style={styles.tr(theme)}>
                          <td style={styles.td}><b>{r.name}</b><br/><small>{r.aadhaar}</small></td>
                          <td style={styles.td}>{r.scheme}</td>
                          <td style={styles.td}>₹{r.income}</td>
                          <td style={styles.td}>
                            <div style={styles.tableRisk(r.riskScore)}>
                              {r.riskScore}%
                            </div>
                          </td>
                          <td style={styles.td}>
                            <span style={styles.statusBadge(r.riskScore)}>{r.status}</span>
                          </td>
                          <td style={styles.td}>
                            <button style={styles.delBtn} onClick={() => handleDelete(i)}>🗑️</button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: RESULTS, MAP & FEED */}
          <div style={styles.rightCol}>
            
            {/* AI SCAN RESULT */}
            {result ? (
              <div style={styles.cardLegend(theme)} className="legend-card">
                <div style={styles.resultHeader}>
                  <h3 style={{...styles.cardHeader, margin: 0}}>ANALYSIS REPORT</h3>
                  <div style={styles.scoreCircle(result.riskScore)}>
                    {result.riskScore}%
                  </div>
                </div>

                <div style={styles.riskMeterContainer}>
                  <div style={styles.riskMeterFill(result.riskScore)} />
                </div>

                <div style={styles.resultDetails}>
                  <div style={styles.resultItem}>
                    <span>STATUS:</span>
                    <b style={{color: result.riskScore > 70 ? "#ef4444" : "#22c55e"}}>{result.status.toUpperCase()}</b>
                  </div>
                  <div style={styles.resultItem}>
                    <span>CONFIDENCE:</span>
                    <b>{result.confidence}</b>
                  </div>
                </div>

                <h4 style={styles.subHeader}>DETECTED ANOMALIES</h4>
                <div style={styles.tagGrid}>
                  {result.tags.map((t, i) => <span key={i} style={styles.tag}>{t}</span>)}
                </div>

                <div style={styles.aiExplanation(theme)}>
                  <small style={{color: '#3b82f6', fontWeight: 'bold'}}>SHIELD-AI SYSTEM LOG:</small>
                  <p style={{fontSize: '0.85rem', marginTop: 5}}>{result.explanation}</p>
                </div>

                <div style={{display: 'flex', gap: 10}}>
                  <div style={{...styles.recommendation(result.riskScore), flex: 1}}>
                    {result.riskScore > 70 ? "ACTION: REJECT" : "ACTION: VERIFIED"}
                  </div>
                  <button onClick={downloadReport} style={styles.downloadBtn}>DOWNLOAD REPORT ↓</button>
                </div>
              </div>
            ) : (
              <div style={styles.emptyState(theme)}>
                <div style={styles.radarEffect} />
                <p>AWAITING ANALYSIS INPUT</p>
              </div>
            )}

            {/* GEOSPATIAL THREAT MAP - FIXED VISIBILITY */}
            <div style={{...styles.cardLegend(theme), marginTop: 25}} className="legend-card">
              <h3 style={styles.cardHeader}>GEOSPATIAL THREAT MAP</h3>
              <div style={styles.mapWrap}>
                <MapContainer center={[12.97, 77.59]} zoom={12} style={{ height: "100%", width: "100%", borderRadius: 15 }}>
                  <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                  {records.map((r, j) => (
                    <Marker key={j} position={[r.location.lat, r.location.lng]}>
                      <Popup>
                        <b style={{color: '#1f2328'}}>{r.name}</b><br/>
                        <span style={{color: '#1f2328'}}>Risk: {r.riskScore}%</span><br/>
                        <span style={{color: '#1f2328'}}>Status: {r.status}</span>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>

            {/* GLOBAL LIVE FEED */}
            <div style={{...styles.cardLegend(theme), marginTop: 25}} className="legend-card">
              <h3 style={styles.cardHeader}>LIVE FEED</h3>
              <div style={styles.feedScroll} className="custom-scroll">
                {liveFeed.map((f, k) => (
                  <div key={k} style={styles.feedItem(theme, f.riskScore)}>
                    <div style={styles.feedStatus(f.riskScore)} />
                    <div style={{flex: 1}}>
                      <small style={{opacity: 0.6}}>{f.time}</small>
                      <div style={{fontWeight: 'bold'}}>{f.name}</div>
                    </div>
                    <div style={{textAlign: 'right'}}>
                      <div style={{fontSize: '0.7rem', fontWeight: 'bold'}}>{f.status}</div>
                      <div style={{fontSize: '0.8rem', color: f.riskScore > 70 ? "#ef4444" : "#22c55e"}}>{f.riskScore}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ANALYTICS CHARTS */}
        <div style={styles.chartGrid}>
          <div style={styles.cardLegend(theme)} className="legend-card">
            <h3 style={styles.cardHeader}>DISTRIBUTION ANALYSIS</h3>
            <div style={{height: 250}}>
              <Pie data={{ 
                labels: ["Threats", "Integrity Safe"], 
                datasets: [{ 
                  data: [fraud, safe],
                  backgroundColor: ["#ef4444", "#3b82f6"],
                  borderColor: theme.panel,
                  borderWidth: 5
                }] 
              }} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
          <div style={styles.cardLegend(theme)} className="legend-card">
            <h3 style={styles.cardHeader}>THREAT SCORE HISTORY</h3>
            <div style={{height: 250}}>
              <Bar data={{ 
                labels: history.map((_, i) => `Scan ${i+1}`), 
                datasets: [{ 
                  label: "Risk Score",
                  data: history,
                  backgroundColor: "#3b82f6",
                  borderRadius: 8
                }] 
              }} options={{ maintainAspectRatio: false, scales: { y: { display: false }, x: { grid: { display: false } } } }} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ---------------------------------------------------------
// 6. COMPREHENSIVE STYLES OBJECT (PRO LEGEND VERSION)
// ---------------------------------------------------------
const styles = {
  app: { minHeight: "100vh", transition: "all 0.3s ease" },
  loginContainer: {
    height: "100vh", display: "flex", justifyContent: "center", alignItems: "center",
    backgroundImage: `url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2000')`,
    backgroundSize: 'cover', backgroundPosition: 'center'
  },
  loginBgOverlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(2, 6, 23, 0.85)' },
  loginCard: { width: 420, padding: 45, borderRadius: 30, textAlign: 'center', zIndex: 10, position: 'relative', border: '1px solid rgba(255,255,255,0.1)' },
  chip: { width: 40, height: 30, background: 'linear-gradient(135deg, #ffd700, #b8860b)', borderRadius: 5, margin: '0 auto 20px', boxShadow: '0 0 15px rgba(255, 215, 0, 0.3)' },
  loginTitle: { fontSize: '2.5rem', fontWeight: 900, color: 'white', margin: 0, letterSpacing: -2 },
  loginSub: { fontSize: '0.7rem', color: '#3b82f6', fontWeight: 900, letterSpacing: 3, marginBottom: 40 },
  inputGroup: { textAlign: 'left', marginBottom: 20 },
  label: { fontSize: '0.65rem', fontWeight: 900, color: '#3b82f6', letterSpacing: 1.5, marginBottom: 8, display: 'block' },
  loginInput: { width: '100%', padding: '15px 0', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.2)', color: 'white', outline: 'none', fontSize: '1rem' },
  loginBtn: { width: '100%', padding: 18, borderRadius: 12, border: 'none', background: '#3b82f6', color: 'white', fontWeight: 'bold', fontSize: '1rem', marginTop: 30, cursor: 'pointer', transition: '0.3s', boxShadow: '0 10px 20px rgba(59, 130, 246, 0.3)' },
  toggleText: { color: 'white', opacity: 0.6, fontSize: '0.85rem', marginTop: 25, cursor: 'pointer' },
  glass: { backdropFilter: 'blur(15px)', backgroundColor: 'rgba(15, 23, 42, 0.7)' },
  
  nav: { height: 80, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 40px', position: 'fixed', top: 0, width: '100%', boxSizing: 'border-box', zIndex: 100 },
  navLeft: { display: 'flex', alignItems: 'center', gap: 20 },
  pulseDot: { width: 10, height: 10, backgroundColor: '#22c55e', borderRadius: '50%', boxShadow: '0 0 10px #22c55e' },
  navLogo: { fontSize: '1.4rem', fontWeight: 900, margin: 0, letterSpacing: -1 },
  terminalMini: { backgroundColor: 'rgba(0,0,0,0.3)', padding: '8px 15px', borderRadius: 8, fontSize: '0.75rem', fontFamily: 'monospace', display: 'flex', alignItems: 'center' },
  navRight: { display: 'flex', alignItems: 'center', gap: 15 },
  navStat: { textAlign: 'right', display: 'flex', flexDirection: 'column' },
  themeBtn: { padding: 10, borderRadius: 10, border: 'none', background: 'rgba(150,150,150,0.1)', cursor: 'pointer', fontSize: '1.2rem' },
  adminBtn: { padding: '10px 15px', borderRadius: 10, border: 'none', background: '#334155', color: 'white', fontWeight: 'bold', cursor: 'pointer' },
  adminBtnActive: { padding: '10px 15px', borderRadius: 10, border: 'none', background: '#ef4444', color: 'white', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 0 15px #ef4444' },
  logoutBtn: { padding: '10px 15px', borderRadius: 10, border: '1px solid #ef4444', background: 'transparent', color: '#ef4444', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' },

  mainContent: { padding: '120px 40px 40px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 25, marginBottom: 25 },
  statCard: (theme, color) => ({
    backgroundColor: theme.card, padding: 30, borderRadius: 24, border: `1px solid ${theme.border}`, borderLeft: `8px solid ${color}`
  }),
  statTitle: { fontSize: '0.7rem', fontWeight: 900, opacity: 0.6, letterSpacing: 1.5 },
  statVal: { fontSize: '2.5rem', margin: '10px 0', fontWeight: 900 },
  statTrend: { fontSize: '0.75rem', color: '#22c55e', fontWeight: 'bold' },

  dashboardGrid: { display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 25 },
  leftCol: {},
  rightCol: {},
  
  cardLegend: (theme) => ({
    backgroundColor: theme.card, padding: 35, borderRadius: 28, border: `1px solid ${theme.border}`, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
  }),
  cardHeader: { fontSize: '1.1rem', fontWeight: 900, letterSpacing: -0.5, marginBottom: 25, color: '#3b82f6' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
  inputWrap: { display: 'flex', flexDirection: 'column', gap: 8 },
  input: (theme) => ({
    padding: '14px 18px', borderRadius: 12, border: `1px solid ${theme.border}`, backgroundColor: theme.input, color: theme.text, fontSize: '0.9rem', outline: 'none'
  }),
  analyzeBtn: (loading) => ({
    width: '100%', padding: 18, borderRadius: 14, marginTop: 30, border: 'none', 
    background: loading ? '#475569' : 'linear-gradient(90deg, #3b82f6, #2563eb)',
    color: 'white', fontWeight: 900, cursor: 'pointer', letterSpacing: 1
  }),

  registryHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  registryActions: { display: 'flex', gap: 10 },
  searchBox: (theme) => ({ padding: '10px 15px', borderRadius: 10, border: `1px solid ${theme.border}`, backgroundColor: theme.input, color: theme.text, fontSize: '0.85rem' }),
  purgeBtn: { backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '10px 15px', borderRadius: 10, fontWeight: 'bold', cursor: 'pointer' },
  tableContainer: { maxHeight: 400, overflowY: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thRow: (theme) => ({ borderBottom: `2px solid ${theme.border}` }),
  th: { textAlign: 'left', padding: 15, fontSize: '0.7rem', opacity: 0.5, fontWeight: 900 },
  tr: (theme) => ({ borderBottom: `1px solid ${theme.border}` }),
  td: { padding: '18px 15px', fontSize: '0.85rem' },
  statusBadge: (score) => ({
    padding: '4px 10px', borderRadius: 6, fontSize: '0.65rem', fontWeight: 900,
    backgroundColor: score > 70 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
    color: score > 70 ? '#ef4444' : '#22c55e'
  }),
  tableRisk: (score) => ({ fontWeight: 'bold', color: score > 70 ? "#ef4444" : "#3b82f6" }),
  delBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' },

  resultHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  scoreCircle: (score) => ({
    width: 60, height: 60, borderRadius: '50%', border: `4px solid ${score > 70 ? "#ef4444" : "#22c55e"}`,
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.2rem'
  }),
  riskMeterContainer: { height: 10, backgroundColor: 'rgba(150,150,150,0.1)', borderRadius: 10, margin: '20px 0', overflow: 'hidden' },
  riskMeterFill: (score) => ({
    width: `${score}%`, height: '100%', backgroundColor: score > 70 ? "#ef4444" : "#22c55e", transition: 'width 1.5s ease'
  }),
  resultDetails: { display: 'flex', flexDirection: 'column', gap: 10, margin: '20px 0' },
  resultItem: { display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' },
  subHeader: { fontSize: '0.8rem', fontWeight: 900, opacity: 0.6, marginBottom: 15 },
  tagGrid: { display: 'flex', flexWrap: 'wrap', gap: 10 },
  tag: { padding: '6px 12px', borderRadius: 8, backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', fontSize: '0.75rem', fontWeight: 'bold' },
  aiExplanation: (theme) => ({
    marginTop: 25, padding: 20, borderRadius: 15, backgroundColor: theme.panel, borderLeft: '4px solid #3b82f6'
  }),
  recommendation: (score) => ({
    marginTop: 20, padding: 15, textAlign: 'center', borderRadius: 12, fontWeight: 900,
    backgroundColor: score > 70 ? '#fee2e2' : '#dcfce7', color: score > 70 ? '#b91c1c' : '#15803d',
    fontSize: '0.8rem'
  }),
  downloadBtn: { marginTop: 20, padding: 15, borderRadius: 12, border: 'none', background: '#3b82f6', color: 'white', fontWeight: 900, cursor: 'pointer', fontSize: '0.8rem' },
  emptyState: (theme) => ({
    height: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
    border: `2px dashed ${theme.border}`, borderRadius: 25, color: theme.text, opacity: 0.3
  }),
  mapWrap: { height: 350, borderRadius: 20, overflow: 'hidden', marginTop: 10 },
  feedScroll: { maxHeight: 300, overflowY: 'auto' },
  feedItem: (theme, score) => ({
    display: 'flex', gap: 15, padding: '15px 0', borderBottom: `1px solid ${theme.border}`, alignItems: 'center'
  }),
  feedStatus: (score) => ({ width: 8, height: 8, borderRadius: '50%', backgroundColor: score > 70 ? "#ef4444" : "#22c55e" }),
  chartGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 25, marginTop: 25 }
};