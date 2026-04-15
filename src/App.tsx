import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';

const Home = lazy(() => import('./pages/Home'));
const BadgeExplorer = lazy(() => import('./pages/BadgeExplorer'));
const BadgeDetailPage = lazy(() => import('./pages/BadgeDetailPage'));
const Booklets = lazy(() => import('./pages/Booklets'));
const SourceQuality = lazy(() => import('./pages/SourceQuality'));
const FAQ = lazy(() => import('./pages/FAQ'));
const CompareBadges = lazy(() => import('./pages/CompareBadges'));
const Changelog = lazy(() => import('./pages/Changelog'));
const Coverage = lazy(() => import('./pages/Coverage'));
const Suggestions = lazy(() => import('./pages/Suggestions'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-32">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent" />
    </div>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/odznaki" element={<BadgeExplorer />} />
            <Route path="/odznaki/:id" element={<BadgeDetailPage />} />
            <Route path="/ksiazeczki" element={<Booklets />} />
            <Route path="/porownaj" element={<CompareBadges />} />
            <Route path="/pokrycie" element={<Coverage />} />
            <Route path="/propozycje" element={<Suggestions />} />
            <Route path="/zmiany" element={<Changelog />} />
            <Route path="/zrodla" element={<SourceQuality />} />
            <Route path="/faq" element={<FAQ />} />
          </Routes>
        </Suspense>
      </Layout>
    </>
  );
}
