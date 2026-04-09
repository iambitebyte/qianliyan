# Qianliyan - Log Watcher

一个用于监控和查看日志文件的 Next.js 应用程序。

**版本**: v0.2.2  
**更新日期**: 2024-04-09

## 特性

1. **文件夹管理**
   - 添加和删除要监控的文件夹路径
   - 文件夹保存在本地 JSON 文件中（无需数据库）

2. **文件浏览器**
   - 浏览监控文件夹中的 `.txt` 和 `.log` 文件
   - 文件按修改时间排序

3. **实时日志查看**
   - 可配置的自动刷新间隔（1s、2s、5s、10s、30s 或手动）
   - 跟踪最后更新时间
   - 语法高亮以获得更好的可读性

4. **用户友好的界面**
   - 响应式设计
   - 直观的文件浏览
   - 实时更新指示器
   - 基于 Tailwind CSS 的现代化 UI
   - shadcn/ui 组件库

5. **灵活的端口配置**
   - 通过 `.env` 文件配置端口
   - 开发和生产环境独立配置
   - 默认端口：12306

6. **智能日志查看**
   - 浏览器端实时计时器
   - 自动滚动到最新日志
   - 智能滚动控制

## 安装

```bash
npm install
```

## 配置

复制 `.env.example` 为 `.env` 并修改配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# Server port
PORT=12306

# Data folder path (relative to project root or absolute path)
DATA_DIR=./data
```

## 开发

```bash
npm run dev
```

或使用启动脚本：

```bash
./start.sh
```

或使用快速启动脚本（带示例数据）：

```bash
./quick-start.sh
```

应用将在配置的端口上运行（默认：http://localhost:12306）

## 构建

```bash
npm run build
```

## 生产环境运行

```bash
npm start
```

## 使用方法

1. 在浏览器中打开应用程序（默认为 http://localhost:12306）
2. 添加一个要监控的文件夹路径（例如：`/var/log`）
3. 浏览文件夹中的文件
4. 选择一个文件查看其内容
5. 设置刷新间隔以自动更新

## API 端点

- `GET /api/folders` - 获取所有监控的文件夹
- `POST /api/folders` - 添加新文件夹
- `DELETE /api/folders` - 删除文件夹
- `GET /api/files?path=<folder_path>` - 获取文件夹中的文件列表
- `GET /api/logs?path=<file_path>` - 获取日志文件内容

## 文件结构

```
qianliyan/
├── app/
│   ├── api/
│   │   ├── folders/route.ts    # 文件夹管理 API
│   │   ├── files/route.ts      # 文件列表 API
│   │   └── logs/route.ts       # 日志内容 API
│   ├── logs/
│   │   └── page.tsx            # 日志查看页面
│   ├── globals.css             # 全局样式
│   ├── layout.tsx              # 根布局
│   └── page.tsx                # 主页
├── data/
│   └── folders.json            # 文件夹数据存储
├── .env                        # 环境变量配置
├── .env.example                # 环境变量示例
├── .env.production             # 生产环境配置
└── package.json
```

## 技术栈

- Next.js 16.1.7
- React 19.2.3
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Lucide Icons
- dotenv-cli

## 注意事项

- 应用需要对日志文件有读取权限
- 文件夹路径必须是有效的绝对路径
- 仅支持 `.txt` 和 `.log` 文件扩展名
- 数据存储在 `data/folders.json` 中，请确保该目录有写权限
- 确保配置的端口未被其他程序占用

## 许可证

MIT
