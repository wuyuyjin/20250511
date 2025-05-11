


          
# PDF页面旋转工具

## 项目介绍
这是一个基于Next.js开发的PDF页面旋转工具，可以帮助用户轻松地对PDF文档进行页面旋转操作。用户可以单独旋转某一页，也可以一次性旋转所有页面。

## 功能特点
- 支持PDF文件上传（拖拽或点击上传）
- 单页旋转功能
- 批量旋转功能
- 实时预览
- 缩放控制
- 导出修改后的PDF

## 环境要求
- Node.js (推荐 18.x 或更高版本)
- npm, yarn, pnpm 或 bun 包管理器

## 快速开始

### 1. 安装依赖
```bash
npm install
# 或
yarn install
# 或
pnpm install
# 或
bun install
```

### 2. 启动开发服务器
```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
# 或
bun dev
```

### 3. 访问应用
打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 使用说明

1. **上传PDF**
   - 点击上传区域选择PDF文件
   - 或直接将PDF文件拖拽到上传区域

2. **旋转操作**
   - 点击每页右上角的旋转按钮进行单页旋转
   - 使用"Rotate all"按钮可以一次性旋转所有页面
   - 使用"Remove PDF"按钮可以移除当前PDF

3. **预览控制**
   - 使用缩放按钮调整预览大小
   - 实时预览旋转效果

4. **导出文件**
   - 完成旋转操作后，点击下载按钮
   - 系统会自动生成并下载修改后的PDF文件

## 技术栈
- Next.js 15
- react 19
- TypeScript
- Tailwind CSS
- pdf-lib (PDF处理)
- react-pdf (PDF预览)

## 注意事项
- 建议使用现代浏览器以获得最佳体验
- 大文件处理可能需要较长时间，请耐心等待
- 处理过程中请勿刷新页面

## 部署

项目可以轻松部署到Vercel平台：

1. **构建项目**
```bash
npm run build
# 或
yarn build
# 或
pnpm build
# 或
bun build
```

2. **启动生产服务**
```bash
npm run start
# 或
yarn start
# 或
pnpm start
# 或
bun start
```

## 贡献
欢迎提交问题和改进建议！

## 许可证
MIT License

        
