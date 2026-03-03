# Parking System - Interactive Prototypes

This is a multi-app interactive parking system prototype project consisting of:
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

## 🚀 Deployment Options

### 🌟 Option 1: GitHub + Google Cloud Run (Recommended for Demo)

**Easiest way!** Deploy directly to Google Cloud Run from GitHub repository with automatic updates.

👉 **[See detailed steps: DEPLOY_CLOUDRUN_UPDATED.md](./DEPLOY_CLOUDRUN_UPDATED.md)**

**Overview:**
1. Push code to GitHub
2. Click "Deploy from repository" in Cloud Run console
3. Connect GitHub repository
4. Configure Dockerfile path and environment variables
5. Done! Get public URL automatically

**Benefits:**
- ✅ Automatic deployment (updates on push)
- ✅ Public access (test on mobile devices)
- ✅ Free tier (sufficient for prototype demos)
- ✅ No local Docker required

---

### Option 2: Local Docker Compose (Recommended for Development)

**Prerequisites:**
- Install [Docker](https://www.docker.com/get-started) and Docker Compose

**Steps:**

```bash
# 1. Navigate to project directory
cd /Users/guanruijia/Desktop/205Web

# 2. Build and start all services
docker-compose up --build

# 3. Access applications
# - App (Mobile): http://localhost:3000
# - Infotainment (In-car): http://localhost:3002
# - WizardOfOz (Control Panel): http://localhost:3003
# - Backend (WebSocket): ws://localhost:3001
```

**Stop services:**
```bash
docker-compose down
```

### Option 3: Manual Installation and Run

**Prerequisites:**
- Node.js 18+ and npm

**Steps:**

```bash
# 1. Install and start backend server
cd backend
npm install
npm start
# Backend runs at http://localhost:3001

# 2. Open new terminal, install and start App
cd App
npm install
npm run dev
# App runs at http://localhost:5173

# 3. Open new terminal, install and start Infotainment
cd Infotainment
npm install
npm run dev
# Infotainment runs at http://localhost:5174

# 4. Open new terminal, install and start WizardOfOz
cd WizardOfOz
npm install
npm run dev
# WizardOfOz runs at http://localhost:5175
```

---

## 📚 More Deployment Options

If you want to use command-line tools (gcloud CLI) for deployment, you can run:

```bash
./deploy-gcloud.sh
```

However, the **GitHub + Cloud Run** method is recommended (see [DEPLOY_CLOUDRUN_UPDATED.md](./DEPLOY_CLOUDRUN_UPDATED.md)) as it's simpler and supports automatic deployment.

## 🛠️ Tech Stack

### Frontend (App, Infotainment & WizardOfOz)
- **Framework**: React 18.3.1
- **Language**: TypeScript
- **Build Tool**: Vite 6.3.5
- **Styling**: Tailwind CSS 4.1.12
- **UI Components**: Radix UI + shadcn/ui
- **Routing**: React Router 7.13.0
- **Communication**: WebSocket (Native API)

### Backend
- **Runtime**: Node.js 20
- **Framework**: Express 4.18.2
- **WebSocket**: ws 8.16.0
- **CORS**: CORS 2.8.5

### Deployment
- **Containerization**: Docker + Docker Compose
- **Web Server**: Nginx (production)
- **Cloud Platform**: Google Cloud Run

## 🔧 Environment Variables

### App, Infotainment & WizardOfOz
```env
VITE_WS_URL=ws://localhost:3001  # Local development
# or
VITE_WS_URL=wss://your-backend.run.app  # Production
```

### Backend
```env
PORT=3001
```

## 📝 Development Notes

1. **WebSocket Connection**
   - Development: Use `ws://localhost:3001`
   - Production: Use `wss://your-backend-url`
   - Auto-reconnect on disconnect (3s delay)

2. **CORS Issues**
   - Backend configured with CORS allowing all origins
   - Production: Recommend restricting to specific domains

3. **State Synchronization**
   - WebSocket events are one-way broadcasts
   - Frontend triggers navigation via events
   - Backend does not store session state (stateless design)

## 🐛 Troubleshooting

### WebSocket Connection Failed
```bash
# Check if backend is running
curl http://localhost:3001/health

# Check browser console for WebSocket connection status
# Should see "WebSocket connected to backend"
```

### Docker Build Failed
```bash
# Clean Docker cache
docker system prune -a

# Rebuild
docker-compose build --no-cache
```

### Port Conflicts
```bash
# Check port usage
lsof -i :3000
lsof -i :3001
lsof -i :3002
lsof -i :3003

# Kill process using port
kill -9 <PID>
```

## 📄 License

MIT License

## 👥 Author

Hannah Guan

---

**Quick Start:**
```bash
docker-compose up --build
```
Then open:
- App: http://localhost:3000
- Infotainment: http://localhost:3002
- WizardOfOz: http://localhost:3003
