"use client"

import { useActionState } from "react"
import { authenticate } from "@/actions/auth"
import { motion } from "framer-motion"

export default function LoginFormClient() {
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined)

  return (
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
  )
}
