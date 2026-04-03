# Quick Reference Guide

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📍 Important URLs

- Homepage: `http://localhost:3000/`
- Products: `http://localhost:3000/products`
- Cart: `http://localhost:3000/cart`
- Checkout: `http://localhost:3000/checkout`
- Benefits: `http://localhost:3000/benefits`
- Gallery: `http://localhost:3000/gallery`
- Contact: `http://localhost:3000/contact`
- Account: `http://localhost:3000/account`
- About: `http://localhost:3000/about`

## 🗂️ Data Files Location

All data is in the `/data` folder:

```
data/products.json       → Product catalog
data/categories.json     → Product categories
data/benefits.json       → Crystal benefits
data/gallery.json        → Gallery images
data/testimonials.json   → Customer reviews
data/banners.json        → Homepage carousel banners
```

## 🛒 Cart Functions

```typescript
import { addToCart, removeFromCart, updateQuantity, getCart, getCartTotal, getCartCount, clearCart } from '@/lib/cart';

// Add product to cart
addToCart({
  id: "1",
  name: "Product Name",
  price: 799,
  image: "/path/to/image.jpg"
});

// Remove from cart
removeFromCart("1");

// Update quantity
updateQuantity("1", 3);

// Get all cart items
const cart = getCart();

// Get cart total
const total = getCartTotal();

// Get cart count
const count = getCartCount();

// Clear cart
clearCart();
```

## 🎨 Color Palette

```css
/* Primary Colors */
Purple-600: #7c3aed
Purple-700: #6d28d9
Pink-600: #db2777
Pink-700: #be185d

/* Background */
Gray-50: #f9fafb
White: #ffffff

/* Text */
Gray-700: #374151
Gray-900: #111827
```

## 📱 Responsive Breakpoints

```css
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1400px /* Container max width */
```

## 🎭 Animation Classes

```css
.animate-fade-in        /* Fade in from bottom */
.animate-slide-in-left  /* Slide from left */
.animate-slide-in-right /* Slide from right */
.animate-scale-in       /* Scale up */
.animate-spin-slow      /* Slow rotation */
```

## 🧩 Key Components

```typescript
// Product Card
<ProductCard product={product} />

// Header
<EcommerceHeader />

// Footer
<SiteFooter />

// Loading
<Loading />
```

## 📦 Adding New Banner Slides

Edit `data/banners.json`:

```json
{
  "id": "unique-id",
  "title": "Banner Title",
  "subtitle": "Banner subtitle or description",
  "image": "/images/banner.jpg",
  "ctaText": "Primary Button Text",
  "ctaLink": "/link-url",
  "secondaryCtaText": "Secondary Button Text",
  "secondaryCtaLink": "/secondary-link"
}
```

## 📦 Adding New Products

Edit `data/products.json`:

```json
{
  "id": "unique-id",
  "name": "Product Name",
  "description": "Full description",
  "shortDesc": "Short description",
  "category": "category-slug",
  "price": 999,
  "image": "/bracelets/image.jpg",
  "images": ["/bracelets/image.jpg"],
  "stock": 20,
  "featured": true,
  "newArrival": false,
  "bestSeller": true,
  "bulletPoints": [
    "Benefit 1",
    "Benefit 2",
    "Benefit 3"
  ]
}
```

## 🏷️ Adding New Categories

Edit `data/categories.json`:

```json
{
  "id": "category-id",
  "name": "Category Name",
  "slug": "category-slug",
  "description": "Category description"
}
```

## 🖼️ Image Locations

```
public/
├── bracelets/          → Product images
│   ├── amethyst.png
│   ├── tigereye.png
│   └── ...
└── images/             → Other images
    ├── aboutimg.jpg
    ├── benefit2.png
    └── ...
```

## 🔧 Common Tasks

### Update Contact Info
- Edit: `app/contact/page.tsx`
- Edit: `components/site-footer.tsx`

### Update Logo
- Edit: `components/logo.tsx`

### Update Homepage Hero
- Edit: `app/page.tsx` (Hero Section)

### Update Colors
- Edit: `tailwind.config.ts`
- Edit: `app/globals.css`

### Add New Page
1. Create file: `app/newpage/page.tsx`
2. Add link in header: `components/ecommerce-header.tsx`
3. Add link in footer: `components/site-footer.tsx`

## 🐛 Troubleshooting

### Cart not updating?
- Check browser console for errors
- Clear localStorage: `localStorage.clear()`
- Refresh the page

### Images not showing?
- Verify image path starts with `/`
- Check file exists in `public/` folder
- Verify image extension matches

### Build errors?
- Run: `npm run build`
- Check for TypeScript errors
- Verify all imports are correct

## 📚 Documentation

- Next.js: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Radix UI: https://www.radix-ui.com/
- shadcn/ui: https://ui.shadcn.com/

## 💡 Tips

1. Use `getDiagnostics` to check for errors
2. Test on mobile devices
3. Optimize images before adding
4. Keep data files organized
5. Use TypeScript for type safety
6. Follow existing code patterns
7. Test cart functionality thoroughly

## 🎯 Key Features

✅ Responsive design
✅ Cart persistence
✅ Search functionality
✅ Category filtering
✅ Product sorting
✅ Toast notifications
✅ Loading states
✅ Form validation
✅ SEO friendly
✅ Fast performance

---

For detailed information, see:
- `README.md` - Full documentation
- `SETUP.md` - Setup instructions
- `PROJECT_SUMMARY.md` - Complete feature list
