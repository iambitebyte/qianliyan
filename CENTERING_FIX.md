# 主页居中布局修复

## 问题描述
首页元素没有居中显示，所有内容都靠左显示。

## 解决方案
修改了主页布局，确保所有元素都正确居中显示。

## 修改内容

### 1. 调整容器布局
- **修改前**: `max-w-6xl mx-auto`（宽度过大，导致内容不居中）
- **修改后**: `max-w-3xl mx-auto` + `flex-1 flex flex-col justify-center`（更合适的宽度，垂直居中）

### 2. 调整标题布局
- **修改前**: 标题和图标靠左对齐
- **修改后**: 使用 `items-center justify-center` 使标题和图标居中

### 3. 调整卡片标题布局
- **修改前**: 卡片标题靠左对齐
- **修改后**: 使用 `items-center justify-center` 使卡片标题居中

### 4. 调整页面整体布局
- **修改前**: 简单的 padding
- **修改后**: 使用 `flex flex-col` + `justify-center` 使内容垂直居中

## 修改后的效果

### 主页布局
```
┌─────────────────────────────────┐
│                                 │
│                                 │
│          [Logo] Qianliyan        │  ← 居中
│        实时日志监控工具          │  ← 居中
│                                 │
│     ┌─────────────────────┐    │
│     │ 添加监控文件夹       │    │  ← 居中
│     └─────────────────────┘    │
│                                 │
│     ┌─────────────────────┐    │
│     │ 监控文件夹列表       │    │  ← 居中
│     │                     │    │
│     │ [文件夹 1] [打开]   │    │
│     │ [文件夹 2] [打开]   │    │
│     └─────────────────────┘    │
│                                 │
│    Qianliyan v0.2.1            │  ← 居中
│                                 │
└─────────────────────────────────┘
```

## 代码对比

### 修改前的容器
```tsx
<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
  <div className="max-w-6xl mx-auto">
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-blue-600 rounded-lg p-2">
          <ShieldCheck className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900">Qianliyan</h1>
      </div>
      <p className="text-gray-600 ml-14">实时日志监控工具</p>
    </div>
    ...
  </div>
</div>
```

### 修改后的容器
```tsx
<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8 flex flex-col">
  <div className="w-full max-w-3xl mx-auto flex-1 flex flex-col justify-center">
    <div className="mb-12 text-center">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="bg-blue-600 rounded-lg p-3">
          <ShieldCheck className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Qianliyan</h1>
      </div>
      <p className="text-gray-600 text-lg">实时日志监控工具</p>
    </div>
    ...
  </div>
</div>
```

## 关键修改点

### 1. 容器宽度
- `max-w-6xl` → `max-w-3xl`
- 更适合单栏居中布局

### 2. 垂直居中
- 添加 `flex flex-col` 到最外层容器
- 添加 `flex-1 flex flex-col justify-center` 到内容容器
- 确保内容在视口中垂直居中

### 3. 文本居中
- 标题: `items-center justify-center`
- 描述: `text-center`
- 卡片标题: `items-center justify-center`

### 4. 图标大小
- `w-8 h-8` → `w-12 h-12`
- 更大的图标，更醒目

### 5. 间距调整
- `mb-8` → `mb-12`
- 增加标题和内容之间的间距

## 响应式设计

### 移动端（< 768px）
- 最大宽度: 100%
- 标题大小: text-4xl
- 间距: 适中的 padding

### 平板和桌面（≥ 768px）
- 最大宽度: max-w-3xl (48rem)
- 标题大小: text-5xl
- 间距: 适当的 padding

## 测试验证

### 视觉检查
- ✅ 标题居中
- ✅ 描述居中
- ✅ 卡片标题居中
- ✅ 内容垂直居中
- ✅ 响应式布局正常

### 功能检查
- ✅ 添加文件夹功能正常
- ✅ 文件夹列表显示正常
- ✅ 打开和删除功能正常

## 浏览器兼容性

- ✅ Chrome/Edge (最新版)
- ✅ Firefox (最新版)
- ✅ Safari (最新版)
- ✅ 移动浏览器

## 相关文件

- `app/page.tsx` - 主页组件

## 后续建议

如果需要进一步调整布局，可以修改以下参数：
- `max-w-3xl` → 调整容器最大宽度
- `mb-12` → 调整标题和内容之间的间距
- `p-4 md:p-8` → 调整页面内边距
- `text-4xl md:text-5xl` → 调整标题大小

---

**更新日期**: 2024-04-09
**版本**: v0.2.2
**状态**: ✅ 已修复并测试
