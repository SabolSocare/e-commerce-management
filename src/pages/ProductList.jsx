import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { 
  Search, 
  Filter, 
  Calendar, 
  Plus, 
  FileDown, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react'
import { productApi } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatCurrency, formatDate, cn } from '@/lib/utils'

const ITEMS_PER_PAGE = 10

export default function ProductList() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedProducts, setSelectedProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [deleteDialog, setDeleteDialog] = useState({ open: false, productId: null })
  // sortOrder: { key: 'product' | 'stock' | 'price' | 'added', direction: 'asc' | 'desc' }
  const [sortOrder, setSortOrder] = useState({ key: 'product', direction: 'asc' })

  // Fetch products
  const { data, isLoading, isError } = useQuery({
    queryKey: ['products', currentPage, ITEMS_PER_PAGE],
    queryFn: () =>
      productApi.getProducts({
        limit: ITEMS_PER_PAGE,
        skip: (currentPage - 1) * ITEMS_PER_PAGE,
      }),
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: productApi.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      setDeleteDialog({ open: false, productId: null })
    },
  })

  const products = data?.products || []
  const total = data?.total || 0
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

  const handleSelectAll = () => {
    if (selectedProducts.length > 0) {
      // If any are selected (some or all), deselect all
      setSelectedProducts([])
    } else {
      // If none are selected, select all
      setSelectedProducts(products.map((p) => p.id))
    }
  }

  const handleSelectProduct = (productId, checked) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId])
    } else {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId))
    }
  }

  const handleDelete = (productId) => {
    setDeleteDialog({ open: true, productId })
  }

  const confirmDelete = () => {
    if (deleteDialog.productId) {
      deleteMutation.mutate(deleteDialog.productId)
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    setSelectedProducts([])
  }

  const renderPagination = () => {
    const pages = []
    const maxVisiblePages = 5

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-normal',
            currentPage === i
              ? 'bg-[#3A5BFF] text-white'
              : 'bg-[#3A5BFF]/15 text-[#3A5BFF] hover:bg-[#3A5BFF]/25'
          )}
          style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', lineHeight: '20px', letterSpacing: '0.005em' }}
        >
          {i}
        </button>
      )
    }

    // Add ellipsis if there are more pages
    if (endPage < totalPages) {
      pages.push(
        <button
          key="ellipsis"
          disabled
          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-normal bg-[#3A5BFF]/15 text-[#3A5BFF]"
          style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', lineHeight: '20px', letterSpacing: '0.005em' }}
        >
          ...
        </button>
      )
    }

    return pages
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-500 mb-4">Failed to load products</p>
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['products'] })}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-[#F9F9FC] p-6">
      {/* Main Content Card */}
      <div className="rounded-lg flex-1 flex flex-col gap-8 pb-8">
        {/* Toolbar */}
        <div className="bg-[#F9F9FC] rounded-lg ">
          <div className="flex items-center justify-between mb-7 gap-8">
            {/* Large Search Bar and Actions with space between */}
            <div className="flex w-full items-center gap-8">
              <div className="w-[1160px] bg-[#F9F9FC] gab-b-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#858D9D] w-4 h-4 gap" />
                  <Input
                    type="text"
                    placeholder="Search order..."
                    className="pl-9 h-10 bg-[#F9F9FC] border border-[#E0E2E7] text-sm font-normal tracking-[0.005em] text-[#858D9D] placeholder:text-[#858D9D] rounded-lg w-full"
                    style={{ fontFamily: 'Public Sans, sans-serif' }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <Button 
                variant="ghost" 
                className="gap-1 h-10 w-[95px] px-3.5 py-2.5 bg-[#3A5BFF]/15 hover:bg-[#3A5BFF]/25 text-[#3A5BFF] rounded-lg flex-shrink-0"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_16_1959)">
                    <path d="M8.58543 14.0813C9.36624 14.8627 10.6326 14.8631 11.4139 14.0822C11.4142 14.0819 11.4145 14.0817 11.4148 14.0813L13.5554 11.9407C13.8024 11.6676 13.7811 11.246 13.5081 10.9991C13.2538 10.7692 12.8666 10.7696 12.6128 11L10.6621 12.9513L10.6668 2.66669C10.6667 2.29847 10.3683 2 10.0001 2C9.6319 2 9.33343 2.29847 9.33343 2.66666L9.32743 12.9387L7.38743 11C7.12693 10.7397 6.70474 10.7398 6.44443 11.0003C6.18412 11.2608 6.18427 11.683 6.44477 11.9433L8.58543 14.0813Z" fill="#3A5BFF"/>
                    <path d="M17.3333 12.6666C16.9652 12.6666 16.6667 12.9651 16.6667 13.3333V16C16.6667 16.3682 16.3682 16.6666 16 16.6666H4C3.63181 16.6666 3.33334 16.3682 3.33334 16V13.3333C3.33334 12.9651 3.03487 12.6667 2.66669 12.6667C2.29847 12.6666 2 12.9651 2 13.3333V16C2 17.1045 2.89544 18 4 18H16C17.1046 18 18 17.1045 18 16V13.3333C18 12.9651 17.7015 12.6666 17.3333 12.6666Z" fill="#3A5BFF"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_16_1959">
                      <rect width="16" height="16" fill="white" transform="translate(2 2)"/>
                    </clipPath>
                  </defs>
                </svg>
                <span className="text-sm font-normal leading-5 tracking-[0.005em]">Export</span>
              </Button>
              <Button
                className="flex items-center justify-center gap-1 h-10 w-[140px] px-3.5 py-2.5 bg-[#3A5BFF] hover:bg-[#3A5BFF]/90 text-white rounded-lg flex-shrink-0"
                style={{ fontFamily: 'Poppins, sans-serif' }}
                onClick={() => navigate('/products/add')}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_16_1963)">
                    <path d="M17.3333 9.33333H10.6667V2.66667C10.6667 2.48986 10.5964 2.32029 10.4714 2.19526C10.3464 2.07024 10.1768 2 10 2V2C9.82319 2 9.65362 2.07024 9.5286 2.19526C9.40357 2.32029 9.33333 2.48986 9.33333 2.66667V9.33333H2.66667C2.48986 9.33333 2.32029 9.40357 2.19526 9.5286C2.07024 9.65362 2 9.82319 2 10V10C2 10.1768 2.07024 10.3464 2.19526 10.4714C2.32029 10.5964 2.48986 10.6667 2.66667 10.6667H9.33333V17.3333C9.33333 17.5101 9.40357 17.6797 9.5286 17.8047C9.65362 17.9298 9.82319 18 10 18C10.1768 18 10.3464 17.9298 10.4714 17.8047C10.5964 17.6797 10.6667 17.5101 10.6667 17.3333V10.6667H17.3333C17.5101 10.6667 17.6797 10.5964 17.8047 10.4714C17.9298 10.3464 18 10.1768 18 10C18 9.82319 17.9298 9.65362 17.8047 9.5286C17.6797 9.40357 17.5101 9.33333 17.3333 9.33333Z" fill="white"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_16_1963">
                      <rect width="16" height="16" fill="white" transform="translate(2 2)"/>
                    </clipPath>
                  </defs>
                </svg>
                <span className="text-sm font-normal leading-5 tracking-[0.005em]">Add Product</span>
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center justify-between gap-4">
            {/* Tabs */}
            <div className="flex items-center p-1 bg-[#F9F9FC] border border-[#E0E2E7] rounded-lg">
              <button
                onClick={() => setStatusFilter('all')}
                className={cn(
                  'flex items-center justify-center gap-2 px-3 py-1.5 w-[100px] h-8 rounded-[6px] font-normal text-[14px] leading-5 tracking-[0.005em] transition-colors',
                  statusFilter === 'all'
                    ? 'bg-[#3A5BFF]/15 text-[#3A5BFF] font-[Poppins]'
                    : 'text-[#6E7079] hover:bg-gray-50 font-[Poppins]'
                )}
                style={statusFilter === 'all' ? { fontFamily: 'Poppins, sans-serif', fontWeight: 400 } : { fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}
              >
                <span className="w-[76px] h-5">All Product</span>
              </button>
              <button
                onClick={() => setStatusFilter('published')}
                className={cn(
                  'flex items-center justify-center gap-2 px-3 py-1.5 w-[100px] h-8 rounded-[6px] font-normal text-[14px] leading-5 tracking-[0.005em] transition-colors',
                  statusFilter === 'published'
                    ? 'bg-[#3A5BFF]/15 text-[#3A5BFF] font-[Poppins]'
                    : 'text-[#6E7079] hover:bg-gray-50 font-[Poppins]'
                )}
                style={statusFilter === 'published' ? { fontFamily: 'Poppins, sans-serif', fontWeight: 400 } : { fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}
              >
                <span className="w-[76px] h-5">Published</span>
              </button>
              <button
                onClick={() => setStatusFilter('lowstock')}
                className={cn(
                  'flex items-center justify-center gap-2 px-3 py-1.5 w-[100px] h-8 rounded-[6px] font-normal text-[14px] leading-5 tracking-[0.005em] transition-colors',
                  statusFilter === 'lowstock'
                    ? 'bg-[#3A5BFF]/15 text-[#3A5BFF] font-[Poppins]'
                    : 'text-[#6E7079] hover:bg-gray-50 font-[Poppins]'
                )}
                style={statusFilter === 'lowstock' ? { fontFamily: 'Poppins, sans-serif', fontWeight: 400 } : { fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}
              >
                <span className="w-[76px] h-5">Low Stock</span>
              </button>
              <button
                onClick={() => setStatusFilter('draft')}
                className={cn(
                  'flex items-center justify-center gap-2 px-3 py-1.5 w-[100px] h-8 rounded-[6px] font-normal text-[14px] leading-5 tracking-[0.005em] transition-colors',
                  statusFilter === 'draft'
                    ? 'bg-[#3A5BFF]/15 text-[#3A5BFF] font-[Poppins]'
                    : 'text-[#6E7079] hover:bg-gray-50 font-[Poppins]'
                )}
                style={statusFilter === 'draft' ? { fontFamily: 'Poppins, sans-serif', fontWeight: 400 } : { fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}
              >
                <span className="w-[76px] h-5">Draft</span>
              </button>
            </div>

            {/* Filter Controls */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#858D9D] w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search product..."
                  className="pl-10 h-10 w-[250px] bg-[#F9F9FC] border-[#E0E2E7] text-sm tracking-[0.005em] rounded-lg"
                />
              </div>
              <Button 
                variant="outline" 
                className="flex items-center justify-center gap-2 w-[137px] h-10 px-[14px] py-[10px] bg-[#F9F9FC] border border-[#E0E2E7] text-[#858D9D] hover:bg-gray-50 rounded-lg flex-shrink-0"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}
              >
                <span className="flex items-center justify-center w-5 h-5 mr-2">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_16_1983)">
                      <path d="M2 14.6667C2.00106 15.5505 2.35259 16.3977 2.97748 17.0226C3.60237 17.6475 4.4496 17.999 5.33333 18.0001H14.6667C15.5504 17.999 16.3976 17.6475 17.0225 17.0226C17.6474 16.3977 17.9989 15.5505 18 14.6667V8.66675H2V14.6667ZM13.3333 11.6667C13.5311 11.6667 13.7245 11.7254 13.8889 11.8353C14.0534 11.9452 14.1815 12.1013 14.2572 12.2841C14.3329 12.4668 14.3527 12.6679 14.3141 12.8618C14.2755 13.0558 14.1803 13.234 14.0404 13.3739C13.9006 13.5137 13.7224 13.6089 13.5284 13.6475C13.3344 13.6861 13.1334 13.6663 12.9507 13.5906C12.7679 13.5149 12.6117 13.3868 12.5019 13.2223C12.392 13.0579 12.3333 12.8645 12.3333 12.6667C12.3333 12.4015 12.4387 12.1472 12.6262 11.9596C12.8138 11.7721 13.0681 11.6667 13.3333 11.6667ZM10 11.6667C10.1978 11.6667 10.3911 11.7254 10.5556 11.8353C10.72 11.9452 10.8482 12.1013 10.9239 12.2841C10.9996 12.4668 11.0194 12.6679 10.9808 12.8618C10.9422 13.0558 10.847 13.234 10.7071 13.3739C10.5673 13.5137 10.3891 13.6089 10.1951 13.6475C10.0011 13.6861 9.80004 13.6663 9.61732 13.5906C9.43459 13.5149 9.27841 13.3868 9.16853 13.2223C9.05865 13.0579 9 12.8645 9 12.6667C9 12.4015 9.10536 12.1472 9.29289 11.9596C9.48043 11.7721 9.73478 11.6667 10 11.6667ZM6.66667 11.6667C6.86445 11.6667 7.05779 11.7254 7.22224 11.8353C7.38669 11.9452 7.51486 12.1013 7.59055 12.2841C7.66623 12.4668 7.68604 12.6679 7.64745 12.8618C7.60887 13.0558 7.51363 13.234 7.37377 13.3739C7.23392 13.5137 7.05574 13.6089 6.86176 13.6475C6.66778 13.6861 6.46671 13.6663 6.28398 13.5906C6.10126 13.5149 5.94508 13.3868 5.8352 13.2223C5.72532 13.0579 5.66667 12.8645 5.66667 12.6667C5.66667 12.4015 5.77202 12.1472 5.95956 11.9596C6.1471 11.7721 6.40145 11.6667 6.66667 11.6667Z" fill="#858D9D"/>
                      <path d="M14.6667 3.33333H14V2.66667C14 2.48986 13.9298 2.32029 13.8047 2.19526C13.6797 2.07024 13.5101 2 13.3333 2C13.1565 2 12.987 2.07024 12.8619 2.19526C12.7369 2.32029 12.6667 2.48986 12.6667 2.66667V3.33333H7.33333V2.66667C7.33333 2.48986 7.2631 2.32029 7.13807 2.19526C7.01305 2.07024 6.84348 2 6.66667 2C6.48986 2 6.32029 2.07024 6.19526 2.19526C6.07024 2.32029 6 2.48986 6 2.66667V3.33333H5.33333C4.4496 3.33439 3.60237 3.68592 2.97748 4.31081C2.35259 4.93571 2.00106 5.78294 2 6.66667L2 7.33333H18V6.66667C17.9989 5.78294 17.6474 4.93571 17.0225 4.31081C16.3976 3.68592 15.5504 3.33439 14.6667 3.33333Z" fill="#858D9D"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_16_1983">
                        <rect width="16" height="16" fill="white" transform="translate(2 2)"/>
                      </clipPath>
                    </defs>
                  </svg>
                </span>
                <span className="text-sm font-normal leading-5 tracking-[0.005em]" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400, color: '#858D9D', width: '81px', height: '20px' }}>Select Date</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center justify-center gap-2 w-[97px] h-10 px-[14px] py-[10px] bg-[#F9F9FC]  border border-[#E0E2E7] text-[#667085] hover:bg-gray-50 rounded-lg flex-shrink-0"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}
              >
                <span className="flex items-center justify-center w-5 h-5 mr-2">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_16_1987)">
                      <path d="M2.66751 5.16715H4.49132C4.85129 6.49158 6.21675 7.27344 7.54118 6.91348C8.39181 6.68228 9.05631 6.01779 9.2875 5.16715H17.3327C17.7009 5.16715 17.9993 4.86871 17.9993 4.50056C17.9993 4.13241 17.7009 3.83397 17.3327 3.83397H9.2875C8.92754 2.50951 7.56208 1.72765 6.23765 2.08762C5.38702 2.31881 4.72252 2.98331 4.49132 3.83394H2.66751C2.29935 3.83394 2.00092 4.13238 2.00092 4.50053C2.00092 4.86868 2.29935 5.16715 2.66751 5.16715Z" fill="#858D9D"/>
                      <path d="M17.3327 9.33374H15.5089C15.1496 8.0095 13.7849 7.2272 12.4607 7.58642C11.6094 7.81736 10.9443 8.48239 10.7134 9.33374H2.66751C2.29935 9.33374 2.00092 9.63218 2.00092 10.0003C2.00092 10.3685 2.29935 10.6669 2.66751 10.6669H10.7134C11.0726 11.9912 12.4373 12.7735 13.7616 12.4143C14.6129 12.1833 15.2779 11.5183 15.5089 10.6669H17.3327C17.7009 10.6669 17.9993 10.3685 17.9993 10.0003C17.9993 9.63218 17.7009 9.33374 17.3327 9.33374Z" fill="#858D9D"/>
                      <path d="M17.3327 14.8328H9.2875C8.92754 13.5084 7.56208 12.7266 6.23765 13.0865C5.38702 13.3177 4.72252 13.9822 4.49132 14.8328H2.66751C2.29935 14.8328 2.00092 15.1313 2.00092 15.4994C2.00092 15.8676 2.29935 16.166 2.66751 16.166H4.49132C4.85129 17.4904 6.21675 18.2723 7.54118 17.9123C8.39181 17.6811 9.05631 17.0167 9.2875 16.166H17.3327C17.7009 16.166 17.9993 15.8676 17.9993 15.4994C17.9993 15.1313 17.7009 14.8328 17.3327 14.8328Z" fill="#858D9D"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_16_1987">
                        <rect width="16" height="16" fill="white" transform="translate(2 2)"/>
                      </clipPath>
                    </defs>
                  </svg>
                </span>
                <span className="text-sm font-normal leading-5 tracking-[0.005em]" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400, color: '#667085', width: '41px', height: '20px' }}>Filters</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white flex-1 flex flex-col overflow-hidden mb-6" style={{ borderRadius: '12px' }}>
          <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead className="bg-white sticky top-0">
              <tr className="border-b border-[#F0F1F3]">
                <th className="px-[22px] py-[18px]" style={{ width: '350px', height: '56px' }}>
                  <div className="flex flex-row items-center gap-2">
                    <button
                      onClick={handleSelectAll}
                      className="w-5 h-5 flex-shrink-0"
                    >
                      {selectedProducts.length === products.length && products.length > 0 ? (
                        // All selected - checkmark
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="20" height="20" rx="6" fill="#3A5BFF"/>
                          <path fillRule="evenodd" clipRule="evenodd" d="M15.947 4.7738C16.302 5.06668 16.3524 5.59191 16.0595 5.94693L8.91037 14.6125C8.76048 14.7942 8.4899 14.8156 8.31329 14.6598L4.44865 11.2498C4.10355 10.9453 4.07063 10.4187 4.37514 10.0736C4.67964 9.72849 5.20625 9.69557 5.55135 10.0001L8.44707 12.5551L14.7739 4.88629C15.0667 4.53127 15.592 4.48091 15.947 4.7738Z" fill="white"/>
                        </svg>
                      ) : selectedProducts.length > 0 ? (
                        // Some selected - minus
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="20" height="20" rx="6" fill="#3A5BFF"/>
                          <path d="M5 10H15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      ) : (
                        // None selected - empty
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="1" y="1" width="18" height="18" rx="5" fill="white" stroke="#858D9D" strokeWidth="2"/>
                        </svg>
                      )}
                    </button>
                    <span className="flex-grow text-left font-medium text-sm leading-5 tracking-[0.005em] text-[#353535]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Product
                    </span>
                    <button 
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="flex-shrink-0"
                    >
                      <svg 
                        width="16" 
                        height="16" 
                        viewBox="0 0 16 16" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                          transform: sortOrder === 'desc' ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease'
                        }}
                      >
                        <path d="M4.27602 6H11.724C11.8559 6.00003 11.9847 6.03914 12.0943 6.1124C12.2039 6.18565 12.2894 6.28976 12.3398 6.41156C12.3903 6.53336 12.4035 6.66738 12.3777 6.79669C12.352 6.92599 12.2886 7.04476 12.1954 7.138L8.47135 10.862C8.34634 10.987 8.1768 11.0572 8.00002 11.0572C7.82325 11.0572 7.65371 10.987 7.52869 10.862L3.80469 7.138C3.71148 7.04476 3.64801 6.92599 3.6223 6.79669C3.59659 6.66738 3.60979 6.53336 3.66024 6.41156C3.71068 6.28976 3.79611 6.18565 3.90572 6.1124C4.01532 6.03914 4.14419 6.00003 4.27602 6Z" fill="#A3A9B6"/>
                      </svg>
                    </button>
                  </div>
                </th>
                <th className="px-[22px] py-[18px]" style={{ width: '220px', minHeight: '56px', textAlign: 'left' }}>
                  <span className="flex-grow text-left font-medium text-sm leading-5 tracking-[0.005em] text-[#353535]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      SKU
                    </span>
                </th>
                <th className="px-[22px] py-[18px]" style={{ width: '180px', minHeight: '56px', textAlign: 'left' }}>
                  <span className="flex-grow text-left font-medium text-sm leading-5 tracking-[0.005em] text-[#353535]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Category
                    </span>
                </th>
                <th className="px-[22px] py-[18px]" style={{ width: '225px', minHeight: '56px', textAlign: 'left' }}>
                  <div className="flex flex-row items-center gap-2">
                    <span className="flex-grow text-left font-medium text-sm leading-5 tracking-[0.005em] text-[#353535]" style={{ fontFamily: 'Poppins, sans-serif' }}>Stock</span>
                    <button
                      onClick={() => setSortOrder({ key: 'stock', direction: sortOrder.key === 'stock' && sortOrder.direction === 'asc' ? 'desc' : 'asc' })}
                      className="flex-shrink-0"
                      aria-label="Sort by Stock"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                          transform: sortOrder.key === 'stock' && sortOrder.direction === 'desc' ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease'
                        }}
                      >
                        <path d="M4.27602 6H11.724C11.8559 6.00003 11.9847 6.03914 12.0943 6.1124C12.2039 6.18565 12.2894 6.28976 12.3398 6.41156C12.3903 6.53336 12.4035 6.66738 12.3777 6.79669C12.352 6.92599 12.2886 7.04476 12.1954 7.138L8.47135 10.862C8.34634 10.987 8.1768 11.0572 8.00002 11.0572C7.82325 11.0572 7.65371 10.987 7.52869 10.862L3.80469 7.138C3.71148 7.04476 3.64801 6.92599 3.6223 6.79669C3.59659 6.66738 3.60979 6.53336 3.66024 6.41156C3.71068 6.28976 3.79611 6.18565 3.90572 6.1124C4.01532 6.03914 4.14419 6.00003 4.27602 6Z" fill="#A3A9B6"/>
                      </svg>
                    </button>
                  </div>
                </th>
                <th className="px-[22px] py-[18px]" style={{ width: '225px', minHeight: '56px', textAlign: 'left' }}>
                  <div className="flex flex-row items-center gap-2">
                    <span className="flex-grow text-left font-medium text-sm leading-5 tracking-[0.005em] text-[#353535]" style={{ fontFamily: 'Poppins, sans-serif' }}>Price</span>
                    <button
                      onClick={() => setSortOrder({ key: 'price', direction: sortOrder.key === 'price' && sortOrder.direction === 'asc' ? 'desc' : 'asc' })}
                      className="flex-shrink-0"
                      aria-label="Sort by Price"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                          transform: sortOrder.key === 'price' && sortOrder.direction === 'desc' ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease'
                        }}
                      >
                        <path d="M4.27602 6H11.724C11.8559 6.00003 11.9847 6.03914 12.0943 6.1124C12.2039 6.18565 12.2894 6.28976 12.3398 6.41156C12.3903 6.53336 12.4035 6.66738 12.3777 6.79669C12.352 6.92599 12.2886 7.04476 12.1954 7.138L8.47135 10.862C8.34634 10.987 8.1768 11.0572 8.00002 11.0572C7.82325 11.0572 7.65371 10.987 7.52869 10.862L3.80469 7.138C3.71148 7.04476 3.64801 6.92599 3.6223 6.79669C3.59659 6.66738 3.60979 6.53336 3.66024 6.41156C3.71068 6.28976 3.79611 6.18565 3.90572 6.1124C4.01532 6.03914 4.14419 6.00003 4.27602 6Z" fill="#A3A9B6"/>
                      </svg>
                    </button>
                  </div>
                </th>
                <th className="px-[22px] py-[18px]" style={{ width: '130px', minHeight: '56px', textAlign: 'left' }}>
                  <div className="flex flex-row items-center gap-2">
                    <span className="flex-grow text-left font-medium text-sm leading-5 tracking-[0.005em] text-[#353535]" style={{ fontFamily: 'Poppins, sans-serif' }}>Added</span>
                    <button
                      onClick={() => setSortOrder({ key: 'added', direction: sortOrder.key === 'added' && sortOrder.direction === 'asc' ? 'desc' : 'asc' })}
                      className="flex-shrink-0"
                      aria-label="Sort by Added"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                          transform: sortOrder.key === 'added' && sortOrder.direction === 'desc' ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease'
                        }}
                      >
                        <path d="M4.27602 6H11.724C11.8559 6.00003 11.9847 6.03914 12.0943 6.1124C12.2039 6.18565 12.2894 6.28976 12.3398 6.41156C12.3903 6.53336 12.4035 6.66738 12.3777 6.79669C12.352 6.92599 12.2886 7.04476 12.1954 7.138L8.47135 10.862C8.34634 10.987 8.1768 11.0572 8.00002 11.0572C7.82325 11.0572 7.65371 10.987 7.52869 10.862L3.80469 7.138C3.71148 7.04476 3.64801 6.92599 3.6223 6.79669C3.59659 6.66738 3.60979 6.53336 3.66024 6.41156C3.71068 6.28976 3.79611 6.18565 3.90572 6.1124C4.01532 6.03914 4.14419 6.00003 4.27602 6Z" fill="#A3A9B6"/>
                      </svg>
                    </button>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                  <span className="text-sm font-medium leading-5 tracking-[0.005em] text-[#353535]" style={{ fontFamily: 'Poppins, sans-serif' }}>Action</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                // Skeleton loading rows
                Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                  <tr key={`skeleton-${index}`} className="animate-pulse">
                    <td className="px-[22px] py-3 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-gray-200 rounded"></div>
                        <div className="w-11 h-11 bg-gray-200 rounded-lg"></div>
                        <div className="flex flex-col gap-2">
                          <div className="h-4 w-32 bg-gray-200 rounded"></div>
                          <div className="h-3 w-24 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200">
                      <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200">
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200">
                      <div className="h-4 w-12 bg-gray-200 rounded"></div>
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200">
                      <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200">
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded"></div>
                        <div className="w-8 h-8 bg-gray-200 rounded"></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const isSelected = selectedProducts.includes(product.id)
                  return (
                    <tr 
                      key={product.id} 
                      className={cn(
                        "hover:bg-gray-50",
                        isSelected ? "bg-[#F9F9FC]" : "bg-white"
                      )}
                    >
                      <td className={cn(
                        "px-[22px] py-3 border-b",
                        isSelected ? "border-[#F0F1F3] bg-[#F9F9FC]" : "border-gray-200"
                      )}>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSelectProduct(product.id, !isSelected)}
                            className="w-5 h-5 flex-shrink-0"
                          >
                            {isSelected ? (
                              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="20" height="20" rx="6" fill="#3A5BFF"/>
                                <path fillRule="evenodd" clipRule="evenodd" d="M15.947 4.7738C16.302 5.06668 16.3524 5.59191 16.0595 5.94693L8.91037 14.6125C8.76048 14.7942 8.4899 14.8156 8.31329 14.6598L4.44865 11.2498C4.10355 10.9453 4.07063 10.4187 4.37514 10.0736C4.67964 9.72849 5.20625 9.69557 5.55135 10.0001L8.44707 12.5551L14.7739 4.88629C15.0667 4.53127 15.592 4.48091 15.947 4.7738Z" fill="white"/>
                              </svg>
                            ) : (
                              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="1" y="1" width="18" height="18" rx="5" fill="white" stroke="#858D9D" strokeWidth="2"/>
                              </svg>
                            )}
                          </button>
                          <img
                            src={product.thumbnail || 'https://via.placeholder.com/44'}
                            alt={product.title}
                            className="w-11 h-11 rounded-lg object-cover bg-[#E0E2E7]"
                          />
                          <div className="flex flex-col gap-1">
                            <div className="text-sm font-normal text-[#353535] tracking-[0.005em]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                              {product.title}
                            </div>
                            <div className="text-xs font-normal text-[#6E7079] tracking-[0.005em]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                              {product.meta?.barcode || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className={cn(
                        "px-4 py-3 border-b",
                        isSelected ? "border-[#F0F1F3] bg-[#F9F9FC]" : "border-gray-200"
                      )}>
                        <span className="text-sm text-blue-600">{product.sku || 'N/A'}</span>
                      </td>
                      <td className={cn(
                        "px-4 py-3 border-b",
                        isSelected ? "border-[#F0F1F3] bg-[#F9F9FC]" : "border-gray-200"
                      )}>
                        <span className="text-sm text-gray-500 capitalize" style={{ fontFamily: 'Poppins, sans-serif' }}>{product.category}</span>
                      </td>
                      <td className={cn(
                        "px-4 py-3 border-b",
                        isSelected ? "border-[#F0F1F3] bg-[#F9F9FC]" : "border-gray-200"
                      )}>
                        <span className="text-sm text-gray-500" style={{ fontFamily: 'Poppins, sans-serif' }}>{product.stock}</span>
                      </td>
                      <td className={cn(
                        "px-4 py-3 border-b",
                        isSelected ? "border-[#F0F1F3] bg-[#F9F9FC]" : "border-gray-200"
                      )}>
                        <span className="text-sm text-gray-500" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          {formatCurrency(product.price)}
                        </span>
                      </td>
                      <td className={cn(
                        "px-4 py-3 border-b",
                        isSelected ? "border-[#F0F1F3] bg-[#F9F9FC]" : "border-gray-200"
                      )}>
                        <span className="text-sm text-gray-500" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          {product.meta?.createdAt
                            ? formatDate(product.meta.createdAt)
                            : formatDate(new Date())}
                        </span>
                      </td>
                      <td className={cn(
                        "px-4 py-3 border-b",
                        isSelected ? "border-[#F0F1F3] bg-[#F9F9FC]" : "border-gray-200"
                      )}>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => navigate(`/products/edit/${product.id}`)}
                          >
                            {/* Custom Edit Icon */}
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <g clipPath="url(#clip0_16_2321)">
                                <path d="M0.781333 12.7458C0.281202 13.2458 0.000151033 13.9239 0 14.6311L0 15.9998H1.36867C2.07585 15.9996 2.75402 15.7186 3.254 15.2184L12.1493 6.32313L9.67667 3.85046L0.781333 12.7458Z" fill="#A3A9B6"/>
                                <path d="M15.4299 0.570117C15.2675 0.407607 15.0747 0.278687 14.8626 0.190728C14.6504 0.102769 14.4229 0.0574951 14.1932 0.0574951C13.9635 0.0574951 13.736 0.102769 13.5239 0.190728C13.3117 0.278687 13.1189 0.407607 12.9565 0.570117L10.6192 2.90812L13.0919 5.38078L15.4299 3.04345C15.5924 2.88111 15.7213 2.68833 15.8093 2.47614C15.8972 2.26394 15.9425 2.03649 15.9425 1.80678C15.9425 1.57708 15.8972 1.34963 15.8093 1.13743C15.7213 0.925236 15.5924 0.732457 15.4299 0.570117V0.570117Z" fill="#A3A9B6"/>
                              </g>
                              <defs>
                                <clipPath id="clip0_16_2321">
                                  <rect width="16" height="16" fill="white"/>
                                </clipPath>
                              </defs>
                            </svg>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleDelete(product.id)}
                          >
                            {/* Custom Delete Icon */}
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M14 2.66666H11.9334C11.6144 1.11572 10.2501 0.002 8.66669 0H7.33334C5.74994 0.002 4.38562 1.11572 4.06669 2.66666H2.00003C1.63184 2.66666 1.33337 2.96513 1.33337 3.33331C1.33337 3.7015 1.63184 4 2.00003 4H2.66669V12.6667C2.66891 14.5067 4.16 15.9978 6.00003 16H10C11.8401 15.9978 13.3312 14.5067 13.3334 12.6667V4H14C14.3682 4 14.6667 3.70153 14.6667 3.33334C14.6667 2.96516 14.3682 2.66666 14 2.66666ZM7.33337 11.3333C7.33337 11.7015 7.0349 12 6.66672 12C6.2985 12 6.00003 11.7015 6.00003 11.3333V7.33334C6.00003 6.96516 6.2985 6.66669 6.66669 6.66669C7.03487 6.66669 7.33334 6.96516 7.33334 7.33334V11.3333H7.33337ZM10 11.3333C10 11.7015 9.70156 12 9.33337 12C8.96519 12 8.66672 11.7015 8.66672 11.3333V7.33334C8.66672 6.96516 8.96519 6.66669 9.33337 6.66669C9.70156 6.66669 10 6.96516 10 7.33334V11.3333ZM5.44737 2.66666C5.73094 1.86819 6.48606 1.33434 7.33337 1.33331H8.66672C9.51403 1.33434 10.2692 1.86819 10.5527 2.66666H5.44737Z" fill="#A3A9B6"/>
                            </svg>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-row items-center px-6 py-[18px] gap-3 bg-white">
          <div 
            className="flex-grow text-sm font-normal text-[#667085]"
            style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', lineHeight: '20px', letterSpacing: '0.005em' }}
          >
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
            {Math.min(currentPage * ITEMS_PER_PAGE, total)} from {total}
          </div>

          <div className="flex flex-row items-start gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#3A5BFF]/15 hover:bg-[#3A5BFF]/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.86 14.3933L7.14003 10.6666C7.01586 10.5417 6.94617 10.3727 6.94617 10.1966C6.94617 10.0205 7.01586 9.85152 7.14003 9.72661L10.86 5.99994C10.9533 5.90593 11.0724 5.84181 11.2022 5.81576C11.3321 5.78971 11.4667 5.80292 11.589 5.8537C11.7113 5.90448 11.8157 5.99052 11.8889 6.10087C11.9621 6.21122 12.0008 6.34086 12 6.47328V13.9199C12.0008 14.0524 11.9621 14.182 11.8889 14.2924C11.8157 14.4027 11.7113 14.4887 11.589 14.5395C11.4667 14.5903 11.3321 14.6035 11.2022 14.5775C11.0724 14.5514 10.9533 14.4873 10.86 14.3933Z" fill="#3A5BFF"/>
              </svg>
            </button>

            {renderPagination()}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#3A5BFF]/15 hover:bg-[#3A5BFF]/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(180deg)' }}>
                <path d="M10.86 14.3933L7.14003 10.6666C7.01586 10.5417 6.94617 10.3727 6.94617 10.1966C6.94617 10.0205 7.01586 9.85152 7.14003 9.72661L10.86 5.99994C10.9533 5.90593 11.0724 5.84181 11.2022 5.81576C11.3321 5.78971 11.4667 5.80292 11.589 5.8537C11.7113 5.90448 11.8157 5.99052 11.8889 6.10087C11.9621 6.21122 12.0008 6.34086 12 6.47328V13.9199C12.0008 14.0524 11.9621 14.182 11.8889 14.2924C11.8157 14.4027 11.7113 14.4887 11.589 14.5395C11.4667 14.5903 11.3321 14.6035 11.2022 14.5775C11.0724 14.5514 10.9533 14.4873 10.86 14.3933Z" fill="#3A5BFF"/>
              </svg>
            </button>
          </div>
        </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, productId: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, productId: null })}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
