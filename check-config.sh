#!/bin/bash

# Qianliyan 配置检查脚本

echo "==================================="
echo "  Qianliyan 配置检查"
echo "==================================="
echo ""

# 检查 .env 文件
if [ -f .env ]; then
    echo "✓ 找到 .env 文件"
    
    # 读取端口配置
    PORT=$(grep -v '^#' .env | grep 'PORT=' | cut -d'=' -f2)
    if [ -n "$PORT" ]; then
        echo "✓ 端口配置: $PORT"
        
        # 检查端口是否被占用
        if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
            echo "✗ 警告: 端口 $PORT 已被占用"
            echo "  占用进程:"
            lsof -Pi :$PORT -sTCP:LISTEN
        else
            echo "✓ 端口 $PORT 可用"
        fi
    else
        echo "✗ 警告: 未找到 PORT 配置"
    fi
    
    # 读取数据目录配置
    DATA_DIR=$(grep -v '^#' .env | grep 'DATA_DIR=' | cut -d'=' -f2)
    if [ -n "$DATA_DIR" ]; then
        echo "✓ 数据目录配置: $DATA_DIR"
        
        if [ -d "$DATA_DIR" ]; then
            echo "✓ 数据目录存在"
            
            if [ -w "$DATA_DIR" ]; then
                echo "✓ 数据目录可写"
            else
                echo "✗ 警告: 数据目录不可写"
            fi
        else
            echo "✗ 警告: 数据目录不存在"
        fi
    else
        echo "✗ 警告: 未找到 DATA_DIR 配置"
    fi
else
    echo "✗ 警告: .env 文件不存在"
    echo "  建议运行: cp .env.example .env"
fi

echo ""

# 检查依赖
if [ -d "node_modules" ]; then
    echo "✓ 依赖已安装"
else
    echo "✗ 警告: 依赖未安装"
    echo "  建议运行: npm install"
fi

echo ""

# 检查包配置
if [ -f "package.json" ]; then
    echo "✓ package.json 存在"
    
    if grep -q "dotenv-cli" package.json; then
        echo "✓ dotenv-cli 依赖已安装"
    else
        echo "✗ 警告: dotenv-cli 依赖未安装"
        echo "  建议运行: npm install"
    fi
else
    echo "✗ 警告: package.json 不存在"
fi

echo ""
echo "==================================="
echo "  检查完成"
echo "==================================="
echo ""

# 显示启动命令
echo "启动命令:"
echo "  开发环境: npm run dev"
echo "  生产环境: npm run build && npm start"
echo ""
