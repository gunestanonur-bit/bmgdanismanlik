import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { PageLoader } from './components/PageLoader'

const ProtectedAdmin = lazy(() => import('./admin/ProtectedAdmin').then((m) => ({ default: m.ProtectedAdmin })))
const AdminLayout = lazy(() => import('./admin/AdminLayout').then((m) => ({ default: m.AdminLayout })))
const AdminDashboard = lazy(() => import('./admin/pages/AdminDashboard').then((m) => ({ default: m.AdminDashboard })))
const AdminLoginPage = lazy(() => import('./admin/pages/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage })))
const HeroSettingsPage = lazy(() => import('./admin/pages/HeroSettingsPage').then((m) => ({ default: m.HeroSettingsPage })))
const ServiceEditPage = lazy(() => import('./admin/pages/ServiceEditPage').then((m) => ({ default: m.ServiceEditPage })))
const ServiceListPage = lazy(() => import('./admin/pages/ServiceListPage').then((m) => ({ default: m.ServiceListPage })))
const AboutSettingsPage = lazy(() => import('./admin/pages/AboutSettingsPage').then((m) => ({ default: m.AboutSettingsPage })))
const SiteSettingsPage = lazy(() => import('./admin/pages/SiteSettingsPage').then((m) => ({ default: m.SiteSettingsPage })))
const VisualsSettingsPage = lazy(() => import('./admin/pages/VisualsSettingsPage').then((m) => ({ default: m.VisualsSettingsPage })))
const BannerSettingsPage = lazy(() => import('./admin/pages/BannerSettingsPage').then((m) => ({ default: m.BannerSettingsPage })))
const HomeSectionsPage = lazy(() => import('./admin/pages/HomeSectionsPage').then((m) => ({ default: m.HomeSectionsPage })))
const EmailSettingsPage = lazy(() => import('./admin/pages/EmailSettingsPage').then((m) => ({ default: m.EmailSettingsPage })))
const RawContentPage = lazy(() => import('./admin/pages/RawContentPage').then((m) => ({ default: m.RawContentPage })))

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
          <Route path="all-data" element={<RawContentPage />} />
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
