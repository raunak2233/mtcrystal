# MT Crystals - E-commerce Website

A modern, full-featured e-commerce website for MT Crystals (Miracle Touch Crystals), specializing in handcrafted crystal bracelets.

## Features

### 🛍️ E-commerce Functionality
- **Product Catalog**: Browse all products with filtering by category
- **Product Details**: Detailed product pages with image galleries, descriptions, and benefits
- **Shopping Cart**: Full cart functionality with localStorage persistence
- **Checkout Process**: Complete checkout flow with form validation
- **Search**: Real-time product search functionality

### 🎨 Design & UX
- **Premium Fonts**: Playfair Display for headings, Inter for body text
- **Smooth Animations**: Fade-in, slide-in, and scale animations throughout
- **Responsive Design**: Mobile-first approach, works on all devices
- **Interactive Cards**: Hover effects and shadows on product cards
- **Color Theme**: Soothing purple and pink gradient theme

### 📄 Pages
- **Home**: Hero banner, best sellers, new arrivals, testimonials, brand story
- **Products**: Filterable product listing with sorting options
- **Product Detail**: Individual product pages with add to cart and buy now
- **Cart**: Shopping cart with quantity management
- **Checkout**: Complete checkout form (COD payment)
- **Benefits**: Crystal healing benefits with detailed descriptions
- **Gallery**: Image gallery with category filtering
- **Testimonials**: Customer reviews and ratings
- **Contact**: Contact form with business information
- **Account**: Sign in/Sign up pages (UI only, backend not implemented)

### 🎯 Header Features
- Logo on the left
- Search bar in the center
- Account and cart icons on the right (with cart count badge)
- Category navigation bar below main header
- Mobile-responsive menu

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Icons**: Lucide React
- **Notifications**: Sonner (toast notifications)
- **State Management**: React hooks + localStorage for cart

## Project Structure

```
├── app/                      # Next.js app directory
│   ├── account/             # Account management page
│   ├── benefits/            # Benefits page
│   ├── cart/                # Shopping cart page
│   ├── checkout/            # Checkout page
│   ├── contact/             # Contact page
│   ├── gallery/             # Gallery page
│   ├── products/            # Products listing and detail pages
│   ├── testimonials/        # Testimonials page
│   ├── layout.tsx           # Root layout with header/footer
│   ├── page.tsx             # Homepage
│   └── globals.css          # Global styles and animations
│
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── ecommerce-header.tsx # Main header component
│   ├── product-card.tsx     # Product card component
│   ├── site-footer.tsx      # Footer component
│   └── loading.tsx          # Loading component
│
├── data/                    # JSON data files
│   ├── products.json        # Product catalog
│   ├── categories.json      # Product categories
│   ├── benefits.json        # Crystal benefits
│   ├── gallery.json         # Gallery images
│   ├── testimonials.json    # Customer testimonials
│   └── banners.json         # Homepage carousel banners
│
├── lib/                     # Utility functions
│   ├── cart.ts              # Cart management functions
│   └── utils.ts             # General utilities
│
└── public/                  # Static assets
    ├── bracelets/           # Product images
    └── images/              # Other images
```

## Data Structure

All data is stored in JSON files in the `/data` folder:

- **products.json**: Product information including name, description, price, images, category, stock, etc.
- **categories.json**: Product categories with descriptions
- **benefits.json**: Crystal healing benefits with images and descriptions
- **gallery.json**: Gallery images with titles and categories
- **testimonials.json**: Customer reviews with ratings and dates
- **banners.json**: Homepage carousel banner slides with images and CTAs

## Cart System

The cart system uses localStorage for persistence:
- Add/remove items
- Update quantities
- Calculate totals
- Persist across page refreshes
- Real-time cart count badge in header

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Future Enhancements

- Backend integration for authentication
- Payment gateway integration (Razorpay, Stripe)
- Order management system
- Wishlist functionality
- Product reviews and ratings
- Email notifications
- Admin dashboard
- Inventory management

## Notes

- Authentication pages are UI-only (no backend)
- Cart uses localStorage (no database)
- Checkout is frontend-only (no payment processing)
- All product data is in JSON files

## License

© 2024 MT Crystals - Miracle Touch Crystals. All rights reserved.
