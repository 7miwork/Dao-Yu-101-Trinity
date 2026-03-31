import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/app/router'
import { LearningProvider } from '@/features/learning/store/LearningProvider'
import '@/styles/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LearningProvider>
      <RouterProvider router={router} />
    </LearningProvider>
  </React.StrictMode>
)
