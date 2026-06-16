import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // 建立密碼
  const defaultPassword = await bcrypt.hash('123456', 10)
  const adminPassword = await bcrypt.hash('admin123', 10)

  // 1. 建立帳號
  const accounts = [
    { username: 'admin', name: '系統管理員', role: Role.ADMIN, password: adminPassword },
    { username: 'mech_group', name: '機械職類編組', role: Role.GROUP, password: defaultPassword },
    { username: 'elec_group', name: '電機職類編組', role: Role.GROUP, password: defaultPassword },
    { username: 'design_group', name: '設計職類編組', role: Role.GROUP, password: defaultPassword },
    { username: 'info_group', name: '資訊職類編組', role: Role.GROUP, password: defaultPassword },
  ]

  const users: Record<string, any> = {}
  for (const acc of accounts) {
    const user = await prisma.user.upsert({
      where: { username: acc.username },
      update: {},
      create: acc,
    })
    users[acc.username] = user
  }

  // 2. 建立標籤
  const tagNames = ['系統公告', '競賽規則', '重要', '一般', '機械', '電機', '設計', '資訊', '成績公佈']
  const tags: Record<string, any> = {}
  for (const t of tagNames) {
    const tag = await prisma.tag.upsert({
      where: { name: t },
      update: {},
      create: { name: t }
    })
    tags[t] = tag
  }

  // 3. 建立範例公告 (使用 HTML 格式以搭配 Rich Text Editor)
  await prisma.announcement.deleteMany({}) // 清除舊公告以避免重複

  const announcements = [
    {
      title: '115學年度全國高級中等學校工科技藝競賽 報名須知',
      content: `
        <h2>報名注意事項</h2>
        <p>本年度競賽將於下個月正式展開，請各校指導老師注意以下事項：</p>
        <ul>
          <li><strong>報名期限：</strong>即日起至本月底止。</li>
          <li><strong>報名方式：</strong>請於本系統線上填寫表單並上傳選手資料。</li>
          <li><strong>注意事項：</strong>逾期恕不受理，請特別留意時間。</li>
        </ul>
        <p>相關競賽簡章與切結書，請見下方附件下載。</p>
      `,
      authorId: users['admin'].id,
      tagIds: [tags['系統公告'].id, tags['重要'].id, tags['競賽規則'].id]
    },
    {
      title: '機械職類 - 術科測試設備清單更新',
      content: `
        <h3>設備更新公告</h3>
        <p>各位選手好：</p>
        <p>機械職類術科測試場地的 <strong>CNC 銑床</strong> 已於昨日完成軟體升級。最新的控制器操作手冊與差異說明已經附在下方，請參賽選手務必下載詳閱，以免影響考試權益。</p>
        <p>祝各位選手準備順利！</p>
      `,
      authorId: users['mech_group'].id,
      tagIds: [tags['機械'].id, tags['重要'].id]
    },
    {
      title: '資訊職類 - 開發環境與軟體版本公告',
      content: `
        <p>資訊職類的開發環境已確認如下：</p>
        <ul>
          <li><strong>作業系統：</strong> Windows 11 專業版</li>
          <li><strong>IDE：</strong> Visual Studio Code 1.85, Visual Studio 2022</li>
          <li><strong>資料庫：</strong> MS SQL Server 2022 Express, MySQL 8.0</li>
        </ul>
        <p>如需安裝額外擴充套件，請於考前熟悉離線安裝方式。</p>
      `,
      authorId: users['info_group'].id,
      tagIds: [tags['資訊'].id, tags['一般'].id]
    },
    {
      title: '設計職類 - 軟體版權與素材使用規範',
      content: `
        <p>設計職類參賽者請注意：</p>
        <p>競賽期間<strong>嚴禁使用未經授權之圖庫素材或盜版字體</strong>。違者將依競賽規則取消資格。主辦單位已提供合法授權之素材庫連結，請參考附件說明文件。</p>
        <p><a href="https://creativecommons.org/" target="_blank">創用 CC 授權參考</a></p>
      `,
      authorId: users['design_group'].id,
      tagIds: [tags['設計'].id, tags['競賽規則'].id, tags['重要'].id]
    },
    {
      title: '系統維護通知 (本週日凌晨)',
      content: `
        <p>為提升系統效能，本網站預計於本週日 (02:00 - 04:00) 進行停機維護。</p>
        <p>屆時將無法登入系統或下載檔案，造成不便敬請見諒。</p>
      `,
      authorId: users['admin'].id,
      tagIds: [tags['系統公告'].id]
    }
  ]

  for (const ann of announcements) {
    await prisma.announcement.create({
      data: {
        title: ann.title,
        content: ann.content,
        authorId: ann.authorId,
        tags: {
          connect: ann.tagIds.map(id => ({ id }))
        }
      }
    })
  }

  console.log('Mock Data seeded successfully')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
