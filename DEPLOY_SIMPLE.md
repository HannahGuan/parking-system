# 🚀 最简单的部署步骤

## 📋 你需要的：
1. GitHub 账户
2. Google Cloud 账户（**个人 Gmail**）
3. 10-15 分钟时间

---

## 第一步：推送到 GitHub (5分钟)

### 1. 创建 GitHub 仓库

访问：https://github.com/new

- **Repository name**: `parking-system`
- **Privacy**: Public
- **不要**勾选任何选项（README, .gitignore 等）
- 点击 **Create repository**

### 2. 推送代码

```bash
cd /Users/guanruijia/Desktop/205Web

git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/parking-system.git
git branch -M main
git push -u origin main
```

✅ GitHub 完成！

---

## 第二步：部署后端 (5分钟)

### 1. 打开 Cloud Run

访问：https://console.cloud.google.com/run

选择你的项目（如果没有，创建一个新项目）

### 2. 创建服务

点击 **CREATE SERVICE**

### 3. 配置

**Source:**
- 选择 "Continuously deploy from a repository"
- 点击 "SET UP WITH CLOUD BUILD"
- 连接 GitHub → 选择你的仓库
- 点击 "Next"

**Build:**
- Branch: `^main$`
- Build Type: **Dockerfile**
- Source location: `/backend/Dockerfile` ⚠️ **注意开头的斜杠**
- 点击 "Save"

**Service:**
- Service name: `parking-backend`
- Region: `us-central1`
- Authentication: **Allow unauthenticated**
- Container port: **3001** ⚠️ **必须是 3001**

点击 **CREATE**，等待 5-8 分钟

### 4. 保存 URL

部署完成后，复制服务 URL（类似 `https://parking-backend-xxx.run.app`）

**保存这个 URL！下一步需要用！**

✅ 后端完成！

---

## 第三步：部署 App (5分钟)

### 1. 回到 Cloud Run，点击 CREATE SERVICE

### 2. 配置

**Source:**
- "Continuously deploy from a repository"
- 选择同一个仓库

**Build:**
- Branch: `^main$`
- Build Type: **Dockerfile**
- Source location: `/App/Dockerfile` ⚠️ **注意大小写 A**
- Build configuration file: `/App/cloudbuild.yaml`
- 点击 "Save"

### 3. 设置环境变量

**重要！** 在 Cloud Build 触发器设置中：

1. 部署开始后，会创建一个 Cloud Build 触发器
2. 进入 **Cloud Build** → **Triggers**
3. 找到 `parking-app` 触发器
4. 点击 **EDIT**
5. 找到 **Substitution variables**
6. 添加变量：
   - Name: `_VITE_WS_URL`
   - Value: `wss://parking-backend-xxx.run.app` (把 https 改成 wss)
7. 点击 **SAVE**
8. 点击 **RUN** 手动触发一次构建

**Service:**
- Service name: `parking-app`
- Region: `us-central1`
- Authentication: **Allow unauthenticated**
- Container port: **80**

✅ App 完成！

---

## 第四步：部署 Infotainment (5分钟)

重复 App 的步骤，但修改以下内容：

**Build:**
- Source location: `/Infotainment/Dockerfile` ⚠️ **注意大小写 I**
- Build configuration file: `/Infotainment/cloudbuild.yaml`

**Substitution variables:**
- `_VITE_WS_URL`: `wss://parking-backend-xxx.run.app`

**Service:**
- Service name: `parking-infotainment`
- Container port: **80**

✅ Infotainment 完成！

---

## 🎉 完成！测试你的应用

你现在有 3 个 URL：

```
Backend:      https://parking-backend-xxx.run.app
App:          https://parking-app-xxx.run.app
Infotainment: https://parking-infotainment-xxx.run.app
```

### 测试：

1. 打开 App URL
2. 打开 Infotainment URL（另一个窗口）
3. 在 Infotainment 点击 "Main"
4. 点击 "Simulate Park On"
5. 看 App 自动跳转！✅

---

## 🐛 如果有问题

### WebSocket 连接失败？

检查：
1. 后端 URL 是否正确（用 `wss://` 不是 `https://`）
2. 打开浏览器开发者工具 (F12) 查看错误

### 构建失败？

1. 查看 Cloud Build 日志
2. 确认 Dockerfile 路径正确（注意大小写）
3. 确认 cloudbuild.yaml 文件在正确位置

### 服务无法访问？

检查：
1. 容器端口设置（Backend: 3001, App/Infotainment: 80）
2. Authentication 设置为 "Allow unauthenticated"

---

## 💡 小贴士

- 修改代码后，只需 `git push`，Cloud Run 会自动重新部署
- 查看日志：Cloud Run 控制台 → 选择服务 → LOGS 标签
- 免费额度足够演示使用！

---

**祝你部署成功！** 🎉
