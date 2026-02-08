'use client'
import { Loader } from '@/components/Loader';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Target, Trophy, Badge, Brain, AlertCircle, Zap, BookOpen, LayoutDashboard, RotateCcw, Calendar, Fingerprint, AlertTriangle, ArrowUpRight, Lightbulb, TrendingDown, TrendingUp, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';


function page() {
    const params = useParams()
    console.log(params.sessionId)
    const [data, setData] = useState<any>(null)
    const [isloading, setIsLoading] = useState(false)

    const fetchOverview = async () => {
        try {
            setIsLoading(true)
            console.log("fetching started")
            const res = await axios.get(`http://localhost:5000/api/result/get/${params.sessionId}`,{headers: {Authorization: `Bearer ${sessionStorage.getItem('token')}`}})
            console.log(res.data.result)
            setData(res.data.result)

        } catch (error) {
            console.error(error)
        } finally {
          setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchOverview()
    }, [])

    if (isloading) {
      return <Loader fullScreen label='Preparing your overview'/>
    }

    if (!data) {
    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-[2.5rem] border border-slate-200 p-10 text-center shadow-xl shadow-slate-200/50">
                <div className="mx-auto size-20 bg-rose-50 rounded-3xl flex items-center justify-center mb-6">
                    <AlertCircle className="size-10 text-rose-500" />
                </div>
                
                <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
                    No Report Found
                </h2>
                
                <p className="text-slate-500 font-medium leading-relaxed mb-8">
                    We couldn't find a performance report for this session. It’s possible the assessment was never completed.
                </p>

                <div className="flex flex-col gap-3">
                    <Link href="/dashboard">
                        <Button className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]">
                            Go to Dashboard
                        </Button>
                    </Link>
                    
                    <Link href="/">
                        <Button variant="ghost" className="w-full h-12 rounded-xl text-slate-500 font-bold hover:bg-slate-50">
                            Back to Home
                        </Button>
                    </Link>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-100">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                        Error Code: 404_RESULT_NOT_FOUND
                    </p>
                </div>
            </div>
        </div>
    );
  ``}

    const { 
        _id,
        performanceLevel, 
        averageScore, 
        detailedOverview, 
        strongTopics, 
        weakTopics = [], 
        nextTopicsToLearn = [], 
        suggestions,
        createdAt
        } = data;



    const formattedDate = new Date(createdAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
    });
    
    
    const isPoor = performanceLevel === "poor";
  return (
    <div className="min-h-screen bg-[#f8fafc] pt-20 pb-12 px-4 md:px-8 font-sans">
      <div className="mx-auto max-w-5xl">
        
        {/* Header with Meta Data */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Performance Report</h1>
            <div className="flex items-center gap-4 mt-2 text-slate-500 text-sm font-medium">
              <span className="flex items-center gap-1.5"><Calendar className="size-4" /> {formattedDate}</span>
              <span className="flex items-center gap-1.5"><Fingerprint className="size-4" /> ID: {_id.slice(-6)}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-xl border-slate-200 bg-white hover:bg-slate-50 font-bold transition-all">
              <RotateCcw className="mr-2 size-4" /> Retake
            </Button>
            <Link href={"/dashboard"}>
            <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 font-bold transition-all active:scale-95">
              <LayoutDashboard className="mr-2 size-4" /> Dashboard
            </Button>
            </Link>
          </div>
        </div>

        {/* Main Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Score Card */}
          <div className="md:col-span-1 bg-white rounded-[2.5rem] border border-slate-200 p-8 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-rose-500" /> {/* Top accent line */}
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Final Score</p>
            <div className="relative flex items-center justify-center">
              <svg className="size-36">
                <circle cx="72" cy="72" r="64" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
                <circle cx="72" cy="72" r="64" fill="transparent" stroke="#f43f5e" strokeWidth="12" 
                  strokeDasharray="402" strokeDashoffset={402 - (402 * averageScore) / 100} 
                  strokeLinecap="round" className="transition-all duration-1000 ease-out" />
              </svg>
              <span className="absolute text-4xl font-black text-slate-900">{averageScore}%</span>
            </div>
            <div className="mt-6 bg-rose-50 text-rose-600 border-rose-100 px-4 py-1.5 uppercase text-[10px] font-black">
              {performanceLevel} Performance
            </div>
          </div>

          {/* AI Feedback Card */}
          <div className="md:col-span-2 bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl flex flex-col justify-center">
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs mb-6 uppercase tracking-widest">
                <Zap className="size-4 fill-indigo-400 text-indigo-400" /> AI Executive Summary
              </div>
              <p className="text-xl md:text-2xl font-semibold leading-relaxed text-slate-100 italic">
                "{detailedOverview}"
              </p>
            </div>
            <div className="absolute -right-16 -bottom-16 size-64 bg-indigo-500/10 rounded-full blur-3xl" />
          </div>

          {/* Weak Topics Box */}
          <div className="md:col-span-1 bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
            <h3 className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
              <AlertTriangle className="size-4 text-rose-500" /> Weak Points
            </h3>
            <div className="flex flex-col gap-3">
              {weakTopics.map((topic: any, i:any) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-rose-50/50 border border-rose-100/50 rounded-2xl text-rose-700 font-bold text-xs transition-hover hover:bg-rose-50">
                  <TrendingDown className="size-4 shrink-0" /> {topic}
                </div>
              ))}
            </div>
          </div>

          {/* Strong Topics Box */}
          <div className="md:col-span-1 bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
            <h3 className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
              <CheckCircle2 className="size-4 text-emerald-500" /> Strengths
            </h3>
            <div className="flex flex-col gap-3">
              {strongTopics.length > 0 ? (
                strongTopics.map((topic:any, i:any) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-emerald-50/50 border border-emerald-100/50 rounded-2xl text-emerald-700 font-bold text-xs">
                    <TrendingUp className="size-4 shrink-0" /> {topic}
                  </div>
                ))
              ) : (
                <div className="py-6 text-center">
                  <p className="text-xs font-medium text-slate-400 italic">No strong topics identified in this session. Keep practicing!</p>
                </div>
              )}
            </div>
          </div>

          {/* Next Steps Card */}
          <div className="md:col-span-1 bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
            <h3 className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
              <Target className="size-4 text-indigo-500" /> Learning Path
            </h3>
            <ul className="space-y-4">
              {nextTopicsToLearn.map((topic:any, i:any) => (
                <li key={i} className="flex items-center justify-between group cursor-default p-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <span className="text-slate-700 font-bold text-sm">{topic}</span>
                  <ArrowUpRight className="size-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                </li>
              ))}
            </ul>
          </div>

          {/* Suggestions Banner */}
          <div className="md:col-span-3 bg-indigo-50/50 border border-indigo-100 rounded-[2rem] p-8 flex flex-col md:flex-row items-center gap-6 shadow-inner">
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-indigo-50 shrink-0">
              <Lightbulb className="size-8 text-indigo-600 animate-pulse" />
            </div>
            <div>
              <h4 className="text-indigo-900 font-black text-lg mb-1 uppercase tracking-tight">Personalized Coaching</h4>
              <p className="text-indigo-700/80 font-semibold leading-relaxed text-sm">
                {suggestions}
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center text-slate-400 text-[10px] uppercase font-black tracking-[0.2em] gap-4">
          <p>Session Ref:</p>
          <p>© 2026 Examy Intelligence Engine</p>
        </div>
      </div>
    </div>
  )
};

export default page;
