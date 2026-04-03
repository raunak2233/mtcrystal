# MT Crystals - Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Overview

This is a fully functional e-commerce website built with Next.js 15, featuring:

- ✅ Product catalog with filtering and search
- ✅ Shopping cart with localStorage
- ✅ Checkout process
- ✅ Responsive design
- ✅ Premium animations and styling
- ✅ Multiple pages (Home, Products, Cart, Checkout, Benefits, Gallery, Contact, etc.)

## Key Features Implemented

### 1. Header
- Logo on left
- Search bar in center
- Account and cart icons on right (with cart count badge)
- Category navigation bar
- Mobile responsive menu

### 2. Homepage
- Full-page hero banner
- Best Sellers section (6 products)
- New Arrivals section (6 products)
- Testimonials section
- Brand Story section
- Contact banner
- Footer

### 3. Product Pages
- All products page with filtering and sorting
- Individual product detail pages
- Scrollable product images
- Add to cart and buy now buttons
- Related products section

### 4. Cart System
- Add/remove items
- Update quantities
- Persistent cart (localStorage)
- Real-time cart count in header
- Cart page with order summary
- Checkout page with form validation

### 5. Additional Pages
- Benefits page (crystal healing benefits)
- Gallery page (with category filtering)
- Testimonials page (customer reviews)
- Contact page (contact form + info)
- Account page (sign in/sign up UI)
- About page (company story)

## Data Structure

All data is stored in JSON files in the `/data` folder:

```
data/
├── products.json       # 10 products with full details
├── categories.json     # 8 product categories
├── benefits.json       # 7 crystal benefits
├── gallery.json        # 12 gallery images
├── testimonials.json   # 6 customer reviews
└── banners.json        # 4 carousel banner slides
```

## Styling

- **Fonts**: Playfair Display (headings) + Inter (body)
- **Colors**: Purple and pink gradient theme
- **Animations**: Fade-in, slide-in, scale effects
- **Cards**: Interactive with hover effects and shadows
- **Responsive**: Mobile-first design

## Cart Functionality

The cart uses localStorage for persistence:

```typescript
// Add to cart
addToCart(product);

// Remove from cart
removeFromCart(productId);

// Update quantity
updateQuantity(productId, newQuantity);

// Get cart total
getCartTotal();

// Get cart count
getCartCount();
```

## Pages Structure

```
/                    → Homepage
/products            → All products
/products/[id]       → Product detail
/cart                → Shopping cart
/checkout            → Checkout
/benefits            → Crystal benefits
/gallery             → Image gallery
/testimonials        → Customer reviews
/contact             → Contact form
/account             → Account management
/about               → About us
```

## Next Steps (Future Enhancements)

1. **Backend Integration**
   - User authentication (JWT/OAuth)
   - Database for products and orders
   - Order management system

2. **Payment Integration**
   - Razorpay/Stripe integration
   - Multiple payment methods
   - Order confirmation emails

3. **Additional Features**
   - Product reviews and ratings
   - Wishlist functionality
   - Order tracking
   - Admin dashboard
   - Inventory management
   - Email notifications

## Notes

- Authentication is UI-only (no backend)
- Cart uses localStorage (no database)
- Checkout is frontend-only (no payment processing)
- All images should be placed in `/public` folder

## Customization

### Adding New Banner Slides

Edit `data/banners.json`:

```json
{
  "id": "unique-id",
  "title": "Banner Title",
  "subtitle": "Banner subtitle text",
  "image": "/images/banner.jpg",
  "ctaText": "Primary Button",
  "ctaLink": "/products",
  "secondaryCtaText": "Secondary Button",
  "secondaryCtaLink": "/benefits"
}
```

### Adding New Products

Edit `data/products.json`:

```json
{
  "id": "unique-id",
  "name": "Product Name",
  "description": "Full description",
  "shortDesc": "Short description",
  "category": "category-slug",
  "price": 999,
  "image": "/path/to/image.jpg",
  "images": ["/path/to/image1.jpg", "/path/to/image2.jpg"],
  "stock": 20,
  "featured": true,
  "newArrival": false,
  "bestSeller": true,
  "bulletPoints": ["Point 1", "Point 2"]
}
```

### Adding New Categories

Edit `data/categories.json`:

```json
{
  "id": "category-id",
  "name": "Category Name",
  "slug": "category-slug",
  "description": "Category description"
}
```

### Updating Contact Information

Edit `app/contact/page.tsx` and `components/site-footer.tsx`

## Support

For any issues or questions, refer to the main README.md file.

## License

© 2024 MT Crystals. All rights reserved.
