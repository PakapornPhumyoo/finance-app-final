// src/app/profile/page.tsx
'use client';

import { useState } from 'react';
import useStore from '../../store/useStore';
import { Card, CardHeader, CardContent } from '../../components/UI/Card';
import ProtectedRoute from '../../components/Layout/ProtectedRoute';
import PageLayout from '../../components/Layout/PageLayout';

const ProfilePage = () => {
  const user = useStore((state) => state.user);
  const updateProfile = useStore((state) => state.updateProfile);
  const transactions = useStore((state) => state.transactions);
  const getFinancialSummary = useStore((state) => state.getFinancialSummary);

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  });

  const { balance } = getFinancialSummary();
  const transactionCount = transactions.length;
  const expenseCount = transactions.filter(t => t.type === 'expense').length;
  const incomeCount = transactions.filter(t => t.type === 'income').length;

  const handleSave = () => {
    updateProfile(form);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
    setIsEditing(false);
  };

  return (
    <ProtectedRoute>
      <PageLayout>
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8 fade-in">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">โปรไฟล์ผู้ใช้</h1>
            <p className="text-gray-600 text-lg">จัดการข้อมูลส่วนตัวของคุณ</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">ข้อมูลส่วนตัว</h2>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="btn-secondary"
                    >
                      {isEditing ? 'ยกเลิก' : 'แก้ไข'}
                    </button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ชื่อ
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={form.firstName}
                            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                            className="form-input"
                          />
                        ) : (
                          <p className="text-gray-900 font-medium">{user.firstName}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          นามสกุล
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={form.lastName}
                            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                            className="form-input"
                          />
                        ) : (
                          <p className="text-gray-900 font-medium">{user.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        อีเมล
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="form-input"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">{user.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ชื่อผู้ใช้
                      </label>
                      <p className="text-gray-900 font-medium">{user.username}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        วันที่เข้าร่วม
                      </label>
                      <p className="text-gray-900 font-medium">
                        {new Date(user.joinDate).toLocaleDateString('th-TH', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>

                    {isEditing && (
                      <div className="flex space-x-3 pt-4">
                        <button
                          onClick={handleSave}
                          className="flex-1 btn-primary py-3"
                        >
                          บันทึกการเปลี่ยนแปลง
                        </button>
                        <button
                          onClick={handleCancel}
                          className="btn-secondary px-6"
                        >
                          ยกเลิก
                        </button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* User Stats */}
            <div className="space-y-6">
              {/* User Avatar */}
              <Card>
                <CardContent className="text-center p-6">
                  <div className="w-24 h-24 pig-gradient rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-3xl text-white font-bold">
                      {user.firstName.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-gray-500">@{user.username}</p>
                </CardContent>
              </Card>

              {/* Statistics */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-bold text-gray-900">สถิติการใช้งาน</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">รายการทั้งหมด</span>
                      <span className="font-semibold text-gray-900">{transactionCount}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-green-600">รายรับ</span>
                      <span className="font-semibold text-green-600">{incomeCount}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <span className="text-red-600">รายจ่าย</span>
                      <span className="font-semibold text-red-600">{expenseCount}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-blue-600">ยอดคงเหลือ</span>
                      <span className="font-semibold text-blue-600">
                        {balance.toLocaleString()} บาท
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-bold text-gray-900">การดำเนินการด่วน</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <button className="w-full btn-secondary text-sm py-2">
                      📥 ส่งออกข้อมูล
                    </button>
                    <button className="w-full btn-secondary text-sm py-2">
                      🔔 การแจ้งเตือน
                    </button>
                    <button className="w-full btn-secondary text-sm py-2">
                      🛡️ ความปลอดภัย
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
};

export default ProfilePage;