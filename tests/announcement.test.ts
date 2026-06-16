import { describe, it, expect, vi, beforeEach } from 'vitest'
import { deleteAnnouncement } from '@/actions/announcement'
import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

// Mocking modules
vi.mock('@/auth', () => ({
  auth: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
}))

vi.mock('@/lib/prisma', () => ({
  default: {
    announcement: {
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

describe('deleteAnnouncement Server Action 權限驗證測試', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('未登入的使用者試圖刪除公告，應拋出 Unauthorized 錯誤', async () => {
    // 模擬 auth() 回傳 null (未登入)
    vi.mocked(auth).mockResolvedValue(null)

    await expect(deleteAnnouncement('ann_123', null)).rejects.toThrow('Unauthorized')
  })

  it('登入的普通使用者試圖刪除「他人」發布的公告，應拋出 Unauthorized 錯誤', async () => {
    // 模擬登入使用者為 user_A (GROUP 角色)
    vi.mocked(auth).mockResolvedValue({
      user: { id: 'user_A', role: 'GROUP', name: '編組A' },
      expires: ''
    } as any)

    // 模擬公告 authorId 為 user_B
    vi.mocked(prisma.announcement.findUnique).mockResolvedValue({
      id: 'ann_123',
      authorId: 'user_B',
    } as any)

    await expect(deleteAnnouncement('ann_123', null)).rejects.toThrow('Unauthorized')
  })

  it('登入的普通使用者試圖刪除「自己」發布的公告，應執行成功並刪除', async () => {
    // 模擬登入使用者為 user_A (GROUP 角色)
    vi.mocked(auth).mockResolvedValue({
      user: { id: 'user_A', role: 'GROUP', name: '編組A' },
      expires: ''
    } as any)

    // 模擬公告 authorId 為 user_A
    vi.mocked(prisma.announcement.findUnique).mockResolvedValue({
      id: 'ann_123',
      authorId: 'user_A',
    } as any)

    // 呼叫刪除，設定不跳轉
    await deleteAnnouncement('ann_123', null)

    // 驗證 prisma 刪除確實被呼叫
    expect(prisma.announcement.delete).toHaveBeenCalledWith({
      where: { id: 'ann_123' }
    })
  })

  it('管理員(ADMIN) 試圖刪除任何人的公告，皆應執行成功', async () => {
    // 模擬登入使用者為 admin_user (ADMIN 角色)
    vi.mocked(auth).mockResolvedValue({
      user: { id: 'admin_user', role: 'ADMIN', name: '系統管理員' },
      expires: ''
    } as any)

    // 模擬公告 authorId 為 user_B (他人公告)
    vi.mocked(prisma.announcement.findUnique).mockResolvedValue({
      id: 'ann_123',
      authorId: 'user_B',
    } as any)

    // 呼叫刪除，設定跳轉
    await deleteAnnouncement('ann_123', '/')

    // 驗證 prisma 刪除被呼叫
    expect(prisma.announcement.delete).toHaveBeenCalledWith({
      where: { id: 'ann_123' }
    })
    // 驗證 redirect 被呼叫
    expect(redirect).toHaveBeenCalledWith('/')
  })
})
