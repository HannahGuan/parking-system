# Parking System - Interactive Prototypes

This is a multi-app interactive parking system prototype project, for **Stanford EE205: Product Development for Computer Scientists and Electrical Engineers**, consisting of:
- **App**: Mobile parking application interface
- **Infotainment**: In-car infotainment system interface
- **WizardOfOz**: Researcher control panel for triggering parking simulations
- **Backend**: WebSocket server enabling real-time communication between all apps

## 🎯 Feature Demo

### Interaction Flow

#### Method 1: Using Wizard of Oz Control Panel (Recommended for Research)

1. **WizardOfOz** → Click "Start Parking Simulation" button
   - **App** automatically navigates to active session page (`/active`)
   - **Infotainment** automatically navigates to session started page (`/session-started`)

2. **WizardOfOz** → Click "User Leaves Car" button
   - **Infotainment** screen goes completely black (`/black-screen`)
   - **App** remains unchanged

3. **WizardOfOz** → Click "User Returns to Car" button
   - **Infotainment** displays session-active page (`/session-active`)
   - **App** remains unchanged

4. **WizardOfOz** → Click "15 Minutes Have Passed" button
   - **App** shows payment notification
   - **Infotainment** remains unchanged

5. **Infotainment (Session Active)** → Click "End Session" button
   - **App** automatically navigates to payment page (`/payment`)
   - **Infotainment** navigates to session end page (`/end-session`)

#### Method 2: Manual Trigger from Infotainment (For Development/Debugging)

1. **Infotainment (Main Page)** → Navigate to parking confirmation
   - **App** can navigate to confirm page (`/confirm`)
   - **Infotainment** goes to parking confirmation page (`/parking-confirmation`)

2. **Infotainment (Parking Confirmation)** → Click "Confirm" button
   - **App** automatically navigates to active session page (`/active`)
   - **Infotainment** navigates to session started page (`/session-started`)

3. **Infotainment (Session Active)** → Click "End Session" button
   - **App** automatically navigates to payment page (`/payment`)
   - **Infotainment** navigates to session end page (`/end-session`)

## 🏗️ Project Structure

```
205Web/
├── App/                    # Mobile app frontend (React + TypeScript + Vite)
│   ├── src/
│   │   ├── app/
│   │   │   ├── hooks/
│   │   │   │   └── useWebSocket.ts    # WebSocket client hook
│   │   │   ├── pages/                 # Page components
│   │   │   └── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── Infotainment/          # In-car system frontend (React + TypeScript + Vite)
│   ├── src/
│   │   ├── app/
│   │   │   ├── hooks/
│   │   │   │   └── useWebSocket.ts    # WebSocket client hook
│   │   │   ├── components/
│   │   │   │   ├── MainPage.tsx       # Main page
│   │   │   │   ├── ParkingConfirmation.tsx
│   │   │   │   ├── SessionActive.tsx
│   │   │   │   └── BlackScreen.tsx    # Black screen for user leaving car
│   │   │   └── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── WizardOfOz/            # Researcher control panel (React + TypeScript + Vite)
│   ├── src/
│   │   ├── App.tsx                    # Main interface (parking simulation control buttons)
│   │   ├── useWebSocket.ts            # WebSocket client hook
│   │   └── main.tsx
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── README.md                      # WoZ usage instructions
│
├── backend/               # WebSocket backend server (Node.js + Express + ws)
│   ├── src/
│   │   └── server.js                  # WebSocket server main file
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml     # Docker Compose configuration
└── README.md             # This file
```


## 📄 License

MIT License

## 👥 Author

Hannah Guan, Allison John

---

**Quick Start:**
```bash
docker-compose up --build
```
Then open:
- App: http://localhost:3000
- Infotainment: http://localhost:3002
- WizardOfOz: http://localhost:3003
