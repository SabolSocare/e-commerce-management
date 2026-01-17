// Refactored Product Form Component
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  useProduct,
  useCategories,
  useAddProduct,
  useUpdateProduct,
} from '@/hooks/useProducts'
import { useForm } from '@/hooks/useForm'
import { validateProductForm, sanitizeProductForm } from '@/utils/validation'
import { ROUTES } from '@/constants'
import { getErrorMessage } from '@/utils/errorHandler'

// Loading skeleton component
const FormSkeleton = () => (
  <div className="h-full flex flex-col bg-[#F9F9FC] font-sans overflow-hidden lg:overflow-visible animate-pulse">
    <div className="flex-shrink-0 lg:flex-shrink">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-3 sm:px-6 lg:px-8 py-3 sm:py-4 gap-2.5 sm:gap-0">
        <div className="flex items-center gap-1.5">
          <div className="h-4 w-16 bg-gray-200 rounded"></div>
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="w-[calc(50%-4px)] sm:flex-1 md:flex-none md:min-w-[99px] h-9 bg-gray-200 rounded-lg"></div>
          <div className="w-[calc(50%-4px)] sm:flex-1 md:flex-none md:min-w-[146px] h-9 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
    <div className="flex-1 overflow-y-auto">
      <div className="w-full px-3 sm:px-6 lg:px-8 pt-0 pb-4">
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-6">
          <div className="flex-1 flex flex-col gap-3 sm:gap-4 lg:gap-6">
            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 flex flex-col gap-3 sm:gap-3.5" style={{ boxShadow: '0px 4px 30px rgba(46, 45, 116, 0.05)' }}>
              <div className="h-6 w-40 bg-gray-200 rounded"></div>
              <div className="space-y-3.5">
                <div className="space-y-1">
                  <div className="h-4 w-28 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded-lg"></div>
                </div>
                <div className="space-y-1">
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  <div className="h-[156px] bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default function ProductForm() {
  const { id } = useParams()
  const isEditMode = !!id
  const navigate = useNavigate()

  // Fetch product data if in edit mode
  const { data: product, isLoading: isLoadingProduct } = useProduct(id, isEditMode)

  // Fetch categories
  const { data: categories } = useCategories()

  // Form state management
  const form = useForm(
    {
      title: '',
      description: '',
      category: '',
      price: '',
      discountPercentage: '',
      sku: '',
      stock: '',
    },
    validateProductForm
  )

  // Mutations
  const addMutation = useAddProduct()
  const updateMutation = useUpdateProduct(id)
  const mutation = isEditMode ? updateMutation : addMutation

  // Populate form when editing
  useEffect(() => {
    if (product && isEditMode) {
      form.setFormValues({
        title: product.title || '',
        description: product.description || '',
        category: product.category || '',
        price: product.price?.toString() || '',
        discountPercentage: product.discountPercentage?.toString() || '',
        sku: product.sku || '',
        stock: product.stock?.toString() || '',
      })
    }
  }, [product, isEditMode])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.validate()) {
      return
    }

    const sanitizedData = sanitizeProductForm(form.values)
    mutation.mutate(sanitizedData)
  }

  const handleCancel = () => {
    navigate(ROUTES.PRODUCTS)
  }

  // Show loading skeleton
  if ((isLoadingProduct && isEditMode) || mutation.isPending) {
    return <FormSkeleton />
  }

  return (
    <div className="h-full flex flex-col bg-[#F9F9FC] font-sans overflow-hidden lg:overflow-visible">
      {/* Breadcrumb and Actions Header */}
      <div className="flex-shrink-0 lg:flex-shrink">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-3 sm:px-6 lg:px-8 py-3 sm:py-4 gap-2.5 sm:gap-0">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-[11px] sm:text-sm">
            <span 
              className="font-medium text-[#3A5BFF] cursor-pointer hover:underline" 
              onClick={handleCancel}
            >
              Product
            </span>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-4 sm:h-4">
              <path d="M6 11.9193V4.47133C6.00003 4.3395 6.03914 4.21064 6.1124 4.10103C6.18565 3.99142 6.28976 3.906 6.41156 3.85555C6.53336 3.8051 6.66738 3.7919 6.79669 3.81761C6.92599 3.84332 7.04476 3.90679 7.138 4L10.862 7.724C10.987 7.84902 11.0572 8.01856 11.0572 8.19533C11.0572 8.37211 10.987 8.54165 10.862 8.66667L7.138 12.3907C7.04476 12.4839 6.92599 12.5473 6.79669 12.5731C6.66738 12.5988 6.53336 12.5856 6.41156 12.5351C6.28976 12.4847 6.18565 12.3992 6.1124 12.2896C6.03914 12.18 6.00003 12.0512 6 11.9193Z" fill="#C2C6CE"/>
            </svg>
            <span className="font-medium text-[#6E7079]">
              {isEditMode ? 'Edit Product' : 'Add Product'}
            </span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={mutation.isPending}
              className="w-[calc(50%-4px)] sm:flex-1 md:flex-none md:min-w-[99px] h-9"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="product-form"
              disabled={mutation.isPending}
              className="w-[calc(50%-4px)] sm:flex-1 md:flex-none md:min-w-[146px] h-9"
            >
              {mutation.isPending 
                ? (isEditMode ? 'Saving...' : 'Adding...') 
                : (isEditMode ? 'Save Product' : 'Add Product')
              }
            </Button>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="w-full px-3 sm:px-6 lg:px-8 pt-0 pb-4">
          <form id="product-form" onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-6">
            {/* Left Column */}
            <div className="flex-1 flex flex-col gap-3 sm:gap-4 lg:gap-6">
              {/* General Information */}
              <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 flex flex-col items-center gap-3 sm:gap-3.5" style={{ boxShadow: '0px 4px 30px rgba(46, 45, 116, 0.05)' }}>
                <h2 className="text-base sm:text-lg font-medium text-[#353535] self-stretch" style={{ letterSpacing: '0.01em' }}>
                  General Information
                </h2>
                
                <div className="flex flex-col gap-3.5 self-stretch">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="title" className="text-sm font-medium text-[#777980]">
                      Product Name
                    </Label>
                    <Input
                      id="title"
                      type="text"
                      placeholder="Type product name here..."
                      value={form.values.title}
                      onChange={(e) => form.handleChange('title', e.target.value)}
                      onBlur={() => form.handleBlur('title')}
                      className={`h-10 bg-[#F9F9FC] border-[#E0E2E7] text-sm placeholder:text-[#858D9D] ${
                        form.errors.title ? 'border-red-500' : ''
                      }`}
                    />
                    {form.errors.title && (
                      <p className="text-sm text-red-500 mt-1">{form.errors.title}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <Label htmlFor="description" className="text-sm font-medium text-[#777980]">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Type product description here..."
                      value={form.values.description}
                      onChange={(e) => form.handleChange('description', e.target.value)}
                      className="bg-[#F9F9FC] border-[#E0E2E7] text-sm placeholder:text-[#858D9D] resize-none"
                      style={{ height: '156px' }}
                    />
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 flex flex-col items-center gap-3 sm:gap-3.5" style={{ boxShadow: '0px 4px 30px rgba(46, 45, 116, 0.05)' }}>
                <h2 className="text-base sm:text-lg font-medium text-[#353535] self-stretch">
                  Pricing
                </h2>
                
                <div className="flex flex-col gap-3.5 self-stretch">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="price" className="text-sm font-medium text-[#777980]">
                      Base Price
                    </Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <DollarSign className="w-4 h-4 text-[#858D9D]" />
                      </div>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        placeholder="Type base price here..."
                        value={form.values.price}
                        onChange={(e) => form.handleChange('price', e.target.value)}
                        onBlur={() => form.handleBlur('price')}
                        className={`h-10 pl-9 bg-[#F9F9FC] border-[#E0E2E7] text-sm placeholder:text-[#858D9D] ${
                          form.errors.price ? 'border-red-500' : ''
                        }`}
                      />
                    </div>
                    {form.errors.price && (
                      <p className="text-sm text-red-500 mt-1">{form.errors.price}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <Label htmlFor="discountPercentage" className="text-sm font-medium text-[#777980]">
                      Discount Percentage (%)
                    </Label>
                    <Input
                      id="discountPercentage"
                      type="number"
                      step="0.01"
                      placeholder="Type discount percentage..."
                      value={form.values.discountPercentage}
                      onChange={(e) => form.handleChange('discountPercentage', e.target.value)}
                      onBlur={() => form.handleBlur('discountPercentage')}
                      className={`h-10 bg-[#F9F9FC] border-[#E0E2E7] text-sm placeholder:text-[#858D9D] ${
                        form.errors.discountPercentage ? 'border-red-500' : ''
                      }`}
                    />
                    {form.errors.discountPercentage && (
                      <p className="text-sm text-red-500 mt-1">{form.errors.discountPercentage}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Inventory */}
              <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 flex flex-col items-center gap-3 sm:gap-3.5" style={{ boxShadow: '0px 4px 30px rgba(46, 45, 116, 0.05)' }}>
                <h2 className="text-base sm:text-lg font-medium text-[#353535] self-stretch">
                  Inventory
                </h2>
                
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-3.5 self-stretch">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="sku" className="text-sm font-medium text-[#777980]">
                      SKU
                    </Label>
                    <Input
                      id="sku"
                      type="text"
                      placeholder="Type product SKU here..."
                      value={form.values.sku}
                      onChange={(e) => form.handleChange('sku', e.target.value)}
                      onBlur={() => form.handleBlur('sku')}
                      className={`h-10 bg-[#F9F9FC] border-[#E0E2E7] text-sm placeholder:text-[#858D9D] ${
                        form.errors.sku ? 'border-red-500' : ''
                      }`}
                    />
                    {form.errors.sku && (
                      <p className="text-sm text-red-500 mt-1">{form.errors.sku}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <Label htmlFor="stock" className="text-sm font-medium text-[#777980]">
                      Quantity
                    </Label>
                    <Input
                      id="stock"
                      type="number"
                      placeholder="Type product quantity here..."
                      value={form.values.stock}
                      onChange={(e) => form.handleChange('stock', e.target.value)}
                      onBlur={() => form.handleBlur('stock')}
                      className={`h-10 bg-[#F9F9FC] border-[#E0E2E7] text-sm placeholder:text-[#858D9D] ${
                        form.errors.stock ? 'border-red-500' : ''
                      }`}
                    />
                    {form.errors.stock && (
                      <p className="text-sm text-red-500 mt-1">{form.errors.stock}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="w-full lg:w-[264px]">
              {/* Category */}
              <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 flex flex-col items-center gap-3 sm:gap-3.5" style={{ boxShadow: '0px 4px 30px rgba(46, 45, 116, 0.05)' }}>
                <h2 className="text-base sm:text-lg font-medium text-[#353535] self-stretch">
                  Category
                </h2>
                
                <div className="flex flex-col gap-1 self-stretch">
                  <Label htmlFor="category" className="text-sm font-medium text-[#777980]">
                    Product Category
                  </Label>
                  <Select 
                    value={form.values.category} 
                    onValueChange={(value) => form.handleChange('category', value)}
                  >
                    <SelectTrigger 
                      className={`h-10 bg-[#F9F9FC] border-[#E0E2E7] text-sm ${
                        form.errors.category ? 'border-red-500' : ''
                      }`}
                    >
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.errors.category && (
                    <p className="text-sm text-red-500 mt-1">{form.errors.category}</p>
                  )}
                </div>
              </div>
            </div>
          </form>

          {/* Error Message */}
          {mutation.isError && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">
                {getErrorMessage(mutation.error)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
