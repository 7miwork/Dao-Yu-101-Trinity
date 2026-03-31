import { createBrowserRouter } from 'react-router-dom'
import { LandingPage } from '@/pages/LandingPage'
import { StudentPage } from '@/pages/StudentPage'
import { TeacherPage } from '@/pages/TeacherPage'
import { AdminPage } from '@/pages/AdminPage'
import { MainLayout } from '@/layouts/MainLayout'
import { StudentLayout } from '@/layouts/StudentLayout'
import { TeacherLayout } from '@/layouts/TeacherLayout'
import { AdminLayout } from '@/layouts/AdminLayout'

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <MainLayout>
        <LandingPage />
      </MainLayout>
    ),
  },
  {
    path: '/student',
    element: (
      <StudentLayout>
        <StudentPage />
      </StudentLayout>
    ),
  },
  {
    path: '/teacher',
    element: (
      <TeacherLayout>
        <TeacherPage />
      </TeacherLayout>
    ),
  },
  {
    path: '/admin',
    element: (
      <AdminLayout>
        <AdminPage />
      </AdminLayout>
    ),
  },
], {
  basename: '/Dao-Yu-101-Trinity'
})
