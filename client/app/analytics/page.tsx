'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Loader } from '@/components/Loader';
import { TrendingUp, BookOpen, Award, AlertCircle, CheckCircle2, ChevronRight, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, Filler);

interface AnalyticsData {
  chartData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderRadius?: number;
    }[];
  };
  performanceLevels: string[];
  summary: {
    totalSessions: number;
    overallAverageScore: number;
  };
}

const PerformanceAnalytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/analytics/scores', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Add custom styling to the dataset
        const enhancedData = {
          ...response.data,
          chartData: {
            ...response.data.chartData,
            datasets: response.data.chartData.datasets.map((ds: any) => ({
              ...ds,
              backgroundColor: 'rgba(59, 130, 246, 0.8)',
              hoverBackgroundColor: 'rgba(37, 99, 235, 1)',
              borderRadius: 8,
              barThickness: 40,
            }))
          }
        };

        setData(enhancedData);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <Loader fullScreen label='Assembling your progress report...' />;
  if (error) return <div className="flex items-center justify-center h-screen text-red-500 font-bold">Error: {error}</div>;
  
  if (!data || data.summary.totalSessions === 0) {
  return (
    <div className="min-h-screen bg-[#f8fafc] pt-32 pb-12 px-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 text-center transition-all hover:shadow-2xl">
        <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Brain className="w-10 h-10 text-indigo-600 animate-pulse" />
        </div>
        
        <h2 className="text-2xl font-black text-slate-900 mb-3">No Analytics Yet!</h2>
        
        <p className="text-slate-500 mb-8 leading-relaxed">
          It looks like you haven't completed any exam sessions yet. Complete your first test to see a detailed breakdown of your performance.
        </p>

        <div className="space-y-3">
          <Link href="/dashboard">
            <Button className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-100 transition-all active:scale-95 flex items-center justify-center gap-2">
              Go to Dashboard
              <ChevronRight size={20} />
            </Button>
          </Link>
          
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Ready to challenge yourself?
          </p>
        </div>
      </div>
    </div>
  );
}

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        padding: 12,
        cornerRadius: 8,
      }
    },
    scales: {
      y: { 
        beginAtZero: true, 
        max: 100,
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: { callback: (value: any) => `${value}%` }
      },
      x: { grid: { display: false } }
    }
  };

  return (
    <div className="min-h-screen  bg-linear-to-br from-indigo-50 via-white to-blue-50 p-4 md:p-8">
      <div className="max-w-5xl pt-25  mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Learning Insights</h2>
            <p className="text-slate-500">Track your journey and subject mastery</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-indigo-100 flex items-center gap-2">
            <TrendingUp className="text-indigo-600 w-5 h-5" />
            <span className="text-sm font-semibold text-slate-700">Level: Intermediate</span>
          </div>
        </div>

        {/* Informational Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            icon={<BookOpen className="text-blue-600" />} 
            label="Total Sessions" 
            value={data!.summary.totalSessions} 
            color="blue"
          />
          <StatCard 
            icon={<Award className="text-emerald-600" />} 
            label="Average Score" 
            value={`${data!.summary.overallAverageScore}%`} 
            color="emerald"
          />
          <StatCard 
            icon={<TrendingUp className="text-purple-600" />} 
            label="Status" 
            value={data!.summary.overallAverageScore > 50 ? "Improving" : "Needs Focus"} 
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart Card */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-800 text-lg">Score Breakdown</h3>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Percentage %</span>
            </div>
            <div className="h-72">
              <Bar options={chartOptions} data={data!.chartData} />
            </div>
          </div>

          {/* Feedback & Mastery List */}
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white">
            <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Subject Mastery
            </h3>
            <div className="space-y-4">
              {data!.performanceLevels.map((level, index) => (
                <div key={index} className="group p-4 rounded-2xl bg-white border border-slate-100 hover:border-indigo-200 transition-all hover:shadow-md">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-slate-700">{data!.chartData.labels[index]}</span>
                    {level === 'poor' ? 
                      <AlertCircle className="w-4 h-4 text-rose-500" /> : 
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    }
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${level === 'poor' ? 'bg-rose-400' : 'bg-emerald-400'}`}
                        style={{ width: `${data!.chartData.datasets[0].data[index]}%` }}
                      />
                    </div>
                    <span className={`text-xs font-black uppercase ${level === 'poor' ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {level}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// Helper Component for Stats
const StatCard = ({ icon, label, value, color }: any) => (
  <div className="bg-white p-6 rounded-3xl shadow-lg border border-white flex items-center gap-4 hover:scale-[1.02] transition-transform">
    <div className={`p-4 rounded-2xl bg-${color}-50`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500 uppercase tracking-tight">{label}</p>
      <p className="text-2xl font-black text-slate-800">{value}</p>
    </div>
  </div>
);

export default PerformanceAnalytics;