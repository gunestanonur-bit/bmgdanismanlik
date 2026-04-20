import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminLayout } from './admin/AdminLayout'
import { ProtectedAdmin } from './admin/ProtectedAdmin'
import { AdminDashboard } from './admin/pages/AdminDashboard'
import { AdminLoginPage } from './admin/pages/AdminLoginPage'
import { HeroSettingsPage } from './admin/pages/HeroSettingsPage'
import { ServiceEditPage } from './admin/pages/ServiceEditPage'
import { ServiceListPage } from './admin/pages/ServiceListPage'
import { AboutSettingsPage } from './admin/pages/AboutSettingsPage'
import { SiteSettingsPage } from './admin/pages/SiteSettingsPage'
import { VisualsSettingsPage } from './admin/pages/VisualsSettingsPage'
import { BannerSettingsPage } from './admin/pages/BannerSettingsPage'
import { HomeSectionsPage } from './admin/pages/HomeSectionsPage'
import { EmailSettingsPage } from './admin/pages/EmailSettingsPage'
import { Layout } from './components/Layout'
import { PageLoader } from './components/PageLoader'

const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })))
const HakkimizdaPage = lazy(() => import('./pages/HakkimizdaPage').then((m) => ({ default: m.HakkimizdaPage })))
const ContactPage = lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })))
const ConsultingHomePage = lazy(() => import('./pages/ConsultingHomePage').then((m) => ({ default: m.ConsultingHomePage })))
const ConsultingServicePage = lazy(() => import('./pages/ConsultingServicePage').then((m) => ({ default: m.ConsultingServicePage })))
const TrainingHomePage = lazy(() => import('./pages/TrainingHomePage').then((m) => ({ default: m.TrainingHomePage })))
const TrainingServicePage = lazy(() => import('./pages/TrainingServicePage').then((m) => ({ default: m.TrainingServicePage })))
const SectoralHomePage = lazy(() => import('./pages/SectoralHomePage').then((m) => ({ default: m.SectoralHomePage })))
const SectoralServicePage = lazy(() => import('./pages/SectoralServicePage').then((m) => ({ default: m.SectoralServicePage })))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })))

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ── Admin ─────────────────────────────────────────── */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedAdmin>
              <AdminLayout />
            </ProtectedAdmin>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="site" element={<SiteSettingsPage />} />
          <Route path="home-sections" element={<HomeSectionsPage />} />
          <Route path="about" element={<AboutSettingsPage />} />
          <Route path="hero" element={<HeroSettingsPage />} />
          <Route path="visuals" element={<VisualsSettingsPage />} />
          <Route path="banners" element={<BannerSettingsPage />} />
          <Route path="email" element={<EmailSettingsPage />} />
          <Route path="consulting" element={<ServiceListPage kind="consulting" />} />
          <Route path="consulting/:slug" element={<ServiceEditPage kind="consulting" />} />
          <Route path="training" element={<ServiceListPage kind="training" />} />
          <Route path="training/:slug" element={<ServiceEditPage kind="training" />} />
          <Route path="sectoral" element={<ServiceListPage kind="sectoral" />} />
          <Route path="sectoral/:slug" element={<ServiceEditPage kind="sectoral" />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>

        {/* ── Public — Turkish (default) ────────────────────── */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/hakkimizda" element={<HakkimizdaPage />} />
          <Route path="/iletisim" element={<ContactPage />} />
          <Route path="/danismanlik" element={<ConsultingHomePage />} />
          <Route path="/danismanlik/:slug" element={<ConsultingServicePage />} />
          <Route path="/egitim" element={<TrainingHomePage />} />
          <Route path="/egitim/:slug" element={<TrainingServicePage />} />
          <Route path="/sektorel" element={<SectoralHomePage />} />
          <Route path="/sektorel/:slug" element={<SectoralServicePage />} />
        </Route>

        {/* ── 404 ───────────────────────────────────────────── */}
        <Route element={<Layout />}>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
