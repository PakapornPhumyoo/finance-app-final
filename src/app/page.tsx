// src/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useStore from '../store/useStore';
import { Card, CardHeader, CardContent } from '../components/UI/Card';
import ProtectedRoute from '../components/Layout/ProtectedRoute';
import PageLayout from '../components/Layout/PageLayout';

const Dashboard = () => {
  const isLoggedIn = useStore((state) => state.isLoggedIn);
  const transactions = useStore((state) => state.transactions);
  const getFinancialSummary = useStore((state) => state.getFinancialSummary);
  const getBudgetStatus = useStore((state) => state.getBudgetStatus);
  const checkBudgetAlerts = useStore((state) => state.checkBudgetAlerts);
  const router = useRouter();

  const [budgetAlerts, setBudgetAlerts] = useState<string[]>([]);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    } else {
      setBudgetAlerts(checkBudgetAlerts());
    }
  }, [isLoggedIn, router, checkBudgetAlerts]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center fade-in">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังเปลี่ยนเส้นทาง...</p>
        </div>
      </div>
    );
  }

  const { totalIncome, totalExpense, balance } = getFinancialSummary();
  const budgetStatus = getBudgetStatus();
  const overBudgetCount = budgetStatus.filter(b => b.status === 'over').length;
  const nearBudgetCount = budgetStatus.filter(b => b.spent / b.limit > 0.8 && b.status !== 'over').length;

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const monthlyIncome = totalIncome;
  const monthlyExpense = totalExpense;
  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpense) / monthlyIncome) * 100 : 0;

  return (
    <ProtectedRoute>
      <PageLayout>
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8 fade-in-up">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-4 lg:mb-0">
                <h1 className="text-4xl font-bold text-gray-900 mb-3">แดชบอร์ดการเงิน</h1>
                <p className="text-gray-600 text-lg">สวัสดี! นี่คือภาพรวมการเงินของคุณ 🐷</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-white rounded-2xl p-3 shadow-lg border border-pink-200">
                  <div className="flex items-center space-x-3">
                    <div className="pig-gradient p-2 rounded-xl">
                      <span className="text-white text-lg">📅</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">วันที่</p>
                      <p className="font-semibold text-gray-900">
                        {new Date().toLocaleDateString('th-TH', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Alert Section */}
          {budgetAlerts.length > 0 && (
            <div className="mb-8 fade-in-up">
              <Card className="border-l-4 border-red-500 bg-gradient-to-r from-red-50 to-pink-50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-red-500 p-2 rounded-full">
                      <span className="text-white text-lg">⚠️</span>
                    </div>
                    <h3 className="text-lg font-semibold text-red-800">การแจ้งเตือนงบประมาณ</h3>
                  </div>
                  <div className="space-y-2">
                    {budgetAlerts.map((alert, index) => (
                      <p key={index} className="text-red-700 text-sm">{alert}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 fade-in-up">
            {/* ยอดคงเหลือ */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-100 border-2 border-blue-200 p-6 shadow-lg">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200 rounded-full -mr-6 -mt-6 opacity-50"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-blue-800">ยอดคงเหลือ</h3>
                  <div className="bg-blue-500 p-2 rounded-lg">
                    <span className="text-white text-lg">💰</span>
                  </div>
                </div>
                <p className="text-3xl font-bold text-blue-900 mb-2">
                  {balance.toLocaleString()} บาท
                </p>
                <div className={`flex items-center text-sm ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <span>{balance >= 0 ? '📈' : '📉'}</span>
                  <span className="ml-1">อัตราการออม {savingsRate.toFixed(1)}%</span>
                </div>
              </div>
            </div>

            {/* รายรับรวม */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-200 p-6 shadow-lg">
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-200 rounded-full -mr-6 -mt-6 opacity-50"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-green-800">รายรับรวม</h3>
                  <div className="bg-green-500 p-2 rounded-lg">
                    <span className="text-white text-lg">📈</span>
                  </div>
                </div>
                <p className="text-3xl font-bold text-green-900 mb-2">
                  {totalIncome.toLocaleString()} บาท
                </p>
                <div className="flex items-center text-sm text-green-600">
                  <span>⬆️</span>
                  <span className="ml-1">รายได้ทั้งหมด</span>
                </div>
              </div>
            </div>

            {/* รายจ่ายรวม */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-50 to-rose-100 border-2 border-red-200 p-6 shadow-lg">
              <div className="absolute top-0 right-0 w-20 h-20 bg-red-200 rounded-full -mr-6 -mt-6 opacity-50"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-red-800">รายจ่ายรวม</h3>
                  <div className="bg-red-500 p-2 rounded-lg">
                    <span className="text-white text-lg">📉</span>
                  </div>
                </div>
                <p className="text-3xl font-bold text-red-900 mb-2">
                  {totalExpense.toLocaleString()} บาท
                </p>
                <div className="flex items-center text-sm text-red-600">
                  <span>⬇️</span>
                  <span className="ml-1">ค่าใช้จ่ายทั้งหมด</span>
                </div>
              </div>
            </div>

            {/* สถานะงบประมาณ */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50 to-amber-100 border-2 border-orange-200 p-6 shadow-lg">
              <div className="absolute top-0 right-0 w-20 h-20 bg-orange-200 rounded-full -mr-6 -mt-6 opacity-50"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-orange-800">สถานะงบประมาณ</h3>
                  <div className="bg-orange-500 p-2 rounded-lg">
                    <span className="text-white text-lg">🎯</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-orange-700">เกินงบ</span>
                    <span className="text-xl font-bold text-red-600">{overBudgetCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-orange-700">ใกล้เกินงบประมาณ</span>
                    <span className="text-xl font-bold text-yellow-600">{nearBudgetCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-orange-700">ทั้งหมด</span>
                    <span className="text-xl font-bold text-orange-600">{budgetStatus.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 fade-in-up">
            {/* Left Column - Transactions */}
            <div className="xl:col-span-2 space-y-8">
              {/* Recent Transactions */}
              <Card className="pig-shape">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">รายการล่าสุด</h2>
                    <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-medium">
                      {transactions.length} รายการ
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentTransactions.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="text-6xl mb-4">🐷</div>
                        <p className="text-gray-500">ยังไม่มีรายการ</p>
                        <button
                          onClick={() => router.push('/transactions')}
                          className="btn-primary mt-4"
                        >
                          เพิ่มรายการแรก
                        </button>
                      </div>
                    ) : (
                      recentTransactions.map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300 group"
                        >
                          <div className="flex items-center space-x-4 min-w-0 flex-1">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                              transaction.type === 'income' 
                                ? 'bg-green-100 text-green-600 border-2 border-green-200' 
                                : 'bg-red-100 text-red-600 border-2 border-red-200'
                            }`}>
                              {transaction.type === 'income' ? '⬆️' : '⬇️'}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="font-semibold text-gray-900 truncate">{transaction.category}</p>
                                  <p className="text-sm text-gray-500 truncate">
                                    {new Date(transaction.date).toLocaleDateString('th-TH')}
                                    {transaction.description && ` • ${transaction.description}`}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <p className={`font-bold text-lg whitespace-nowrap ${
                                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                  }`}>
                                    {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toLocaleString()} บาท
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <button
                    onClick={() => router.push('/transactions')}
                    className="w-full mt-6 btn-secondary"
                  >
                    ดูรายการทั้งหมด
                  </button>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-8">
              {/* Quick Actions */}
              <Card className="pig-shape">
                <CardHeader>
                  <h2 className="text-xl font-bold text-gray-900">การดำเนินการด่วน</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <button
                      onClick={() => router.push('/transactions')}
                      className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-100 rounded-xl border border-green-200 hover:shadow-md transition-all group"
                    >
                      <div className="bg-green-500 p-3 rounded-lg group-hover:scale-110 transition-transform">
                        <span className="text-white text-lg">➕</span>
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">เพิ่มรายการ</p>
                        <p className="text-sm text-gray-600">บันทึกรายรับ-รายจ่าย</p>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => router.push('/budget')}
                      className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-100 rounded-xl border border-blue-200 hover:shadow-md transition-all group"
                    >
                      <div className="bg-blue-500 p-3 rounded-lg group-hover:scale-110 transition-transform">
                        <span className="text-white text-lg">🎯</span>
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">ตั้งงบประมาณ</p>
                        <p className="text-sm text-gray-600">จัดการวงเงินค่าใช้จ่าย</p>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => router.push('/reports')}
                      className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-violet-100 rounded-xl border border-purple-200 hover:shadow-md transition-all group"
                    >
                      <div className="bg-purple-500 p-3 rounded-lg group-hover:scale-110 transition-transform">
                        <span className="text-white text-lg">📈</span>
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">ดูรายงาน</p>
                        <p className="text-sm text-gray-600">วิเคราะห์การเงิน</p>
                      </div>
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

export default Dashboard;