# ⚡ Electric Vehicle Analytics Dashboard

A comprehensive, modern data visualization platform for analyzing Electric Vehicle (EV) market trends, built with React and Recharts. This professional dashboard provides actionable insights into the EV market through interactive charts, real-time filters, and AI-powered analytics.

![Dashboard Preview](https://img.shields.io/badge/Status-Production%20Ready-success)
![React](https://img.shields.io/badge/React-19.1.1-blue)
![Recharts](https://img.shields.io/badge/Recharts-3.2.1-orange)

## 🎯 Project Overview

This dashboard is designed as a professional assignment submission for company interviews, showcasing:
- Modern UI/UX design principles
- Advanced data visualization techniques
- Responsive and accessible interface
- Clean, maintainable code architecture
- Professional documentation

## ✨ Key Features

### 📊 Interactive Data Visualizations
- **Real-time Metrics Cards**: Display total vehicles, BEV, and PHEV statistics with percentage breakdowns
- **Top Manufacturers Chart**: Bar chart showing the top 10 EV manufacturers by vehicle count
- **Adoption Timeline**: Line chart tracking EV adoption trends over model years
- **AI-Powered Insights**: Generate intelligent insights from data patterns
- **Make Comparison**: Side-by-side comparison of two different manufacturers
- **Model Distribution**: Explore models by manufacturer with detailed breakdowns

### 🎨 Modern Design Features
- **Glassmorphism UI**: Contemporary frosted-glass effect design
- **Gradient Accents**: Sophisticated color gradients throughout
- **Smooth Animations**: Polished transitions and hover effects
- **Responsive Layout**: Fully responsive across desktop, tablet, and mobile
- **Dark Theme**: Eye-friendly dark mode design
- **Professional Typography**: Inter font family for clean readability

### 🔧 Technical Highlights
- **Dynamic Filtering**: Real-time data filtering by make, type, and year range
- **Lazy Loading**: Optimized data loading with skeleton screens
- **Modular Architecture**: Clean component structure for maintainability
- **CSS Variables**: Consistent theming with custom properties
- **Accessibility**: WCAG-compliant with proper ARIA labels

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd leaflet-demo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

### Build for Production
```bash
npm run build
```

The production-ready files will be in the `dist` folder.

## 📁 Project Structure

```
leaflet-demo/
├── public/
│   └── csvjson.json          # EV data source
├── src/
│   ├── components/
│   │   ├── RawCount.jsx      # Key metrics cards
│   │   ├── RawCount.css
│   │   ├── EvCharts.jsx      # Top manufacturers chart
│   │   ├── EvAdaption.jsx    # Adoption timeline
│   │   ├── EvAdopation.css
│   │   ├── Insights.jsx      # AI insights
│   │   ├── Insights.css
│   │   ├── EvComparision.jsx # Make comparison
│   │   ├── EvComparision.css
│   │   ├── ModelMakeChart.jsx # Model distribution
│   │   └── ModelMakeChart.css
│   ├── App.jsx               # Main app component
│   ├── App.css               # Main styling
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles
├── index.html
├── package.json
└── vite.config.js
```

## 🎨 Design System

### Color Palette
- **Primary Gradient**: `#667eea → #764ba2` (Purple)
- **Secondary Gradient**: `#f093fb → #f5576c` (Pink)
- **Success Gradient**: `#4facfe → #00f2fe` (Blue)
- **Background**: `#0a0e27` (Deep Dark Blue)
- **Cards**: `rgba(255, 255, 255, 0.03)` (Translucent White)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: 600-700 weight
- **Body**: 400-500 weight

### Spacing System
- XS: 0.5rem
- SM: 1rem
- MD: 1.5rem
- LG: 2rem
- XL: 3rem

## 📊 Data Structure

The dashboard uses EV data with the following key fields:
- `Make`: Vehicle manufacturer
- `Model`: Vehicle model name
- `Electric Vehicle Type`: BEV or PHEV
- `Model Year`: Year of manufacture
- `Electric Range`: Range in miles
- `Base MSRP`: Manufacturer's suggested retail price

## 🛠️ Technologies Used

### Frontend Framework
- **React 19.1.1**: Modern UI library with hooks and functional components
- **Vite 7.1.7**: Next-generation frontend build tool

### Data Visualization
- **Recharts 3.2.1**: Composable charting library built on React components

### Data Processing
- **PapaParse 5.5.3**: CSV parser for data handling
- **Lodash 4.17.21**: Utility functions for data manipulation

### Development Tools
- **ESLint**: Code linting and quality assurance
- **PostCSS**: CSS processing and optimization

## 🎯 Key Components Explained

### RawCount Component
Displays three metric cards showing:
- Total registered EVs
- Battery Electric Vehicles (BEV) count and percentage
- Plug-in Hybrid Electric Vehicles (PHEV) count and percentage

Features skeleton loading states and animated hover effects.

### EvCharts Component
Bar chart visualization of the top 10 EV manufacturers, sorted by vehicle count. Includes gradient fills and interactive tooltips.

### EvAdaption Component
Line chart showing EV adoption trends over time with dynamic filtering by:
- Vehicle make
- Electric vehicle type
- Year range

### Insights Component
Generates AI-powered insights about adoption trends. Features a loading state and formatted insight display box.

### EvComparision Component
Side-by-side comparison of two manufacturers using dual-line charts with synchronized scales.

### ModelMakeChart Component
Pie chart breakdown of model distribution for a selected manufacturer.

## 🌟 Best Practices Implemented

### Code Quality
- ✅ Functional components with React Hooks
- ✅ Proper prop validation
- ✅ Clean, self-documenting code
- ✅ Consistent naming conventions
- ✅ Modular CSS architecture

### Performance
- ✅ Lazy loading of data
- ✅ Memoization where appropriate
- ✅ Optimized re-renders
- ✅ Efficient data filtering

### Accessibility
- ✅ Semantic HTML
- ✅ Proper heading hierarchy
- ✅ Keyboard navigation support
- ✅ ARIA labels for charts
- ✅ High contrast ratios

### UX Design
- ✅ Loading states for async operations
- ✅ Error handling and user feedback
- ✅ Responsive design for all devices
- ✅ Smooth animations and transitions
- ✅ Intuitive navigation

## 📱 Responsive Design

The dashboard is fully responsive with breakpoints at:
- **Mobile**: < 768px
- **Tablet**: 768px - 1200px
- **Desktop**: > 1200px

All components adapt gracefully to different screen sizes with optimized layouts.

## 🔮 Future Enhancements

Potential improvements for future iterations:
- [ ] Export data as PDF/CSV
- [ ] Additional chart types (scatter, heatmap)
- [ ] User authentication and saved preferences
- [ ] Real-time data updates via WebSocket
- [ ] Advanced filtering with multi-select
- [ ] Data comparison across multiple years
- [ ] Geographic visualization with Leaflet maps
- [ ] Dark/Light theme toggle

## 🤝 Contributing

This is a demonstration project for interview purposes. However, suggestions and feedback are welcome!

## 📄 License

This project is created for educational and demonstration purposes.

## 👨‍💻 Author

**Your Name**  
Created as a professional assignment submission

---

## 🙏 Acknowledgments

- Data source: [Electric Vehicle Population Data]
- Icons: Native emoji icons
- Fonts: Google Fonts (Inter)
- Charts: Recharts library

---

**Built with ❤️ using React + Recharts**

*Last Updated: October 2025*
