#!/bin/bash

# Google Cloud 部署脚本
# 作者: Hannah Guan

set -e  # 遇到错误立即退出

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  停车系统 - Google Cloud 部署脚本${NC}"
echo -e "${GREEN}========================================${NC}\n"

# 1. 检查 gcloud 是否安装
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}错误: gcloud CLI 未安装${NC}"
    echo "请访问 https://cloud.google.com/sdk/docs/install 安装"
    exit 1
fi

# 2. 设置项目 ID
read -p "请输入 Google Cloud 项目 ID (回车使用默认 'parking-system-demo'): " PROJECT_ID
PROJECT_ID=${PROJECT_ID:-parking-system-demo}

echo -e "\n${YELLOW}使用项目: $PROJECT_ID${NC}"

# 3. 设置区域
read -p "请输入部署区域 (回车使用默认 'us-central1'): " REGION
REGION=${REGION:-us-central1}

echo -e "${YELLOW}部署区域: $REGION${NC}\n"

# 4. 配置项目
echo -e "${GREEN}[1/5] 配置 Google Cloud 项目...${NC}"
gcloud config set project $PROJECT_ID 2>/dev/null || {
    echo -e "${YELLOW}项目不存在，正在创建...${NC}"
    gcloud projects create $PROJECT_ID --name="Parking System"
    gcloud config set project $PROJECT_ID
}

# 5. 启用必要的 API
echo -e "\n${GREEN}[2/5] 启用必要的 Google Cloud API...${NC}"
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com

# 6. 部署后端
echo -e "\n${GREEN}[3/5] 部署后端 WebSocket 服务器...${NC}"
cd backend
gcloud run deploy parking-backend \
  --source . \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 3001 \
  --quiet

BACKEND_URL=$(gcloud run services describe parking-backend --region $REGION --format 'value(status.url)')
WSS_URL=${BACKEND_URL/https/wss}

echo -e "${GREEN}✓ 后端部署成功: $BACKEND_URL${NC}"

# 7. 部署 App
echo -e "\n${GREEN}[4/5] 部署 App 前端...${NC}"
cd ../App
echo "VITE_WS_URL=$WSS_URL" > .env.production

gcloud run deploy parking-app \
  --source . \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 80 \
  --quiet

APP_URL=$(gcloud run services describe parking-app --region $REGION --format 'value(status.url)')
echo -e "${GREEN}✓ App 部署成功: $APP_URL${NC}"

# 8. 部署 Infotainment
echo -e "\n${GREEN}[5/5] 部署 Infotainment 前端...${NC}"
cd ../Infotainment
echo "VITE_WS_URL=$WSS_URL" > .env.production

gcloud run deploy parking-infotainment \
  --source . \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 80 \
  --quiet

INFOTAINMENT_URL=$(gcloud run services describe parking-infotainment --region $REGION --format 'value(status.url)')
echo -e "${GREEN}✓ Infotainment 部署成功: $INFOTAINMENT_URL${NC}"

# 9. 输出总结
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}         部署成功! 🎉${NC}"
echo -e "${GREEN}========================================${NC}\n"

echo -e "${YELLOW}访问地址:${NC}"
echo -e "  📱 App (手机应用):         $APP_URL"
echo -e "  🚗 Infotainment (车载系统): $INFOTAINMENT_URL"
echo -e "  🔌 Backend (WebSocket):    $BACKEND_URL"
echo ""

echo -e "${YELLOW}使用说明:${NC}"
echo "  1. 在浏览器中打开 Infotainment URL"
echo "  2. 在另一个浏览器窗口中打开 App URL"
echo "  3. 在 Infotainment 上点击 'Simulate Park On' 按钮"
echo "  4. 观察 App 自动跳转到确认页面"
echo ""

echo -e "${YELLOW}查看日志:${NC}"
echo "  gcloud run services logs read parking-backend --region $REGION"
echo "  gcloud run services logs read parking-app --region $REGION"
echo "  gcloud run services logs read parking-infotainment --region $REGION"
echo ""

echo -e "${YELLOW}删除部署:${NC}"
echo "  gcloud run services delete parking-backend --region $REGION"
echo "  gcloud run services delete parking-app --region $REGION"
echo "  gcloud run services delete parking-infotainment --region $REGION"
echo ""

# 10. 询问是否打开浏览器
read -p "是否在浏览器中打开应用? (y/N): " OPEN_BROWSER
if [[ $OPEN_BROWSER =~ ^[Yy]$ ]]; then
    open "$APP_URL"
    open "$INFOTAINMENT_URL"
    echo -e "${GREEN}已在浏览器中打开应用${NC}"
fi

echo -e "\n${GREEN}部署完成！${NC}"
