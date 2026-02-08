"use client"

import { Plus, Search, Calendar, BarChart3, Clock, ArrowRight, Sparkles, XCircle, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { Select , SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import SessionCreationModal from "@/components/SessionCreationModal"
import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader } from "@/components/Loader"

const getInitials = (subject: string) => {
  return subject
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getColorTheme = (subject: string) => {
  const themes = [
    { accent: "border-t-emerald-500", bg: "bg-emerald-50" },
    { accent: "border-t-blue-500", bg: "bg-blue-50" },
    { accent: "border-t-orange-500", bg: "bg-orange-50" },
    { accent: "border-t-pink-500", bg: "bg-pink-50" },
    { accent: "border-t-indigo-500", bg: "bg-indigo-50" },
  ];
  // Stable pick based on string length
  return themes[subject.length % themes.length];
};

export default function ExamDashboard() {

  const [examSessions, setExamSessions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()


  const fetchSessions = async () => {
      try {
        setIsLoading(true)
        const res = await axios.get('http://localhost:5000/api/session/my',{headers: {Authorization: `Bearer ${sessionStorage.getItem('token')}`}})
        console.log(res)
        setExamSessions(res.data.sessions)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    useEffect(() => {
      fetchSessions()
    }, []);

    
  return (
    /* pt-24 provides space for the fixed h-16 navbar */
    <div className="min-h-screen bg-[#fcfcfd] pt-24 pb-12 px-6">
      <div className="mx-auto max-w-7xl">
        
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="space-y-1">
            <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-slate-900">
              <Brain className="size-8 text-indigo-600" />
              <span>Examy</span>
            </h1>
            <p className="text-slate-500">Select a path to start your assessment session.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <Input 
                placeholder="Search paths..." 
                className="w-full md:w-72 pl-10 h-11 rounded-xl border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500/20" 
              />
            </div>
          </div>
        </div>

        {/* Card Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader size="lg" label="Loading your sessions..." />
          </div>
        ) : (<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {examSessions && examSessions.length > 0 ? (
            examSessions.map((exam) => {
              const theme = getColorTheme(exam.subject);
              const formattedDate = new Date(exam.updatedAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              });

              return (
                <div 
                  key={exam._id} // Using backend _id
                  className={`relative flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md border-t-4 ${theme.accent}`}
                >
                  {/* Header: Icon + Titles */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`flex size-14 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-slate-700 shadow-inner ${theme.bg}`}>
                      {getInitials(exam.subject)}
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="font-bold text-slate-900 text-lg truncate">{exam.subject}</h3>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {exam.topics.join(", ")}
                      </p>
                    </div>
                  </div>

                  {/* Pill Badges mapped to Backend Keys */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <div className="px-3 py-1 rounded-full border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 shadow-sm">
                      Type: <span className="uppercase">{exam.examType}</span>
                    </div>
                    <div className="px-3 py-1 rounded-full border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 shadow-sm">
                      {exam.questions.length} Q&A
                    </div>
                    <div className="px-3 py-1 rounded-full border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 shadow-sm">
                      Updated: {formattedDate}
                    </div>
                  </div>

                  {/* Sub-description */}
                  <p className="text-xs text-slate-400 mb-6 italic capitalize">
                    {exam.difficulty} difficulty as {exam.subject}
                  </p>

                  <div className="mt-auto flex flex-row gap-3">
                    {/* Primary Action: Start Assessment */}
                    <Link href={`/session/${exam._id}`} className="flex-1">
                      <Button className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]">
                      Start Assessment
                    </Button>
                    </Link>

                    {/* Secondary Action: Overview */}
                    <Link href={`overview/${exam._id}`}>
                    <Button 
                      variant="outline" 
                      className="flex-1 h-11 rounded-xl border-2 border-slate-200 bg-transparent font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-[0.98]"
                      key={exam._id}
                    >
                      Overview
                    </Button>
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            /* Empty State Container */
            <div className="col-span-full flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-slate-200 bg-slate-50/50 py-20 px-6 text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-xl shadow-slate-200/50">
                <Sparkles className="size-10 text-indigo-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">No sessions yet</h2>
              <p className="mt-2 max-w-[300px] text-slate-500">
                Your dashboard is looking a bit lonely. Create your first assessment path to get started.
              </p>
              <div className="mt-8 flex items-center gap-2 text-sm font-bold text-indigo-600 animate-bounce">
                <ArrowRight className="size-4 rotate-90" />
                <span>Click "Add New" below</span>
              </div>
            </div>
          )}
        </div>)}
        

        {/* The Modal Trigger - Assuming it renders the floating button internally */}
        <SessionCreationModal onSessionCreated={fetchSessions} />
        
      </div>
    </div>
  )
}