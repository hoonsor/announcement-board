"use server"

import { signIn, signOut } from "@/auth"
import { AuthError } from "next-auth"

export async function authenticate(prevState: string | undefined, formData: FormData) {
  try {
    await signIn('credentials', {
      ...Object.fromEntries(formData),
      redirectTo: '/admin'
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return '帳號或密碼錯誤'
        default:
          return '發生未知錯誤'
      }
    }
    throw error
  }
}

export async function logout() {
  await signOut({ redirectTo: '/' })
}
