"use client"

import { useEffect, useState } from "react"
import {  
  ChevronLeft, 
  Brain, 
  Lightbulb, 
  SendHorizontal,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  LayoutDashboard
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"


interface Question {
  _id: string;
  questionText: string;
  hint?: string;
  options?: string[];
  answer?: string;
}

interface Session {
   _id: string;
   user: string;
   examType: string;
   subject: string;
   difficulty: string;
   topics: string[];
   questions: Question[];
}




export default function AssessmentPage() {

  const router = useRouter()
  
  const [session, setSession] = useState<Session | null>(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("")
  const [feedback, setFeedback] = useState<string>("")

  const params = useParams()
  
  const fetchSessionData = async () => {
    try {
      setIsLoading(true)
      const res = await axios.get(`http://localhost:5000/api/session/${params.sessionId}`, {headers: {Authorization: `Bearer ${sessionStorage.getItem('token')}`}})
      setSession(res.data.session)
      setTotalQuestions(res.data.session.questions.length)
      setCurrentQuestion(res.data.session.questions[0])

    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNextSubmit = async () => {
  if (!currentQuestion || !session || answer.trim() === "") return;

  try {

      console.log(answer)
      const res = await axios.post(
      `http://localhost:5000/api/ai/verify`,
      { questionId: currentQuestion._id, userAnswer: answer },
      { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } })

      console.log(res)
      setFeedback(res.data.feedback)
  } catch (error) {
    console.error(error)
  }
}


  
  useEffect(() => {
    fetchSessionData()
  }, [])

  // Update currentQuestion when currentIndex changes
  useEffect(() => {
    if (session && session.questions.length > 0) {
      setCurrentQuestion(session.questions[currentIndex])
      setProgress(((currentIndex + 1) / session.questions.length) * 100)
      console.log(currentIndex)
    }
  }, [currentIndex, session])

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setFeedback("")
      setAnswer("")
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async() => {
    try {
      const res = await axios.post(`http://localhost:5000/api/result/generate`, {sessionId: session?._id}, {headers: {Authorization: `Bearer ${sessionStorage.getItem('token')}`}})
      
      if (res) {
        router.push(`/overview/${session?._id}`)
      }
    } catch (error) {
      console.error(error)
    }
  }

  if (isLoading) return <div>Loading...</div>;
  if (!session) return <div>No session found</div>;

  return (

    <div className="min-h-screen bg-[#FCFDFF] pt-24 pb-12 px-6">
      <div className="mx-auto max-w-4xl">
        
        {/* Top Context Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-widest text-xs">
              <Brain className="size-4" />
              <span>Assessment Session</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 capitalize">
              {session.subject}
            </h1>
            <div className="flex gap-2">
              {session.topics.map((topic, i) => (
                <Badge key={i} variant="secondary" className="bg-indigo-50 text-indigo-700 border-none px-3">
                  {topic}
                </Badge>
              ))}
              <Badge variant="outline" className="border-slate-200 text-slate-500 uppercase">
                {session.difficulty}
              </Badge>
            </div>
          </div>

          <div className="text-right space-y-2">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-tighter">
              Question {currentIndex + 1} of {totalQuestions}
            </p>
            <Progress value={progress} className="w-40 h-2 bg-slate-100" />
          </div>
        </div>

        {/* Main Question Card */}
        <div className="relative group">
          <div className="rounded-[2.5rem] border border-slate-200 bg-white p-10 shadow-xl shadow-indigo-100/20">
            
            {/* Question Text */}
            <div className="mb-8">
              <span className="inline-block px-4 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase mb-6 shadow-lg shadow-slate-200">
                Current Question
              </span>
              {feedback && (
                  <Badge className=" ml-3 px-4 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black uppercase  shadow-lg shadow-slate-200">
                    <CheckCircle2 className="size-3.5" /> Evaluated
                  </Badge>
                )}
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 leading-snug">
                {currentQuestion!.questionText}
              </h2>
            </div>

            {/* AI Hint Section */}
            {currentQuestion!.hint && (
              <div className="mb-8 flex items-start gap-3 rounded-2xl bg-amber-50/50 p-5 border border-amber-100/50">
                <Lightbulb className="size-5 text-amber-500 shrink-0 mt-1" />
                <p className="text-sm text-amber-800 leading-relaxed italic">
                  <span className="font-bold">Hint:</span> {currentQuestion!.hint}
                </p>
              </div>
            )}

            {/* Large Answer Field */}
            <div className="space-y-6">
              {!feedback ? (
                // Input Mode
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">
                    Your Answer
                  </label>
                  <Textarea 
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your explanation here..."
                    className="min-h-[180px] rounded-[1.5rem] border-slate-200 bg-slate-50 p-6 text-lg focus-visible:ring-indigo-600 focus:bg-white shadow-inner"
                    required
                  />
                </div>
              ) : (
                // Feedback Mode
                <div className="space-y-6 animate-in zoom-in-95 duration-300">
                  <div className="rounded-2xl bg-indigo-50/50 p-6 border border-indigo-100">
                    <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm mb-3">
                      <Sparkles className="size-4" />
                      AI FEEDBACK
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      {feedback}
                    </p>
                  </div>
                  
                  <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">Your Original Answer:</p>
                    <p className="text-sm text-slate-600 italic">"{answer}"</p>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons Inside Card */}
            <div className="mt-10 flex items-center justify-between border-t border-slate-50 pt-8">
              <Button 
                variant="ghost" 
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="rounded-xl font-bold text-slate-500 disabled:opacity-30"
              >
                <ChevronLeft className="mr-2 size-5" />
                Previous
              </Button>

              <div className="flex gap-4">
                {currentIndex >= totalQuestions - 1 &&  feedback ? (
                  /* The Overview Button - Appears only at the end after feedback */
                  <Button 
                    className="rounded-xl bg-emerald-600 px-8 py-6 font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95 text-white" 
                    onClick={handleSubmit}
                    
                  >
                    Overview <LayoutDashboard className="ml-2 size-4" />
                  </Button>
                ) : (
                  /* The Standard Submit/Next Button */
                  <Button 
                    className="rounded-xl bg-slate-900 px-8 py-6 font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 text-white" 
                    onClick={handleNextSubmit}
                  >
                    Submit Answer 
                    <SendHorizontal className="ml-2 size-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Floating Next Arrow on the Right */}
          {currentIndex < totalQuestions - 1 && (
            <button 
              onClick={handleNext}
              className="absolute -right-6 top-1/2 -translate-y-1/2 flex h-14 w-14 items-center justify-center rounded-full bg-white border border-slate-200 text-indigo-600 shadow-2xl hover:bg-indigo-600 hover:text-white transition-all transform hover:scale-110 active:scale-90 z-10"
            >
              <ArrowRight className="size-6"/>
            </button>
          )}
        </div>

        {/* Footer Meta */}
        <p className="mt-8 text-center text-slate-400 text-xs">
          Session ID: {session._id} • Auto-saving active
        </p>
      </div>
    </div>
  )
}

