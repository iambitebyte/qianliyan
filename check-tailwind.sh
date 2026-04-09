#!/bin/bash

echo "==================================="
echo "  Tailwind CSS 配置检查"
echo "==================================="
echo ""

echo "1. 检查配置文件..."
if [ -f "tailwind.config.ts" ]; then
    echo "✓ tailwind.config.ts 存在"
    grep -q "content:" tailwind.config.ts && echo "✓ content 配置正确" || echo "✗ content 配置缺失"
    grep -q "theme:" tailwind.config.ts && echo "✓ theme 配置正确" || echo "✗ theme 配置缺失"
else
    echo "✗ tailwind.config.ts 不存在"
fi

if [ -f "postcss.config.mjs" ]; then
    echo "✓ postcss.config.mjs 存在"
    grep -q "@tailwindcss/postcss" postcss.config.mjs && echo "✓ Tailwind PostCSS 插件已配置" || echo "✗ Tailwind PostCSS 插件未配置"
else
    echo "✗ postcss.config.mjs 不存在"
fi

echo ""
echo "2. 检查 globals.css..."
if [ -f "app/globals.css" ]; then
    echo "✓ app/globals.css 存在"
    grep -q "@import \"tailwindcss\"" app/globals.css && echo "✓ Tailwind 导入正确" || echo "✗ Tailwind 导入缺失"
    grep -q "@layer utilities" app/globals.css && echo "✓ utilities 层配置正确" || echo "⚠ utilities 层未配置"
else
    echo "✗ app/globals.css 不存在"
fi

echo ""
echo "3. 检查页面中的 Tailwind 类..."
if grep -q "className=\".*flex.*\"" app/page.tsx; then
    echo "✓ 主页使用 flex 类"
else
    echo "⚠ 主页未检测到 flex 类"
fi

if grep -q "bg-gradient-to-br" app/page.tsx; then
    echo "✓ 主页使用渐变背景"
else
    echo "⚠ 主页未检测到渐变背景"
fi

if grep -q "className=\".*flex.*\"" app/logs/page.tsx; then
    echo "✓ 日志页面使用 flex 类"
else
    echo "⚠ 日志页面未检测到 flex 类"
fi

echo ""
echo "4. 检查构建文件..."
if [ -d ".next" ]; then
    echo "✓ .next 目录存在"
    css_files=$(find .next -name "*.css" -type f | wc -l)
    echo "✓ 找到 $css_files 个 CSS 文件"
    
    if [ $css_files -gt 0 ]; then
        echo "✓ Tailwind 样式已生成"
    else
        echo "✗ 未找到 CSS 文件"
    fi
else
    echo "⚠ .next 目录不存在（需要先构建）"
fi

echo ""
echo "5. 检查 Tailwind 功能..."
if grep -q "@tailwindcss/postcss" postcss.config.mjs; then
    echo "✓ 使用 Tailwind CSS v4（新语法）"
    
    if grep -q "@import \"tailwindcss\"" app/globals.css; then
        echo "✓ 使用正确的 v4 导入语法"
    fi
else
    echo "⚠ 使用传统 Tailwind CSS v3 语法"
fi

echo ""
echo "==================================="
echo "  检查完成"
echo "==================================="
echo ""
echo "如果所有检查都通过，请："
echo "1. 清理构建缓存：rm -rf .next"
echo "2. 重新构建：npm run build"
echo "3. 启动开发服务器：npm run dev"
echo "4. 在浏览器中访问：http://localhost:12306"
echo ""
echo "如果 Tailwind 仍然不工作，请检查："
echo "- 浏览器控制台是否有错误"
echo "- 网络请求是否成功加载 CSS"
echo "- 元素检查器中样式是否被应用"
echo ""
