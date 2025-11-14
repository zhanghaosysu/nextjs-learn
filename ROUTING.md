# Next.js 路由和渲染机制详解

> 📖 **深入理解 RSC**：想了解 `.rsc` 文件的详细内容和工作原理？请查看 [RSC-EXPLAINED.md](./RSC-EXPLAINED.md)

## 📁 为什么 build 后 server 目录有很多 HTML 文件？

### 1. **混合渲染模式（Hybrid Rendering）**

Next.js 使用混合渲染模式，会根据不同情况选择不同的渲染策略：

```
.next/server/app/
├── api-demo.html      ← 预渲染的 HTML（用于首次加载）
├── api-demo.rsc       ← React Server Component 数据
├── api-demo.meta      ← 元数据
└── api-demo/
    └── page.js        ← 服务端组件代码
```

**这些 HTML 文件的作用：**

1. **首次访问（直接输入 URL 或刷新页面）**

   - 浏览器请求 `/api-demo`
   - Next.js 服务端返回预渲染的 HTML（`.html` 文件）
   - 同时加载客户端 JavaScript
   - 完成"水合"（Hydration），激活客户端路由

2. **客户端导航（点击 Link 组件）**
   - 使用客户端路由，**不会**请求新的 HTML
   - 只请求 JSON 数据（`.rsc` 文件）
   - 在客户端更新 DOM
   - **不会重新加载整个页面**

## 🔄 Next.js 路由的两种模式

### 模式 1：服务端渲染（SSR）- 首次访问

```
用户输入 URL 或刷新页面
    ↓
浏览器请求 /api-demo
    ↓
Next.js 服务端渲染组件
    ↓
返回完整的 HTML（包含初始内容）
    ↓
浏览器显示页面
    ↓
加载客户端 JavaScript
    ↓
"水合"（Hydration）- 激活客户端路由
```

**特点：**

- ✅ SEO 友好（搜索引擎能看到完整 HTML）
- ✅ 首次加载快（服务端已渲染好）
- ✅ 返回完整的 HTML 页面

### 模式 2：客户端路由（CSR）- 点击 Link

```
用户点击 <Link href="/api-demo">
    ↓
Next.js 客户端路由拦截（preventDefault）
    ↓
不刷新页面，不请求 HTML
    ↓
请求 JSON 数据（/api-demo.rsc）
    ↓
客户端更新 DOM（只更新变化的部分）
    ↓
更新浏览器 URL（使用 pushState）
    ↓
触发路由事件（可选）
```

**特点：**

- ✅ 极快的页面切换（无需重新加载）
- ✅ 只传输数据，不传输 HTML
- ✅ 保持页面状态（如滚动位置）
- ✅ 类似 SPA（单页应用）体验

## 🎯 实际演示

### 场景 1：直接访问 `/api-demo`

```bash
# 浏览器请求
GET /api-demo
Accept: text/html

# Next.js 响应
Status: 200
Content-Type: text/html
Body: <!DOCTYPE html>...（完整的 HTML）
```

**网络面板显示：**

- 请求 HTML 文件
- 加载 CSS 文件
- 加载 JavaScript 文件
- 页面完全刷新

### 场景 2：从首页点击 Link 跳转到 `/api-demo`

```bash
# Next.js 客户端路由
# 不发送 HTTP 请求到 /api-demo
# 而是请求：
GET /api-demo.rsc
Accept: text/x-component

# Next.js 响应
Status: 200
Content-Type: text/x-component
Body: {"type":"div","props":{...}}（JSON 格式的组件数据）
```

**网络面板显示：**

- ✅ 只请求 `.rsc` 文件（很小，只有数据，比 HTML 小 90%）
- ✅ 不请求 HTML
- ✅ 不重新加载页面
- ✅ URL 更新但页面不闪烁

## 🔍 如何验证客户端路由？

### 方法 1：打开浏览器开发者工具

1. 打开 Network 面板
2. 从首页点击 `<Link>` 跳转
3. 观察：
   - ✅ 只看到 `.rsc` 请求（不是 `.html`）
   - ✅ 页面不刷新（没有整页重新加载）
   - ✅ URL 更新但页面平滑切换

### 方法 2：查看页面源码

**首次访问（刷新页面）：**

```html
<!-- 完整的 HTML，包含所有内容 -->
<!DOCTYPE html>
<html>
  <body>
    <main class="container">
      <h1>API 路由示例</h1>
      <!-- 所有内容都在这里 -->
    </main>
  </body>
</html>
```

**客户端路由（点击 Link）：**

- 页面源码不会变化（因为 DOM 是 JavaScript 更新的）
- 但页面内容会更新（通过 JavaScript）

## 📦 构建后的文件结构

```
.next/
├── server/                    # 服务端文件
│   └── app/
│       ├── api-demo.html      # 预渲染的 HTML（首次访问用）
│       ├── api-demo.rsc       # RSC 数据（客户端路由用）
│       ├── api-demo.meta      # 元数据
│       └── api-demo/
│           └── page.js        # 服务端组件代码
│
└── static/                    # 客户端文件
    ├── chunks/
    │   ├── main-app-xxx.js    # 主应用代码
    │   └── app/
    │       └── api-demo/
    │           └── page-xxx.js # 客户端组件代码
    └── css/
        └── xxx.css            # 样式文件
```

## 🎨 Next.js Link 组件的工作原理

```tsx
import Link from 'next/link';

<Link href='/api-demo'>API 示例</Link>;
```

**Link 组件做了什么：**

1. **拦截点击事件**

   ```javascript
   // 伪代码
   link.addEventListener('click', (e) => {
     e.preventDefault(); // 阻止默认跳转
     // 使用客户端路由
   });
   ```

2. **预取（Prefetch）**

   - 鼠标悬停时，自动预取目标页面的数据
   - 点击时几乎瞬间加载

3. **客户端导航**

   - 使用 `window.history.pushState()` 更新 URL
   - 请求 `.rsc` 数据
   - 更新 DOM

4. **回退支持**
   - 浏览器前进/后退按钮正常工作
   - Next.js 管理路由历史

## ⚡ 性能优势

### 传统多页应用（MPA）

```
点击链接 → 请求 HTML → 解析 HTML → 渲染 → 加载 JS → 执行 JS
总时间：~500-1000ms
```

### Next.js 客户端路由

```
点击 Link → 请求 JSON → 更新 DOM
总时间：~50-200ms（快 5-10 倍！）
```

## 🔐 什么时候使用服务端渲染？

### 使用 SSR（返回 HTML）的场景：

1. **首次访问**

   - 用户直接输入 URL
   - 刷新页面（F5）
   - 从外部链接进入

2. **SEO 需求**

   - 搜索引擎爬虫
   - 社交媒体分享（需要完整的 HTML）

3. **禁用 JavaScript**
   - 用户浏览器禁用 JS
   - 降级方案

### 使用客户端路由的场景：

1. **应用内导航**

   - 点击 `<Link>` 组件
   - 使用 `router.push()` 编程式导航

2. **已加载的应用**
   - 应用已经"水合"完成
   - JavaScript 已激活

## 🛠️ 如何强制使用服务端渲染？

如果你想强制某个链接使用服务端渲染（重新加载页面）：

```tsx
// 方法 1：使用普通 <a> 标签
<a href="/api-demo">API 示例</a>

// 方法 2：Link 组件添加属性
<Link href="/api-demo" prefetch={false}>
  API 示例
</Link>

// 方法 3：编程式导航（强制刷新）
router.push('/api-demo');
window.location.href = '/api-demo'; // 强制服务端渲染
```

## 📊 总结

| 场景            | 渲染方式 | 请求内容    | 页面刷新 |
| --------------- | -------- | ----------- | -------- |
| 直接访问 URL    | SSR      | HTML        | ✅ 是    |
| 刷新页面 (F5)   | SSR      | HTML        | ✅ 是    |
| 点击 `<Link>`   | CSR      | JSON (.rsc) | ❌ 否    |
| 浏览器前进/后退 | CSR      | JSON (.rsc) | ❌ 否    |

**关键点：**

1. ✅ Next.js **同时支持**服务端渲染和客户端路由
2. ✅ HTML 文件用于**首次访问**和 SEO
3. ✅ 客户端路由用于**应用内导航**，提供 SPA 体验
4. ✅ 这是 Next.js 的**混合渲染**优势，兼顾性能和 SEO

## 🎓 最佳实践

1. **使用 `<Link>` 进行应用内导航**

   - 享受客户端路由的快速切换

2. **让 Next.js 自动选择**

   - 首次访问自动使用 SSR
   - 后续导航自动使用客户端路由

3. **理解两种模式**

   - 知道什么时候用哪种
   - 根据需求选择

4. **性能优化**
   - 客户端路由已经很快了
   - 预取（Prefetch）让体验更流畅
