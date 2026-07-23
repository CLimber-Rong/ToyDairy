# Toy Dairy · Web（前端）

对齐仓库根目录 [`plan.md`](../plan.md) 的 B 角色产出：React + TypeScript + Vite + Tailwind。

当前 **纯前端 Mock**（`localStorage`），不依赖后端 / R2。接口形状与 plan 契约一致，后端就绪后改 `src/api/client.ts` 的 `USE_MOCK`。

## 启动

```bash
cd web
npm install
npm run dev
```

浏览器打开终端提示的地址（默认 `http://localhost:5173`）。桌面端会居中 390px 手机框。

## 可交互路径

| 操作 | 路径 |
|------|------|
| 时间轴 | 底栏「日志」 |
| 新建记录 + Mock AI 日记 | 中间「+」 |
| 日记详情 / 重写 | 点进某条记录 |
| 身份卡 / 切换玩偶 | 「玩偶」 |
| 新建玩偶 + 星座/独白 | 「玩偶」→ 新增 |
| 成长占位统计 | 「成长」 |
| 重置演示数据 | 「我的」 |

## 脚本

- `npm run dev` — 开发
- `npm run build` — 类型检查 + 生产构建
- `npm run lint` — oxlint
- `npm run typecheck` — 仅 TS
- `npm run preview` — 预览 dist

## 目录

```
src/
  api/        # client + mockStore（契约）
  components/ # 底栏、身份卡、日志卡片…
  context/    # 全局状态
  pages/      # 页面
  types.ts    # 与 plan 对齐的类型
```
