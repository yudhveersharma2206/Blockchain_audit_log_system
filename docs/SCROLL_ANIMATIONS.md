# Scroll Animations Documentation

## Overview
The Blockchain Audit Log System now features smooth scroll-triggered animations that make the UI more engaging and interactive. When users scroll down the page, elements like cards, tables, and stats smoothly slide in from different directions.

## Animation Features

### 1. **Scroll-Triggered Animations**
Elements automatically animate into view when they enter the user's viewport as they scroll down the page.

#### Animation Types:
- **Bottom Slide**: Elements slide up from the bottom (main animation)
- **Left Slide**: Statistics with odd indices slide in from the left
- **Right Slide**: Statistics with even indices slide in from the right

### 2. **Implemented Pages**
All pages now include scroll animations:

| Page | Animated Components |
|------|-------------------|
| **Dashboard** | Stats cards, blockchain visualization, block table, status card |
| **Analytics** | Stats cards, user/action tables |
| **Verify** | Verification results, info cards, blockchain structure |
| **RiskMonitor** | Risk assessment, high-risk/suspicious blocks tables |
| **BlockDetails** | Block info, JSON view |
| **AddBlock** | Form card |
| **UserManagement** | Form card, users table, role descriptions |
| **Login** | Login form card |

## Technical Implementation

### Intersection Observer API
The animations use the `Intersection Observer API` to detect when elements enter the viewport:

```javascript
// Observer options
const observerOptions = {
  threshold: 0.1,           // Trigger when 10% visible
  rootMargin: "0px 0px -100px 0px"  // Offset bottom margin
};

// Observe elements
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("scroll-animate-in");
      observer.unobserve(entry.target);  // Stop observing once animated
    }
  });
}, observerOptions);
```

### CSS Animations
Located in `frontend/src/styles/App.css`:

```css
/* Initial state - hidden and offset */
.scroll-animate {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

/* Animated state - visible and in place */
.scroll-animate-in {
  animation: slideInFromBottom 0.8s ease-out forwards;
}

/* Keyframe animations */
@keyframes slideInFromBottom {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInFromLeft {
  from {
    opacity: 0;
    transform: translateX(-100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInFromRight {
  from {
    opacity: 0;
    transform: translateX(100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

### Component Implementation
Each page includes:

1. **useRef Hook**: To reference the container
2. **useEffect with setupScrollAnimations()**: Initializes observers
3. **scroll-animate Class**: Applied to animatable elements
4. **containerRef**: Passed to main container div

Example:
```javascript
const containerRef = useRef(null);

useEffect(() => {
  setupScrollAnimations();
}, []);

const setupScrollAnimations = () => {
  if (!containerRef.current) return;
  // Observer setup code...
};

// In JSX:
<div className="container" ref={containerRef}>
  <div className="card scroll-animate">Content</div>
</div>
```

## Performance Considerations

### Optimization Features:
- **One-time Animation**: Each element animates only once (observer unobserves after)
- **Efficient Querying**: Uses CSS selectors to batch select elements
- **Throttled Execution**: IntersectionObserver is inherently throttled
- **GPU Acceleration**: Uses `transform` and `opacity` for smooth 60fps animations

### Browser Support:
- IntersectionObserver API is supported in all modern browsers
- Fallback: Elements without animation still display correctly

## Animation Parameters

| Parameter | Value | Effect |
|-----------|-------|--------|
| threshold | 0.1 | Trigger when 10% of element is visible |
| rootMargin | "0px 0px -100px 0px" | Start animation 100px before bottom |
| duration | 0.6s - 0.8s | Smooth, noticeable animations |
| easing | ease-out | Natural deceleration |
| translateY | 30px - 50px | Visible movement before animation |

## Customization Guide

### Adjust Animation Speed
Modify the `transition` and `animation` in CSS:
```css
.scroll-animate {
  transition: opacity 0.3s ease, transform 0.3s ease; /* Faster */
}

@keyframes slideInFromBottom {
  animation: 0.4s ease-out forwards; /* Faster */
}
```

### Adjust Animation Distance
Change `translateY` and `translateX` values:
```css
@keyframes slideInFromBottom {
  from {
    transform: translateY(100px); /* Longer distance */
  }
}
```

### Adjust Threshold
```javascript
const observerOptions = {
  threshold: 0.5, // Trigger when 50% visible (more conservative)
};
```

### Add to More Elements
Simply add `scroll-animate` class to any element:
```jsx
<div className="stat-card scroll-animate">...</div>
<table className="scroll-animate">...</table>
```

## User Experience Benefits

1. **Visual Feedback**: Users see immediate feedback as they scroll
2. **Engagement**: Animations make the interface feel more responsive
3. **Content Hierarchy**: Staggered animations guide user attention
4. **Professional Polish**: Smooth animations enhance perceived quality
5. **Mobile Friendly**: Optimized for touch devices and lower-end phones

## Debugging

### Check if Animation Triggers
1. Open DevTools (F12)
2. Right-click element → Inspect
3. Look for `scroll-animate-in` class when element enters viewport
4. Check CSS in Elements panel for animation rules

### Animation Not Playing?
- Verify `scroll-animate` class is applied
- Check if element is visible in viewport
- Ensure CSS is loaded (check Network tab)
- Verify browser supports IntersectionObserver

### Performance Issues?
- Reduce number of animated elements
- Increase `threshold` value
- Decrease animation duration
- Use `will-change` CSS property sparingly

## Future Enhancements

- [ ] Parallax scrolling for backgrounds
- [ ] Staggered animations for list items
- [ ] Scroll progress indicator
- [ ] Smooth scroll anchor navigation
- [ ] Spring physics animations
- [ ] Reduced motion preference support

---

**Last Updated**: March 2026
**Version**: 1.0
**Status**: Production Ready
