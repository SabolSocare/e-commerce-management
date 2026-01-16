import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ProductList from './pages/ProductList'
import AddProduct from './pages/AddProduct'
import EditProduct from './pages/EditProduct'
import ComingSoon from './pages/ComingSoon'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/products" replace />} />
          <Route path="dashboard" element={<ComingSoon title="Dashboard" />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="orders" element={<ComingSoon title="Order Management" />} />
          <Route path="customers" element={<ComingSoon title="Customer Management" />} />
          <Route path="reports" element={<ComingSoon title="Reports" />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
