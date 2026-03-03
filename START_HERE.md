# 🚀 从这里开始

## 两种部署方式，选择一种：

---

## 🌟 方式 1: GitHub + Google Cloud Run（推荐）

**适合：想要公网访问，可以在手机上演示**

### 步骤：

1. **推送到 GitHub**
   ```bash
   cd /Users/guanruijia/Desktop/205Web
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/parking-demo.git
   git push -u origin main
   ```

2. **打开 Cloud Run 控制台**
   - 访问：https://console.cloud.google.com/run
   - 使用**个人 Gmail**（不是 Stanford 账户）

3. **部署 3 个服务**（每个重复以下步骤）

   **服务 1 - Backend:**
   - 点击 "CREATE SERVICE" → "Deploy from repository"
   - 连接 GitHub → 选择你的仓库
   - Dockerfile 路径: `/backend/Dockerfile`
   - 服务名: `parking-backend`
   - 端口: `3001`
   - ✅ Allow unauthenticated

   **服务 2 - App:**
   - Dockerfile 路径: `/App/Dockerfile`
   - 服务名: `parking-app`
   - 端口: `80`
   - 环境变量: `VITE_WS_URL=wss://[backend-url]`

   **服务 3 - Infotainment:**
   - Dockerfile 路径: `/Infotainment/Dockerfile`
   - 服务名: `parking-infotainment`
   - 端口: `80`
   - 环境变量: `VITE_WS_URL=wss://[backend-url]`

4. **完成！** 获得 3 个公网 URL

📖 **详细步骤**：[DEPLOY_GITHUB.md](./DEPLOY_GITHUB.md)

---

## 💻 方式 2: 本地 Docker（最快）

**适合：快速测试功能**

```bash
cd /Users/guanruijia/Desktop/205Web

# 一键启动
docker-compose up --build
```

访问：
- App: http://localhost:3000
- Infotainment: http://localhost:3002

---

## 🎮 如何测试

1. 打开两个浏览器窗口（App 和 Infotainment）
2. 在 Infotainment 点击 **"Simulate Park On"**
3. 看 App 自动跳转 ✅
4. 继续点击 Confirm → 两个应用同步跳转
5. 点击 End Session → App 跳到付款页面

---

## 需要帮助？

- 📖 完整文档：[README.md](./README.md)
- ☁️ Cloud Run 部署：[DEPLOY_GITHUB.md](./DEPLOY_GITHUB.md)
- 💬 问题？查看 README 的"故障排除"部分

**推荐：先用 Docker 本地测试，确认功能正常后再部署到云端！**
