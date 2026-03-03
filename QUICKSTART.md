# 🚀 快速开始指南

## 5 分钟快速部署

### 选项 1: 本地 Docker 部署（最简单）

```bash
# 1. 确保安装了 Docker
docker --version

# 2. 启动所有服务
cd /Users/guanruijia/Desktop/205Web
docker-compose up --build

# 3. 打开浏览器
open http://localhost:3000  # App
open http://localhost:3002  # Infotainment
```

**就这么简单！** 🎉

---

### 选项 2: Google Cloud 一键部署

```bash
# 1. 确保安装了 gcloud CLI
gcloud --version

# 2. 运行部署脚本
cd /Users/guanruijia/Desktop/205Web
./deploy-gcloud.sh

# 3. 按照提示输入项目 ID 和区域
# 脚本会自动完成所有部署并打开浏览器
```

**5-10 分钟内完成云端部署！** ☁️

---

### 选项 3: 手动本地开发

```bash
# 1. 运行测试脚本（自动安装依赖）
./test-local.sh

# 2. 选择 'N' 不使用 Docker

# 3. 在 3 个终端窗口分别运行：

# 终端 1 - 后端
cd backend
npm install
npm start

# 终端 2 - App
cd App
npm install
npm run dev

# 终端 3 - Infotainment
cd Infotainment
npm install
npm run dev
```

---

## 🎮 如何测试交互

1. **打开两个浏览器窗口**
   - 窗口 1: App (http://localhost:3000)
   - 窗口 2: Infotainment (http://localhost:3002)

2. **测试流程 1: Simulate Park On**
   - 在 **Infotainment** 点击 "Simulate Park On" 按钮
   - 观察 **App** 自动跳转到 Confirm 页面 ✅
   - **Infotainment** 也跳转到 Parking Confirmation 页面 ✅

3. **测试流程 2: Start Session**
   - 在 **Infotainment** 的 Parking Confirmation 页面点击 "Confirm"
   - 观察 **App** 自动跳转到 Active Session 页面 ✅
   - **Infotainment** 跳转到 Session Started 页面 ✅

4. **测试流程 3: End Session**
   - 在 **Infotainment** 的 Session Active 页面点击 "End Session"
   - 观察 **App** 自动跳转到 Payment 页面 ✅
   - **Infotainment** 跳转到 End Session 页面 ✅

---

## 🏗️ 系统架构

```
┌─────────────────┐         WebSocket          ┌─────────────────┐
│                 │◄──────────────────────────►│                 │
│   App           │       ws://backend:3001     │  Infotainment   │
│  (Mobile UI)    │                             │  (Car Display)  │
│                 │                             │                 │
│  - Home         │                             │  - Main Page    │
│  - Confirm      │         ┌──────────┐        │  - Confirmation │
│  - Active       │◄────────┤          │───────►│  - Started      │
│  - Payment      │         │  Backend │        │  - Active       │
│  - Receipt      │         │   Node   │        │  - End          │
│                 │         │          │        │  - Review       │
│  Port: 3000     │         │  Port:   │        │  Port: 3002     │
│                 │         │   3001   │        │                 │
└─────────────────┘         └──────────┘        └─────────────────┘

                         WebSocket Events:
                    ┌──────────────────────────┐
                    │  SIMULATE_PARK_ON        │
                    │  START_SESSION           │
                    │  END_SESSION             │
                    │  NAVIGATE_TO_*           │
                    └──────────────────────────┘
```

---

## 📁 项目文件说明

```
205Web/
├── backend/                    # WebSocket 服务器
│   ├── src/server.js          # 核心服务器逻辑 ⭐
│   ├── package.json
│   └── Dockerfile
│
├── App/                        # 手机应用
│   ├── src/app/
│   │   ├── hooks/useWebSocket.ts  # WebSocket 客户端 ⭐
│   │   ├── pages/             # 5 个页面组件
│   │   └── App.tsx            # 应用入口
│   └── Dockerfile
│
├── Infotainment/              # 车载系统
│   ├── src/app/
│   │   ├── hooks/useWebSocket.ts  # WebSocket 客户端 ⭐
│   │   ├── components/
│   │   │   ├── MainPage.tsx   # 带 "Simulate Park On" 按钮 ⭐
│   │   │   ├── ParkingConfirmation.tsx  # 发送 START_SESSION ⭐
│   │   │   └── SessionActive.tsx  # 发送 END_SESSION ⭐
│   │   └── App.tsx
│   └── Dockerfile
│
├── docker-compose.yml         # 本地部署配置 ⭐
├── deploy-gcloud.sh          # Google Cloud 部署脚本 ⭐
├── test-local.sh             # 本地测试脚本 ⭐
├── README.md                 # 完整文档
└── QUICKSTART.md            # 本文件
```

⭐ = 核心文件

---

## 🔧 常见问题

### Q: WebSocket 连接失败？
A: 检查后端是否运行：
```bash
curl http://localhost:3001/health
```

### Q: Docker 端口冲突？
A: 修改 `docker-compose.yml` 中的端口映射：
```yaml
ports:
  - "8000:80"  # 改成其他端口
```

### Q: 如何查看日志？
A:
```bash
# Docker
docker-compose logs backend
docker-compose logs app
docker-compose logs infotainment

# Google Cloud
gcloud run services logs read parking-backend --region us-central1
```

### Q: 如何停止服务？
A:
```bash
# Docker
docker-compose down

# 手动启动的话，在每个终端按 Ctrl+C
```

---

## 💰 成本估算

### 本地开发
- **成本**: 免费 ✅
- **要求**: Docker 或 Node.js

### Google Cloud Run
- **免费额度** (每月):
  - 2 百万次请求
  - 360,000 GB-seconds
  - 180,000 vCPU-seconds
- **原型演示**: 完全免费 ✅
- **生产环境**: ~$10-50/月（取决于流量）

---

## 🎯 下一步

1. ✅ 完成本地测试
2. ✅ 部署到 Google Cloud
3. 📱 使用手机访问云端 URL
4. 🚗 在平板上打开 Infotainment URL
5. 🎉 向 Product Team 演示！

---

## 📞 需要帮助？

遇到问题？
1. 查看 [README.md](./README.md) 的详细文档
2. 检查浏览器控制台的 WebSocket 连接日志
3. 查看后端健康检查：`curl http://localhost:3001/health`

---

**祝你部署顺利！** 🚀
