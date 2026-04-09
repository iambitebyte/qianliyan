#!/bin/bash

# 示例：使用不同端口启动 Qianliyan

echo "==================================="
echo "  Qianliyan 端口配置示例"
echo "==================================="
echo ""

# 读取当前配置
if [ -f .env ]; then
    CURRENT_PORT=$(grep -v '^#' .env | grep 'PORT=' | cut -d'=' -f2)
    echo "当前配置的端口: $CURRENT_PORT"
else
    echo "未找到 .env 文件"
    CURRENT_PORT="12306"
fi

echo ""
echo "使用方式："
echo ""
echo "1. 使用默认端口（$CURRENT_PORT）："
echo "   npm run dev"
echo ""
echo "2. 使用临时端口（8080）："
echo "   PORT=8080 npm run dev"
echo ""
echo "3. 修改 .env 文件永久更改端口："
echo "   nano .env"
echo "   # 修改 PORT=8080"
echo "   npm run dev"
echo ""
echo "4. 修改 .env.production 文件（生产环境）："
echo "   nano .env.production"
echo "   # 修改 PORT=8080"
echo "   npm run build"
echo "   npm start"
echo ""
echo "5. 使用不同端口启动多个实例："
echo "   # 终端 1"
echo "   PORT=12306 npm run dev"
echo "   # 终端 2"
echo "   PORT=12307 npm run dev"
echo ""
echo "6. 检查端口占用："
echo "   lsof -i :12306"
echo ""
echo "7. 使用配置检查脚本："
echo "   ./check-config.sh"
echo ""
echo "==================================="
echo ""
