import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { isAdminSession } from './auth'

export function ProtectedAdmin({ children }: { children: ReactNode }) {
  const location = useLocation()
  if (!isAdminSession()) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }
  return <>{children}</>
}
