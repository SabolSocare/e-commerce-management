# Quick Reference Guide

## 🎯 Common Tasks

### Fetching Data

```javascript
import { useProducts, useProduct, useCategories } from '@/hooks'

// Get paginated products
const { data, isLoading, isError } = useProducts(page, limit)

// Get single product
const { data: product } = useProduct(productId)

// Get categories
const { data: categories } = useCategories()
```

### Managing Forms

```javascript
import { useForm } from '@/hooks'
import { validateProductForm } from '@/utils/validation'

const form = useForm(initialValues, validateProductForm)

// In JSX
<Input
  value={form.values.title}
  onChange={(e) => form.handleChange('title', e.target.value)}
  onBlur={() => form.handleBlur('title')}
/>
{form.errors.title && <p>{form.errors.title}</p>}

// On submit
const handleSubmit = (e) => {
  e.preventDefault()
  if (form.validate()) {
    // Submit data
  }
}
```

### Adding/Updating Products

```javascript
import { useAddProduct, useUpdateProduct } from '@/hooks'

// Add
const addMutation = useAddProduct({
  onSuccess: (data) => console.log('Added:', data),
  onError: (error) => console.error('Error:', error)
})
addMutation.mutate(productData)

// Update
const updateMutation = useUpdateProduct(productId)
updateMutation.mutate(productData)
```

### Using Constants

```javascript
import { ROUTES, QUERY_KEYS, VALIDATION_RULES } from '@/constants'

// Navigate
navigate(ROUTES.PRODUCTS_ADD)

// Query keys
queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] })

// Validation
if (price < VALIDATION_RULES.MIN_PRICE) { /* error */ }
```

### Logging

```javascript
import { logger } from '@/utils/logger'

logger.error('Critical error:', error)  // Production + Dev
logger.warn('Warning:', data)            // Dev only
logger.info('Info:', data)               // Dev only
logger.debug('Debug:', data)             // Dev only
```

### Error Handling

```javascript
import { getErrorMessage } from '@/utils/errorHandler'

try {
  await someAsyncOperation()
} catch (error) {
  const message = getErrorMessage(error)
  // Show to user
}
```

### Formatting

```javascript
import { formatCurrency, formatDate, truncateText } from '@/lib/utils'

formatCurrency(99.99)                    // "$99.99"
formatDate(new Date())                   // "Jan 17, 2026"
truncateText('Long text...', 20)         // "Long text..."
```

### Pagination

```javascript
import { usePagination } from '@/hooks'

const pagination = usePagination(totalItems, itemsPerPage)

// Use in component
<button onClick={pagination.goToNextPage}>Next</button>
<button onClick={pagination.goToPreviousPage}>Previous</button>
<button onClick={() => pagination.goToPage(5)}>Go to 5</button>
```

### Debouncing

```javascript
import { useDebounce } from '@/hooks'

const [searchQuery, setSearchQuery] = useState('')
const debouncedSearch = useDebounce(searchQuery, 300)

useEffect(() => {
  // This runs 300ms after user stops typing
  searchProducts(debouncedSearch)
}, [debouncedSearch])
```

## 📁 File Structure Quick Reference

```
src/
├── components/           → Reusable UI components
│   ├── ErrorBoundary.jsx  → Wraps app for error catching
│   ├── layout/           → Layout components
│   └── ui/              → UI primitives
├── config/              → Configuration files
├── constants/           → App-wide constants
├── hooks/              → Custom React hooks
├── lib/                → External integrations
├── pages/              → Page components (routes)
├── services/           → API services
└── utils/              → Utility functions
```

## 🎨 Component Patterns

### Page Component Template

```javascript
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ROUTES } from '@/constants'
import { logger } from '@/utils/logger'

export default function MyPage() {
  const navigate = useNavigate()
  const [state, setState] = useState(initialState)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['myData'],
    queryFn: fetchData,
  })

  if (isLoading) return <PageLoader />
  if (isError) return <ErrorMessage />

  return (
    <div>
      {/* Your content */}
    </div>
  )
}
```

### Form Component Template

```javascript
import { useForm } from '@/hooks'
import { validateMyForm, sanitizeMyForm } from '@/utils/validation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function MyForm({ onSubmit }) {
  const form = useForm(initialValues, validateMyForm)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.validate()) {
      const sanitized = sanitizeMyForm(form.values)
      onSubmit(sanitized)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        value={form.values.field}
        onChange={(e) => form.handleChange('field', e.target.value)}
      />
      {form.errors.field && <p>{form.errors.field}</p>}
      <Button type="submit">Submit</Button>
    </form>
  )
}
```

## 🔧 Common Scenarios

### Adding a New API Endpoint

1. Add to `services/api.js`:
```javascript
export const myApi = {
  getData: async (id) => {
    try {
      const response = await apiClient.get(`/endpoint/${id}`)
      return response.data
    } catch (error) {
      logger.error('Failed to fetch:', error)
      throw error
    }
  }
}
```

2. Create hook in `hooks/useMyData.js`:
```javascript
import { useQuery } from '@tanstack/react-query'
import { myApi } from '@/services/api'

export const useMyData = (id) => {
  return useQuery({
    queryKey: ['myData', id],
    queryFn: () => myApi.getData(id),
    enabled: !!id,
  })
}
```

3. Export from `hooks/index.js`:
```javascript
export { useMyData } from './useMyData'
```

### Adding a New Constant

In `constants/index.js`:
```javascript
export const MY_CONSTANT = {
  VALUE_1: 'value1',
  VALUE_2: 'value2',
}
```

### Adding a New Validation Rule

In `utils/validation.js`:
```javascript
export const validateMyForm = (values) => {
  const errors = {}
  
  if (!values.field) {
    errors.field = 'Field is required'
  }
  
  return errors
}

export const sanitizeMyForm = (values) => {
  return {
    field: values.field?.trim(),
    // ... other fields
  }
}
```

## ⚡ Performance Tips

1. **Use lazy loading for routes**
```javascript
const MyPage = lazy(() => import('./pages/MyPage'))
```

2. **Memoize expensive components**
```javascript
export default memo(MyComponent)
```

3. **Use proper cache settings**
```javascript
useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
  staleTime: 5 * 60 * 1000,  // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
})
```

4. **Debounce search inputs**
```javascript
const debouncedSearch = useDebounce(searchQuery, 300)
```

## 🐛 Debugging Tips

1. **Check logs in development**
```javascript
logger.debug('Current state:', state)
```

2. **Use error boundary**
```javascript
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

3. **Inspect network calls**
- Check browser DevTools → Network tab
- Look for logged API requests in console

4. **Verify query cache**
```javascript
console.log(queryClient.getQueryData(['products']))
```

## 📚 Resources

- [React Query Docs](https://tanstack.com/query/latest)
- [React Router Docs](https://reactrouter.com)
- [Tailwind CSS Docs](https://tailwindcss.com)

## ⚠️ Common Pitfalls

1. **Don't destructure before checking existence**
```javascript
// ❌ Bad
const { name } = data

// ✅ Good
const name = data?.name
```

2. **Always use constants for routes**
```javascript
// ❌ Bad
navigate('/products')

// ✅ Good
navigate(ROUTES.PRODUCTS)
```

3. **Don't forget to handle loading and error states**
```javascript
if (isLoading) return <Loader />
if (isError) return <Error />
return <Content />
```

4. **Use form hook instead of manual state**
```javascript
// ❌ Bad - Manual state management
const [title, setTitle] = useState('')
const [errors, setErrors] = useState({})

// ✅ Good - Use hook
const form = useForm(initialValues, validate)
```

---

**Keep this guide handy for quick reference during development!** 🚀
