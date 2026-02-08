"use client"

import Link from "next/link"
import { Brain, ArrowRight, Lock, Mail, User} from "lucide-react"
import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Loader } from "@/components/Loader"

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      setIsLoading(true);
      if (!name || !email || !password) {
        throw new Error("Please fill in all fields");
      }

      // Endpoint is /api/auth/signup based on server/routes/auth.js
      const res = await axios.post('http://localhost:5000/api/auth/signup', { name, email, password });

      if (res.status === 200 || res.status === 201) {
        console.log("signed up successfully");
        router.push('/auth/login');
      }
    } catch (err: any) {
      console.error("Signup failed:", err);
      const errorMessage = err.response?.data?.message || err.message || "Something went wrong. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }
  
  if (isLoading) {
    return <Loader fullScreen label="Creating your account.."/>
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="w-full max-w-[400px] rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">

        {/* Logo & Header */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
            <Brain className="size-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create Account</h1>
          <p className="text-sm text-slate-500">Join Examy to start your journey</p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-center text-xs font-bold text-red-600 border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="ml-1 text-xs font-semibold text-slate-600">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="John Doe"
                className="h-11 rounded-xl border-slate-200 pl-10 focus-visible:ring-blue-600"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="ml-1 text-xs font-semibold text-slate-600">Email address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="email"
                placeholder="name@example.com"
                className="h-11 rounded-xl border-slate-200 pl-10 focus-visible:ring-blue-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="ml-1 text-xs font-semibold text-slate-600">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="password"
                placeholder="••••••••"
                className="h-11 rounded-xl border-slate-200 pl-10 focus-visible:ring-blue-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <Button 
            className="h-11 w-full rounded-xl bg-slate-900 font-semibold text-white hover:bg-blue-600 transition-all active:scale-[0.98]"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader size="sm" label="" className="text-white" />
            ) : (
              <>
                Get Started
                <ArrowRight className="ml-2 size-4" />
              </>
            )}
          </Button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-bold text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}