// src/components/UI/StatsCard.tsx
import { CardContent } from './Card';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const StatsCard = ({ title, value, subtitle, icon, trend }: StatsCardProps) => {
  return (
    <div className="stats-card fade-in">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
              <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
              {subtitle && (
                <p className="text-sm text-gray-500">{subtitle}</p>
              )}
              {trend && (
                <div className={`flex items-center mt-2 text-sm ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  <span>{trend.isPositive ? '↗' : '↘'}</span>
                  <span className="ml-1">{trend.value}%</span>
                </div>
              )}
            </div>
            <div className="bg-gradient-to-br from-pink-500 to-rose-500 p-4 rounded-2xl shadow-lg">
              <span className="text-2xl text-white">{icon}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </div>
  );
};