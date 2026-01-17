import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Package, ShoppingCart, Users, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

// Custom Dashboard Icon
const DashboardIcon = ({ className }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path fillRule="evenodd" clipRule="evenodd" d="M3 6.5C3 3.87479 3.02811 3 6.5 3C9.97189 3 10 3.87479 10 6.5C10 9.12521 10.0111 10 6.5 10C2.98893 10 3 9.12521 3 6.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M14 6.5C14 3.87479 14.0281 3 17.5 3C20.9719 3 21 3.87479 21 6.5C21 9.12521 21.0111 10 17.5 10C13.9889 10 14 9.12521 14 6.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M3 17.5C3 14.8748 3.02811 14 6.5 14C9.97189 14 10 14.8748 10 17.5C10 20.1252 10.0111 21 6.5 21C2.98893 21 3 20.1252 3 17.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M14 17.5C14 14.8748 14.0281 14 17.5 14C20.9719 14 21 14.8748 21 17.5C21 20.1252 21.0111 21 17.5 21C13.9889 21 14 20.1252 14 17.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)


// Custom Product Management Icon
const ProductIcon = ({ className }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M21 16V8.00002C20.9996 7.6493 20.9071 7.30483 20.7315 7.00119C20.556 6.69754 20.3037 6.44539 20 6.27002L13 2.27002C12.696 2.09449 12.3511 2.00208 12 2.00208C11.6489 2.00208 11.304 2.09449 11 2.27002L4 6.27002C3.69626 6.44539 3.44398 6.69754 3.26846 7.00119C3.09294 7.30483 3.00036 7.6493 3 8.00002V16C3.00036 16.3508 3.09294 16.6952 3.26846 16.9989C3.44398 17.3025 3.69626 17.5547 4 17.73L11 21.73C11.304 21.9056 11.6489 21.998 12 21.998C12.3511 21.998 12.696 21.9056 13 21.73L20 17.73C20.3037 17.5547 20.556 17.3025 20.7315 16.9989C20.9071 16.6952 20.9996 16.3508 21 16Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.27002 6.95996L12 12.01L20.73 6.95996" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 22.08V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// Custom Order Management Icon
const OrderIcon = ({ className }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path fillRule="evenodd" clipRule="evenodd" d="M16.5137 21.4999H8.16592C5.09955 21.4999 2.74715 20.3924 3.41534 15.9347L4.19338 9.89351C4.60528 7.66925 6.02404 6.81799 7.26889 6.81799H17.4474C18.7105 6.81799 20.0469 7.73332 20.5229 9.89351L21.3009 15.9347C21.8684 19.8889 19.5801 21.4999 16.5137 21.4999Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16.651 6.59836C16.651 4.21229 14.7167 2.27799 12.3307 2.27799V2.27799C11.1817 2.27312 10.0781 2.72615 9.26388 3.53691C8.44969 4.34766 7.99199 5.44935 7.992 6.59836H7.992" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15.2963 11.1018H15.2506" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9.46572 11.1018H9.41995" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// Custom Customer Management Icon
const CustomerIcon = ({ className }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path fillRule="evenodd" clipRule="evenodd" d="M9.59151 15.2068C13.2805 15.2068 16.4335 15.7658 16.4335 17.9988C16.4335 20.2318 13.3015 20.8068 9.59151 20.8068C5.90151 20.8068 2.74951 20.2528 2.74951 18.0188C2.74951 15.7848 5.88051 15.2068 9.59151 15.2068Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M9.59151 12.0198C7.16951 12.0198 5.20551 10.0568 5.20551 7.63476C5.20551 5.21276 7.16951 3.24976 9.59151 3.24976C12.0125 3.24976 13.9765 5.21276 13.9765 7.63476C13.9855 10.0478 12.0355 12.0108 9.62251 12.0198H9.59151Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16.4831 10.8815C18.0841 10.6565 19.3171 9.28253 19.3201 7.61953C19.3201 5.98053 18.1251 4.62053 16.5581 4.36353" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18.5954 14.7322C20.1464 14.9632 21.2294 15.5072 21.2294 16.6272C21.2294 17.3982 20.7194 17.8982 19.8954 18.2112" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// Custom Reports Icon
const ReportsIcon = ({ className }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path fillRule="evenodd" clipRule="evenodd" d="M21.4189 15.7321C21.4189 19.3101 19.3099 21.4191 15.7319 21.4191H7.94988C4.36288 21.4191 2.24988 19.3101 2.24988 15.7321V7.93212C2.24988 4.35912 3.56388 2.25012 7.14288 2.25012H9.14288C9.86088 2.25112 10.5369 2.58812 10.9669 3.16312L11.8799 4.37712C12.3119 4.95112 12.9879 5.28912 13.7059 5.29012H16.5359C20.1229 5.29012 21.4469 7.11612 21.4469 10.7671L21.4189 15.7321Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7.48096 14.463H16.216" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: DashboardIcon },
  { name: 'Product Management', href: '/products', icon: ProductIcon },
  { name: 'Order Management', href: '/orders', icon: OrderIcon },
  { name: 'Customer Management', href: '/customers', icon: CustomerIcon },
  { name: 'Reports', href: '/reports', icon: ReportsIcon },
]

export default function Sidebar({ isOpen = false, onClose }) {
  const location = useLocation()
  
  return (
    <>
      <div className={cn(
        "w-[280px] bg-[#3A5BFF] text-white flex flex-col transition-transform duration-300 ease-in-out",
        "fixed lg:relative inset-y-0 left-0 z-30",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-lg transition-colors z-50"
          aria-label="Close menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 5L5 15M5 5l10 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      {/* Logo */}
      <div className="h-16 relative border-b border-blue-600">
        <div className="absolute left-[45px] top-[30px] w-[88px] h-[30px] flex items-center gap-2">
          <div className="w-[30px] h-[30px] rounded-full border-[8px] border-white bg-[#4169E1]"></div>
          <span className="text-[20px] font-medium leading-[1.02]">Logo</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 mt-8">
        {navigation.map((item, idx) => {
          const Icon = item.icon
          // Check if current location matches this nav item
          const isActive = location.pathname.startsWith(item.href)
          
          // Icon size per Figma: Dashboard/Product/Order/Customer/Reports
          const iconSizes = [
            { w: 18, h: 18 }, // Dashboard (Category)
            { w: 24, h: 24 }, // Product Management (Box)
            { w: 18, h: 19 }, // Order Management (Bag)
            { w: 18, h: 18 }, // Customer Management (2 User)
            { w: 19, h: 19 }  // Reports (Folder)
          ];
          const iconSize = iconSizes[idx] || { w: 24, h: 24 };
          return (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={cn(
                'relative flex items-center w-[280px] h-[72px] pl-[45px] text-[14px] font-medium transition-all',
                isActive ? 'text-white' : 'text-[#C2C0FF]',
                'hover:bg-[#5168E5]/50'
              )}
            >
              {/* Left white indicator for active item */}
              {isActive && (
                <div className="absolute left-0 top-0 w-[4px] h-[72px] bg-white rounded-r-[40px]" />
              )}
              
              <Icon 
                className={cn(isActive ? "text-white" : "text-[#C2C0FF]")} 
                style={{ width: iconSize.w, height: iconSize.h, strokeWidth: 1.5 }} 
              />
              
              <span
                className={cn(
                  'font-poppins',
                  'text-[14px]',
                  'font-medium',
                  'leading-[1.02]',
                  'tracking-[0px]',
                  'ml-[15px]',
                  isActive ? 'text-white' : 'text-[#C2C0FF]'
                )}
              >
                {item.name}
              </span>
            </NavLink>
          )
        })}
      </nav>
    </div>
    </>
  )
}
