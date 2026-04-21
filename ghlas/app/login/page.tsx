'use client'

import { useState } from 'react'
import { Mail, Lock, LogIn, Eye, EyeOff, IdCard } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic
    console.log('Login:', { email, password })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-deepCanopy via-brand-darkForest to-brand-shadow flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex p-3 bg-brand-darkForest rounded-full mb-4">
              <LogIn className="w-8 h-8 text-accent-golden" />
            </div>
            <h1 className="text-2xl font-bold text-brand-darkForest">Welcome Back</h1>
            <p className="text-brand-muted mt-2">Sign in to your account</p>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-10"
                  placeholder="user@example.com"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-10 pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="w-5 h-5 text-brand-muted" /> : <Eye className="w-5 h-5 text-brand-muted" />}
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-neutral-coolGray text-brand-leaf focus:ring-brand-leaf" />
                <span className="text-sm text-brand-muted">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-accent-golden hover:text-accent-darkGold">
                Forgot password?
              </Link>
            </div>
            
            <button type="submit" className="btn-accent w-full py-3">
              Sign In
            </button>
          </form>
          
          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-coolGray"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-brand-muted">Or continue with</span>
            </div>
          </div>
          
          {/* GhanaCard Login */}
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-neutral-coolGray rounded-lg hover:bg-neutral-paleMint transition-colors">
            <IdCard className="w-5 h-5" />
            <span>Sign in with GhanaCard</span>
          </button>
          
          {/* Sign Up Link */}
          <p className="text-center mt-6 text-sm text-brand-muted">
            Don't have an account?{' '}
            <Link href="/register" className="text-accent-golden hover:text-accent-darkGold font-medium">
              Create an account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}