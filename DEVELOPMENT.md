# Development Guidelines

## 📐 Architecture Overview

This project follows a production-grade architecture with clear separation of concerns:

```
┌─────────────────────────────────────────┐
│            React Router                 │
│         (Route Management)              │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│          Layout Component               │
│      (Sidebar + Header + Main)          │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│          Page Components                │
│  (ProductList, AddProduct, etc.)        │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│        React Query Layer                │
│    (State Management & Caching)         │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│          API Service Layer              │
│        (Axios HTTP Client)              │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│        DummyJSON REST API               │
└─────────────────────────────────────────┘
```

## 🎯 Design Patterns Used

### 1. **Container/Presentation Pattern**
- Pages act as containers (logic)
- UI components are presentational (rendering)

### 2. **Service Layer Pattern**
- All API calls centralized in `services/api.js`
- Easy to mock for testing
- Single source of truth for API endpoints

### 3. **Custom Hooks Pattern**
- React Query hooks for data fetching
- Reusable logic across components

### 4. **Composition Pattern**
- Small, reusable UI components
- Built using Shadcn/ui primitives

## 📁 Folder Structure Explained

```
src/
├── components/
│   ├── layout/              # Layout components
│   │   ├── Layout.jsx       # Main wrapper with Outlet
│   │   ├── Sidebar.jsx      # Navigation sidebar
│   │   └── Header.jsx       # Top header with user menu
│   └── ui/                  # Reusable UI components (Shadcn)
│       ├── button.jsx
│       ├── input.jsx
│       ├── select.jsx
│       ├── checkbox.jsx
│       ├── dialog.jsx
│       ├── dropdown-menu.jsx
│       ├── label.jsx
│       └── textarea.jsx
│
├── pages/                   # Page components (routes)
│   ├── ProductList.jsx      # Main product listing
│   ├── AddProduct.jsx       # Add new product
│   ├── EditProduct.jsx      # Edit existing product
│   └── ComingSoon.jsx       # Placeholder page
│
├── services/                # External services
│   └── api.js               # API client and endpoints
│
├── lib/                     # Utilities and helpers
│   └── utils.js             # Helper functions (cn, format, etc.)
│
├── App.jsx                  # Root component with routing
├── main.jsx                 # Entry point
└── index.css                # Global styles + Tailwind
```

## 🔧 State Management

### React Query (TanStack Query)

We use React Query for all server state management:

**Benefits:**
- Automatic caching
- Background refetching
- Optimistic updates
- Request deduplication
- Pagination support

**Example Usage:**

```jsx
// Fetching data
const { data, isLoading, isError } = useQuery({
  queryKey: ['products', page],
  queryFn: () => productApi.getProducts({ page }),
})

// Mutating data
const mutation = useMutation({
  mutationFn: productApi.addProduct,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['products'] })
  },
})
```

## 🎨 Styling Approach

### TailwindCSS + Shadcn/ui

1. **Utility-First**: Use Tailwind classes directly in JSX
2. **Component Library**: Shadcn/ui for complex components
3. **Customization**: Tailwind config for theme customization
4. **Responsive**: Mobile-first responsive utilities

**Example:**

```jsx
<button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
  Click me
</button>
```

## 🚦 Routing Strategy

### React Router v6

**Route Structure:**

```jsx
<Routes>
  <Route path="/" element={<Layout />}>
    <Route index element={<Navigate to="/products" />} />
    <Route path="products" element={<ProductList />} />
    <Route path="products/add" element={<AddProduct />} />
    <Route path="products/edit/:id" element={<EditProduct />} />
    <Route path="*" element={<ComingSoon />} />
  </Route>
</Routes>
```

## 📡 API Integration

### Service Layer

All API calls go through `services/api.js`:

```javascript
export const productApi = {
  getProducts: async (params) => { /* ... */ },
  getProduct: async (id) => { /* ... */ },
  addProduct: async (data) => { /* ... */ },
  updateProduct: async (id, data) => { /* ... */ },
  deleteProduct: async (id) => { /* ... */ },
  getCategories: async () => { /* ... */ },
}
```

**Why?**
- Single source of truth
- Easy to test
- Easy to switch APIs
- Centralized error handling

## ✅ Form Validation

### Client-Side Validation

**Approach:**
1. Validate on submit
2. Show errors inline
3. Clear errors on input change
4. Prevent submission if invalid

**Example:**

```javascript
const validateForm = () => {
  const newErrors = {}
  
  if (!formData.title.trim()) {
    newErrors.title = 'Product name is required'
  }
  
  if (!formData.price || Number(formData.price) <= 0) {
    newErrors.price = 'Valid price is required'
  }
  
  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}
```

## 🎯 Performance Optimizations

1. **React Query Caching**
   - 5 minute stale time
   - Automatic background refetch
   - Cache invalidation on mutations

2. **Code Splitting**
   - Vite handles this automatically
   - Lazy loading ready

3. **Optimistic Updates**
   - UI updates before API response
   - Rollback on error

4. **Memoization**
   - Use React.memo for expensive components
   - useMemo for expensive calculations

## 🧪 Testing Strategy (Future)

**Recommended Tools:**
- **Unit Tests**: Vitest
- **Component Tests**: React Testing Library
- **E2E Tests**: Playwright or Cypress

**Example Test Structure:**

```javascript
// ProductList.test.jsx
describe('ProductList', () => {
  it('renders product list', () => {
    render(<ProductList />)
    expect(screen.getByText('Product')).toBeInTheDocument()
  })
  
  it('handles pagination', () => {
    // Test pagination logic
  })
})
```

## 🚀 Deployment Checklist

- [ ] Run `npm run build`
- [ ] Test production build with `npm run preview`
- [ ] Check bundle size
- [ ] Verify environment variables
- [ ] Test on different browsers
- [ ] Test responsive design
- [ ] Check accessibility (a11y)
- [ ] Deploy to hosting (Vercel, Netlify, etc.)

## 📦 Build Optimization

**Vite Build Output:**

```bash
npm run build
# Output in dist/ folder
# Optimized and minified
# Ready for production
```

**Bundle Size Tips:**
- Use dynamic imports for large dependencies
- Tree-shake unused code
- Optimize images
- Use CDN for large assets

## 🔒 Security Best Practices

1. **Environment Variables**
   - Never commit `.env` file
   - Use `.env.example` as template
   - Prefix with `VITE_` for Vite

2. **API Keys**
   - Store in environment variables
   - Never expose in frontend code
   - Use backend proxy for sensitive APIs

3. **User Input**
   - Always validate on frontend
   - Sanitize before displaying
   - Validate on backend too (if applicable)

## 📝 Code Style

**ESLint Configuration:**
- React recommended rules
- Hooks rules enforced
- Auto-fix on save (recommended)

**Formatting:**
- 2 space indentation
- Single quotes
- Semicolons optional
- Trailing commas

**Naming Conventions:**
- Components: PascalCase (e.g., `ProductList`)
- Files: PascalCase for components (e.g., `ProductList.jsx`)
- Functions: camelCase (e.g., `handleSubmit`)
- Constants: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)

## 🔄 Git Workflow

**Branching Strategy:**

```
main (production)
  ├── develop (integration)
  │   ├── feature/add-product
  │   ├── feature/edit-product
  │   └── fix/pagination-bug
```

**Commit Messages:**

```
feat: add product deletion feature
fix: resolve pagination issue
docs: update README
style: format code with prettier
refactor: reorganize components
test: add unit tests for ProductList
```

## 🎓 Learning Resources

- **React**: https://react.dev
- **Vite**: https://vitejs.dev
- **TailwindCSS**: https://tailwindcss.com
- **Shadcn/ui**: https://ui.shadcn.com
- **React Query**: https://tanstack.com/query
- **React Router**: https://reactrouter.com

## 💡 Tips for Extending

### Adding a New Page

1. Create component in `src/pages/`
2. Add route in `App.jsx`
3. Add navigation in `Sidebar.jsx`
4. Create API service if needed
5. Add React Query hooks

### Adding a New Feature

1. Plan the feature
2. Create components
3. Add API integration
4. Handle loading/error states
5. Test thoroughly
6. Update documentation

### Modifying Styles

1. Check Tailwind config first
2. Use existing utility classes
3. Add custom classes if needed
4. Keep design consistent
5. Test responsive behavior

---

**Happy Coding! 🚀**
