# Banner Carousel Features

## Overview

The homepage now features a full-length, auto-playing image carousel banner that showcases multiple promotional slides.

## Features

### 🎠 Carousel Functionality
- **Auto-play**: Automatically transitions between slides every 5 seconds
- **Manual Navigation**: Left/right arrow buttons for manual control
- **Dot Indicators**: Click on dots to jump to specific slides
- **Slide Counter**: Shows current slide number (e.g., "1 / 4")
- **Pause on Hover**: Auto-play pauses when user hovers over the carousel
- **Smooth Transitions**: 1-second fade transition between slides

### 🎨 Visual Design
- **Full-width Layout**: Spans entire viewport width
- **600px Height**: Optimal viewing height for hero banners
- **Gradient Overlay**: Purple-to-pink gradient over each image for text readability
- **Responsive Design**: Adapts to all screen sizes
- **Professional Controls**: Semi-transparent navigation buttons with backdrop blur

### 📝 Content Structure
Each slide includes:
- **Title**: Large, bold headline (responsive text size)
- **Subtitle**: Supporting description text
- **Primary CTA**: Main call-to-action button (white background)
- **Secondary CTA**: Optional secondary button (outlined)
- **Background Image**: Full-cover image for each slide

### 🎯 Navigation Controls

#### Arrow Buttons
- Left/Right arrows on sides of carousel
- Semi-transparent white background with blur effect
- Hover effect: Scale up slightly
- Positioned at vertical center

#### Dot Indicators
- Located at bottom center
- Active dot: White, elongated (8px wide)
- Inactive dots: Semi-transparent white, circular (3px)
- Hover effect: Increased opacity
- Click to jump to specific slide

#### Slide Counter
- Top-right corner
- Shows "X / Y" format
- Semi-transparent black background with blur
- Always visible

## Data Structure

### Location
`data/banners.json`

### Schema
```json
{
  "id": "unique-id",
  "title": "Main headline text",
  "subtitle": "Supporting description",
  "image": "/path/to/image.jpg",
  "ctaText": "Primary button text",
  "ctaLink": "/link-url",
  "secondaryCtaText": "Secondary button text (optional)",
  "secondaryCtaLink": "/secondary-link (optional)"
}
```

### Current Slides

1. **Slide 1**: Discover the Healing Power of Crystals
   - Image: `/images/image1.png`
   - CTA: Shop Now → `/products`
   - Secondary: Learn More → `/benefits`

2. **Slide 2**: New Arrivals Collection
   - Image: `/images/kyanite-bgb.png`
   - CTA: View Collection → `/products?category=new`
   - Secondary: See Gallery → `/gallery`

3. **Slide 3**: Experience Crystal Healing
   - Image: `/images/aboutimg.jpg`
   - CTA: Explore Benefits → `/benefits`
   - Secondary: Our Story → `/about`

4. **Slide 4**: Handcrafted with Love Since 2017
   - Image: `/images/img.jpg`
   - CTA: Shop Best Sellers → `/products`
   - Secondary: Contact Us → `/contact`

## Component Details

### File Location
`components/banner-carousel.tsx`

### Key Features
- Client-side component (`"use client"`)
- React hooks for state management
- Auto-play with cleanup
- Keyboard navigation ready (can be added)
- Accessibility labels on all controls

### State Management
```typescript
const [currentSlide, setCurrentSlide] = useState(0);
const [isAutoPlaying, setIsAutoPlaying] = useState(true);
```

### Auto-play Logic
- Interval: 5000ms (5 seconds)
- Pauses on mouse enter
- Resumes on mouse leave
- Cleans up interval on unmount

## Customization

### Change Auto-play Speed
Edit the interval in `components/banner-carousel.tsx`:
```typescript
const interval = setInterval(() => {
  nextSlide();
}, 5000); // Change this value (in milliseconds)
```

### Change Transition Speed
Edit the transition duration in the component:
```typescript
className="transition-opacity duration-1000" // Change duration-1000
```

### Add More Slides
Simply add more objects to `data/banners.json`:
```json
{
  "id": "5",
  "title": "New Slide Title",
  "subtitle": "New slide description",
  "image": "/images/new-banner.jpg",
  "ctaText": "Click Here",
  "ctaLink": "/destination"
}
```

### Change Banner Height
Edit the height class in `components/banner-carousel.tsx`:
```typescript
className="relative h-[600px] w-full overflow-hidden"
// Change h-[600px] to desired height
```

## Responsive Behavior

### Desktop (>1024px)
- Full 600px height
- Large text sizes (text-6xl for title)
- Both CTA buttons visible side-by-side
- Arrow buttons on far left/right

### Tablet (768px - 1024px)
- Full 600px height
- Medium text sizes (text-5xl for title)
- Buttons may wrap to two rows
- Arrow buttons slightly inset

### Mobile (<768px)
- Full 600px height (can be adjusted)
- Smaller text sizes (text-4xl for title)
- Buttons stack vertically
- Smaller arrow buttons
- Dots remain visible

## Performance Considerations

- **Priority Loading**: First slide image loads with `priority` flag
- **Lazy Loading**: Other slides load normally
- **Optimized Images**: Use Next.js Image component for optimization
- **Smooth Transitions**: CSS transitions for better performance
- **Cleanup**: Proper interval cleanup prevents memory leaks

## Accessibility

- **ARIA Labels**: All navigation buttons have descriptive labels
- **Keyboard Navigation**: Can be enhanced with arrow key support
- **Focus Management**: Buttons are keyboard accessible
- **Screen Readers**: Proper semantic HTML structure

## Future Enhancements

Potential additions:
- Keyboard arrow key navigation
- Touch/swipe gestures for mobile
- Progress bar showing time until next slide
- Thumbnail preview on hover
- Video slide support
- Parallax scrolling effect
- Ken Burns effect (zoom animation)

## Browser Support

Works on all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Testing Checklist

- [ ] All slides display correctly
- [ ] Auto-play works (5-second intervals)
- [ ] Pause on hover works
- [ ] Arrow navigation works
- [ ] Dot navigation works
- [ ] Slide counter updates correctly
- [ ] CTA buttons link to correct pages
- [ ] Responsive on mobile devices
- [ ] Images load properly
- [ ] Transitions are smooth
- [ ] No console errors

---

The carousel is fully functional and ready to use. Simply update `data/banners.json` to add or modify slides!
