#!/bin/bash

echo "==================================="
echo "  Tailwind CSS 快速验证"
echo "==================================="
echo ""

echo "正在启动开发服务器..."
echo ""

# 启动开发服务器
npm run dev > /tmp/qianliyan-dev.log 2>&1 &
DEV_PID=$!

# 等待服务器启动
sleep 3

# 检查服务器是否启动成功
if ps -p $DEV_PID > /dev/null; then
    echo "✓ 开发服务器已启动 (PID: $DEV_PID)"
    echo ""
    
    # 检查日志
    if grep -q "Ready" /tmp/qianliyan-dev.log; then
        echo "✓ 服务器已就绪"
    fi
    
    if grep -q "localhost:12306" /tmp/qianliyan-dev.log; then
        echo "✓ 服务器监听端口 12306"
    fi
    
    echo ""
    echo "==================================="
    echo "  验证步骤"
    echo "==================================="
    echo ""
    echo "1. 在浏览器中打开："
    echo "   http://localhost:12306"
    echo ""
    echo "2. 检查以下内容："
    echo "   ✓ 页面是否有渐变背景（从浅灰到深灰）"
    echo "   ✓ 卡片是否有白色背景和阴影"
    echo "   ✓ 按钮是否有蓝色或灰色背景"
    echo "   ✓ 文字是否有合适的颜色和大小"
    echo "   ✓ 布局是否有合适的间距"
    echo ""
    echo "3. 打开开发者工具（F12）："
    echo "   - 转到 'Elements' 面板"
    echo "   - 选择页面元素"
    echo "   - 查看 'Styles' 面板"
    echo "   - 确认 Tailwind 类是否被应用"
    echo ""
    echo "4. 检查控制台错误："
    echo "   - 转到 'Console' 面板"
    echo "   - 查看是否有错误信息"
    echo ""
    echo "==================================="
    echo "  停止服务器"
    echo "==================================="
    echo ""
    echo "完成验证后，按 Ctrl+C 停止服务器"
    echo ""
    echo "或者手动停止："
    echo "  kill $DEV_PID"
    echo ""
    
    # 显示日志
    echo "服务器日志："
    echo "---"
    tail -n 20 /tmp/qianliyan-dev.log
    echo "---"
    echo ""
    
    # 等待用户停止
    wait $DEV_PID
else
    echo "✗ 开发服务器启动失败"
    echo ""
    echo "错误日志："
    cat /tmp/qianliyan-dev.log
    echo ""
fi

# 清理
rm -f /tmp/qianliyan-dev.log
