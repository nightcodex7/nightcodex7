# Tuhin Garai Portfolio Website

A modern, responsive portfolio website showcasing Tuhin Garai's expertise in Cloud Computing, Cybersecurity, Research, Open Source, and DevOps.

## Features

- 🌙 **Dark/Light Theme Toggle** - Automatic theme switching with system preference detection
- 📱 **Fully Responsive** - Optimized for all devices from mobile to desktop
- ⚡ **Performance Optimized** - Critical CSS inlined, lazy loading, and optimized assets
- 🔍 **SEO Optimized** - Meta tags, structured data, sitemap, and robots.txt
- 📱 **PWA Ready** - Service worker, manifest, and offline support
- ♿ **Accessibility Compliant** - WCAG guidelines, keyboard navigation, screen reader support
- 🎨 **Modern Design** - Material UI inspired with smooth animations and transitions

## Tech Stack

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **Styling**: CSS Custom Properties, Flexbox, Grid, Animations
- **Icons**: Font Awesome 6.4.0
- **Fonts**: Inter (Google Fonts)
- **Deployment**: GitHub Pages with GitHub Actions
- **Domain**: Custom domain (tuhingarai.in)

## File Structure

```
nightcodex7/
├── index.html                 # Main HTML file
├── styles/
│   ├── main.css              # Base styles and variables
│   ├── components.css        # Component-specific styles
│   └── responsive.css        # Responsive design rules
├── scripts/
│   └── main.js              # Main JavaScript functionality
├── assets/
│   ├── logo.svg             # SVG logo
│   ├── logo.png             # PNG logo
│   ├── favicon.ico          # Favicon
│   └── favicon-*.png        # Various favicon sizes
├── .github/workflows/
│   └── deploy.yml           # GitHub Actions deployment
├── CNAME                    # Custom domain configuration
├── robots.txt               # SEO robots file
├── sitemap.xml             # SEO sitemap
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker
└── .gitignore             # Git ignore rules
```

## Sections

1. **Hero** - Introduction and call-to-action
2. **About** - Personal information and contact details
3. **Tech Stack** - Technologies and tools
4. **Skills** - Categorized skills and expertise
5. **Projects** - Portfolio projects with links
6. **Research** - Publications and articles
7. **Experience** - Work experience timeline
8. **Education** - Academic background
9. **Certifications** - Professional certifications
10. **Support** - Support links and donations

## Performance Features

- Critical CSS inlined for above-the-fold content
- Non-critical CSS loaded asynchronously
- Image lazy loading with error handling
- Font optimization and preloading
- Service worker for offline support
- Optimized animations with requestAnimationFrame
- Debounced and throttled event handlers

## Accessibility Features

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader compatibility
- High contrast ratios
- Reduced motion support

## SEO Features

- Comprehensive meta tags
- Open Graph and Twitter Card support
- Structured data (JSON-LD)
- XML sitemap
- Robots.txt
- Semantic HTML
- Fast loading times

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Deployment

The website is automatically deployed to GitHub Pages when changes are pushed to the main branch.

### Manual Deployment

1. Push changes to the main branch
2. GitHub Actions will automatically build and deploy
3. The site will be available at https://tuhingarai.in

### Local Development

1. Clone the repository
2. Open `index.html` in a web browser
3. For development server, use any local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

## Customization

### Colors
Update CSS custom properties in `styles/main.css`:
```css
:root {
  --accent-primary: #6366f1;
  --accent-secondary: #06b6d4;
  --accent-tertiary: #8b5cf6;
}
```

### Content
Update the content in `index.html` for:
- Personal information
- Projects
- Experience
- Education
- Certifications

### Styling
Modify the CSS files in the `styles/` directory to customize:
- Layout
- Typography
- Animations
- Responsive breakpoints

## Performance Monitoring

The website includes built-in performance monitoring:
- Page load time tracking
- Image load monitoring
- Font loading status
- Error tracking and reporting

## Security

- All external links use `rel="noopener noreferrer"`
- Content Security Policy ready
- HTTPS enforced for production
- No sensitive data in client-side code

## License

This project is for personal use. The design and code structure can be adapted for other portfolio websites.

## Support

For issues or questions:
- Create an issue on GitHub
- Contact: tuhingarai123@gmail.com
- LinkedIn: https://www.linkedin.com/in/tuhingarai

---

Built with ❤️ by Tuhin Garai 