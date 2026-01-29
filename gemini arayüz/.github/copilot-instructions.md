# 3D-LABX Landing Page - AI Agent Instructions

## Project Overview
This is a Turkish React landing page for 3D-LABX, an industrial 3D printing company. The application showcases manufacturing services using a modern bento-grid layout with Turkish language content.

## Architecture
- **Single Component App**: All UI logic contained in `gemini` (React component)
- **Inline Styling**: CSS animations and styles embedded directly in JSX
- **No Build System**: Requires manual React project setup (Create React App or Vite)

## Key Design Patterns

### Color Scheme
- Primary: Blue (`blue-600`, `blue-50`, etc.)
- Accent: Orange (`orange-500`, `orange-100`, etc.)
- Background: Light gray (`#FBFBFD`, `gray-100`)
- Text: Dark slate (`slate-900`, `slate-500`)

### Component Structure
```jsx
const BentoItem = ({ title, description, icon: Icon, className, color = "blue", badge }) => (
  <div className={`group relative overflow-hidden rounded-[2.5rem] p-8 transition-all duration-700 hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] bg-white border border-gray-100 ${className}`}>
    {badge && (
      <span className="absolute top-6 right-8 bg-orange-100 text-orange-600 text-[10px] font-black px-3 py-1 rounded-full tracking-widest uppercase z-10">
        {badge}
      </span>
    )}
    <div className={`mb-6 inline-flex items-center justify-center rounded-2xl p-4 bg-${color}-50 text-${color}-600 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
      <Icon size={32} />
    </div>
    <h3 className="mb-3 text-2xl font-bold text-slate-900 tracking-tight">{title}</h3>
    <p className="text-slate-500 leading-relaxed text-sm md:text-base font-medium">{description}</p>
    <div className="mt-8 flex items-center text-sm font-bold text-slate-400 group-hover:text-blue-600 transition-colors cursor-pointer">
      Detayları İncele <ChevronRight size={16} className="ml-1 group-hover:translate-x-2 transition-transform" />
    </div>
    <div className={`absolute -bottom-12 -right-12 w-32 h-32 bg-${color}-50 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-700`}></div>
  </div>
);
```

### Layout System
- Bento grid using CSS Grid: `grid-cols-1 md:grid-cols-12`
- Responsive breakpoints: `md:`, `lg:`
- Container: `container mx-auto px-6`

### Typography
- Font: Inter (imported via Google Fonts)
- Weights: `font-black` (900), `font-bold` (700), `font-medium` (500)
- Sizes: Large headings (`text-5xl lg:text-[84px]`), body text (`text-lg lg:text-xl`)
- Turkish text throughout - maintain proper Turkish characters

### Animations
- Custom CSS keyframes: `float`, `bounce-slow`, `fadeIn`
- Hover effects: scale, rotate, translate transforms
- Duration: `duration-700`, `duration-500`

## Development Workflow

### Project Setup
```bash
npx create-react-app . --template typescript  # or vite
npm install lucide-react tailwindcss
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Tailwind Configuration
```js
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
}
```

### Build Commands
```bash
npm start    # Development server
npm run build # Production build
```

## Code Conventions

### Icon Usage
- Import from `lucide-react`: `import { Box, Cpu, Layers } from 'lucide-react'`
- Size: `size={32}` for main icons, `size={24}` for secondary
- Color: Inherit from parent or use `text-{color}-600`

### Turkish Content
- All user-facing text in Turkish
- Company name: "3D-LABX" (with orange "X")
- Maintain professional, technical tone
- Examples: "Hayallerinizi Gerçekliğe Basıyoruz", "Endüstriyel 3D Baskı"

### Responsive Design
- Mobile-first approach with `md:` and `lg:` breakpoints
- Bento grid adapts: `md:col-span-8`, `md:row-span-2`
- Mobile navigation: Fixed bottom bar with central CTA button

### State Management
- Simple `useState` for scroll detection and tab switching
- No complex state - keep it minimal

## File Structure
```
c:\gemini arayüz\
├── gemini (main React component)
├── .github/
│   └── copilot-instructions.md
└── [future build files: package.json, tailwind.config.js, etc.]
```

## Common Tasks
- **Add Service**: Use `BentoItem` component in the grid section
- **Update Colors**: Change blue/orange theme variables consistently
- **Add Animation**: Use existing CSS classes or add new keyframes
- **Responsive**: Test grid layout on different screen sizes

## Dependencies
- `react`: ^18.0.0
- `lucide-react`: Latest
- `tailwindcss`: Latest
