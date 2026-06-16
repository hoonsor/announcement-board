"use client"

import { useActionState } from "react"
import { authenticate } from "@/actions/auth"
import { motion } from "framer-motion"

export default function LoginPage() {
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined)

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-white/50"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">系統登入</h1>
          <p className="text-gray-500 mt-2">工科技藝競賽任務編組專區</p>
        </div>

        <form action={formAction} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">帳號</label>
            <input 
              name="username"
              type="text" 
              required 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/50"
              placeholder="請輸入編組帳號"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">密碼</label>
            <input 
              name="password"
              type="password" 
              required 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/50"
              placeholder="請輸入密碼"
            />
          </div>

          {errorMessage && (
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-red-500 text-sm text-center"
            >
              {errorMessage}
            </motion.p>
          )}

          <button 
            type="submit" 
            disabled={isPending}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center"
          >
            {isPending ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              "登入"
            )}
          </button>
        </form>
      </motion.div>
    </main>
  )
}
