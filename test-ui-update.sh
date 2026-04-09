#!/bin/bash

# Qianliyan UI 美化更新测试脚本

echo "==================================="
echo "  Qianliyan UI 美化测试"
echo "==================================="
echo ""

echo "1. 检查依赖安装..."
if npm list class-variance-authority clsx tailwind-merge @radix-ui/react-slot >/dev/null 2>&1; then
    echo "✓ 所有 UI 依赖已安装"
else
    echo "✗ 依赖缺失，请运行 npm install"
    exit 1
fi

echo ""
echo "2. 检查组件文件..."
components=(
    "components/ui/button.tsx"
    "components/ui/card.tsx"
    "components/ui/input.tsx"
    "components/ui/select.tsx"
    "components/ui/badge.tsx"
    "components/ui/scroll-area.tsx"
)

for component in "${components[@]}"; do
    if [ -f "$component" ]; then
        echo "✓ $component 存在"
    else
        echo "✗ $component 缺失"
        exit 1
    fi
done

echo ""
echo "3. 检查工具函数..."
if [ -f "lib/utils.ts" ]; then
    echo "✓ lib/utils.ts 存在"
else
    echo "✗ lib/utils.ts 缺失"
    exit 1
fi

echo ""
echo "4. 检查页面文件..."
if [ -f "app/page.tsx" ]; then
    echo "✓ app/page.tsx 存在"
else
    echo "✗ app/page.tsx 缺失"
    exit 1
fi

if [ -f "app/logs/page.tsx" ]; then
    echo "✓ app/logs/page.tsx 存在"
else
    echo "✗ app/logs/page.tsx 缺失"
    exit 1
fi

echo ""
echo "5. 检查样式文件..."
if [ -f "app/globals.css" ]; then
    echo "✓ app/globals.css 存在"
else
    echo "✗ app/globals.css 缺失"
    exit 1
fi

echo ""
echo "6. 检查文档文件..."
docs=(
    "UI_UPDATE.md"
    "DEMO.md"
    "UPDATE_SUMMARY.md"
)

for doc in "${docs[@]}"; do
    if [ -f "$doc" ]; then
        echo "✓ $doc 存在"
    else
        echo "✗ $doc 缺失"
        exit 1
    fi
done

echo ""
echo "7. 检查功能实现..."

if grep -q "useState(10)" app/logs/page.tsx; then
    echo "✓ 默认刷新时间已改为 10s"
else
    echo "✗ 默认刷新时间未修改"
    exit 1
fi

if grep -q "setElapsedTime" app/logs/page.tsx; then
    echo "✓ 计时器功能已实现"
else
    echo "✗ 计时器功能未实现"
    exit 1
fi

if grep -q "scrollAreaRef" app/logs/page.tsx; then
    echo "✓ 自动滚动功能已实现"
else
    echo "✗ 自动滚动功能未实现"
    exit 1
fi

if grep -q "Button" app/page.tsx && grep -q "@/components/ui/button" app/page.tsx; then
    echo "✓ Button 组件已导入"
else
    echo "✗ Button 组件未导入"
    exit 1
fi

if grep -q "Card" app/page.tsx && grep -q "@/components/ui/card" app/page.tsx; then
    echo "✓ Card 组件已导入"
else
    echo "✗ Card 组件未导入"
    exit 1
fi

echo ""
echo "8. 构建测试..."
if npm run build >/dev/null 2>&1; then
    echo "✓ 项目构建成功"
else
    echo "✗ 项目构建失败"
    exit 1
fi

echo ""
echo "==================================="
echo "  所有测试通过！"
echo "==================================="
echo ""
echo "启动应用进行可视化测试："
echo "  npm run dev"
echo ""
echo "访问地址："
echo "  http://localhost:12306"
echo ""
