# Product Management System

A modern, responsive product management system built with React, TailwindCSS, and Shadcn/ui. This application allows you to manage products with full CRUD operations, pagination, filtering, and a beautiful UI that matches the provided design specifications.

## 🚀 Features

- ✅ **Product List Management** - View all products with pagination
- ✅ **Create Product** - Add new products with validation
- ✅ **Edit Product** - Update existing product information
- ✅ **Delete Product** - Remove products with confirmation
- ✅ **Search & Filter** - Find products quickly
- ✅ **Mobile Responsive** - Fully responsive design for mobile, tablet, and desktop
- ✅ **Skeleton Loading** - Smooth loading states for better UX
- ✅ **Modern UI** - Clean, professional interface using Shadcn/ui
- ✅ **API Integration** - Connected to DummyJSON API
- ✅ **State Management** - React Query for efficient data fetching
- ✅ **Form Validation** - Client-side validation for all forms

## 🛠️ Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** TailwindCSS
- **UI Components:** Shadcn/ui + Radix UI
- **State Management:** React Query (TanStack Query)
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Icons:** Lucide React

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js:** >= 20.0.0 (recommended: 20.10.0)
- **npm:** >= 10.0.0
- **Git:** Latest version

You can verify your installations by running:

```bash
node --version
npm --version
```

## 🔧 Installation & Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd e-commerce-management
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory (or copy from `.env.example`):

```bash
cp .env.example .env
```

The `.env` file should contain:

```env
VITE_API_BASE_URL=https://dummyjson.com
```

### 4. Run the development server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📦 Build for Production

To create a production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## 🧪 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 📁 Project Structure

```
e-commerce-management/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI/CD
├── public/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.jsx      # Main layout wrapper with sidebar toggle
│   │   │   ├── Sidebar.jsx     # Navigation sidebar with mobile support
│   │   │   └── Header.jsx      # Top header with hamburger menu
│   │   └── ui/                 # Shadcn/ui components
│   │       ├── button.jsx
│   │       ├── input.jsx
│   │       ├── select.jsx
│   │       ├── checkbox.jsx
│   │       ├── dialog.jsx
│   │       ├── textarea.jsx
│   │       ├── label.jsx
│   │       ├── dropdown-menu.jsx
│   │       └── ...
│   ├── pages/
│   │   ├── ProductList.jsx     # Product listing page with table
│   │   ├── ProductForm.jsx     # Unified add/edit product form
│   │   └── ComingSoon.jsx      # Placeholder page
│   ├── services/
│   │   └── api.js              # API service layer
│   ├── lib/
│   │   └── utils.js            # Utility functions
│   ├── App.jsx                 # App component with routes
│   ├── main.jsx                # App entry point
│   └── index.css               # Global styles
├── .env.example                # Environment variables template
├── .nvmrc                      # Node version specification
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🎨 Design Implementation

The UI is designed to match modern e-commerce management standards:

- **Custom Breakpoints:** 
  - Mobile: < 475px
  - XS: 475px
  - SM: 640px
  - MD: 768px
  - LG: 1024px
- **Primary Color:** #3A5BFF (Blue)
- **Background:** #F9F9FC (Light Gray)
- **Text Colors:** #353535 (Dark), #777980 (Gray), #858D9D (Light Gray)
- **Font:** Poppins
- **Mobile-First:** Responsive design from mobile to desktop
- **Sidebar:** Auto-hide on mobile, always visible on desktop
- **Loading States:** Skeleton loaders for smooth UX

## 🔗 API Endpoints

The application uses the [DummyJSON API](https://dummyjson.com):

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/products` | GET | List products with pagination |
| `/products/:id` | GET | Get single product |
| `/products/add` | POST | Create new product |
| `/products/:id` | PUT | Update product |
| `/products/:id` | DELETE | Delete product |
| `/products/category-list` | GET | Get all categories |

## 📱 Pages & Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Redirect | Redirects to `/products` |
| `/dashboard` | ComingSoon | Coming later |
| `/products` | ProductList | Product listing page |
| `/products/add` | ProductForm | Add new product |
| `/products/edit/:id` | ProductForm | Edit existing product |
| `/orders` | ComingSoon | Coming later |
| `/customers` | ComingSoon | Coming later |
| `/reports` | ComingSoon | Coming later |

## ✨ Key Features Details

### Product List Page

- **Pagination:** Navigate through products with page numbers
- **Bulk Selection:** Select multiple products with checkboxes
- **Search:** Search products by name
- **Filters:** Filter by status, category, date
- **Actions:** Edit and delete products
- **Export:** Export products data
- **Horizontal Scroll:** Table scrolls horizontally on mobile devices
- **Responsive Layout:** Adapts to all screen sizes

### Add/Edit Product Form

**Unified Form:** Single component handles both add and edit modes with skeleton loading

**Fields:**
- Product Name (required)
- Description (optional, textarea)
- Category (required, dropdown)
- Base Price (required, numeric with $ icon)
- Discount Percentage (optional, numeric)
- SKU (required, text)
- Quantity/Stock (required, numeric)

**Mobile Optimizations:**
- Reduced padding and spacing on small screens
- 50/50 button split on mobile
- Responsive grid layout for inventory fields
- Form content scrolls independently (no double-scroll)
- Skeleton loading during data fetch and save operations

**Validation:**
- All required fields must be filled
- Numeric fields validated for proper format
- Real-time error messages
- Form-level validation before submission

## 🚀 CI/CD

The project includes GitHub Actions CI workflow that:

- ✅ Runs on push and pull requests
- ✅ Checks Node.js version
- ✅ Installs dependencies
- ✅ Runs linting
- ✅ Builds the project
- ✅ Runs on multiple Node versions (20.x)

## 🐛 Troubleshooting

### Issue: Port 5173 already in use

**Solution:**
```bash
# Kill the process using port 5173
lsof -ti:5173 | xargs kill -9

# Or use a different port
npm run dev -- --port 3000
```

### Issue: Module not found errors

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Build fails

**Solution:**
```bash
# Ensure you're using the correct Node version
nvm use 20.10.0

# Clean and rebuild
rm -rf dist
npm run build
```

## 📝 Code Quality

The project follows these best practices:

- ✅ **Clean Code:** Organized, readable, and maintainable
- ✅ **Component Structure:** Reusable and modular components
- ✅ **State Management:** Efficient data fetching with React Query
- ✅ **Error Handling:** Proper error states and user feedback
- ✅ **Responsive Design:** Mobile-first approach with custom breakpoints
- ✅ **Performance:** Optimized rendering and data caching
- ✅ **Loading States:** Skeleton loaders for better UX
- ✅ **Accessibility:** Proper labels and semantic HTML
- ✅ **Component Composition:** Single ProductForm for add/edit modes

## 🎯 Mobile Responsiveness

### Mobile Features (< 768px)
- **Sidebar:** Slide-in navigation with backdrop overlay
- **Header:** Hamburger menu with hidden page title
- **Product List:** Horizontally scrollable table with fixed column widths
- **Product Form:**
  - Reduced padding and spacing
  - Smaller fonts and buttons
  - 50/50 button layout
  - Single-column inventory grid
  - Independent form scrolling
  - Full-width category section
- **Auto-close:** Sidebar closes automatically on navigation

### Desktop Features (≥ 1024px)
- **Sidebar:** Always visible with 209px width
- **Header:** Page title visible
- **Product List:** Full-width table with proper column sizing
- **Product Form:**
  - Larger padding and spacing
  - Two-column layout
  - Fixed-width buttons (99px, 146px)
  - Two-column inventory grid
  - Natural page scrolling

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is created as part of a frontend developer assignment.

## 👨‍💻 Developer

Created by a Senior Frontend Developer as part of the Digital Government Committee assignment.

## 📞 Contact

For any questions or issues, please contact:
- Telegram: Socare Sabol(@socare_sabol)
- Email: sabolsocare1028@gmail.com

---

**Assignment Details:**
- Position: Frontend Developer (Senior)
- Duration: 3 Days
- Evaluation Criteria: Productivity, UX/UI Design, Code Quality, Technical Implementation, Performance
