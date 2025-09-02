# Asadazo - Original Argentinian Cuts

A modern, responsive website for Asadazo, an Argentine meat boutique shop in Amsterdam. Built with React, TypeScript, and Vite.

## Features

- **Product Catalog**: Display of 10 authentic Argentine meat cuts organized by categories
- **Shopping Cart**: Add products with quantity selection and checkout functionality
- **Multilingual Support**: English, Spanish, and Dutch translations
- **Responsive Design**: Mobile-first approach with beautiful UI
- **Order Management**: Email-based order system with delivery options
- **Contact Forms**: Integrated contact and price request forms
- **SEO Optimized**: Meta tags, structured data, and performance optimized

## Product Categories

### Meat (Carne)
- Entraña - €24/kg
- Cuadril - €24/kg
- Vacío - €22/kg
- Bola de Lomo - €26/kg
- Peceto - €26/kg
- Asado - €22/kg

### Pork (Cerdo)
- Matambre de Cerdo - €21/kg

### Sausages (Embutidos)
- Chorizo Criollo - €18/kg
- Morcilla - €18/kg

### Offal (Achuras)
- Chinchulines - €32/kg
- Molleja - €45/kg

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: CSS-in-JS with styled-jsx
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Fonts**: Trajan Pro (headings), Inter (body)

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd asadazo-website
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` folder, ready for deployment.

## Deployment

### Netlify (Recommended)

1. Build the project: `npm run build`
2. Drag and drop the `dist` folder to Netlify
3. Configure your custom domain

### Vercel

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the Vite configuration
3. Deploy with one click

## Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # Navigation and language switcher
│   ├── Hero.tsx        # Hero section
│   ├── ProductGrid.tsx # Product catalog
│   ├── ProductCard.tsx # Individual product display
│   ├── Cart.tsx        # Shopping cart and checkout
│   ├── About.tsx       # About section
│   ├── Delivery.tsx    # Delivery information
│   ├── Testimonials.tsx # Customer reviews
│   ├── Contact.tsx     # Contact form
│   ├── FAQ.tsx         # Frequently asked questions
│   └── Footer.tsx      # Footer with newsletter
├── data/               # Static data
│   ├── products.ts     # Product information
│   └── translations.ts # Multilingual content
├── types/              # TypeScript type definitions
│   └── index.ts        # Main type definitions
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles and CSS variables
```

## Customization

### Adding New Products

1. Edit `src/data/products.ts`
2. Add new product objects following the existing structure
3. Include images in the `public/images/` folder

### Updating Translations

1. Edit `src/data/translations.ts`
2. Add new translation keys for all supported languages
3. Update the language switcher in `Header.tsx` if needed

### Styling

The project uses CSS custom properties for consistent theming:

```css
:root {
  --color-espresso: #2B1F18;    /* Background */
  --color-beige: #E9CD9B;       /* Surfaces */
  --color-malbec: #7A3326;      /* Primary buttons */
  --color-white: #FFFFFF;       /* Text on dark backgrounds */
}
```

### Brand Colors

- **Espresso**: #2B1F18 (Background)
- **Beige**: #E9CD9B (Surfaces)
- **Malbec**: #7A3326 (Primary buttons)

## Features to Add

- [ ] User authentication system
- [ ] Payment integration (Stripe/PayPal)
- [ ] Order tracking
- [ ] Admin dashboard
- [ ] Inventory management
- [ ] Email marketing integration
- [ ] Advanced filtering and search
- [ ] Product reviews and ratings
- [ ] Gift cards and promotions

## Contact

For questions or support, contact:
- Email: allemandi.Sebastian@expandam.nl
- Phone: +31 (0) 6 12345678

## License

This project is proprietary and confidential. All rights reserved.
