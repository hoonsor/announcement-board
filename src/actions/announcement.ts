"use server"

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

export async function createAnnouncement(formData: FormData) {
  const session = await auth()
  if (!session?.user) {
    throw new Error("Unauthorized")
  }

  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const tagIds = formData.getAll("tags") as string[]
  const files = formData.getAll("files") as File[]

  // Handle files
  const attachments = []
  if (files.length > 0) {
    const uploadDir = path.join(process.cwd(), "public", "uploads")
    await mkdir(uploadDir, { recursive: true }).catch(() => {})

    for (const file of files) {
      if (file.size > 0 && file.name && file.name !== "undefined") {
        const buffer = Buffer.from(await file.arrayBuffer())
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        // Ensure safe filename
        const safeName = file.name.replace(/[^a-zA-Z0-9.-_]/g, '_')
        const filename = uniqueSuffix + '-' + safeName
        await writeFile(path.join(uploadDir, filename), buffer)
        attachments.push({
          filename: file.name,
          url: `/uploads/${filename}`
        })
      }
    }
  }

  await prisma.announcement.create({
    data: {
      title,
      content,
      authorId: session.user.id,
      tags: {
        connect: tagIds.map(id => ({ id }))
      },
      attachments: {
        create: attachments
      }
    }
  })

  revalidatePath("/")
  redirect("/")
}

export async function updateAnnouncement(id: string, formData: FormData) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const existing = await prisma.announcement.findUnique({ where: { id } })
  if (!existing || (existing.authorId !== session.user.id && session.user.role !== 'ADMIN')) {
    throw new Error("Unauthorized")
  }

  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const tagIds = formData.getAll("tags") as string[]
  const files = formData.getAll("files") as File[]

  const attachments = []
  if (files.length > 0) {
    const uploadDir = path.join(process.cwd(), "public", "uploads")
    await mkdir(uploadDir, { recursive: true }).catch(() => {})

    for (const file of files) {
      if (file.size > 0 && file.name && file.name !== "undefined") {
        const buffer = Buffer.from(await file.arrayBuffer())
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const safeName = file.name.replace(/[^a-zA-Z0-9.-_]/g, '_')
        const filename = uniqueSuffix + '-' + safeName
        await writeFile(path.join(uploadDir, filename), buffer)
        attachments.push({
          filename: file.name,
          url: `/uploads/${filename}`
        })
      }
    }
  }

  await prisma.announcement.update({
    where: { id },
    data: {
      title,
      content,
      tags: {
        set: [],
        connect: tagIds.map(tId => ({ id: tId }))
      },
      ...(attachments.length > 0 ? {
        attachments: { create: attachments }
      } : {})
    }
  })

  revalidatePath("/")
  revalidatePath(`/announcement/${id}`)
  redirect(`/announcement/${id}`)
}

export async function deleteAnnouncement(id: string, redirectTo: string | null = "/") {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const existing = await prisma.announcement.findUnique({ where: { id } })
  if (!existing || (existing.authorId !== session.user.id && session.user.role !== 'ADMIN')) {
    throw new Error("Unauthorized")
  }

  await prisma.announcement.delete({ where: { id } })
  revalidatePath("/")
  revalidatePath("/admin")
  
  if (redirectTo) {
    redirect(redirectTo)
  }
}
