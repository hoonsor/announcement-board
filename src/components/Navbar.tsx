import Link from 'next/link'
import { auth } from '@/auth'
import { logout } from '@/actions/auth'

export default async function Navbar() {
  const session = await auth()

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/70 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="font-bold text-xl text-indigo-600 tracking-tight">專案活動公告網</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <span className="text-gray-700 text-sm hidden sm:inline-block">Hi, {session.user?.name}</span>
                {session.user?.role === 'ADMIN' && (
                  <Link href="/admin" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">系統管理</Link>
                )}
                <Link href="/create" className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg transition-colors shadow-md shadow-indigo-200">發布公告</Link>
                <form action={logout}>
                  <button className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50">登出</button>
                </form>
              </>
            ) : (
              <Link href="/login" className="text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors">編組登入</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
