import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/layout/Layout'
import { ROUTES } from './constants'

// Lazy load pages for better performance
const ProductList = lazy(() => import('./pages/ProductList'))
const ProductForm = lazy(() => import('./pages/ProductForm'))
const ComingSoon = lazy(() => import('./pages/ComingSoon'))

// Loading fallback component
const PageLoader = () => (
  <div className="h-full flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3A5BFF]"></div>
  </div>
)

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path={ROUTES.HOME} element={<Layout />}>
              <Route index element={<Navigate to={ROUTES.PRODUCTS} replace />} />
              <Route path={ROUTES.DASHBOARD} element={<ComingSoon title="Dashboard" />} />
              <Route path={ROUTES.PRODUCTS} element={<ProductList />} />
              <Route path={ROUTES.PRODUCTS_ADD} element={<ProductForm />} />
              <Route path={ROUTES.PRODUCTS_EDIT()} element={<ProductForm />} />
              <Route path={ROUTES.ORDERS} element={<ComingSoon title="Order Management" />} />
              <Route path={ROUTES.CUSTOMERS} element={<ComingSoon title="Customer Management" />} />
              <Route path={ROUTES.REPORTS} element={<ComingSoon title="Reports" />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  )
}

export default App
