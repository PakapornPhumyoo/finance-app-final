// src/app/transactions/page.tsx
'use client';

import { useState } from 'react';
// ลบบรรทัด useRouter เนื่องจากไม่ได้ใช้งาน
import useStore from '../../store/useStore';
import { Card, CardHeader, CardContent } from '../../components/UI/Card';
import TransactionForm from '../../components/Forms/TransactionForm';
import ProtectedRoute from '../../components/Layout/ProtectedRoute';
import PageLayout from '../../components/Layout/PageLayout';
import { Transaction } from '../../types';

type FilterType = 'all' | 'income' | 'expense';

const TransactionsPage = () => {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useStore();
  
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.type === filter;
  });

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleFormSubmit = (transactionData: Omit<Transaction, 'id'>) => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, transactionData);
    } else {
      addTransaction(transactionData);
    }
    setShowForm(false);
    setEditingTransaction(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?')) {
      deleteTransaction(id);
    }
  };

  return (
    <ProtectedRoute>
      <PageLayout>
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 fade-in">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">บันทึกรายการ</h1>
              <p className="text-gray-600 text-lg">จัดการรายรับ-รายจ่ายของคุณ</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 md:mt-0 btn-primary px-8 py-3 text-lg"
            >
              + เพิ่มรายการใหม่
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Transaction Form */}
            {showForm && (
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-bold text-gray-900">
                      {editingTransaction ? 'แก้ไขรายการ' : 'เพิ่มรายการใหม่'}
                    </h2>
                  </CardHeader>
                  <CardContent>
                    <TransactionForm
                      transaction={editingTransaction || undefined}
                      onSubmit={handleFormSubmit}
                      onCancel={handleCancel}
                    />
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Transaction List */}
            <div className={showForm ? 'lg:col-span-2' : 'lg:col-span-3'}>
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <h2 className="text-xl font-bold text-gray-900">ประวัติรายการ</h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg transition-all ${
                          filter === 'all' 
                            ? 'bg-pink-500 text-white shadow-md' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        ทั้งหมด
                      </button>
                      <button
                        onClick={() => setFilter('income')}
                        className={`px-4 py-2 rounded-lg transition-all ${
                          filter === 'income' 
                            ? 'bg-green-500 text-white shadow-md' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        รายรับ
                      </button>
                      <button
                        onClick={() => setFilter('expense')}
                        className={`px-4 py-2 rounded-lg transition-all ${
                          filter === 'expense' 
                            ? 'bg-red-500 text-white shadow-md' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        รายจ่าย
                      </button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredTransactions.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">📝</div>
                        <p className="text-gray-500 text-lg">ไม่มีรายการ</p>
                      </div>
                    ) : (
                      [...filteredTransactions]
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((transaction) => (
                          <div
                            key={transaction.id}
                            className="flex items-center justify-between p-6 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all"
                          >
                            <div className="flex items-center space-x-4">
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                                transaction.type === 'income' 
                                  ? 'bg-green-100 text-green-600' 
                                  : 'bg-red-100 text-red-600'
                              }`}>
                                <span className="text-2xl">
                                  {transaction.type === 'income' ? '💰' : '💸'}
                                </span>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 text-lg">
                                  {transaction.category}
                                </p>
                                <p className="text-gray-500">
                                  {new Date(transaction.date).toLocaleDateString('th-TH', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </p>
                                {transaction.description && (
                                  <p className="text-gray-600 mt-1">{transaction.description}</p>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                              <p className={`text-xl font-bold ${
                                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toLocaleString()} บาท
                              </p>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEdit(transaction)}
                                  className="bg-blue-100 text-blue-600 p-2 rounded-lg hover:bg-blue-200 transition-colors"
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={() => handleDelete(transaction.id)}
                                  className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition-colors"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                    )}
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

export default TransactionsPage;