# Wizard of Oz Control Panel

A simple control interface for researchers to trigger parking simulation events during experiments.

## Purpose

This Wizard of Oz (WoZ) interface allows researchers to remotely control parking simulation scenarios without users knowing. It provides a clean, simple interface to trigger the parking session start event that notifies both the mobile app and infotainment system.

## Features

- **Simple Control**: One-button interface to start parking simulation
- **Connection Status**: Real-time WebSocket connection indicator
- **Clean Design**: Minimalist UI focused on essential controls

## Usage

### Local Development

```bash
# Install dependencies
npm install

# Start development server (runs on port 5174)
npm run dev
```

Access at: http://localhost:5174

### Docker

The WoZ interface is included in the main docker-compose setup:

```bash
# From project root
docker-compose up wizard-of-oz
```

Access at: http://localhost:3003

### Controls

- **Start Parking Simulation**: Sends a `START_SESSION` event to the backend, which triggers:
  - Infotainment system to navigate to session started screen
  - Mobile app to receive parking notifications

## Architecture

The WoZ interface connects to the same WebSocket backend as the other clients:
- Registers as `wizard-of-oz` client type
- Sends `START_SESSION` events to trigger simulations
- Displays real-time connection status

## Environment Variables

- `VITE_WS_URL`: WebSocket server URL (default: `ws://localhost:3001` for local, production URL for deployed)

## Notes

- This interface is for **research use only**
- Designed to be used by experimenters, not study participants
- All actions are logged in the browser console for debugging
