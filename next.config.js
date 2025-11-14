/** @type {import('next').NextConfig} */
const nextConfig = {
  // ========== React 配置 ==========
  // 启用 React 严格模式，帮助发现潜在问题
  reactStrictMode: true,

  // ========== 构建优化配置 ==========
  // 使用 SWC 压缩器（比 Terser 更快，Next.js 13+ 默认启用）
  swcMinify: true,

  // 压缩输出
  compress: true,

  // ========== 图片优化配置 ==========
  images: {
    // 允许加载外部图片的域名列表
    // 例如：domains: ['example.com', 'cdn.example.com']
    domains: [],

    // 图片格式配置
    formats: ['image/avif', 'image/webp'],

    // 图片尺寸限制
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // ========== 环境变量配置 ==========
  // 可以在客户端访问的环境变量（必须以 NEXT_PUBLIC_ 开头）
  env: {
    NEXT_PUBLIC_CUSTOM_KEY: 'my-value', // 例如，可以定义一个 NEXT_PUBLIC_ 前缀的环境变量
  },
  /*
    如何在客户端组件里访问这个变量？

    直接使用 process.env.NEXT_PUBLIC_CUSTOM_KEY 即可，例如：

    function MyComponent() {
      return <div>{process.env.NEXT_PUBLIC_CUSTOM_KEY}</div>;
    }

    注意：
    - 变量名必须以 NEXT_PUBLIC_ 开头，否则不会暴露到客户端。
    - 重新启动开发服务器以应用更改。
  */

  // ========== 重定向和重写配置 ==========
  // async redirects() {
  //   return [
  //     {
  //       source: '/old-page',
  //       destination: '/new-page',
  //       permanent: true, // 301 永久重定向
  //     },
  //   ];
  // },

  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/proxy/:path*',
  //       destination: 'https://api.example.com/:path*',
  //     },
  //   ];
  // },

  // ========== 头部配置 ==========
  // async headers() {
  //   return [
  //     {
  //       source: '/:path*',
  //       headers: [
  //         {
  //           key: 'X-Custom-Header',
  //           value: 'my-custom-value',
  //         },
  //       ],
  //     },
  //   ];
  // },

  // ========== Webpack 自定义配置 ==========
  // webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
  //   // 自定义 webpack 配置
  //   return config;
  // },

  // ========== 输出配置 ==========
  // 启用独立输出模式（用于 Docker 部署）
  // 生成 .next/standalone 目录，包含最小化的部署文件
  output: 'standalone',

  // ========== 实验性功能 ==========
  // experimental: {
  //   // 启用 App Router（Next.js 13+ 默认启用）
  //   appDir: true,
  //   // 启用服务器组件
  //   serverComponents: true,
  // },

  // ========== 其他常用配置 ==========
  // 禁用 x-powered-by 头
  // poweredByHeader: false,

  // 自定义页面扩展名
  // pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js'],

  // 生成静态页面时忽略的路径
  // generateBuildId: async () => {
  //   return 'my-build-id';
  // },
};

module.exports = nextConfig;
