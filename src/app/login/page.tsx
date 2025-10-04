// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useStore from '../../store/useStore';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useStore((state) => state.login);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 800));

    if (login(username, password)) {
      router.push('/');
    } else {
      alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full fade-in">
        <div className="text-center mb-8">
          <div className="mx-auto w-24 h-24 pig-gradient rounded-3xl flex items-center justify-center mb-6 shadow-2xl pig-icon">
            <span className="text-4xl text-white">🐷</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-3">
            chuaikhep
          </h1>
          <p className="text-gray-600 text-lg">จัดการการเงินอย่างชาญฉลาด</p>
        </div>

        <div className="card-modern">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            เข้าสู่ระบบ
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                ชื่อผู้ใช้
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="form-input"
                placeholder="กรอกชื่อผู้ใช้"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                รหัสผ่าน
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="form-input"
                placeholder="กรอกรหัสผ่าน"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  กำลังเข้าสู่ระบบ...
                </div>
              ) : (
                'เข้าสู่ระบบ'
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-pink-50 rounded-xl border border-pink-200">
            <p className="text-sm text-gray-600 text-center">
              <strong className="text-pink-600">ข้อมูลทดสอบ:</strong><br />
              ชื่อผู้ใช้: moowan06<br />
              รหัสผ่าน: 220506
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;