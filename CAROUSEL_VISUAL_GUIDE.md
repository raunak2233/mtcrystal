# Banner Carousel - Visual Guide

## Carousel Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                            [1 / 4]   │ ← Slide Counter
│                                                                      │
│   [◄]                                                          [►]   │ ← Arrow Buttons
│                                                                      │
│                                                                      │
│        ┌──────────────────────────────────────────────┐            │
│        │                                               │            │
│        │   Discover the Healing Power of Crystals     │            │ ← Title
│        │                                               │            │
│        │   Handcrafted crystal bracelets designed     │            │ ← Subtitle
│        │   to bring balance, harmony, and positive    │            │
│        │   energy into your life.                     │            │
│        │                                               │            │
│        │   ┌──────────────┐  ┌──────────────┐        │            │
│        │   │  Shop Now ►  │  │  Learn More  │        │            │ ← CTA Buttons
│        │   └──────────────┘  └──────────────┘        │            │
│        │                                               │            │
│        └──────────────────────────────────────────────┘            │
│                                                                      │
│                                                                      │
│                          ● ○ ○ ○                                    │ ← Dot Indicators
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Slide Transitions

### Slide 1 → Slide 2 (Auto-play after 5 seconds)

```
Slide 1 (Fading Out)                    Slide 2 (Fading In)
┌─────────────────────┐                ┌─────────────────────┐
│ Discover Healing... │  ──────────►   │ New Arrivals...     │
│ [Opacity: 100%]     │   1 second     │ [Opacity: 0%]       │
│                     │   transition   │                     │
└─────────────────────┘                └─────────────────────┘
         ↓                                      ↓
┌─────────────────────┐                ┌─────────────────────┐
│ Discover Healing... │                │ New Arrivals...     │
│ [Opacity: 50%]      │                │ [Opacity: 50%]      │
│                     │                │                     │
└─────────────────────┘                └─────────────────────┘
         ↓                                      ↓
┌─────────────────────┐                ┌─────────────────────┐
│ Discover Healing... │                │ New Arrivals...     │
│ [Opacity: 0%]       │                │ [Opacity: 100%]     │
│                     │                │                     │
└─────────────────────┘                └─────────────────────┘
```

## Interactive Elements

### 1. Arrow Buttons

```
Normal State:
┌─────┐
│  ◄  │  ← Semi-transparent white
└─────┘     with backdrop blur

Hover State:
┌─────┐
│  ◄  │  ← Slightly more opaque
└─────┘     Scales up 110%
```

### 2. Dot Indicators

```
Normal State:
○ ○ ○ ○  ← All inactive (semi-transparent)

Active State:
● ○ ○ ○  ← First dot active (white, elongated)

Hover State:
◐ ○ ○ ○  ← Hovered dot more opaque
```

### 3. Slide Counter

```
┌───────┐
│ 1 / 4 │  ← Black background with blur
└───────┘     White text
```

## User Interactions

### Mouse Hover
```
User hovers over carousel
         ↓
Auto-play PAUSES
         ↓
User moves mouse away
         ↓
Auto-play RESUMES
```

### Click Arrow
```
User clicks right arrow (►)
         ↓
Current slide fades out
         ↓
Next slide fades in
         ↓
Auto-play STOPS
```

### Click Dot
```
User clicks dot #3
         ↓
Jump directly to slide 3
         ↓
Smooth fade transition
         ↓
Auto-play STOPS
```

## Slide Content Structure

```
┌─────────────────────────────────────────────────────────┐
│                                                          │
│  Background Image (Full Cover)                          │
│  ┌────────────────────────────────────────────────┐    │
│  │ Gradient Overlay (Purple → Pink, 80% opacity)  │    │
│  │                                                 │    │
│  │  ┌──────────────────────────────────────────┐  │    │
│  │  │ Content Container (Max-width: 2xl)       │  │    │
│  │  │                                           │  │    │
│  │  │  Title (text-6xl, bold, white)           │  │    │
│  │  │  Subtitle (text-2xl, white)              │  │    │
│  │  │                                           │  │    │
│  │  │  ┌──────────────┐  ┌──────────────┐     │  │    │
│  │  │  │ Primary CTA  │  │ Secondary CTA│     │  │    │
│  │  │  │ (White bg)   │  │ (Outlined)   │     │  │    │
│  │  │  └──────────────┘  └──────────────┘     │  │    │
│  │  │                                           │  │    │
│  │  └──────────────────────────────────────────┘  │    │
│  │                                                 │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Responsive Layouts

### Desktop (>1024px)
```
┌─────────────────────────────────────────────────────────┐
│ [◄]                                               [►]   │
│                                                          │
│     Title (text-6xl)                                    │
│     Subtitle (text-2xl)                                 │
│     [Primary CTA]  [Secondary CTA]                      │
│                                                          │
│                    ● ○ ○ ○                              │
└─────────────────────────────────────────────────────────┘
```

### Tablet (768px - 1024px)
```
┌──────────────────────────────────────────────┐
│[◄]                                      [►]  │
│                                              │
│   Title (text-5xl)                          │
│   Subtitle (text-xl)                        │
│   [Primary CTA]  [Secondary CTA]            │
│                                              │
│              ● ○ ○ ○                        │
└──────────────────────────────────────────────┘
```

### Mobile (<768px)
```
┌────────────────────────────────┐
│[◄]                        [►]  │
│                                │
│  Title (text-4xl)             │
│  Subtitle (text-lg)           │
│                                │
│  [Primary CTA]                │
│  [Secondary CTA]              │
│                                │
│        ● ○ ○ ○                │
└────────────────────────────────┘
```

## Animation Timeline

```
Time: 0s
├─ Slide 1 visible (opacity: 100%)
│
Time: 5s (Auto-play trigger)
├─ Fade transition starts
│  ├─ Slide 1: opacity 100% → 0%
│  └─ Slide 2: opacity 0% → 100%
│
Time: 6s (Transition complete)
├─ Slide 2 visible (opacity: 100%)
│
Time: 11s (Auto-play trigger)
├─ Fade transition starts
│  ├─ Slide 2: opacity 100% → 0%
│  └─ Slide 3: opacity 0% → 100%
│
Time: 12s (Transition complete)
├─ Slide 3 visible (opacity: 100%)
│
... continues cycling through all slides
```

## Z-Index Layers

```
Layer 5: Navigation Controls (z-20)
         ├─ Arrow buttons
         ├─ Dot indicators
         └─ Slide counter

Layer 4: Active Slide Content (z-10)
         └─ Text and buttons

Layer 3: Active Slide Gradient (z-10)
         └─ Purple-pink overlay

Layer 2: Active Slide Image (z-10)
         └─ Background image

Layer 1: Inactive Slides (z-0)
         └─ Hidden slides (opacity: 0)
```

## Color Scheme

```
Background Images:
├─ Full saturation
└─ Covered by gradient

Gradient Overlay:
├─ From: Purple-900 (80% opacity)
└─ To: Pink-900 (60% opacity)

Text:
├─ Title: White
├─ Subtitle: Gray-100
└─ All text has high contrast

Buttons:
├─ Primary: White background, Purple-900 text
└─ Secondary: White border, White text

Navigation:
├─ Arrows: White/20 background, White text
├─ Dots Active: White
├─ Dots Inactive: White/50
└─ Counter: Black/30 background, White text
```

## Performance Metrics

```
Initial Load:
├─ First slide image: Priority load
├─ Other slides: Lazy load
└─ Component JS: ~5KB

Runtime:
├─ Transition: 1 second (CSS)
├─ Auto-play interval: 5 seconds
└─ Memory: Minimal (cleanup on unmount)

Optimization:
├─ Next.js Image optimization
├─ CSS transitions (GPU accelerated)
└─ Proper event cleanup
```

---

This visual guide shows exactly how the carousel looks and behaves on the homepage!
