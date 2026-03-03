#!/bin/bash

# 本地测试脚本
# 检查所有依赖并启动本地开发环境

set -e

# 颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  停车系统 - 本地开发环境测试${NC}"
echo -e "${GREEN}========================================${NC}\n"

# 检查 Node.js
echo -e "${YELLOW}检查 Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js 未安装${NC}"
    echo "请访问 https://nodejs.org 安装 Node.js 18+"
    exit 1
fi
NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js 已安装: $NODE_VERSION${NC}\n"

# 检查 npm
echo -e "${YELLOW}检查 npm...${NC}"
if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm 未安装${NC}"
    exit 1
fi
NPM_VERSION=$(npm -v)
echo -e "${GREEN}✓ npm 已安装: $NPM_VERSION${NC}\n"

# 安装后端依赖
echo -e "${YELLOW}[1/3] 安装后端依赖...${NC}"
cd backend
if [ ! -d "node_modules" ]; then
    npm install
    echo -e "${GREEN}✓ 后端依赖安装完成${NC}\n"
else
    echo -e "${GREEN}✓ 后端依赖已存在${NC}\n"
fi

# 安装 App 依赖
echo -e "${YELLOW}[2/3] 安装 App 依赖...${NC}"
cd ../App
if [ ! -d "node_modules" ]; then
    npm install
    echo -e "${GREEN}✓ App 依赖安装完成${NC}\n"
else
    echo -e "${GREEN}✓ App 依赖已存在${NC}\n"
fi

# 安装 Infotainment 依赖
echo -e "${YELLOW}[3/3] 安装 Infotainment 依赖...${NC}"
cd ../Infotainment
if [ ! -d "node_modules" ]; then
    npm install
    echo -e "${GREEN}✓ Infotainment 依赖安装完成${NC}\n"
else
    echo -e "${GREEN}✓ Infotainment 依赖已存在${NC}\n"
fi

cd ..

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  ✓ 所有依赖安装完成!${NC}"
echo -e "${GREEN}========================================${NC}\n"

echo -e "${YELLOW}现在可以选择启动方式:${NC}\n"

echo "方式 1: 使用 Docker Compose (推荐)"
echo "  docker-compose up --build"
echo ""
echo "方式 2: 手动启动（需要3个终端窗口）"
echo "  终端 1: cd backend && npm start"
echo "  终端 2: cd App && npm run dev"
echo "  终端 3: cd Infotainment && npm run dev"
echo ""

read -p "是否使用 Docker Compose 启动? (y/N): " USE_DOCKER

if [[ $USE_DOCKER =~ ^[Yy]$ ]]; then
    # 检查 Docker
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}✗ Docker 未安装${NC}"
        echo "请访问 https://www.docker.com/get-started 安装 Docker"
        exit 1
    fi

    echo -e "\n${YELLOW}使用 Docker Compose 启动...${NC}"
    docker-compose up --build
else
    echo -e "\n${YELLOW}请在3个不同的终端窗口运行以下命令:${NC}"
    echo ""
    echo -e "${GREEN}终端 1 (后端):${NC}"
    echo "  cd $(pwd)/backend && npm start"
    echo ""
    echo -e "${GREEN}终端 2 (App):${NC}"
    echo "  cd $(pwd)/App && npm run dev"
    echo ""
    echo -e "${GREEN}终端 3 (Infotainment):${NC}"
    echo "  cd $(pwd)/Infotainment && npm run dev"
    echo ""
    echo -e "${YELLOW}然后访问:${NC}"
    echo "  App: http://localhost:5173"
    echo "  Infotainment: http://localhost:5174"
fi
