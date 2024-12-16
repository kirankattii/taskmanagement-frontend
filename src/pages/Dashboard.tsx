// components/Dashboard.tsx
import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

interface DashboardData {
  taskCounts: {
    total: number;
    completed: number;
    pending: number;
    inProgress: number;
  };
  percentages: {
    completed: number;
    pending: number;
  };
  timeAnalysisByPriority: {
    High: { elapsed: number; remaining: number };
    Medium: { elapsed: number; remaining: number };
    Low: { elapsed: number; remaining: number };
  };
  averageCompletionTime: number;
}

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { backendUrl } = useContext(AppContext);

  const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#6366F1'];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.post(`${backendUrl}/api/task/dashboard`);
        if (response.data.success) {
          setDashboardData(response.data.summary);
        }
      } catch (error) {
        toast.error('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [backendUrl]);

  if (loading || !dashboardData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  //  charts
  const statusData = [
    { name: 'Completed', value: dashboardData.taskCounts.completed },
    { name: 'Pending', value: dashboardData.taskCounts.pending },
    { name: 'In Progress', value: dashboardData.taskCounts.inProgress },
  ];

  const timeAnalysisData = [
    {
      priority: 'High',
      elapsed: Math.max(0, dashboardData.timeAnalysisByPriority.High.elapsed),
      remaining: dashboardData.timeAnalysisByPriority.High.remaining,
    },
    {
      priority: 'Medium',
      elapsed: Math.max(0, dashboardData.timeAnalysisByPriority.Medium.elapsed),
      remaining: dashboardData.timeAnalysisByPriority.Medium.remaining,
    },
    {
      priority: 'Low',
      elapsed: Math.max(0, dashboardData.timeAnalysisByPriority.Low.elapsed),
      remaining: dashboardData.timeAnalysisByPriority.Low.remaining,
    },
  ];

  return (
    <div className="space-y-6 md:p-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Total Tasks</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{dashboardData.taskCounts.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Completion Rate</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {dashboardData.percentages.completed.toFixed(1)}%
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Average Completion Time</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {dashboardData.averageCompletionTime.toFixed(1)}h
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Pending Tasks</h3>
          <p className="text-3xl font-bold text-yellow-500 mt-2">
            {dashboardData.taskCounts.pending + dashboardData.taskCounts.inProgress}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Status Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Time Analysis */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Analysis by Priority</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeAnalysisData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="priority" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="elapsed" name="Elapsed Time" fill="#10B981" />
                <Bar dataKey="remaining" name="Remaining Time" fill="#6366F1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
