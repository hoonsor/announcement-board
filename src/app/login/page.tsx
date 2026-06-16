import { auth } from "@/auth"
import { redirect } from "next/navigation"
import LoginFormClient from "./LoginFormClient"

export default async function LoginPage() {
  const session = await auth()
  
  // 防呆：已登入的使用者如果訪問 /login，直接導向後台 /admin
  if (session) {
    redirect("/admin")
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-white/50">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">系統登入</h1>
          <p className="text-gray-500 mt-2">工科技藝競賽任務編組專區</p>
        </div>

        <LoginFormClient />
      </div>
    </main>
  )
}
