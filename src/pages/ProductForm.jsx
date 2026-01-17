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
  }, [product, isEditMode, form.setFormValues])

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
            <button
              type="button"
              onClick={handleCancel}
              disabled={mutation.isPending}
              className="flex items-center justify-center gap-2 w-[99px] h-10 border border-[#858D9D] rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_16_4738)">
                  <path d="M10.9425 9.99999L17.8045 3.13799C17.926 3.01225 17.9932 2.84385 17.9916 2.66905C17.9901 2.49425 17.92 2.32705 17.7964 2.20344C17.6728 2.07984 17.5056 2.00972 17.3308 2.0082C17.156 2.00668 16.9876 2.07388 16.8619 2.19532L9.99986 9.05732L3.13786 2.19532C3.01212 2.07388 2.84372 2.00668 2.66892 2.0082C2.49413 2.00972 2.32692 2.07984 2.20331 2.20344C2.07971 2.32705 2.00959 2.49425 2.00807 2.66905C2.00656 2.84385 2.07375 3.01225 2.19519 3.13799L9.05719 9.99999L2.19519 16.862C2.07021 16.987 2 17.1565 2 17.3333C2 17.5101 2.07021 17.6796 2.19519 17.8047C2.32021 17.9296 2.48975 17.9998 2.66652 17.9998C2.8433 17.9998 3.01284 17.9296 3.13786 17.8047L9.99986 10.9427L16.8619 17.8047C16.9869 17.9296 17.1564 17.9998 17.3332 17.9998C17.51 17.9998 17.6795 17.9296 17.8045 17.8047C17.9295 17.6796 17.9997 17.5101 17.9997 17.3333C17.9997 17.1565 17.9295 16.987 17.8045 16.862L10.9425 9.99999Z" fill="#858D9D"/>
                </g>
                <defs>
                  <clipPath id="clip0_16_4738">
                    <rect width="16" height="16" fill="white" transform="translate(2 2)"/>
                  </clipPath>
                </defs>
              </svg>
              <span className="font-['Poppins'] text-sm leading-5 tracking-[0.005em] text-[#858D9D]">
                Cancel
              </span>
            </button>
            <button
              type="submit"
              form="product-form"
              disabled={mutation.isPending}
              className="flex items-center justify-center gap-2 w-[135px] h-10 bg-[#3A5BFF] rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isEditMode ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_16_6564)">
                    <path d="M10.0001 12.6667C10.7365 12.6667 11.3334 12.0697 11.3334 11.3333C11.3334 10.597 10.7365 10 10.0001 10C9.26371 10 8.66675 10.597 8.66675 11.3333C8.66675 12.0697 9.26371 12.6667 10.0001 12.6667Z" fill="white"/>
                    <path d="M17.024 4.748L15.252 2.976C15.0747 2.80147 14.8783 2.64741 14.6667 2.51666V4C14.6644 5.84003 13.1733 7.33113 11.3333 7.33334H8.66666C6.82662 7.33113 5.33553 5.84003 5.33334 4V2C3.49331 2.00222 2.00222 3.49331 2 5.33334V14.6667C2.00222 16.5067 3.49331 17.9978 5.33334 18H14.6667C16.5067 17.9978 17.9978 16.5067 18 14.6667V7.10469C18.0025 6.22028 17.651 5.37166 17.024 4.748ZM10 14C8.52725 14 7.33334 12.8061 7.33334 11.3333C7.33334 9.86059 8.52725 8.66669 10 8.66669C11.4727 8.66669 12.6667 9.86059 12.6667 11.3333C12.6667 12.8061 11.4727 14 10 14Z" fill="white"/>
                    <path d="M8.66675 5.99997H11.3334C12.438 5.99997 13.3334 5.10453 13.3334 3.99997V2.04266C13.1885 2.01903 13.0421 2.00478 12.8954 2H6.66675V4C6.66675 5.10453 7.56218 5.99997 8.66675 5.99997Z" fill="white"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_16_6564">
                      <rect width="16" height="16" fill="white" transform="translate(2 2)"/>
                    </clipPath>
                  </defs>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_16_4743)">
                    <path d="M15.3333 7.33334H8.66666V0.666656C8.66666 0.298469 8.36819 0 8 0C7.63181 0 7.33334 0.298469 7.33334 0.666656V7.33331H0.666656C0.298469 7.33334 0 7.63181 0 8C0 8.36819 0.298469 8.66666 0.666656 8.66666H7.33331V15.3333C7.33331 15.7015 7.63178 16 7.99997 16C8.36816 16 8.66662 15.7015 8.66662 15.3333V8.66666H15.3333C15.7015 8.66666 15.9999 8.36819 15.9999 8C16 7.63181 15.7015 7.33334 15.3333 7.33334Z" fill="white"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_16_4743">
                      <rect width="16" height="16" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
              )}
              <span className="font-['Poppins'] text-sm leading-5 tracking-[0.005em] text-white">
                {mutation.isPending 
                  ? 'Saving...' 
                  : (isEditMode ? 'Save Product' : 'Add Product')
                }
              </span>
            </button>
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
                    key={form.values.category || 'empty'}
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
