# React Server Components (RSC) 详解

## 📄 .rsc 文件里是什么？

`.rsc` 文件是 **React Server Components** 的序列化数据格式，包含了组件的**树结构**和**数据**，而不是完整的 HTML。

### 实际内容示例

让我们看看 `api-demo.rsc` 文件的内容：

```
2:I[7394,[],"ClientPageRoot"]
3:I[5807,["20","static/chunks/20-3efb1862cf15d588.js","333","static/chunks/app/api-demo/page-6c8ac79b148681c6.js"],"default",1]
0:["tAqn5kWAHrJ4Vi896_8Zt",[[["",{"children":["api-demo",{"children":["__PAGE__",{}]}]},"$undefined","$undefined",true],...
```

这看起来像乱码，但实际上是一种**序列化的 React 组件树**。

### 格式解析

`.rsc` 文件使用了一种特殊的序列化格式：

1. **数字标识符**：`2:`, `3:`, `0:` 等是引用 ID
2. **组件引用**：`I[...]` 表示组件实例
3. **组件树**：嵌套的数组结构表示组件的层级关系
4. **数据**：组件的 props 和状态数据

### 对比：HTML vs RSC

**HTML 文件（首次访问）：**

```html
<!DOCTYPE html>
<html>
  <body>
    <main class="container">
      <h1>API 路由示例</h1>
      <div class="card">
        <h2>什么是 API 路由？</h2>
        <p>Next.js 允许你在...</p>
      </div>
      <!-- 完整的 HTML 结构 -->
    </main>
  </body>
</html>
```

- ✅ 包含完整的 HTML 标签
- ✅ 可以直接在浏览器中显示
- ❌ 体积较大（包含所有标签）
- ❌ 需要重新解析整个 DOM

**RSC 文件（客户端路由）：**

```
0:["tAqn5kWAHrJ4Vi896_8Zt",[[["",{"children":["api-demo",...]}]...]
```

- ✅ 只包含数据和结构信息
- ✅ 体积小（只有必要的数据）
- ✅ 格式紧凑，传输快
- ❌ 需要 React 解析才能渲染

## 🔄 为什么请求 .rsc 文件就能更新页面？

### 工作流程

```
1. 用户点击 <Link href="/api-demo">
   ↓
2. Next.js 客户端路由拦截（preventDefault）
   ↓
3. 请求 /api-demo.rsc（不是 HTML！）
   ↓
4. 服务端返回 RSC 数据（序列化的组件树）
   ↓
5. React 客户端解析 RSC 数据
   ↓
6. React 对比新旧虚拟 DOM（Diff）
   ↓
7. 只更新变化的部分（高效更新）
   ↓
8. 更新浏览器 URL（pushState）
```

### 详细步骤

#### 步骤 1：拦截导航

```javascript
// Next.js Link 组件内部（简化版）
<Link href="/api-demo" onClick={(e) => {
  e.preventDefault(); // 阻止默认跳转
  router.push('/api-demo'); // 使用客户端路由
}}>
```

#### 步骤 2：请求 RSC 数据

```javascript
// Next.js 内部（简化版）
fetch('/api-demo.rsc', {
  headers: {
    Accept: 'text/x-component', // 请求 RSC 格式
  },
});
```

#### 步骤 3：服务端返回 RSC

服务端返回序列化的组件数据：

```
0:["tAqn5kWAHrJ4Vi896_8Zt",[[["",{"children":["api-demo",...]}]...]
```

#### 步骤 4：React 解析和渲染

```javascript
// React 内部（简化版）
const rscData = await response.text();
const componentTree = parseRSC(rscData); // 解析 RSC 数据
const newVDOM = createVDOM(componentTree); // 创建虚拟 DOM

// 对比新旧虚拟 DOM
const diff = compareVDOM(currentVDOM, newVDOM);

// 只更新变化的部分
updateDOM(diff); // 高效更新，不重新渲染整个页面
```

#### 步骤 5：更新 URL

```javascript
window.history.pushState({}, '', '/api-demo'); // 更新 URL，不刷新页面
```

## 🎯 核心优势

### 1. **只传输数据，不传输 HTML**

**传统方式（请求 HTML）：**

```
请求大小：~50KB（包含所有 HTML 标签）
传输时间：~200ms
解析时间：~100ms
总时间：~300ms
```

**RSC 方式：**

```
请求大小：~5KB（只有数据和结构）
传输时间：~50ms
解析时间：~30ms
总时间：~80ms（快 4 倍！）
```

### 2. **高效的 DOM 更新**

React 使用**虚拟 DOM Diff 算法**：

```javascript
// 伪代码
const oldVDOM = {
  type: 'main',
  children: [{ type: 'h1', children: '首页' }],
};

const newVDOM = {
  type: 'main',
  children: [
    { type: 'h1', children: 'API 路由示例' }, // 只有这里变了
  ],
};

// React 只更新 h1 的内容，不重新创建整个 main 元素
updateOnlyChangedParts(oldVDOM, newVDOM);
```

### 3. **保持应用状态**

因为页面不刷新，所以：

- ✅ React 组件状态保持（useState 的值）
- ✅ 滚动位置保持
- ✅ 表单输入保持
- ✅ 动画不中断

## 🔍 实际演示

### 在浏览器中验证

1. **打开开发者工具**

   - F12 或右键 → 检查

2. **切换到 Network 面板**

3. **从首页点击 Link 跳转**

   ```
   请求 URL: /api-demo.rsc
   请求方法: GET
   Content-Type: text/x-component
   响应大小: ~2-5KB（很小！）
   ```

4. **查看响应内容**

   ```
   0:["tAqn5kWAHrJ4Vi896_8Zt",[[["",{"children":...
   ```

   这就是序列化的 React 组件树

5. **观察 DOM 更新**
   - Elements 面板中，只有内容变化的部分会高亮
   - 整个页面结构不会重新创建

### 对比测试

**测试 1：点击 Link（客户端路由）**

```
Network: 只看到 .rsc 请求
页面：平滑切换，不闪烁
时间：~50-100ms
```

**测试 2：直接输入 URL（服务端渲染）**

```
Network: 看到 .html 请求
页面：完全刷新
时间：~200-500ms
```

## 🧩 RSC 数据格式详解

### 基本结构

```
[引用ID]:[数据]
```

例如：

```
2:I[7394,[],"ClientPageRoot"]
```

- `2:` = 引用 ID 2
- `I[...]` = 组件实例
- `7394` = 组件 ID
- `"ClientPageRoot"` = 组件名称

### 组件树结构

```
0:["tAqn5kWAHrJ4Vi896_8Zt",[
  [
    ["",{"children":["api-demo",...]},...],  // 路由信息
    ["",{"children":["__PAGE__",...]},...],  // 页面组件
    ...
  ]
]]
```

这表示：

- 根路由：`api-demo`
- 页面组件：`__PAGE__`（对应 `page.tsx`）
- 嵌套的组件树结构

### 为什么这么复杂？

1. **支持引用**：避免重复数据
2. **支持流式传输**：可以逐步加载
3. **支持服务端组件**：区分服务端和客户端组件
4. **支持 Suspense**：支持异步组件

## 🚀 React 如何解析 RSC？

### 解析流程

```javascript
// 1. 接收 RSC 数据
const rscStream = await fetch('/api-demo.rsc');

// 2. 解析为组件树
const componentTree = parseRSCStream(rscStream);

// 3. 创建虚拟 DOM
const vdom = createVDOM(componentTree);

// 4. 对比差异
const patches = diff(currentVDOM, vdom);

// 5. 应用更新
applyPatches(patches);
```

### 关键函数（简化版）

```javascript
function parseRSC(rscData) {
  // 解析序列化数据
  const lines = rscData.split('\n');
  const references = {};

  lines.forEach((line) => {
    const [id, data] = line.split(':');
    references[id] = parseData(data);
  });

  return buildComponentTree(references);
}

function createVDOM(componentTree) {
  // 将组件树转换为虚拟 DOM
  return {
    type: componentTree.type,
    props: componentTree.props,
    children: componentTree.children.map((child) =>
      typeof child === 'string' ? child : createVDOM(child)
    ),
  };
}

function diff(oldVDOM, newVDOM) {
  // 对比虚拟 DOM，找出差异
  const patches = [];

  if (oldVDOM.type !== newVDOM.type) {
    patches.push({ type: 'REPLACE', node: newVDOM });
  } else if (oldVDOM.props !== newVDOM.props) {
    patches.push({ type: 'PROPS', props: newVDOM.props });
  }

  // 递归对比子节点...

  return patches;
}

function applyPatches(patches) {
  // 应用差异到真实 DOM
  patches.forEach((patch) => {
    switch (patch.type) {
      case 'REPLACE':
        replaceDOMNode(patch.node);
        break;
      case 'PROPS':
        updateDOMProps(patch.props);
        break;
      // ...
    }
  });
}
```

## 📊 性能对比

### 数据量对比

| 文件类型 | 大小    | 内容                 |
| -------- | ------- | -------------------- |
| HTML     | ~50KB   | 完整 HTML + 所有标签 |
| RSC      | ~5KB    | 只有数据和结构       |
| **节省** | **90%** | **只传输必要数据**   |

### 时间对比

| 操作     | HTML 方式 | RSC 方式  | 提升     |
| -------- | --------- | --------- | -------- |
| 传输     | 200ms     | 50ms      | 4x       |
| 解析     | 100ms     | 30ms      | 3x       |
| 渲染     | 50ms      | 20ms      | 2.5x     |
| **总计** | **350ms** | **100ms** | **3.5x** |

## 🎓 总结

### .rsc 文件包含什么？

1. ✅ **序列化的 React 组件树**
2. ✅ **组件的 props 和状态数据**
3. ✅ **组件之间的引用关系**
4. ❌ **不包含 HTML 标签**
5. ❌ **不包含样式信息**（样式在 CSS 文件中）

### 为什么能更新页面？

1. ✅ **React 解析 RSC 数据** → 创建虚拟 DOM
2. ✅ **对比新旧虚拟 DOM** → 找出差异
3. ✅ **只更新变化的部分** → 高效更新
4. ✅ **不重新加载页面** → 保持状态

### 关键优势

1. 🚀 **速度快**：只传输数据，不传输 HTML
2. 🎯 **更新精准**：只更新变化的部分
3. 💾 **保持状态**：页面不刷新，状态保持
4. 📦 **体积小**：RSC 文件比 HTML 小 90%

### 类比理解

**HTML = 完整的房子（包括所有砖块）**

- 需要重新建造整个房子
- 体积大，传输慢

**RSC = 房子的设计图纸（只有结构和数据）**

- 只需要更新变化的部分
- 体积小，传输快
- React 是"建筑工人"，根据图纸更新房子

## 🔗 相关概念

- **React Server Components (RSC)**：服务端组件技术
- **虚拟 DOM**：React 的渲染机制
- **Diff 算法**：对比新旧虚拟 DOM 的算法
- **Hydration**：将服务端渲染的 HTML 激活为可交互的 React 应用
