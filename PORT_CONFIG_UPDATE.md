# Qianliyan 端口配置更新说明

## 更新内容

已为 Qianliyan 添加端口配置功能，允许运行在不同的端口上（默认：12306）。

## 新增文件

1. **.env** - 开发环境配置文件（端口：12306）
2. **.env.example** - 环境变量配置示例
3. **.env.production** - 生产环境配置文件（端口：12306）
4. **CONFIG.md** - 详细的配置指南
5. **check-config.sh** - 配置检查脚本

## 修改文件

1. **package.json**
   - 添加 `dotenv-cli` 依赖
   - 修改启动脚本使用环境变量
   - 开发：`dotenv -e .env -- next dev`
   - 生产：`dotenv -e .env.production -- next start`

2. **start.sh** - 添加端口显示功能

3. **quick-start.sh** - 添加端口显示功能

4. **README.md** - 添加端口配置说明

5. **USAGE.md** - 添加环境变量和端口配置说明

6. **PROJECT_SUMMARY.md** - 添加 dotenv-cli 技术栈说明

## 快速开始

### 1. 确认依赖已安装
```bash
npm install
```

### 2. 检查配置
```bash
./check-config.sh
```

### 3. 启动应用
```bash
npm run dev
```

应用将在 **12306** 端口运行。

### 4. 访问应用
```
http://localhost:12306
```

## 修改端口

### 方法 1：编辑 .env 文件（开发环境）
```bash
nano .env
```

修改 `PORT` 变量：
```env
PORT=8080
```

### 方法 2：编辑 .env.production 文件（生产环境）
```bash
nano .env.production
```

修改 `PORT` 变量：
```env
PORT=8080
```

### 方法 3：命令行临时设置
```bash
PORT=8080 npm run dev
```

## 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| PORT | 服务器端口 | 12306 |
| DATA_DIR | 数据文件夹路径 | ./data |

## 启动命令

```bash
# 开发环境
npm run dev

# 生产环境
npm run build
npm start

# 使用启动脚本
./start.sh

# 使用快速启动脚本（带示例数据）
./quick-start.sh

# 检查配置
./check-config.sh
```

## 测试验证

已验证以下功能：
- ✓ 端口配置正确加载
- ✓ 应用在 12306 端口正常启动
- ✓ 环境变量正确传递
- ✓ 配置检查脚本正常工作
- ✓ 构建成功

## 项目文件列表

```
/home/chenshuyang/project/logs_watcher/
├── .env                      # 开发环境配置（端口：12306）
├── .env.example              # 配置示例
├── .env.production           # 生产环境配置
├── .gitignore                # Git 忽略文件
├── CONFIG.md                 # 配置指南
├── README.md                 # 项目说明
├── USAGE.md                  # 使用指南
├── PROJECT_SUMMARY.md        # 项目总结
├── check-config.sh           # 配置检查脚本
├── start.sh                  # 启动脚本
├── quick-start.sh           # 快速启动脚本
├── package.json             # 项目依赖
├── tsconfig.json            # TypeScript 配置
└── app/                     # 应用代码
```

## 注意事项

1. **.env 文件**：包含敏感配置，已添加到 `.gitignore`，不会提交到版本控制
2. **端口占用**：启动前确保配置的端口未被占用
3. **权限要求**：确保应用有读取日志文件和写入数据目录的权限
4. **防火墙**：如需远程访问，请开放相应端口

## 下一步

- [ ] 根据需要修改默认端口
- [ ] 配置防火墙规则（如需远程访问）
- [ ] 设置 Nginx 反向代理（可选）
- [ ] 配置 PM2 自动启动（生产环境）

## 技术支持

详细配置说明请参考：
- **CONFIG.md** - 完整的配置指南
- **USAGE.md** - 使用方法说明
- **README.md** - 项目概述

## 端口选择建议

- **12306** - 默认端口（推荐，与本项目关联）
- **3000** - Next.js 默认端口
- **8080** - 常用开发端口
- **3001-3099** - 备选端口范围

## 快速测试

```bash
# 1. 检查配置
./check-config.sh

# 2. 启动应用
npm run dev

# 3. 访问测试
# 在浏览器打开: http://localhost:12306

# 4. 停止应用
# Ctrl+C
```

---

**更新日期**: 2024-04-09
**默认端口**: 12306
**状态**: ✓ 已测试并验证
