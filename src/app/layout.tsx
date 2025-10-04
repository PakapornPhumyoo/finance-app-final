// src/app/layout.tsx
import type { Metadata } from 'next';
import { Noto_Sans_Thai } from 'next/font/google';
import './globals.css';

const notoSansThai = Noto_Sans_Thai({ 
  subsets: ['thai'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'chuaikhep - จัดการการเงินส่วนบุคคล',
  description: 'แอปพลิเคชันจัดการการเงินส่วนบุคคล บันทึกรายรับ-รายจ่าย ตั้งงบประมาณ และดูรายงาน',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className={notoSansThai.className}>
        {children}
      </body>
    </html>
  );
}