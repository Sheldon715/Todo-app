# Todo App（全栈）— React + Vite + Express + Postgres + JWT + Google OAuth

一个可部署的全栈 Todo 应用：支持 **账号体系（JWT + Google 登录）**、**每个用户数据隔离**、**排序持久化**，以及完整的 UI 交互体验（暗黑模式 / 拖拽排序 / 筛选 / 清除已完成 / loading + 错误提示）。

> 为什么这不是普通 Todo Demo？
> - 真实鉴权：JWT（注册/登录）+ Google OAuth
> - 真实数据库：Postgres（Neon）
> - 真实部署：Vercel 前端 + Vercel Serverless 后端
> - 真实权限控制：Todos API 全部按 `user_id` 做隔离与校验
> - 真实排序持久化：`position` 字段 + `/reorder` API
> - 产品级交互：请求中禁用操作、防重复点击、统一错误提示

---

## 在线地址

- **前端（Vercel）**：`https://todo-app-fronted.vercel.app`
- **后端（Vercel）**：`https://todo-app-backend-topaz-rho.vercel.app`

> 说明：访问后端根路径 `/` 可能显示 `Cannot GET /`，这是正常的（后端只提供 `/api`）。

---

## 功能特性

### 账号 / 鉴权

- **邮箱注册 / 登录（JWT）**
- **刷新后恢复登录态**：通过 `GET /api/auth/me` 获取当前用户并显示 email
- **Google OAuth 登录**
  - 使用 `prompt=select_account`：每次点击都可重新选择账号（方便测试 / demo）

### Todo

- 添加 / 勾选完成 / 删除
- Filter：All / Active / Completed
- Clear Completed（清除已完成）
- items left 统计
- **拖拽排序（桌面端）**
- **排序持久化**：`position` 字段 + `PUT /api/todos/reorder`
- **强制数据隔离**：每个用户只能操作自己的 todos（后端校验）
- **并发保护**：请求中禁用操作，防止重复点击导致并发请求
- **统一错误反馈**：API 层统一抛错，上层统一展示（Toast / banner）

### UI / UX

- Light / Dark 主题
- 响应式布局（桌面/移动端背景）
- 自定义 Checkbox
- 移动端拖拽刻意不做（避免体验/兼容问题）

---

## 技术栈

### 前端

- React + Vite
- Tailwind CSS（见 `client/tailwind.config.js` / `client/postcss.config.js`）

### 后端

- Node.js + Express
- JWT（`jsonwebtoken`）
- bcryptjs 密码哈希
- Google OAuth（Passport）
- Postgres（`pg`）

### 数据库

- Neon Postgres

### 部署

- Vercel 前端
- Vercel 后端（Serverless handler）

---

## 项目结构（概览）

```text
client/                    # React 前端（Vite）
  src/
    api/                   # fetch 封装（auth.js, todo.js）
    components/            # UI 组件

server/                    # Express 后端
  app.js                   # Express app（只导出 app，不 listen）
  index.js                 # 本地开发：app.listen(...)
  api/index.js             # Vercel Serverless 入口
  vercel.json              # 把 /api/* rewrite 到 serverless handler
  db.js                    # pg Pool（DATABASE_URL）
  auth/google.js           # Google OAuth strategy
```

---

## 环境变量

### 前端（Vercel 或本地 `client/.env`）

本项目代码使用的是 **`VITE_API_ORIGIN`**（不要把 `/api` 写进 base url，否则会出现 `/api/api/...` 的 404）。

```bash
VITE_API_ORIGIN=https://todo-app-backend-topaz-rho.vercel.app
```

### 后端（Vercel 或 `server/.env`）

```bash
# Postgres（Neon）
DATABASE_URL=postgres://...

# JWT
JWT_SECRET=replace_me_with_a_strong_secret
JWT_EXPIRES_IN=7d

# 可选：Vercel/线上域名（用于拼 Google 回调、以及 OAuth 登录后重定向回前端）
CLIENT_BASE_URL=https://todo-app-fronted.vercel.app
SERVER_ORIGIN=https://todo-app-backend-topaz-rho.vercel.app

# Google OAuth（可选）
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
# 一般不用填；如需固定则写死：
GOOGLE_CALLBACK_URL=https://todo-app-backend-topaz-rho.vercel.app/api/auth/google/callback
```

> 本地开发时：`CLIENT_BASE_URL=http://localhost:5173`，`SERVER_ORIGIN=http://localhost:4000`，回调一般是 `http://localhost:4000/api/auth/google/callback`。

---

## 本地运行

### 前置要求

- Node.js 18+
- Postgres（Neon 或本地）

### 1）创建数据库表（Neon / 本地 Postgres）

项目未包含迁移脚本，可先执行：

```sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS todos (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  position INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_todos_user_position ON todos(user_id, position);
```

### 2）启动后端（默认 4000）

```bash
cd server
npm install
npm run dev
```

后端：`http://localhost:4000`（API 在 `/api`）

### 3）启动前端（默认 5173）

```bash
cd client
npm install
npm run dev
```

前端：`http://localhost:5173`

---

## API 说明

### Auth

- `POST /api/auth/register`
  - body: `{ "email": "...", "password": "..." }`
  - returns: `{ token, user }`
- `POST /api/auth/login`
  - body: `{ "email": "...", "password": "..." }`
  - returns: `{ token, user }`
- `GET /api/auth/me`
  - header: `Authorization: Bearer <token>`
  - returns: `{ user }`
- `GET /api/auth/google`
  - 跳转到 Google 授权页
- `GET /api/auth/google/callback`
  - OAuth 回调：成功后重定向到前端 `/?token=...&email=...`

### Todos（必须带 JWT）

所有 Todos API 必须带：

- `Authorization: Bearer <token>`

接口：

- `GET /api/todos`（按 `position ASC, id ASC` 返回）
- `POST /api/todos`：body `{ "text": "..." }`
- `PATCH /api/todos/:id`：body `{ "completed": true }`
- `DELETE /api/todos/:id`
- `DELETE /api/todos`：清除已完成（`completed=true`）
- `PUT /api/todos/reorder`：body `{ "orderIds": [1,2,3] }`

---

## 数据库结构

### users

- `id` SERIAL PK
- `email` UNIQUE NOT NULL
- `password_hash` NOT NULL
- `created_at` default now()

### todos

- `id` SERIAL PK
- `user_id` NOT NULL REFERENCES users(id) ON DELETE CASCADE
- `text` NOT NULL
- `completed` default false
- `position` NOT NULL（排序使用）

> id 不连续是正常现象（删除不会重置自增序列）。排序依赖 `position`。

---

## 错误处理与交互说明

- 前端 API 层统一抛出包含 `status` 的错误（`error.status` + `error.message`），便于上层统一处理
- 请求进行中禁用操作，防止重复点击造成并发请求

---

## 部署说明（Vercel + Neon）

### 前端（Vercel）

- **Build Root Directory**：`client`
- **环境变量**：
  - `VITE_API_ORIGIN=https://todo-app-backend-topaz-rho.vercel.app`

### 后端（Vercel）

后端采用：

- `server/api/index.js`：serverless handler
- `server/vercel.json`：把 `/api/*` rewrite 到 handler

建议：

- **Build Root Directory**：`server`
- **环境变量**（至少）：
  - `DATABASE_URL`（Neon）
  - `JWT_SECRET`
  - `JWT_EXPIRES_IN`
  - `CLIENT_BASE_URL=https://todo-app-fronted.vercel.app`
  - `SERVER_ORIGIN=https://todo-app-backend-topaz-rho.vercel.app`

### Neon（Postgres）

- 在 Neon 的 SQL Editor 执行一次建表 SQL
- 把 Neon 提供的连接串填到 Vercel 后端的 `DATABASE_URL`

> 本项目在 `NODE_ENV=production` 时对 pg 启用 SSL（见 `server/db.js`），可直接适配 Neon。

### Google OAuth（如果你启用）

在 Google Cloud Console：

- **Authorized JavaScript origins**
  - `https://todo-app-fronted.vercel.app`
  - `https://todo-app-backend-topaz-rho.vercel.app`
- **Authorized redirect URIs**
  - `https://todo-app-backend-topaz-rho.vercel.app/api/auth/google/callback`

---

## 后续优化（可选）

- 把全局 loading 细化为 per-action（add/toggle/delete/clear/reorder）
- 更完善的网络错误/离线提示
- E2E 测试（Playwright/Cypress）
- CI（lint/test）+ Preview 部署

---

## License

MIT


