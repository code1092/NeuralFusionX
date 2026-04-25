import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';
import axios from 'axios';
import App from './App';

// --- 🛡️ EXTREME MOCKS: PREVENT GRAPHICS CRASHES ---
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div>{children}</div>,
  TileLayer: () => null,
  Marker: () => null,
  Popup: ({ children }) => <div>{children}</div>,
}));

jest.mock('react-chartjs-2', () => ({
  Radar: () => <div />, Line: () => <div />, Pie: () => <div />, Bar: () => <div />
}));

jest.mock('axios');

describe('🛡️ SHIELDCORE APEX SYSTEM VALIDATION', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    // Pre-mock all GET requests to prevent hanging
    axios.get.mockResolvedValue({ data: [] });
  });

  const loginAndNavigate = async (tabName = null) => {
    render(<App />);
    
    const idInput = screen.getByPlaceholderText(/Admin ID/i);
    const keyInput = screen.getByPlaceholderText(/Key/i);
    const loginBtn = screen.getByText(/ESTABLISH LINK/i);

    await act(async () => {
      fireEvent.change(idInput, { target: { value: 'admin' } });
      fireEvent.change(keyInput, { target: { value: 'admin123' } });
      fireEvent.click(loginBtn);
    });

    if (tabName) {
      const tab = await screen.findByText(new RegExp(tabName, "i"));
      await act(async () => {
        fireEvent.click(tab);
      });
    }
  };

  test('1. Authentication Gateway providing hub access', async () => {
    await loginAndNavigate();
    const brand = await screen.findByText(/SHIELDCORE/i);
    expect(brand).toBeInTheDocument();
  });

  test('2. Risk Engine UI Integrity (Photo 1 UI)', async () => {
    await loginAndNavigate('Risk Engine');
    const auditTitle = await screen.findByText(/Identity Audit/i);
    expect(auditTitle).toBeInTheDocument();
  });

  test('3. Compliance Terminal State Sync', async () => {
    await loginAndNavigate('Compliance');
    const header = await screen.findByText(/Governance Terminal/i);
    expect(header).toBeInTheDocument();
  });

  test('4. Velocity Pulse Telemetry Load', async () => {
    await loginAndNavigate('Velocity Pulse');
    const telemetry = await screen.findByText(/Biometric Input Velocity/i);
    expect(telemetry).toBeInTheDocument();
  });

  test('5. Forensic Vault Hex Tracing Visibility', async () => {
    await loginAndNavigate('Forensic Vault');
    const vaultHeader = await screen.findByText(/Forensic Packet Vault/i);
    expect(vaultHeader).toBeInTheDocument();
  });

  test('6. Quantum Ledger Decision Chain Integrity', async () => {
    await loginAndNavigate('Quantum Ledger');
    const ledgerHeader = await screen.findByText(/Decision Chain Immutability/i);
    expect(ledgerHeader).toBeInTheDocument();
  });
});