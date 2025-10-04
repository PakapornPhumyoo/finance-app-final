// src/components/Layout/Footer.tsx
'use client';

// ลบ import Link ที่ไม่ได้ใช้
import { useRouter } from 'next/navigation';
import useStore from '../../store/useStore';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const isLoggedIn = useStore((state) => state.isLoggedIn);
  const router = useRouter();

  const handleFooterLink = (href: string) => {
    if (isLoggedIn) {
      router.push(href);
    } else {
      router.push('/login');
    }
  };

  return (
    <footer className="bg-gradient-to-b from-white to-pink-50 border-t border-pink-200/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="pig-gradient p-2 rounded-xl shadow-lg">
                  <span className="text-xl text-white">🐷</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                    chuaikhep
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    จัดการการเงินส่วนบุคคลอย่างชาญฉลาด
                  </p>
                </div>
              </div>
              <p className="text-gray-600 text-sm max-w-md">
                แอปพลิเคชันจัดการการเงินที่ช่วยให้คุณติดตามรายรับ-รายจ่าย 
                ตั้งงบประมาณ และวิเคราะห์การใช้เงินได้อย่างมีประสิทธิภาพ
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">เมนูหลัก</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => handleFooterLink('/')}
                    className="text-gray-600 hover:text-pink-600 transition-colors duration-200 text-left"
                  >
                    แดชบอร์ด
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleFooterLink('/transactions')}
                    className="text-gray-600 hover:text-pink-600 transition-colors duration-200 text-left"
                  >
                    บันทึกรายการ
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleFooterLink('/reports')}
                    className="text-gray-600 hover:text-pink-600 transition-colors duration-200 text-left"
                  >
                    รายงาน
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleFooterLink('/budget')}
                    className="text-gray-600 hover:text-pink-600 transition-colors duration-200 text-left"
                  >
                    ตั้งงบประมาณ
                  </button>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">ช่วยเหลือ</h4>
              <ul className="space-y-2">
                <li>
                  <button className="text-gray-600 hover:text-pink-600 transition-colors duration-200 text-left">
                    คู่มือการใช้งาน
                  </button>
                </li>
                <li>
                  <button className="text-gray-600 hover:text-pink-600 transition-colors duration-200 text-left">
                    คำถามที่พบบ่อย
                  </button>
                </li>
                <li>
                  <button className="text-gray-600 hover:text-pink-600 transition-colors duration-200 text-left">
                    ติดต่อเรา
                  </button>
                </li>
                <li>
                  <button className="text-gray-600 hover:text-pink-600 transition-colors duration-200 text-left">
                    นโยบายความเป็นส่วนตัว
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright - Simple */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600 text-sm">
              © {currentYear} chuaikhep. สงวนลิขสิทธิ์ทุกประการ
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;