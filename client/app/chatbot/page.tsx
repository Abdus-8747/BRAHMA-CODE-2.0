"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Sparkles, Loader2, ArrowLeft, Brain, Info, Zap, Lightbulb } from "lucide-react" // Added Lightbulb
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import axios from "axios"

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

// 1. Define your suggestions
const SUGGESTIONS = [
    "Why am I weak in this topic?",
    "What should I revise next?",
    "Am I ready for the exam?",
    "Show my progress",
]

export default function ChatbotPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "assistant",
            content: "Hello! I'm your AI Performance Coach. How can I help you improve your skills today?",
            timestamp: new Date()
        }
    ])
    const [inputValue, setInputValue] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => { setMounted(true) }, [])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSendMessage = async (e?: React.FormEvent, textOverride?: string) => {
        e?.preventDefault()
        
        // Use either the override text (from suggestions) or the current input
        const messageToSend = textOverride || inputValue
        if (!messageToSend.trim()) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: messageToSend,
            timestamp: new Date()
        }

        setMessages((prev) => [...prev, userMessage])
        setInputValue("")
        setIsLoading(true)

        try {
            const res = await axios.post('http://localhost:5000/api/coach/chat', 
                { message: userMessage.content }, 
                { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } }
            )

            const data = res.data
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.reply,
                timestamp: new Date()
            }
            setMessages((prev) => [...prev, botMessage])
        } catch (error) {
            console.error("Chat error:", error)
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "I apologize, but I'm having trouble connecting right now.",
                timestamp: new Date()
            }
            setMessages((prev) => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    const NAVBAR_HEIGHT = "64px";

    return (
        <div 
            style={{ marginTop: NAVBAR_HEIGHT, height: `calc(100vh - ${NAVBAR_HEIGHT})` }}
            className="flex w-full flex-col bg-[#F8FAFF] relative overflow-hidden font-sans"
        >
            <div className="pointer-events-none absolute top-0 right-0 h-96 w-96 rounded-full bg-blue-100/30 blur-[120px]" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-96 w-96 rounded-full bg-indigo-100/20 blur-[120px]" />

            <main className="flex-1 overflow-y-auto p-4 md:p-12 scroll-smooth z-10 relative">
                <div className="mx-auto max-w-3xl space-y-8">
                    
                    <div className="flex justify-center mb-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-blue-100 rounded-full shadow-sm">
                            <div className="size-1.5 rounded-full bg-blue-600 animate-pulse" />
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Insight Engine Active</span>
                        </div>
                    </div>

                    {/* Welcome Message */}
                    {messages.length <= 1 && (
                        <div className="flex flex-col items-center justify-center text-center py-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="p-6 bg-[#2863ed] rounded-[2.5rem] shadow-2xl shadow-blue-200">
                                <Brain className="size-10 text-white" />
                            </div>
                            <div className="max-w-sm">
                                <h2 className="text-2xl font-black text-[#1d2433]">Ready to Level Up?</h2>
                                <p className="text-sm text-[#475569] mt-2 font-medium">Try one of these to get started:</p>
                            </div>
                        </div>
                    )}

                    {/* Messages Render logic... (remains same) */}
                    {messages.map((message) => (
                        <div key={message.id} className={cn("flex w-full gap-4 animate-in duration-300", message.role === "user" ? "justify-end" : "justify-start")}>
                            {message.role === "assistant" && (
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 border border-blue-100 shadow-sm mt-1">
                                    <Sparkles className="size-5 text-[#0d1a39]" />
                                </div>
                            )}
                            <div className={cn("relative px-6 py-4 text-base shadow-sm max-w-[85%] font-medium", message.role === "user" ? "bg-blue-600 text-white rounded-[1.5rem] rounded-tr-none" : "bg-white border border-blue-100 text-[#1e293b] rounded-[1.5rem] rounded-tl-none")}>
                                <p className="whitespace-pre-wrap">{message.content}</p>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex w-full gap-4 justify-start animate-pulse">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-white border border-blue-100">
                                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                            </div>
                            <div className="bg-white border border-blue-100 px-6 py-4 rounded-[1.5rem] flex items-center gap-3">
                                <span className="text-[10px] text-blue-600 font-black uppercase tracking-[0.2em]">Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} className="h-10" />
                </div>
            </main>

            {/* Input Area */}
            <div className="p-6 md:p-10 bg-white/60 backdrop-blur-lg border-t border-blue-50">
                <div className="mx-auto max-w-3xl">
                    
                    {/* --- NEW: SUGGESTION CHIPS --- */}
                    <div className="flex flex-wrap gap-2 mb-4 justify-center">
                        {SUGGESTIONS.map((suggestion, index) => (
                            <button
                                key={index}
                                onClick={() => handleSendMessage(undefined, suggestion)}
                                disabled={isLoading}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-100 rounded-full text-xs font-bold text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95"
                            >
                                <Lightbulb className="size-3" />
                                {suggestion}
                            </button>
                        ))}
                    </div>

                    <form
                        onSubmit={handleSendMessage}
                        className="relative flex items-center gap-2 rounded-[2rem] border-2 border-blue-100 bg-white p-2.5 pl-6 shadow-2xl shadow-blue-100/50 focus-within:border-blue-400 transition-all duration-300"
                    >
                        <input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask anything..."
                            className="flex-1 border-0 bg-transparent py-3 text-base outline-none text-[#0f172a] placeholder:text-[#94a3b8] font-bold"
                            disabled={isLoading}
                        />
                        <Button
                            type="submit"
                            size="icon"
                            disabled={!inputValue.trim() || isLoading}
                            className={cn(
                                "h-12 w-12 shrink-0 rounded-[1.5rem] transition-all duration-300",
                                inputValue.trim() ? "bg-[#0f172a] text-white hover:bg-blue-600" : "bg-blue-50 text-blue-200"
                            )}
                        >
                            <Send className="size-5" />
                        </Button>
                    </form>
                    <p className="mt-4 text-center text-[10px] text-[#94a3b8] font-black uppercase tracking-[0.2em]">
                        Insight Engine v3.0 • Optimized for Academic Growth
                    </p>
                </div>
            </div>
        </div>
    )
} 