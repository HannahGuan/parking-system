# 🚀 Google Cloud Run 部署指南（更新版）

## 📋 前提条件

1. ✅ GitHub 账户
2. ✅ Google Cloud 账户（**使用个人 Gmail**，不是 Stanford 账户）
3. ✅ 已创建 Google Cloud 项目并启用计费

---

## 🎯 部署概览

我们将部署 3 个服务：
1. **Backend** (WebSocket 服务器) - 先部署
2. **App** (手机应用) - 需要后端 URL
3. **Infotainment** (车载系统) - 需要后端 URL

---

## 📦 步骤 1: 推送代码到 GitHub

### 1.1 创建 GitHub 仓库

1. 访问 https://github.com/new
2. 仓库名称：`parking-system` 或任意名称
3. **Privacy**: Public 或 Private（推荐 Public 方便演示）
4. **不要**勾选 "Add a README file"（我们已经有了）
5. 点击 **"Create repository"**

### 1.2 推送代码

```bash
cd /Users/guanruijia/Desktop/205Web

# 初始化 git（如果还没有）
git init

# 添加所有文件
git add .

# 创建初始提交
git commit -m "Initial commit: Parking system prototype"

# 添加远程仓库（替换 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/parking-system.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

如果已经有 git 仓库：
```bash
git add .
git commit -m "Update with WebSocket integration"
git push origin main
```

---

## ☁️ 步骤 2: 部署后端 (WebSocket 服务器)

### 2.1 访问 Cloud Run

1. 打开 https://console.cloud.google.com/run
2. 选择你的项目
3. 点击 **"CREATE SERVICE"**

### 2.2 配置后端部署

**Source 部分:**
- 选择 **"Continuously deploy from a repository"**
- 点击 **"SET UP WITH CLOUD BUILD"**

**连接 GitHub:**
1. 点击 **"Authenticate"** 或 **"Connect to GitHub"**
2. 授权 Google Cloud 访问你的 GitHub
3. 选择你的 GitHub 账户
4. 选择仓库：`YOUR_USERNAME/parking-system`
5. 点击 **"Next"**

**Build Configuration:**
- **Branch**: `^main$` (匹配 main 分支)
- **Build Type**: **Dockerfile**
- **Source location**: `/backend/Dockerfile`
  - ⚠️ 注意开头有斜杠 `/`
  - 这是从仓库根目录的相对路径
- 点击 **"Save"**

**Service settings:**
- **Service name**: `parking-backend`
- **Region**: `us-central1` (或选择离你最近的)
- **CPU allocation**: "CPU is only allocated during request processing" (默认)
- **Minimum instances**: 0
- **Maximum instances**: 10

**Authentication:**
- 选择 **"Allow unauthenticated invocations"**
  - 这样你的应用可以公开访问

**Container settings:**
- **Container port**: `3001`
  - ⚠️ 非常重要！必须是 3001

**Resources:**
- **Memory**: 512 MiB (够用)
- **CPU**: 1
- **Request timeout**: 300 seconds (因为 WebSocket)
- **Maximum requests per container**: 80

点击 **"CREATE"**

### 2.3 等待部署

- 第一次部署需要 5-8 分钟
- 你会看到构建日志
- 等待显示 ✅ "Service deployed"

### 2.4 获取后端 URL

部署成功后：
1. 复制服务 URL（顶部显示）
2. 格式类似：`https://parking-backend-xxx-uc.a.run.app`
3. **保存这个 URL！** 稍后需要用

### 2.5 测试后端

在浏览器访问：
```
https://parking-backend-xxx-uc.a.run.app/health
```

应该看到：
```json
{"status":"ok","connections":{"app":0,"infotainment":0}}
```

✅ 后端部署成功！

---

## 📱 步骤 3: 部署 App (手机应用)

### 3.1 创建新服务

回到 Cloud Run 控制台，点击 **"CREATE SERVICE"**

### 3.2 配置 App 部署

**Source:**
- **"Continuously deploy from a repository"** → **"SET UP WITH CLOUD BUILD"**
- 选择同一个仓库
- 点击 **"Next"**

**Build Configuration:**
- **Branch**: `^main$`
- **Build Type**: **Dockerfile**
- **Source location**: `/App/Dockerfile`
  - ⚠️ 注意大小写！是 `App` 不是 `app`

**⚠️ 重要：构建时环境变量**

在 "Build Configuration" 页面，需要配置 **Substitution variables**：

找到 **"Add build variable"** 或 **"Substitution variables"**：
- **Variable name**: `_VITE_WS_URL`
- **Variable value**: `wss://parking-backend-xxx-uc.a.run.app`
  - 将 `https://` 改成 `wss://`
  - 使用你刚才保存的后端 URL

如果 UI 中没有这个选项，我们需要用另一种方法（见下方）。

点击 **"Save"**

**Service settings:**
- **Service name**: `parking-app`
- **Region**: `us-central1` (与后端相同)
- **Authentication**: **"Allow unauthenticated invocations"**
- **Container port**: `80`

**Resources:**
- **Memory**: 512 MiB
- **CPU**: 1

点击 **"CREATE"**

### 3.3 如果构建失败

如果因为环境变量问题构建失败，有两个解决方案：

**方案 A: 使用 cloudbuild.yaml（推荐）**

我已经为你准备了配置文件，回到项目根目录创建 `cloudbuild.yaml`。

**方案 B: 本地构建并推送**

使用 gcloud CLI 本地构建（稍后说明）。

---

## 🚗 步骤 4: 部署 Infotainment (车载系统)

### 4.1 创建新服务

再次点击 **"CREATE SERVICE"**

### 4.2 配置 Infotainment 部署

**Source:**
- **"Continuously deploy from a repository"**
- 选择同一个仓库

**Build Configuration:**
- **Branch**: `^main$`
- **Build Type**: **Dockerfile**
- **Source location**: `/Infotainment/Dockerfile`
  - ⚠️ 注意大小写！

**Substitution variables:**
- **Variable name**: `_VITE_WS_URL`
- **Variable value**: `wss://parking-backend-xxx-uc.a.run.app`

**Service settings:**
- **Service name**: `parking-infotainment`
- **Region**: `us-central1`
- **Authentication**: **"Allow unauthenticated invocations"**
- **Container port**: `80`

点击 **"CREATE"**

---

## ✅ 步骤 5: 测试完整系统

### 5.1 获取所有 URL

在 Cloud Run 控制台，你应该看到 3 个服务：

```
parking-backend        https://parking-backend-xxx.run.app
parking-app            https://parking-app-xxx.run.app
parking-infotainment   https://parking-infotainment-xxx.run.app
```

### 5.2 测试交互

1. **打开 App**
   - 在浏览器访问 App URL
   - 应该看到手机界面

2. **打开 Infotainment**
   - 在另一个窗口访问 Infotainment URL
   - 点击 "Main" 进入主页面

3. **测试 WebSocket 通信**
   - 在 Infotainment 点击 **"Simulate Park On"**
   - App 应该自动跳转到确认页面 ✅
   - 继续测试其他交互流程

### 5.3 调试

如果有问题：

1. **查看日志**
   - 在 Cloud Run 控制台
   - 点击服务名称
   - 选择 **"LOGS"** 标签

2. **检查 WebSocket 连接**
   - 打开浏览器开发者工具 (F12)
   - 查看 Console 标签
   - 应该看到 "WebSocket connected to backend"

3. **检查环境变量**
   - 在服务详情页
   - 查看 "Container" 部分
   - 确认 `VITE_WS_URL` 设置正确

---

## 🔧 备选方案：使用 cloudbuild.yaml

如果 UI 部署有问题，我们可以创建 `cloudbuild.yaml` 配置文件。

这样可以更精确地控制构建过程，包括传递环境变量。

需要的话告诉我，我会帮你创建这些文件。

---

## 📊 成本预估

Google Cloud Run 免费额度（每月）：
- 2 百万次请求
- 360,000 GB-seconds
- 180,000 vCPU-seconds

**你的应用（3个服务）:**
- 演示使用：**完全免费** ✅
- 轻度使用（100用户/天）：~$5-10/月
- 中度使用（1000用户/天）：~$20-50/月

---

## 🎯 快速故障排除

### 问题 1: "Service Unavailable"
- 检查容器端口配置
- Backend: 3001
- App/Infotainment: 80

### 问题 2: WebSocket 连接失败
- 确认 `VITE_WS_URL` 使用 `wss://` (不是 `ws://` 或 `https://`)
- 检查后端日志

### 问题 3: 构建失败
- 查看 Cloud Build 日志
- 检查 Dockerfile 路径大小写
- 确认仓库已推送到 GitHub

### 问题 4: CORS 错误
- 后端已配置 CORS，应该不会有问题
- 如果有，检查后端代码 `server.js`

---

## 🔄 更新部署

修改代码后：

```bash
git add .
git commit -m "Update features"
git push origin main
```

Cloud Run 会**自动检测并重新部署** ✅

---

## 🗑️ 删除部署

如果想删除：

1. 进入 Cloud Run 控制台
2. 选择服务
3. 点击 **"DELETE"**
4. 对所有 3 个服务重复

---

## 📞 需要帮助？

遇到问题了吗？常见解决方案：

1. 确保使用**个人 Gmail 账户**（不是学校账户）
2. 确认已启用计费（即使在免费额度内也需要）
3. 检查 Dockerfile 路径的大小写
4. 查看 Cloud Build 日志了解详细错误

---

**祝你部署成功！** 🚀
