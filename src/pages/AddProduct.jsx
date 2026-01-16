import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
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

export default function AddProduct() {
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

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: productApi.getCategories,
  })

  // Add product mutation
  const addMutation = useMutation({
    mutationFn: productApi.addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      navigate('/products')
    },
  })

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
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
      stock: Number(formData.stock),
    }

    if (formData.discountPercentage) {
      productData.discountPercentage = Number(formData.discountPercentage)
    }

    addMutation.mutate(productData)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Form */}
      <div className="bg-white rounded-lg shadow flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6 max-w-4xl">
          {/* General Information */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">General Information</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Product Name</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Type product name here..."
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-red-500 mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Type product description here..."
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={6}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* Pricing */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="price">Base Price</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="Type base price here..."
                    value={formData.price}
                    onChange={(e) => handleChange('price', e.target.value)}
                    className={errors.price ? 'border-red-500' : ''}
                    step="0.01"
                  />
                  {errors.price && (
                    <p className="text-sm text-red-500 mt-1">{errors.price}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="discountPercentage">Discount Percentage (%)</Label>
                  <Input
                    id="discountPercentage"
                    type="number"
                    placeholder="Type discount percentage..."
                    value={formData.discountPercentage}
                    onChange={(e) => handleChange('discountPercentage', e.target.value)}
                    className={errors.discountPercentage ? 'border-red-500' : ''}
                    step="0.01"
                  />
                  {errors.discountPercentage && (
                    <p className="text-sm text-red-500 mt-1">{errors.discountPercentage}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Category */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Category</h2>
              
              <div>
                <Label htmlFor="category">Product Category</Label>
                <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                  <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
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
                {errors.category && (
                  <p className="text-sm text-red-500 mt-1">{errors.category}</p>
                )}
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Inventory</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  type="text"
                  placeholder="Type product SKU here..."
                  value={formData.sku}
                  onChange={(e) => handleChange('sku', e.target.value)}
                  className={errors.sku ? 'border-red-500' : ''}
                />
                {errors.sku && (
                  <p className="text-sm text-red-500 mt-1">{errors.sku}</p>
                )}
              </div>

              <div>
                <Label htmlFor="stock">Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  placeholder="Type product quantity here..."
                  value={formData.stock}
                  onChange={(e) => handleChange('stock', e.target.value)}
                  className={errors.stock ? 'border-red-500' : ''}
                />
                {errors.stock && (
                  <p className="text-sm text-red-500 mt-1">{errors.stock}</p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/products')}
              disabled={addMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#4169E1] hover:bg-[#3557C1]"
              disabled={addMutation.isPending}
            >
              {addMutation.isPending ? 'Adding Product...' : 'Add Product'}
            </Button>
          </div>

          {addMutation.isError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">
                Failed to add product. Please try again.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
