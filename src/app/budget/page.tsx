// src/app/budget/page.tsx
'use client';

import { useState } from 'react';
import useStore from '../../store/useStore';
import { Card, CardHeader, CardContent } from '../../components/UI/Card';
import ProtectedRoute from '../../components/Layout/ProtectedRoute';
import PageLayout from '../../components/Layout/PageLayout';
import { CATEGORIES } from '../../types';

const BudgetPage = () => {
  const budgets = useStore((state) => state.budgets);
  const setBudget = useStore((state) => state.setBudget);
  const deleteBudget = useStore((state) => state.deleteBudget);
  const getBudgetStatus = useStore((state) => state.getBudgetStatus);

  const [newCategory, setNewCategory] = useState('');
  const [newLimit, setNewLimit] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editLimit, setEditLimit] = useState('');

  const budgetStatus = getBudgetStatus();

  const handleAddBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory || !newLimit) {
      alert('กรุณาเลือกหมวดหมู่และกรอกงบประมาณ');
      return;
    }

    const limit = parseFloat(newLimit);
    if (isNaN(limit) || limit <= 0) {
      alert('กรุณากรอกงบประมาณให้ถูกต้อง');
      return;
    }

    setBudget(newCategory, limit);
    setNewCategory('');
    setNewLimit('');
  };

  const handleEdit = (category: string, currentLimit: number) => {
    setEditingCategory(category);
    setEditLimit(currentLimit.toString());
  };

  const handleSaveEdit = () => {
    if (!editingCategory || !editLimit) return;

    const limit = parseFloat(editLimit);
    if (isNaN(limit) || limit <= 0) {
      alert('กรุณากรอกงบประมาณให้ถูกต้อง');
      return;
    }

    setBudget(editingCategory, limit);
    setEditingCategory(null);
    setEditLimit('');
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditLimit('');
  };

  const expenseCategories = CATEGORIES.filter((cat: string) =>
    !['เงินเดือน', 'เงินโบนัส', 'รายได้เสริม'].includes(cat)
  );

  const usedCategories = budgets.map(b => b.category);
  const availableCategories = expenseCategories.filter((cat: string) => !usedCategories.includes(cat));

  return (
    <ProtectedRoute>
      <PageLayout>
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8 fade-in">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">ตั้งงบประมาณ</h1>
            <p className="text-gray-600 text-lg">จัดการงบประมาณรายจ่ายของคุณ</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Add Budget Form */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold text-gray-900">เพิ่มงบประมาณใหม่</h2>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddBudget} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      หมวดหมู่
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="form-input"
                      required
                    >
                      <option value="">เลือกหมวดหมู่</option>
                      {availableCategories.map((cat: string) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    {availableCategories.length === 0 && (
                      <p className="text-sm text-gray-500 mt-2">
                        คุณได้ตั้งงบประมาณสำหรับทุกหมวดหมู่แล้ว
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      งบประมาณ (บาท)
                    </label>
                    <input
                      type="number"
                      value={newLimit}
                      onChange={(e) => setNewLimit(e.target.value)}
                      className="form-input"
                      placeholder="0.00"
                      step="0.01"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-primary py-3"
                    disabled={availableCategories.length === 0}
                  >
                    เพิ่มงบประมาณ
                  </button>
                </form>
              </CardContent>
            </Card>

            {/* Budget List */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold text-gray-900">งบประมาณทั้งหมด</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {budgets.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🎯</div>
                      <p className="text-gray-500 text-lg">ยังไม่มีงบประมาณ</p>
                      <p className="text-gray-400 text-sm mt-2">
                        เพิ่มงบประมาณเพื่อเริ่มต้นการติดตาม
                      </p>
                    </div>
                  ) : (
                    budgets.map((budget) => {
                      const status = budgetStatus.find(b => b.category === budget.category);
                      const spent = status?.spent || 0;
                      const percentage = (spent / budget.limit) * 100;

                      return (
                        <div
                          key={budget.category}
                          className="p-6 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {budget.category}
                            </h3>
                            <div className="flex items-center space-x-2">
                              {editingCategory === budget.category ? (
                                <>
                                  <input
                                    type="number"
                                    value={editLimit}
                                    onChange={(e) => setEditLimit(e.target.value)}
                                    className="w-32 form-input text-sm"
                                    step="0.01"
                                  />
                                  <button
                                    onClick={handleSaveEdit}
                                    className="bg-green-100 text-green-600 p-2 rounded-lg hover:bg-green-200 transition-colors"
                                  >
                                    ✅
                                  </button>
                                  <button
                                    onClick={handleCancelEdit}
                                    className="bg-gray-100 text-gray-600 p-2 rounded-lg hover:bg-gray-200 transition-colors"
                                  >
                                    ❌
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => handleEdit(budget.category, budget.limit)}
                                    className="bg-blue-100 text-blue-600 p-2 rounded-lg hover:bg-blue-200 transition-colors"
                                  >
                                    ✏️
                                  </button>
                                  <button
                                    onClick={() => deleteBudget(budget.category)}
                                    className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition-colors"
                                  >
                                    🗑️
                                  </button>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">ใช้งบไปแล้ว</span>
                              <span className={`font-semibold ${
                                percentage > 100 ? 'text-red-600' : 
                                percentage > 80 ? 'text-yellow-600' : 'text-green-600'
                              }`}>
                                {spent.toLocaleString()} / {budget.limit.toLocaleString()} บาท
                              </span>
                            </div>

                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div
                                className={`h-3 rounded-full transition-all duration-500 ${
                                  percentage > 100 ? 'bg-red-500' : 
                                  percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{
                                  width: `${Math.min(percentage, 100)}%`
                                }}
                              ></div>
                            </div>

                            <div className="flex justify-between text-xs text-gray-500">
                              <span>{percentage.toFixed(1)}% ของงบประมาณ</span>
                              <span>
                                {percentage > 100 
                                  ? `เกินงบ ${(spent - budget.limit).toLocaleString()} บาท`
                                  : `เหลืออีก ${(budget.limit - spent).toLocaleString()} บาท`
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
};

export default BudgetPage;