#!/bin/bash

# Load environment variables
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Default port if not set
PORT=${PORT:-3000}

# Qianliyan 快速启动脚本

echo "==================================="
echo "  Qianliyan - 日志监控工具"
echo "==================================="
echo ""
echo "正在启动应用..."
echo "端口: $PORT"
echo "访问地址: http://localhost:$PORT"
echo ""

# 创建测试日志文件夹（如果不存在）
TEST_LOG_DIR="/tmp/qianliyan_logs"
if [ ! -d "$TEST_LOG_DIR" ]; then
    mkdir -p "$TEST_LOG_DIR"
    echo "创建测试日志文件夹: $TEST_LOG_DIR"

    # 创建示例日志文件
    cat > "$TEST_LOG_DIR/app.log" << 'EOF'
[2024-04-09 10:00:00] Application started
[2024-04-09 10:00:01] Connected to database
[2024-04-09 10:00:02] Loading configuration
[2024-04-09 10:00:03] Server listening on port 3000
[2024-04-09 10:00:10] New user registration: user@example.com
[2024-04-09 10:00:15] Request received: GET /api/users
[2024-04-09 10:00:20] Request completed in 120ms
EOF
    echo "创建示例日志文件: $TEST_LOG_DIR/app.log"
    echo ""
fi

echo "可以尝试添加以下测试文件夹："
echo "  $TEST_LOG_DIR"
echo ""

# 启动应用
npm run dev
