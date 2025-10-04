// src/components/Forms/TransactionForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { Transaction, CATEGORIES } from '../../types';

interface TransactionFormProps {
  transaction?: Transaction;
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
  onCancel?: () => void;
}

const TransactionForm = ({ transaction, onSubmit, onCancel }: TransactionFormProps) => {
  const [form, setForm] = useState({
    type: 'expense' as 'income' | 'expense',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  useEffect(() => {
    if (transaction) {
      setForm({
        type: transaction.type,
        category: transaction.category,
        amount: transaction.amount.toString(),
        date: transaction.date,
        description: transaction.description || '',
      });
    }
  }, [transaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.category || !form.amount || !form.date) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    const amount = parseFloat(form.amount);
    if (isNaN(amount) || amount <= 0) {
      alert('กรุณากรอกจำนวนเงินให้ถูกต้อง');
      return;
    }

    onSubmit({
      type: form.type,
      category: form.category,
      amount: amount,
      date: form.date,
      description: form.description,
    });

    if (!transaction) {
      setForm({
        type: 'expense',
        category: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
      });
    }
  };

  const incomeCategories = CATEGORIES.filter(cat =>
    ['เงินเดือน', 'เงินโบนัส', 'รายได้เสริม'].includes(cat)
  );

  const expenseCategories = CATEGORIES.filter(cat =>
    !['เงินเดือน', 'เงินโบนัส', 'รายได้เสริม'].includes(cat)
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 fade-in">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">ประเภท</label>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => setForm({ ...form, type: 'expense', category: '' })}
            className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
              form.type === 'expense'
                ? 'bg-red-50 border-red-300 text-red-700 shadow-md'
                : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <div className="text-lg mb-1">💸</div>
              <div className="font-medium">รายจ่าย</div>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setForm({ ...form, type: 'income', category: '' })}
            className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
              form.type === 'income'
                ? 'bg-green-50 border-green-300 text-green-700 shadow-md'
                : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <div className="text-lg mb-1">💰</div>
              <div className="font-medium">รายรับ</div>
            </div>
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">หมวดหมู่</label>
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="form-input"
          required
        >
          <option value="">เลือกหมวดหมู่</option>
          {(form.type === 'income' ? incomeCategories : expenseCategories).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">จำนวนเงิน</label>
          <input
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="form-input"
            placeholder="0.00"
            step="0.01"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">วันที่</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="form-input"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">คำอธิบาย</label>
        <input
          type="text"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="form-input"
          placeholder="คำอธิบายเพิ่มเติม (ไม่จำเป็น)"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 btn-primary py-3"
        >
          {transaction ? 'อัพเดท' : 'เพิ่ม'} รายการ
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary py-3 px-6"
          >
            ยกเลิก
          </button>
        )}
      </div>
    </form>
  );
};

export default TransactionForm;