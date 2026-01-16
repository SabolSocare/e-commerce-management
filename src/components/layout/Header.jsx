import { Bell, User } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import profileImage from '@/assets/profile.png'

const getPageTitle = (pathname) => {
  if (pathname === '/products' || pathname === '/') return 'Product'
  if (pathname === '/dashboard') return 'Dashboard'
  if (pathname === '/orders') return 'Order Management'
  if (pathname === '/customers') return 'Customer Management'
  if (pathname === '/reports') return 'Reports'
  if (pathname.startsWith('/products/add')) return 'Add Product'
  if (pathname.startsWith('/products/edit')) return 'Edit Product'
  return 'Product'
}

export default function Header() {
  const location = useLocation()
  const pageTitle = getPageTitle(location.pathname)

  return (
    <header className="w-full h-[61px] flex flex-col items-start p-0 relative">
      {/* topNav */}
      <div className="flex flex-col items-start px-[21px] py-[14px] gap-[10px] w-full h-[60px] bg-[#F9F9FC]  border-b border-[#F1F3F9]">
        {/* navContainer */}
        <div className="relative w-full h-[32px]">
          {/* Product Title */}
          <h1 className="absolute left-0 top-[1px] min-w-[79px] h-[30px] font-poppins font-medium text-[20px] leading-[30px] text-[#353535] whitespace-nowrap">
            {pageTitle}
          </h1>

          {/* Profile Section */}
          <div className="absolute right-0 top-0 w-[228.23px] h-[32px] flex flex-row items-center gap-[20px]">
            {/* Nik Shop Icon */}
            <div className="flex flex-col justify-center items-center p-[5px_12px] gap-[10px] w-[124px] h-[32px] bg-[#FFCC9180] rounded-[8px]">
              <div className="flex flex-row items-center gap-[20px] w-[100px] h-[21px]">
                <span className="w-[60px] h-[21px] font-poppins font-normal text-[14px] leading-[21px] text-[#353535]">
                  Nik Shop
                </span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 7.5L10 12.5L15 7.5" stroke="#353535" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* Bell Notification */}
            <div className="relative w-[32.23px] h-[29.74px]">
              <Button variant="ghost" size="icon" className="w-full h-full p-0">
                <Bell className="w-[24px] h-[24px] text-[#3A5BFF]" strokeWidth="2" />
              </Button>
              {/* Notification Dot */}
              <div className="absolute w-[18px] h-[18px] right-0 top-[1.13px] bg-[#CC5F5F] rounded-full flex items-center justify-center">
                <span className="font-poppins font-medium text-[11px] leading-[14px] text-white text-center">4</span>
              </div>
            </div>

            {/* Profile Picture */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-[32px] h-[32px] p-0 rounded-[8px]">
                  <div className="w-[32px] h-[32px] rounded-[8px] overflow-hidden">
                    <img 
                      src={profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Breadcrumbs Border */}
      {/* <div className="flex flex-col items-start px-[20px] py-[4px] gap-[10px] w-full h-[1px] bg-white border-t border-[#F1F3F9]" /> */}
    </header>
  )
}
