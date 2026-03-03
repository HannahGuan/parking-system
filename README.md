# Parking System - Interactive Prototypes

这是一个由多个相互交互的停车系统原型组成的项目：
- **App**: 模拟手机停车应用界面
- **Infotainment**: 车载信息娱乐系统界面
- **WizardOfOz**: 研究人员控制面板，用于触发停车模拟
- **Backend**: WebSocket 服务器，实现所有应用的实时通信

## 🎯 功能演示

### 交互流程

#### 方式 1: 使用 Wizard of Oz 控制面板（推荐用于实验）

1. **WizardOfOz** → 点击 "Start Parking Simulation" 按钮
   - **App** 自动跳转到活动会话页面 (`/active`)
   - **Infotainment** 自动跳转到会话开始页面 (`/session-started`)

2. **Infotainment (Session Active)** → 点击 "End Session" 按钮
   - **App** 自动跳转到付款页面 (`/payment`)
   - **Infotainment** 跳转到会话结束页面 (`/end-session`)

#### 方式 2: 使用 Infotainment 手动触发（开发调试用）

1. **Infotainment (Main Page)** → 点击 "Simulate Park On" 按钮
   - **App** 自动跳转到确认页面 (`/confirm`)
   - **Infotainment** 跳转到停车确认页面 (`/parking-confirmation`)

2. **Infotainment (Parking Confirmation)** → 点击 "Confirm" 按钮
   - **App** 自动跳转到活动会话页面 (`/active`)
   - **Infotainment** 跳转到会话开始页面 (`/session-started`)

3. **Infotainment (Session Active)** → 点击 "End Session" 按钮
   - **App** 自动跳转到付款页面 (`/payment`)
   - **Infotainment** 跳转到会话结束页面 (`/end-session`)

## 🏗️ 项目结构

```
205Web/
├── App/                    # 手机应用前端 (React + TypeScript + Vite)
│   ├── src/
│   │   ├── app/
│   │   │   ├── hooks/
│   │   │   │   └── useWebSocket.ts    # WebSocket 客户端 hook
│   │   │   ├── pages/                 # 页面组件
│   │   │   └── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── Infotainment/          # 车载系统前端 (React + TypeScript + Vite)
│   ├── src/
│   │   ├── app/
│   │   │   ├── hooks/
│   │   │   │   └── useWebSocket.ts    # WebSocket 客户端 hook
│   │   │   ├── components/
│   │   │   │   ├── MainPage.tsx       # 主页面 (带 Simulate Park On 按钮)
│   │   │   │   ├── ParkingConfirmation.tsx
│   │   │   │   └── SessionActive.tsx
│   │   │   └── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── WizardOfOz/            # 研究人员控制面板 (React + TypeScript + Vite)
│   ├── src/
│   │   ├── App.tsx                    # 主界面（停车模拟控制按钮）
│   │   ├── useWebSocket.ts            # WebSocket 客户端 hook
│   │   └── main.tsx
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── README.md                      # WoZ 使用说明
│
├── backend/               # WebSocket 后端服务器 (Node.js + Express + ws)
│   ├── src/
│   │   └── server.js                  # WebSocket 服务器主文件
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml     # Docker Compose 配置
└── README.md             # 本文件
```

## 🚀 部署方式

### 🌟 方式 1: GitHub + Google Cloud Run (推荐用于演示)

**最简单的方式！** 通过 GitHub 仓库直接部署到 Google Cloud Run，支持自动更新。

👉 **[查看详细步骤：DEPLOY_GITHUB.md](./DEPLOY_GITHUB.md)**

**步骤概览:**
1. 推送代码到 GitHub
2. 在 Cloud Run 控制台点击 "Deploy from repository"
3. 连接 GitHub 仓库
4. 配置 Dockerfile 路径和环境变量
5. 完成！自动获得公网访问 URL

**优点:**
- ✅ 自动部署（推送代码即更新）
- ✅ 公网访问（可以在手机上测试）
- ✅ 免费额度（原型演示完全够用）
- ✅ 无需本地 Docker

---

### 方式 2: 本地 Docker Compose (推荐用于开发)

**前提条件:**
- 安装 [Docker](https://www.docker.com/get-started) 和 Docker Compose

**步骤:**

```bash
# 1. 进入项目目录
cd /Users/guanruijia/Desktop/205Web

# 2. 构建并启动所有服务
docker-compose up --build

# 3. 访问应用
# - App (手机应用): http://localhost:3000
# - Infotainment (车载系统): http://localhost:3002
# - WizardOfOz (研究人员控制面板): http://localhost:3003
# - Backend (WebSocket 服务器): ws://localhost:3001
```

**停止服务:**
```bash
docker-compose down
```

### 方法 2: 手动安装和运行

**前提条件:**
- Node.js 18+ 和 npm

**步骤:**

```bash
# 1. 安装并启动后端服务器
cd backend
npm install
npm start
# 后端运行在 http://localhost:3001

# 2. 新开一个终端，安装并启动 App
cd App
npm install
npm run dev
# App 运行在 http://localhost:5173

# 3. 新开一个终端，安装并启动 Infotainment
cd Infotainment
npm install
npm run dev
# Infotainment 运行在 http://localhost:5174
```

---

## 📚 更多部署选项

如果你想使用命令行工具（gcloud CLI）进行部署，可以运行：

```bash
./deploy-gcloud.sh
```

但推荐使用 **GitHub + Cloud Run** 的方式（见 [DEPLOY_GITHUB.md](./DEPLOY_GITHUB.md)），更简单且支持自动部署。

## 🛠️ 技术栈

### Frontend (App & Infotainment)
- **框架**: React 18.3.1
- **语言**: TypeScript
- **构建工具**: Vite 6.3.5
- **样式**: Tailwind CSS 4.1.12
- **UI 组件**: Radix UI + shadcn/ui
- **路由**: React Router 7.13.0
- **通信**: WebSocket (原生 API)

### Backend
- **运行时**: Node.js 20
- **框架**: Express 4.18.2
- **WebSocket**: ws 8.16.0
- **跨域**: CORS 2.8.5

### 部署
- **容器化**: Docker + Docker Compose
- **Web 服务器**: Nginx (生产环境)
- **云平台**: Google Cloud Run

## 🔧 环境变量

### App & Infotainment
```env
VITE_WS_URL=ws://localhost:3001  # 本地开发
# 或
VITE_WS_URL=wss://your-backend.run.app  # 生产环境
```

### Backend
```env
PORT=3001
```

## 📝 开发注意事项

1. **WebSocket 连接**
   - 开发环境使用 `ws://localhost:3001`
   - 生产环境使用 `wss://your-backend-url`
   - 连接断开后会自动重连（3秒延迟）

2. **跨域问题**
   - 后端已配置 CORS，允许所有来源
   - 生产环境建议限制特定域名

3. **状态同步**
   - WebSocket 事件是单向广播
   - 前端通过事件触发导航
   - 后端不存储会话状态（无状态设计）

## 🐛 故障排除

### WebSocket 连接失败
```bash
# 检查后端是否运行
curl http://localhost:3001/health

# 查看浏览器控制台 WebSocket 连接状态
# 应该看到 "WebSocket connected to backend"
```

### Docker 构建失败
```bash
# 清理 Docker 缓存
docker system prune -a

# 重新构建
docker-compose build --no-cache
```

### 端口冲突
```bash
# 检查端口占用
lsof -i :3000
lsof -i :3001
lsof -i :3002

# 终止占用端口的进程
kill -9 <PID>
```

## 📄 License

MIT License

## 👥 作者

Hannah Guan

---

**快速开始:**
```bash
docker-compose up --build
```
然后打开:
- App: http://localhost:3000
- Infotainment: http://localhost:3002
