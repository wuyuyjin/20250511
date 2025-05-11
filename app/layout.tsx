import type { Metadata } from "next";
import "./globals.css";
import 'core-js/full/promise/with-resolvers';

export const metadata: Metadata = {
  title: "PDF页面旋转工具 - 在线PDF旋转编辑器",
  description: "免费在线PDF页面旋转工具，支持单页旋转和批量旋转，无需下载软件，操作简单快捷。提供PDF实时预览和快速导出功能。",
  keywords: "PDF旋转,PDF编辑器,在线PDF工具,文档处理,PDF页面旋转",
  openGraph: {
    title: "PDF页面旋转工具 - 在线PDF旋转编辑器",
    description: "免费在线PDF页面旋转工具，支持单页旋转和批量旋转，无需下载软件，操作简单快捷。",
    type: "website",
  },
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#ff5c35"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
