# Qianliyan 项目总结

## 项目概述
Qianliyan 是一个基于 Next.js 的日志文件监控和查看工具，允许用户实时监控服务器上的日志文件。

## 已实现的功能

### 1. 文件夹管理 ✓
- [x] 维护本地文件夹路径列表
- [x] 保存到本地 JSON 文件（无数据库）
- [x] 支持录入文件夹路径
- [x] 检查文件夹是否存在
- [x] 删除不需要的文件夹

### 2. 文件浏览 ✓
- [x] 浏览选中文件夹中的文件
- [x] 仅显示 .txt 和 .log 文件
- [x] 显示文件信息（名称、大小、修改时间）
- [x] 按修改时间排序

### 3. 日志内容查看 ✓
- [x] 查看文件内容
- [x] 前端定时刷新
- [x] 可配置刷新间隔（1s、2s、5s、10s、30s、手动）
- [x] 手动刷新按钮
- [x] 语法高亮显示

### 4. 时间显示 ✓
- [x] 显示最后一条日志到现在的时间
- [x] 基于网页最后一次更新到新内容的时间
- [x] 友好的时间格式（如 "5s ago", "2m ago"）

## 技术栈

### 前端
- **框架**: Next.js 16.1.7 (App Router)
- **UI 库**: React 19.2.3
- **样式**: Tailwind CSS
- **图标**: Lucide React
- **语言**: TypeScript

### 后端
- **API**: Next.js API Routes
- **文件操作**: Node.js File System (fs/promises)
- **数据存储**: JSON 文件
- **环境变量**: dotenv-cli
- **无需数据库**: 使用本地文件系统

## 项目结构

```
/home/chenshuyang/project/logs_watcher/
├── app/
│   ├── api/                      # API 路由
│   │   ├── folders/route.ts      # 文件夹管理 API (GET, POST, DELETE)
│   │   ├── files/route.ts        # 文件列表 API (GET)
│   │   └── logs/route.ts         # 日志内容 API (GET)
│   ├── logs/
│   │   └── page.tsx              # 日志查看页面
│   ├── globals.css               # 全局样式
│   ├── layout.tsx                # 根布局
│   └── page.tsx                  # 主页（文件夹列表）
├── data/
│   └── folders.json              # 文件夹数据存储
├── public/                       # 静态资源
├── .gitignore                    # Git 忽略文件
├── next.config.ts               # Next.js 配置
├── tsconfig.json                # TypeScript 配置
├── package.json                 # 项目依赖
├── README.md                    # 项目说明
├── USAGE.md                     # 使用指南
├── start.sh                     # 启动脚本
└── quick-start.sh              # 快速启动脚本（带示例数据）
```

## API 端点

### 1. 文件夹管理

**获取所有文件夹**
```
GET /api/folders
```

**添加文件夹**
```
POST /api/folders
Content-Type: application/json

{
  "path": "/var/log"
}
```

**删除文件夹**
```
DELETE /api/folders
Content-Type: application/json

{
  "path": "/var/log"
}
```

### 2. 文件列表

**获取文件夹中的文件**
```
GET /api/files?path=/var/log
```

### 3. 日志内容

**获取日志文件内容**
```
GET /api/logs?path=/var/log/syslog
```

## 使用方法

### 启动应用

**方式 1：使用 npm**
```bash
cd /home/chenshuyang/project/logs_watcher
npm run dev
```

**方式 2：使用启动脚本**
```bash
./start.sh
```

**方式 3：使用快速启动脚本（带示例数据）**
```bash
./quick-start.sh
```

应用将在 http://localhost:3000 上运行。

### 基本操作

1. **添加文件夹**
   - 在主页输入框中输入文件夹路径（例如：`/var/log`）
   - 点击 "Add" 按钮

2. **查看日志**
   - 点击文件夹列表中的文件夹
   - 在文件列表中选择一个 `.log` 或 `.txt` 文件
   - 日志内容将显示在右侧面板

3. **设置刷新间隔**
   - 在日志查看页面选择刷新间隔
   - 日志内容将自动更新
   - 可以看到 "Last update" 时间

## 构建和部署

### 构建
```bash
npm run build
```

### 生产环境启动
```bash
npm start
```

### 使用 PM2 部署
```bash
npm install -g pm2
pm2 start npm --name "qianliyan" -- start
pm2 save
pm2 startup
```

## 特色功能

1. **无数据库依赖** - 使用本地 JSON 文件存储配置
2. **实时更新** - 可配置的自动刷新间隔
3. **用户友好** - 直观的界面和操作
4. **响应式设计** - 适配不同屏幕尺寸
5. **语法高亮** - 更好的日志可读性
6. **时间追踪** - 清晰显示更新时间

## 注意事项

1. 应用需要对日志文件有读取权限
2. 文件夹路径必须是有效的绝对路径
3. 仅支持 `.txt` 和 `.log` 文件扩展名
4. 数据存储在 `data/folders.json` 中
5. 确保应用有写入 `data` 目录的权限

## 测试

创建测试日志文件夹：
```bash
mkdir -p /tmp/qianliyan_logs
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Test log entry" > /tmp/qianliyan_logs/test.log
```

然后在应用中添加 `/tmp/qianliyan_logs` 文件夹进行测试。

## 未来可能的改进

1. 添加日志搜索功能
2. 支持更多文件格式（如 JSON 日志）
3. 添加日志过滤功能
4. 支持 WebSocket 实时推送
5. 添加用户认证
6. 支持多服务器监控
7. 添加日志统计和图表
8. 支持日志导出

## 许可证
MIT
