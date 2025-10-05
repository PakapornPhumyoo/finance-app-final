// src/app/reports/page.tsx
'use client';

import { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import useStore from '../../store/useStore';
import { Card, CardHeader, CardContent } from '../../components/UI/Card';
import ProtectedRoute from '../../components/Layout/ProtectedRoute';
import PageLayout from '../../components/Layout/PageLayout';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

type TimeRangeType = 'week' | 'month' | 'year';

const ReportsPage = () => {
  const transactions = useStore((state) => state.transactions);
  const getFinancialSummary = useStore((state) => state.getFinancialSummary);
  const getBudgetStatus = useStore((state) => state.getBudgetStatus);

  const [timeRange, setTimeRange] = useState<TimeRangeType>('month');

  const { totalIncome, totalExpense, balance } = getFinancialSummary();
  const budgetStatus = getBudgetStatus();

  // Prepare data for charts
  const expenseByCategory = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const categories: { [key: string]: number } = {};
    
    expenses.forEach(transaction => {
      categories[transaction.category] = (categories[transaction.category] || 0) + transaction.amount;
    });
    
    return {
      labels: Object.keys(categories),
      data: Object.values(categories),
    };
  }, [transactions]);

  const incomeByCategory = useMemo(() => {
    const incomes = transactions.filter(t => t.type === 'income');
    const categories: { [key: string]: number } = {};
    
    incomes.forEach(transaction => {
      categories[transaction.category] = (categories[transaction.category] || 0) + transaction.amount;
    });
    
    return {
      labels: Object.keys(categories),
      data: Object.values(categories),
    };
  }, [transactions]);

  const monthlyData = useMemo(() => {
    // Simplified monthly data for demonstration
    const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.'];
    const incomeData = [25000, 30000, 28000, 32000, 35000, 38000];
    const expenseData = [22000, 24000, 26000, 28000, 30000, 32000];
    
    return { months, incomeData, expenseData };
  }, []);

  // Bar Chart Configuration
  const barChartData = {
    labels: monthlyData.months,
    datasets: [
      {
        label: 'รายรับ',
        data: monthlyData.incomeData,
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: 'รายจ่าย',
        data: monthlyData.expenseData,
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
            family: 'Inter',
          },
          color: '#4B5563',
        },
      },
      title: {
        display: true,
        text: 'รายรับ-รายจ่าย รายเดือน',
        font: {
          size: 18,
          family: 'Inter',
          weight: 'bold',
        },
        color: '#1F2937',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            family: 'Inter',
          },
          color: '#6B7280',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: 'Inter',
          },
          color: '#6B7280',
        },
      },
    },
  };

  // Doughnut Chart Configuration for Expenses
  const expenseDoughnutData = {
    labels: expenseByCategory.labels,
    datasets: [
      {
        data: expenseByCategory.data,
        backgroundColor: [
          '#EC4899', '#F472B6', '#FB7185', '#FDBA74', '#A78BFA', '#60A5FA', '#34D399', '#FBBF24',
        ],
        borderColor: 'white',
        borderWidth: 3,
        hoverOffset: 15,
      },
    ],
  };

  // Doughnut Chart Configuration for Income (แก้ไข title)
  const incomeDoughnutData = {
    labels: incomeByCategory.labels,
    datasets: [
      {
        data: incomeByCategory.data,
        backgroundColor: [
          '#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#065F46', '#047857', '#059669', '#10B981',
        ],
        borderColor: 'white',
        borderWidth: 3,
        hoverOffset: 15,
      },
    ],
  };

  const expenseDoughnutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 12,
            family: 'Inter',
          },
          color: '#4B5563',
          padding: 20,
        },
      },
      title: {
        display: true,
        text: 'รายจ่ายแยกตามหมวดหมู่',
        font: {
          size: 16,
          family: 'Inter',
          weight: 'bold',
        },
        color: '#1F2937',
      },
    },
    cutout: '60%',
  };

  const incomeDoughnutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 12,
            family: 'Inter',
          },
          color: '#4B5563',
          padding: 20,
        },
      },
      title: {
        display: true,
        text: 'รายรับรวมแยกตามหมวดหมู่', // แก้ไขข้อความตรงนี้
        font: {
          size: 16,
          family: 'Inter',
          weight: 'bold',
        },
        color: '#1F2937',
      },
    },
    cutout: '60%',
  };

  return (
    <ProtectedRoute>
      <PageLayout>
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8 fade-in">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">รายงานการเงิน</h1>
            <p className="text-gray-600 text-lg">วิเคราะห์และติดตามการเงินของคุณด้วยภาพ</p>
          </div>

          {/* Time Range Filter */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-pink-200">
              <div className="flex space-x-2">
                {[
                  { key: 'week', label: 'รายสัปดาห์' },
                  { key: 'month', label: 'รายเดือน' },
                  { key: 'year', label: 'รายปี' },
                ].map((range) => (
                  <button
                    key={range.key}
                    onClick={() => setTimeRange(range.key as TimeRangeType)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all ${
                      timeRange === range.key
                        ? 'bg-pink-500 text-white shadow-md'
                        : 'text-gray-600 hover:bg-pink-50 hover:text-pink-600'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="text-center p-6">
                <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-green-600">💰</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">รายรับรวม</h3>
                <p className="text-3xl font-bold text-green-600">{totalIncome.toLocaleString()} บาท</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center p-6">
                <div className="bg-red-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-red-600">💸</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">รายจ่ายรวม</h3>
                <p className="text-3xl font-bold text-red-600">{totalExpense.toLocaleString()} บาท</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center p-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                  balance >= 0 ? 'bg-blue-100' : 'bg-orange-100'
                }`}>
                  <span className={`text-2xl ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                    {balance >= 0 ? '💎' : '⚠️'}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">ยอดคงเหลือ</h3>
                <p className={`text-3xl font-bold ${
                  balance >= 0 ? 'text-blue-600' : 'text-orange-600'
                }`}>
                  {balance.toLocaleString()} บาท
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Bar Chart */}
            <Card>
              <CardContent className="p-6">
                <Bar data={barChartData} options={barChartOptions} />
              </CardContent>
            </Card>

            {/* Income Doughnut Chart - แก้ไขเป็นรายรับ */}
            <Card>
              <CardContent className="p-6">
                <Doughnut data={incomeDoughnutData} options={incomeDoughnutOptions} />
              </CardContent>
            </Card>
          </div>

          {/* Expense Distribution and Budget Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Expense Distribution */}
            {expenseByCategory.labels.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <Doughnut data={expenseDoughnutData} options={expenseDoughnutOptions} />
                </CardContent>
              </Card>
            )}

            {/* Budget Status */}
            <Card>
              <CardHeader>
                <h3 className="text-xl font-bold text-gray-900">สถานะงบประมาณ</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {budgetStatus.map((budget) => (
                    <div key={budget.category} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">{budget.category}</span>
                        <span className={`font-semibold ${
                          budget.status === 'over' ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {((budget.spent / budget.limit) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                          className={`h-4 rounded-full transition-all duration-500 ${
                            budget.status === 'over' 
                              ? 'bg-red-500' 
                              : budget.spent / budget.limit > 0.8 
                                ? 'bg-yellow-500' 
                                : 'bg-green-500'
                          }`}
                          style={{
                            width: `${Math.min((budget.spent / budget.limit) * 100, 100)}%`
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>ใช้ไป {budget.spent.toLocaleString()} บาท</span>
                        <span>งบ {budget.limit.toLocaleString()} บาท</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
};

export default ReportsPage;