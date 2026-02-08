"use client"

import Link from "next/link"
import { Brain, ArrowRight, Chrome, Github } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Loader } from "@/components/Loader"

export default function SimpleLoginPage() {

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("hitted the api");

    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!email || !password) {
        throw new Error("Please fill in all fields");
      }

      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });


      if (res.status === 200 || res.status === 201) {
        console.log(res.data)
        router.push('/dashboard')
        sessionStorage.setItem("token", res.data.token)
      }

    } catch (err: any) {
      console.error("Login failed:", err);
      const errorMessage = err.response?.data?.message || err.message || "Something went wrong. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <Loader fullScreen label="Loggin you in.."/>
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-[400px] rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">

        {/* Logo & Header */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
            <Brain className="size-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome Back</h1>
          <p className="text-sm text-slate-500">Sign in to your Examy account</p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="ml-1 text-xs font-semibold text-slate-600">Email address</label>
            <Input
              type="email"
              placeholder="name@example.com"
              className="h-11 rounded-xl border-slate-200 focus-visible:ring-blue-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between px-1">
              <label className="text-xs font-semibold text-slate-600">Password</label>
              <Link href="#" className="text-xs font-medium text-blue-600 hover:underline">Forgot?</Link>
            </div>
            <Input
              type="password"
              placeholder="••••••••"
              className="h-11 rounded-xl border-slate-200 focus-visible:ring-blue-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button className="h-11 w-full rounded-xl bg-slate-900 font-semibold text-white hover:bg-blue-600 transition-all">
            Log in
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-slate-500">
          New here?{" "}
          <Link href="/auth/signup" className="font-bold text-blue-600 hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  )
}