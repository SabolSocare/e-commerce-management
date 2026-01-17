import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { X, Plus, DollarSign } from 'lucide-react'
import { productApi } from '@/services/api'
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

export default function ProductForm() {
  const { id } = useParams()
  const isEditMode = !!id
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    discountPercentage: '',
    sku: '',
    stock: '',
  })

  const [errors, setErrors] = useState({})

  // Fetch product if in edit mode
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getProduct(id),
    enabled: isEditMode,
  })

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: productApi.getCategories,
  })

  // Update form when product is loaded (edit mode)
  useEffect(() => {
    if (product && isEditMode) {
      setFormData({
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

  // Mutation for add/update
  const mutation = useMutation({
    mutationFn: (data) => 
      isEditMode 
        ? productApi.updateProduct(id, data)
        : productApi.addProduct(data),
    onSuccess: (response, variables) => {
      // Use optimistic update: Update cache with OUR data, not API's modified data
      if (isEditMode) {
        queryClient.setQueryData(['product', id], (oldData) => ({
          ...oldData,
          ...variables, // Use the data we sent, not what API returned
          id: id
        }))
      }
      queryClient.invalidateQueries({ queryKey: ['products'] })
      navigate('/products')
    },
  })

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Product name is required'
    }

    if (!formData.category) {
      newErrors.category = 'Category is required'
    }

    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = 'Valid base price is required'
    }

    if (formData.discountPercentage && (isNaN(formData.discountPercentage) || Number(formData.discountPercentage) < 0)) {
      newErrors.discountPercentage = 'Valid discount percentage is required'
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required'
    }

    if (!formData.stock || isNaN(formData.stock) || Number(formData.stock) < 0) {
      newErrors.stock = 'Valid quantity is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const productData = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      price: Number(formData.price),
      sku: formData.sku,
      stock: parseInt(formData.stock, 10), // Use parseInt for whole numbers
    }

    if (formData.discountPercentage) {
      productData.discountPercentage = Number(formData.discountPercentage)
    }

    mutation.mutate(productData)
  }

  if (isLoading && isEditMode) {
    return (
      <div className="h-full flex flex-col bg-[#F9F9FC] font-sans overflow-hidden lg:overflow-visible animate-pulse">
        {/* Breadcrumb and Actions Header Skeleton */}
        <div className="flex-shrink-0 lg:flex-shrink">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-3 sm:px-6 lg:px-8 py-3 sm:py-4 gap-2.5 sm:gap-0">
            {/* Breadcrumbs Skeleton */}
            <div className="flex items-center gap-1.5">
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </div>

            {/* Buttons Skeleton */}
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <div className="w-[calc(50%-4px)] sm:flex-1 md:flex-none md:min-w-[99px] h-9 bg-gray-200 rounded-lg"></div>
              <div className="w-[calc(50%-4px)] sm:flex-1 md:flex-none md:min-w-[146px] h-9 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>

        {/* Form Content Skeleton */}
        <div className="flex-1 overflow-y-auto">
          <div className="w-full px-3 sm:px-6 lg:px-8 pt-0 pb-4">
            <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-6">
              {/* Left Column Skeleton */}
              <div className="flex-1 flex flex-col gap-3 sm:gap-4 lg:gap-6">
                {/* General Information Skeleton */}
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

                {/* Pricing Skeleton */}
                <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 flex flex-col gap-3 sm:gap-3.5" style={{ boxShadow: '0px 4px 30px rgba(46, 45, 116, 0.05)' }}>
                  <div className="h-6 w-32 bg-gray-200 rounded"></div>
                  <div className="space-y-3.5">
                    <div className="space-y-1">
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                      <div className="h-10 bg-gray-200 rounded-lg"></div>
                    </div>
                    <div className="space-y-1">
                      <div className="h-4 w-44 bg-gray-200 rounded"></div>
                      <div className="h-10 bg-gray-200 rounded-lg"></div>
                    </div>
                  </div>
                </div>

                {/* Inventory Skeleton */}
                <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 flex flex-col gap-3 sm:gap-3.5" style={{ boxShadow: '0px 4px 30px rgba(46, 45, 116, 0.05)' }}>
                  <div className="h-6 w-28 bg-gray-200 rounded"></div>
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-3.5">
                    <div className="space-y-1">
                      <div className="h-4 w-12 bg-gray-200 rounded"></div>
                      <div className="h-10 bg-gray-200 rounded-lg"></div>
                    </div>
                    <div className="space-y-1">
                      <div className="h-4 w-16 bg-gray-200 rounded"></div>
                      <div className="h-10 bg-gray-200 rounded-lg"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column Skeleton */}
              <div className="w-full lg:w-[264px]">
                {/* Category Skeleton */}
                <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 flex flex-col gap-3 sm:gap-3.5" style={{ boxShadow: '0px 4px 30px rgba(46, 45, 116, 0.05)' }}>
                  <div className="h-6 w-24 bg-gray-200 rounded"></div>
                  <div className="space-y-1">
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show skeleton during save/update
  if (mutation.isPending) {
    return (
      <div className="h-full flex flex-col bg-[#F9F9FC] font-sans overflow-hidden lg:overflow-visible animate-pulse">
        {/* Breadcrumb and Actions Header Skeleton */}
        <div className="flex-shrink-0 lg:flex-shrink">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-3 sm:px-6 lg:px-8 py-3 sm:py-4 gap-2.5 sm:gap-0">
            {/* Breadcrumbs Skeleton */}
            <div className="flex items-center gap-1.5">
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </div>

            {/* Buttons Skeleton */}
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <div className="w-[calc(50%-4px)] sm:flex-1 md:flex-none md:min-w-[99px] h-9 bg-gray-200 rounded-lg"></div>
              <div className="w-[calc(50%-4px)] sm:flex-1 md:flex-none md:min-w-[146px] h-9 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>

        {/* Form Content Skeleton */}
        <div className="flex-1 overflow-y-auto">
          <div className="w-full px-3 sm:px-6 lg:px-8 pt-0 pb-4">
            <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-6">
              {/* Left Column Skeleton */}
              <div className="flex-1 flex flex-col gap-3 sm:gap-4 lg:gap-6">
                {/* General Information Skeleton */}
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

                {/* Pricing Skeleton */}
                <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 flex flex-col gap-3 sm:gap-3.5" style={{ boxShadow: '0px 4px 30px rgba(46, 45, 116, 0.05)' }}>
                  <div className="h-6 w-32 bg-gray-200 rounded"></div>
                  <div className="space-y-3.5">
                    <div className="space-y-1">
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                      <div className="h-10 bg-gray-200 rounded-lg"></div>
                    </div>
                    <div className="space-y-1">
                      <div className="h-4 w-44 bg-gray-200 rounded"></div>
                      <div className="h-10 bg-gray-200 rounded-lg"></div>
                    </div>
                  </div>
                </div>

                {/* Inventory Skeleton */}
                <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 flex flex-col gap-3 sm:gap-3.5" style={{ boxShadow: '0px 4px 30px rgba(46, 45, 116, 0.05)' }}>
                  <div className="h-6 w-28 bg-gray-200 rounded"></div>
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-3.5">
                    <div className="space-y-1">
                      <div className="h-4 w-12 bg-gray-200 rounded"></div>
                      <div className="h-10 bg-gray-200 rounded-lg"></div>
                    </div>
                    <div className="space-y-1">
                      <div className="h-4 w-16 bg-gray-200 rounded"></div>
                      <div className="h-10 bg-gray-200 rounded-lg"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column Skeleton */}
              <div className="w-full lg:w-[264px]">
                {/* Category Skeleton */}
                <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 flex flex-col gap-3 sm:gap-3.5" style={{ boxShadow: '0px 4px 30px rgba(46, 45, 116, 0.05)' }}>
                  <div className="h-6 w-24 bg-gray-200 rounded"></div>
                  <div className="space-y-1">
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-[#F9F9FC] font-sans overflow-hidden lg:overflow-visible">
      {/* Breadcrumb and Actions Header */}
      <div className="flex-shrink-0 lg:flex-shrink">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-3 sm:px-6 lg:px-8 py-3 sm:py-4 gap-2.5 sm:gap-0">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-[11px] sm:text-sm">
            <span className="font-medium text-[#3A5BFF] cursor-pointer" onClick={() => navigate('/products')}>
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
              onClick={() => navigate('/products')}
              disabled={mutation.isPending}
              className="w-[calc(50%-4px)] sm:flex-1 md:flex-none md:min-w-[99px]"
              style={{
                boxSizing: 'border-box',
                height: 36,
                border: '1px solid #858D9D',
                borderRadius: 8,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 400,
                fontSize: 14,
                lineHeight: '20px',
                letterSpacing: '0.005em',
                color: '#858D9D',
                background: 'transparent',
                position: 'relative',
                padding: 0,
                justifyContent: 'center',
                cursor: mutation.isPending ? 'not-allowed' : 'pointer',
                gap: 0
              }}
            >
              <span style={{position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, left: 14}}>
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
              </span>
              <span style={{marginLeft: 38, height: 20, display: 'flex', alignItems: 'center'}}>
                Cancel
              </span>
            </button>
            <button
              type="submit"
              form="product-form"
              disabled={mutation.isPending}
              className="w-[calc(50%-4px)] sm:flex-1 md:flex-none md:min-w-[146px]"
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '8px 12px',
                gap: 6,
                height: 36,
                background: '#3A5BFF',
                borderRadius: 8,
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 400,
                fontSize: 14,
                lineHeight: '20px',
                letterSpacing: '0.005em',
                color: '#FFFFFF',
                border: 'none',
                position: 'relative',
                cursor: mutation.isPending ? 'not-allowed' : 'pointer',
                flex: 'none',
                order: 1,
                flexGrow: 0
              }}
            >
              <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20}}>
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
              </span>
              <span style={{height: 20, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap'}}>
                {mutation.isPending 
                  ? (isEditMode ? 'Saving...' : 'Adding...') 
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
                    <Label 
                      htmlFor="title"
                      className="text-sm font-medium text-[#777980]"
                      style={{ letterSpacing: '0.005em' }}
                    >
                      Product Name
                    </Label>
                    <Input
                      id="title"
                      type="text"
                      placeholder="Type product name here..."
                      value={formData.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      className={`h-10 bg-[#F9F9FC] border-[#E0E2E7] text-sm placeholder:text-[#858D9D] ${
                        errors.title ? 'border-red-500' : ''
                      }`}
                      style={{ letterSpacing: '0.005em' }}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500 mt-1">{errors.title}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <Label 
                      htmlFor="description"
                      className="text-sm font-medium text-[#777980]"
                      style={{ letterSpacing: '0.005em' }}
                    >
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Type product description here..."
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      className="bg-[#F9F9FC] border-[#E0E2E7] text-sm placeholder:text-[#858D9D] resize-none"
                      style={{ height: '156px', letterSpacing: '0.005em' }}
                    />
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 flex flex-col items-center gap-3 sm:gap-3.5" style={{ boxShadow: '0px 4px 30px rgba(46, 45, 116, 0.05)' }}>
                <h2 className="text-base sm:text-lg font-medium text-[#353535] self-stretch" style={{ letterSpacing: '0.01em' }}>
                  Pricing
                </h2>
                
                <div className="flex flex-col gap-3.5 self-stretch">
                  <div className="flex flex-col gap-1">
                    <Label 
                      htmlFor="price"
                      className="text-sm font-medium text-[#777980]"
                      style={{ letterSpacing: '0.005em' }}
                    >
                      Base Price
                    </Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <DollarSign className="w-4 h-4 text-[#858D9D]" />
                      </div>
                      <Input
                        id="price"
                        type="number"
                        placeholder="Type base price here..."
                        value={formData.price}
                        onChange={(e) => handleChange('price', e.target.value)}
                        className={`h-10 pl-9 bg-[#F9F9FC] border-[#E0E2E7] text-sm placeholder:text-[#858D9D] ${
                          errors.price ? 'border-red-500' : ''
                        }`}
                      />
                    </div>
                    {errors.price && (
                      <p className="text-sm text-red-500 mt-1">{errors.price}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <Label 
                      htmlFor="discountPercentage"
                      className="text-sm font-medium text-[#777980]"
                      style={{ letterSpacing: '0.005em' }}
                    >
                      Discount Percentage (%)
                    </Label>
                    <Input
                      id="discountPercentage"
                      type="number"
                      placeholder="Type discount percentage..."
                      value={formData.discountPercentage}
                      onChange={(e) => handleChange('discountPercentage', e.target.value)}
                      className={`h-10 bg-[#F9F9FC] border-[#E0E2E7] text-sm placeholder:text-[#858D9D] ${
                        errors.discountPercentage ? 'border-red-500' : ''
                      }`}
                      style={{ letterSpacing: '0.005em' }}
                    />
                    {errors.discountPercentage && (
                      <p className="text-sm text-red-500 mt-1">{errors.discountPercentage}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Inventory */}
              <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 flex flex-col items-center gap-3 sm:gap-3.5" style={{ boxShadow: '0px 4px 30px rgba(46, 45, 116, 0.05)' }}>
                <h2 className="text-base sm:text-lg font-medium text-[#353535] self-stretch" style={{ letterSpacing: '0.01em' }}>
                  Inventory
                </h2>
                
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-3.5 self-stretch">
                  <div className="flex flex-col gap-1">
                    <Label 
                      htmlFor="sku"
                      className="text-sm font-medium text-[#777980]"
                      style={{ letterSpacing: '0.005em' }}
                    >
                      SKU
                    </Label>
                    <Input
                      id="sku"
                      type="text"
                      placeholder="Type product SKU here..."
                      value={formData.sku}
                      onChange={(e) => handleChange('sku', e.target.value)}
                      className={`h-10 bg-[#F9F9FC] border-[#E0E2E7] text-sm placeholder:text-[#858D9D] ${
                        errors.sku ? 'border-red-500' : ''
                      }`}
                      style={{ letterSpacing: '0.005em' }}
                    />
                    {errors.sku && (
                      <p className="text-sm text-red-500 mt-1">{errors.sku}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <Label 
                      htmlFor="stock"
                      className="text-sm font-medium text-[#777980]"
                      style={{ letterSpacing: '0.005em' }}
                    >
                      Quantity
                    </Label>
                    <Input
                      id="stock"
                      type="number"
                      placeholder="Type product quantity here..."
                      value={formData.stock}
                      onChange={(e) => handleChange('stock', e.target.value)}
                      className={`h-10 bg-[#F9F9FC] border-[#E0E2E7] text-sm placeholder:text-[#858D9D] ${
                        errors.stock ? 'border-red-500' : ''
                      }`}
                      style={{ letterSpacing: '0.005em' }}
                    />
                    {errors.stock && (
                      <p className="text-sm text-red-500 mt-1">{errors.stock}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="w-full lg:w-[264px]">
              {/* Category */}
              <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 flex flex-col items-center gap-3 sm:gap-3.5" style={{ boxShadow: '0px 4px 30px rgba(46, 45, 116, 0.05)' }}>
                <h2 className="text-base sm:text-lg font-medium text-[#353535] self-stretch" style={{ letterSpacing: '0.01em' }}>
                  Category
                </h2>
                
                <div className="flex flex-col gap-1 self-stretch">
                  <Label 
                    htmlFor="category"
                    className="text-sm font-medium text-[#777980]"
                    style={{ letterSpacing: '0.005em' }}
                  >
                    Product Category
                  </Label>
                  <Select 
                    key={formData.category}
                    value={formData.category} 
                    onValueChange={(value) => handleChange('category', value)}
                  >
                    <SelectTrigger 
                      className={`h-10 bg-[#F9F9FC] border-[#E0E2E7] text-sm ${
                        errors.category ? 'border-red-500' : ''
                      }`}
                      style={{ letterSpacing: '0.005em' }}
                    >
                      <SelectValue 
                        placeholder="Select a category"
                        className="text-[#858D9D]"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-red-500 mt-1">{errors.category}</p>
                  )}
                </div>
              </div>
            </div>
          </form>

          {/* Error Message */}
          {mutation.isError && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">
                Failed to {isEditMode ? 'update' : 'add'} product. Please try again.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
