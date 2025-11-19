# 🚀 Cleanstore Frontend - Installation Guide

Complete Next.js 14 e-commerce frontend for Cleanstore Retail.

## 📋 Prerequisites

- Node.js 18+ installed
- Backend NestJS API running on `http://localhost:4000`
- MinIO server running on `http://localhost:9000`

## 🛠️ Installation

### 1. Install Dependencies

```bash
cd Cleanstore-Retail/frontend
npm install
```

### 2. Environment Setup

The frontend is configured to connect to:
- **Backend API**: `http://localhost:4000`
- **MinIO Images**: `http://localhost:9000/cleanstore/`

If you need to change these URLs, modify:
- `src/lib/api.ts` for API endpoints
- `next.config.js` for image domains

### 3. Start Development Server

```bash
npm run dev
```

The frontend will be available at: `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js 14 App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── globals.css        # Global styles (OKLCH theme)
│   ├── productos/         # Products pages
│   ├── categorias/        # Categories pages
│   ├── carrito/           # Shopping cart
│   ├── checkout/          # Checkout process
│   ├── exito/             # Payment success
│   └── error-pago/        # Payment error
├── components/            # Reusable components
│   ├── layout/           # Layout components
│   ├── products/         # Product components
│   ├── categories/       # Category components
│   ├── cart/             # Cart components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utilities
│   ├── api.ts            # API client
│   └── utils.ts          # Helper functions
├── store/                # State management
│   └── cart.ts           # Cart store (Zustand)
└── types/                # TypeScript types
```

## 🎨 Features Implemented

### ✅ **Pages**
- **Home** (`/`) - Hero, featured products, categories, offers
- **Products Catalog** (`/productos`) - All products with filters
- **Product Detail** (`/productos/[id]`) - Image carousel, add to cart
- **Category View** (`/categorias/[id]`) - Products by category
- **Shopping Cart** (`/carrito`) - Cart management
- **Checkout** (`/checkout`) - Customer form, WebPay integration
- **Success** (`/exito`) - Payment confirmation
- **Error** (`/error-pago`) - Payment failure handling

### ✅ **Components**
- **Navbar** - Search, cart, theme toggle, mobile menu
- **Footer** - Links, contact info, branding
- **ProductCard** - Product display with badges, pricing
- **CategoryCard** - Category navigation
- **CartSheet** - Slide-out cart panel
- **Theme Toggle** - Dark/light mode switcher

### ✅ **Functionality**
- **Cart Management** - Add/remove/update items (localStorage)
- **Search & Filters** - Category, price, sorting
- **Responsive Design** - Mobile-first approach
- **Theme Support** - OKLCH Modern Minimal theme
- **API Integration** - Complete backend connectivity
- **Payment Flow** - WebPay Plus integration
- **Error Handling** - Graceful error boundaries
- **Loading States** - Skeleton loaders

## 🔌 API Integration

### Backend Endpoints Used

```typescript
// Products
GET /productos              # All products
GET /productos/:id          # Product detail
GET /productos/destacados   # Featured products
GET /productos/ofertas      # Sale products
GET /productos/categoria/:id # Products by category

// Categories
GET /categorias             # All categories
GET /categorias/:id         # Category detail

// Orders
POST /pedidos               # Create order
GET /pedidos/:id            # Order detail

// Payments
POST /pagos/iniciar/:id     # Initiate payment
POST /pagos/confirmar/:token # Confirm payment

// Images
POST /imagenes/upload/:id   # Upload images
```

### API Client Configuration

The API client (`src/lib/api.ts`) includes:
- Axios configuration
- TypeScript interfaces
- Error handling
- Request/response interceptors

## 🛒 Cart Management

### Zustand Store Features

```typescript
// Cart operations
addItem(producto, cantidad)     # Add product to cart
removeItem(productId)           # Remove product
updateQuantity(id, cantidad)    # Update quantity
clearCart()                     # Empty cart
toggleCart()                    # Open/close cart panel

// Computed values
getTotalItems()                 # Total item count
getTotalPrice()                 # Total price
getItemQuantity(productId)      # Quantity of specific item
```

### Persistence
- Cart data persists in `localStorage`
- Automatic rehydration on page load
- Cross-tab synchronization

## 🎨 Styling & Theme

### OKLCH Modern Minimal Theme
- Light and dark mode support
- Consistent color palette
- Smooth transitions
- Accessible contrast ratios

### Tailwind CSS Classes
```css
/* Primary colors */
bg-primary text-primary-foreground
bg-secondary text-secondary-foreground

/* Status colors */
bg-destructive text-destructive-foreground
bg-muted text-muted-foreground

/* Interactive states */
hover:bg-primary/90
focus:ring-2 focus:ring-ring
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px  
- **Desktop**: > 1024px

### Grid Layouts
```css
/* Product grids */
grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4

/* Category grids */
grid-cols-2 md:grid-cols-3 lg:grid-cols-6
```

## 🔄 State Management

### Cart State (Zustand)
- Global cart state
- Persistent storage
- Type-safe operations
- Reactive updates

### Local State (React)
- Component-level state
- Form handling
- Loading states
- Error states

## 🚀 Performance Optimizations

### Image Optimization
- Next.js Image component
- Lazy loading
- Responsive images
- WebP format support

### Code Splitting
- Route-based splitting
- Dynamic imports
- Lazy loading components

### Caching
- API response caching
- Static asset caching
- Browser caching headers

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Development Tools
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Hot reload for development

## 🔒 Security

### Data Protection
- Input validation with Zod
- XSS prevention
- CSRF protection
- Secure API communication

### Payment Security
- WebPay Plus integration
- No card data storage
- Secure redirects
- Error handling

## 🌐 SEO & Accessibility

### SEO Features
- Meta tags optimization
- Structured data
- Semantic HTML
- Clean URLs

### Accessibility
- ARIA labels
- Keyboard navigation
- Screen reader support
- Color contrast compliance

## 🐛 Troubleshooting

### Common Issues

**1. API Connection Errors**
```bash
# Check if backend is running
curl http://localhost:4000/productos

# Verify CORS settings in backend
```

**2. Image Loading Issues**
```bash
# Check MinIO server
curl http://localhost:9000

# Verify image URLs in database
```

**3. Cart Not Persisting**
```javascript
// Clear localStorage if corrupted
localStorage.removeItem('cleanstore-cart')
```

**4. Theme Not Working**
```bash
# Check if theme provider is properly configured
# Verify CSS variables are loaded
```

## 📦 Production Deployment

### Build Process
```bash
npm run build
npm run start
```

### Environment Variables
```env
# Production API URL
NEXT_PUBLIC_API_URL=https://api.cleanstore.cl

# Production image domain
NEXT_PUBLIC_IMAGE_DOMAIN=images.cleanstore.cl
```

### Performance Checklist
- [ ] Images optimized
- [ ] Bundle size analyzed
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals passing
- [ ] Error boundaries implemented
- [ ] Loading states added

## 🎯 Next Steps

### Potential Enhancements
- [ ] User authentication system
- [ ] Order tracking
- [ ] Product reviews
- [ ] Wishlist functionality
- [ ] Advanced search
- [ ] Product recommendations
- [ ] Multi-language support
- [ ] PWA features

### Performance Improvements
- [ ] Implement ISR (Incremental Static Regeneration)
- [ ] Add service worker
- [ ] Optimize bundle size
- [ ] Add CDN integration

## 📞 Support

For issues or questions:
- Check the troubleshooting section
- Review the API documentation
- Verify backend connectivity
- Check browser console for errors

---

## ✅ **Frontend Complete!**

The Cleanstore frontend is now fully functional with:
- 🎨 Modern OKLCH theme
- 🛒 Complete shopping experience
- 📱 Responsive design
- 🔌 Full API integration
- 💳 WebPay payment processing
- 🚀 Production-ready code

**Ready to launch!** 🎉