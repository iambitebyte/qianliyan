# Qianliyan 使用指南

## 快速开始

### 1. 安装依赖
```bash
cd /home/chenshuyang/project/logs_watcher
npm install
```

### 2. 配置端口

复制 `.env.example` 为 `.env`：

```bash
cp .env.example .env
```

编辑 `.env` 文件，设置端口：

```env
# Server port
PORT=12306

# Data folder path (relative to project root or absolute path)
DATA_DIR=./data
```

### 3. 启动应用
```bash
npm run dev
```

应用将在配置的端口上运行（默认：http://localhost:12306）

## 启动方式

### 方式 1：使用 npm
```bash
npm run dev          # 开发环境
npm run build        # 构建
npm start            # 生产环境
```

### 方式 2：使用启动脚本
```bash
./start.sh
```

### 方式 3：使用快速启动脚本（带示例数据）
```bash
./quick-start.sh
```

## 基本操作

### 1. 添加监控文件夹

在主页上：
1. 在 "Add New Folder" 输入框中输入文件夹路径（例如：`/var/log` 或 `/tmp/test_logs`）
2. 点击 "Add" 按钮或按 Enter 键

### 2. 查看日志文件

1. 点击文件夹列表中的文件夹进入文件浏览器
2. 在文件列表中选择一个 `.txt` 或 `.log` 文件
3. 日志内容将显示在右侧面板

### 3. 设置自动刷新

在日志查看页面：
1. 选择刷新间隔（1s、2s、5s、10s、30s 或手动）
2. 日志内容将自动更新
3. "Last update" 显示距离上次更新的时间

## 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| PORT | 服务器端口 | 12306 |
| DATA_DIR | 数据文件夹路径 | ./data |

## 功能说明

### 主页
- **文件夹列表**：显示所有已添加的监控文件夹
- **添加文件夹**：输入路径并添加到监控列表
- **删除文件夹**：点击删除按钮移除不需要的文件夹
- **打开文件夹**：点击文件夹进入日志查看页面

### 日志查看页面
- **文件列表**：显示当前文件夹中的所有 `.txt` 和 `.log` 文件
- **文件信息**：显示文件名、大小和修改时间
- **日志内容**：以语法高亮的形式显示日志内容
- **自动刷新**：可配置的刷新间隔
- **最后更新时间**：显示距离上次更新的时间

## API 文档

### 获取所有文件夹
```
GET /api/folders
```

返回：
```json
{
  "folders": [
    {
      "path": "/var/log",
      "name": "log"
    }
  ]
}
```

### 添加文件夹
```
POST /api/folders
Content-Type: application/json

{
  "path": "/var/log"
}
```

### 删除文件夹
```
DELETE /api/folders
Content-Type: application/json

{
  "path": "/var/log"
}
```

### 获取文件列表
```
GET /api/files?path=/var/log
```

返回：
```json
{
  "files": [
    {
      "name": "syslog",
      "size": 1024,
      "modified": "2024-04-09T12:00:00.000Z"
    }
  ]
}
```

### 获取日志内容
```
GET /api/logs?path=/var/log/syslog
```

返回：
```json
{
  "content": "[2024-04-09 12:00:00] Log entry here\n"
}
```

## 技术细节

### 数据存储
- 文件夹列表存储在 `data/folders.json`
- 使用文件系统读取日志文件
- 不使用数据库，数据持久化到本地文件

### 前端技术
- Next.js 16.1.7 (App Router)
- React 19.2.3
- TypeScript
- Tailwind CSS
- Lucide React Icons

### 后端技术
- Next.js API Routes
- Node.js File System API
- JSON 文件存储
- dotenv-cli 环境变量管理

## 故障排除

### 端口被占用
如果端口被占用，修改 `.env` 文件中的 `PORT` 变量：

```env
PORT=8080
```

### 文件夹无法添加
- 确保输入的路径是绝对路径
- 确保文件夹存在
- 确保应用有读取该文件夹的权限

### 日志文件无法显示
- 确保文件扩展名是 `.txt` 或 `.log`
- 确保应用有读取该文件的权限
- 检查文件是否为空

### 自动刷新不工作
- 检查刷新间隔设置
- 确保选择了有效的文件
- 检查浏览器控制台是否有错误

## 生产环境部署

### 构建
```bash
npm run build
```

### 启动
```bash
npm start
```

### 使用 PM2（推荐）
```bash
npm install -g pm2
pm2 start npm --name "qianliyan" -- start
pm2 save
pm2 startup
```

## 许可证
MIT
