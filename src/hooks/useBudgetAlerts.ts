// src/hooks/useBudgetAlerts.ts
import { useEffect } from 'react';
import useStore from '../store/useStore';
import { useNotifications } from '../store/useNotifications';

export const useBudgetAlerts = () => {
  const { getBudgetStatus, transactions } = useStore();
  const { addNotification, notifications } = useNotifications();

  useEffect(() => {
    const checkBudgetAlerts = () => {
      const budgetStatus = getBudgetStatus();
      
      budgetStatus.forEach((budget) => {
        const percentage = (budget.spent / budget.limit) * 100;
        
        // ตรวจสอบว่ามีการแจ้งเตือนสำหรับหมวดหมู่นี้แล้วหรือยัง
        const existingAlert = notifications.find(
          n => n.message.includes(budget.category) && n.type === 'budget'
        );

        // แจ้งเตือนเมื่อเกินงบประมาณ
        if (budget.status === 'over' && !existingAlert) {
          addNotification({
            type: 'budget',
            title: '⚠️ เกินงบประมาณ',
            message: `หมวดหมู่ "${budget.category}" เกินงบประมาณแล้ว! ใช้ไป ${budget.spent.toLocaleString()} บาท จากงบ ${budget.limit.toLocaleString()} บาท`,
          });
        }
        
        // แจ้งเตือนเมื่อใกล้เกินงบประมาณ (80%)
        else if (percentage > 80 && percentage <= 100 && !existingAlert) {
          addNotification({
            type: 'alert',
            title: '🔔 ใกล้เกินงบประมาณ',
            message: `หมวดหมู่ "${budget.category}" ใช้งบประมาณไปแล้ว ${percentage.toFixed(1)}% ใกล้จะเกินงบประมาณแล้ว`,
          });
        }
      });
    };

    // ตรวจสอบทุกครั้งที่ transactions เปลี่ยนแปลง
    checkBudgetAlerts();
  }, [transactions, getBudgetStatus, addNotification, notifications]);
};