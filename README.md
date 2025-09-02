# 🥩 Asadazo - Premium Meat Website

A modern, responsive website for Asadazo, specializing in premium Argentine meat cuts delivered fresh to your door.

## ✨ Features

- **Product Catalog**: Browse premium meat cuts with detailed information
- **Shopping Cart**: Full cart functionality with localStorage persistence
- **Admin Dashboard**: Manage products, stock, and orders
- **User Authentication**: Secure login/signup system
- **Contact Forms**: Integrated contact and custom request forms
- **Responsive Design**: Mobile-first approach with elegant styling
- **Search & Filtering**: Find specific cuts by name or category

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: CSS3 with custom design tokens
- **Build Tool**: Vite
- **State Management**: React Context API
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Email Service**: Formspree integration

## 🎨 Design System

- **Color Palette**: 
  - Espresso (#2B1F18) - Base background
  - Malbec (#7A3326) - Cards and accents
  - Golden Beige (#E9CD9B) - Highlights and borders
  - White Smoked (#F5F5F5) - Light text and backgrounds

- **Typography**: 
  - Headings: Cormorant Garamond (serif)
  - Body: Inter (sans-serif)

- **Effects**: Frosted glass cards with backdrop-filter blur

## �� Pages & Components

- **Home**: Hero section, product showcase, features
- **Products**: Searchable product grid with filtering
- **Contact**: Contact form with business information
- **On Request**: Custom meat request form with photo upload
- **Admin**: Product management dashboard
- **Account**: User dashboard with orders and profile

## 🛠️ Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/Seballemandiv/asadazo-website.git
   cd asadazo-website
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Start development server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Build for production**
   \`\`\`bash
   npm run build
   \`\`\`

## �� Configuration

### Email Service
The contact forms use Formspree. Update the endpoint in:
- `src/components/Contact.tsx`
- `src/components/OnRequest.tsx`

### Product Data
Products are stored in `src/data/products.ts` and can be managed through the admin dashboard.

## 📁 Project Structure

src/
├── components/ # Reusable UI components
├── pages/ # Page components
├── contexts/ # React contexts (Auth, Cart)
├── data/ # Static data and types
├── config/ # Configuration files
└── components.css # Global styles and design tokens


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Development Guidelines

- Follow the existing code style and naming conventions
- Use TypeScript for all new components
- Maintain the established design system
- Test responsive behavior on multiple screen sizes
- Ensure accessibility standards are met

## 🚀 Deployment

The project can be deployed to:
- **Vercel**: Connect your GitHub repository for automatic deployments
- **Netlify**: Drag and drop the `dist` folder after building
- **GitHub Pages**: Use GitHub Actions for automated deployment

## 📞 Support

For questions or support, please contact:
- **Email**: Allemandi.Sebastian@expandam.nl
- **Location**: Amsterdam Oost, Netherlands

## 📄 License

This project is proprietary software for Asadazo. All rights reserved.

---

**Built with ❤️ for premium meat lovers**
