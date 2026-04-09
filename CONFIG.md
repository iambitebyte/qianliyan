# Qianliyan 配置指南

## 端口配置

### 默认配置

Qianliyan 默认运行在 **12306** 端口上。

### 修改端口

#### 1. 编辑 `.env` 文件（开发环境）

```bash
nano .env
```

修改 `PORT` 变量：

```env
# Server port
PORT=8080

# Data folder path (relative to project root or absolute path)
DATA_DIR=./data
```

#### 2. 编辑 `.env.production` 文件（生产环境）

```bash
nano .env.production
```

修改 `PORT` 变量：

```env
# Server port (production)
PORT=8080

# Data folder path (relative to project root or absolute path)
DATA_DIR=./data
```

### 环境变量说明

| 变量名 | 说明 | 默认值 | 必需 |
|--------|------|--------|------|
| PORT | 服务器监听端口 | 12306 | 否 |
| DATA_DIR | 数据文件夹路径 | ./data | 否 |

### 端口选择建议

- **12306** - 默认端口（推荐）
- **3000** - Next.js 默认端口
- **8080** - 常用开发端口
- **3001-3099** - 备选端口范围

注意：确保选择的端口没有被其他程序占用。

### 检查端口占用

Linux/macOS:
```bash
lsof -i :12306
# 或
netstat -tuln | grep 12306
```

Windows:
```cmd
netstat -ano | findstr :12306
```

### 启动应用

#### 开发环境

```bash
npm run dev
```

应用将读取 `.env` 文件中的配置。

#### 生产环境

```bash
npm run build
npm start
```

应用将读取 `.env.production` 文件中的配置。

### 启动脚本

项目提供了两个启动脚本，会自动读取 `.env` 配置：

#### start.sh

```bash
./start.sh
```

显示端口信息并启动应用。

#### quick-start.sh

```bash
./quick-start.sh
```

创建测试数据并启动应用，显示端口信息。

### 环境文件说明

- **.env** - 开发环境配置（不提交到版本控制）
- **.env.example** - 配置示例（提交到版本控制）
- **.env.production** - 生产环境配置（不提交到版本控制）

### 配置示例

#### 开发环境 (.env)

```env
# Server port
PORT=12306

# Data folder path (relative to project root or absolute path)
DATA_DIR=./data
```

#### 生产环境 (.env.production)

```env
# Server port (production)
PORT=12306

# Data folder path (relative to project root or absolute path)
DATA_DIR=/var/lib/qianliyan/data
```

### 访问应用

启动后，在浏览器中访问：

```
http://localhost:PORT
```

例如，如果端口是 12306：

```
http://localhost:12306
```

### 防火墙配置

如果需要远程访问，需要开放防火墙端口：

#### UFW (Ubuntu)

```bash
sudo ufw allow 12306/tcp
```

#### firewall-cmd (CentOS)

```bash
sudo firewall-cmd --permanent --add-port=12306/tcp
sudo firewall-cmd --reload
```

### Nginx 反向代理配置

如果需要通过 Nginx 反向代理访问：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:12306;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### PM2 配置

使用 PM2 管理时，确保 `.env.production` 配置正确：

```bash
pm2 start npm --name "qianliyan" -- start
```

PM2 会自动读取 `.env.production` 文件。

### 故障排除

#### 端口被占用

如果启动时提示端口被占用：

1. 检查端口占用情况
2. 修改 `.env` 文件中的 `PORT`
3. 重新启动应用

#### 配置不生效

确保：
1. `.env` 文件位于项目根目录
2. `package.json` 中的脚本使用了 `dotenv -e .env`
3. 环境变量格式正确（KEY=value，无空格）

#### 权限问题

确保：
1. 应用有读取日志文件的权限
2. 应用有写入 `DATA_DIR` 目录的权限

## 高级配置

### 自定义数据目录

如果想要使用不同的数据目录：

```env
# Data folder path (relative to project root or absolute path)
DATA_DIR=/var/lib/qianliyan/data
```

确保该目录存在且有正确的权限。

### 多环境配置

可以为不同的环境创建不同的配置文件：

- `.env.development` - 开发环境
- `.env.staging` - 测试环境
- `.env.production` - 生产环境

然后在 `package.json` 中使用对应的配置：

```json
{
  "scripts": {
    "dev": "dotenv -e .env.development -- next dev",
    "staging": "dotenv -e .env.staging -- next start",
    "prod": "dotenv -e .env.production -- next start"
  }
}
```

## 总结

1. 复制 `.env.example` 为 `.env`
2. 修改 `PORT` 变量设置端口
3. 运行 `npm run dev` 或 `npm start`
4. 在浏览器中访问 `http://localhost:PORT`
