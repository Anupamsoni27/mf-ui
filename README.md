# Investment Platform - Angular 17

A complete Angular web platform for managing mutual funds and stocks, built with Angular 17+ and styled with Tailwind CSS.

## Features

### 🏦 Mutual Funds Management
- **Fund List**: Paginated list of all mutual funds with real-time data
- **Fund Details**: Comprehensive fund information including performance metrics and constituent stocks
- **Performance Tracking**: 1-day, 1-week, 1-month, 3-month, and 1-year performance data

### 📈 Stock Management
- **Stock List**: Paginated list of all stocks with market data
- **Stock Details**: Detailed stock information including company details
- **Timeline Analysis**: Historical price and volume data with interactive charts

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Interactive Components**: Custom buttons, modals, and loading spinners
- **Data Tables**: Sortable and filterable tables with pagination
- **Real-time Updates**: Live data refresh capabilities

## Project Structure

```
src/app/
├── core/                           # Core services and utilities
│   ├── services/
│   │   ├── api.service.ts         # HTTP client wrapper
│   │   ├── fund.service.ts        # Fund data service
│   │   ├── stock.service.ts       # Stock data service
│   │   └── timeline.service.ts    # Timeline data service
│   └── core.module.ts
├── shared/                         # Reusable components and models
│   ├── components/
│   │   ├── button/                # Custom button component
│   │   ├── loading-spinner/       # Loading indicator
│   │   └── modal/                 # Modal dialog component
│   ├── models/
│   │   ├── fund.model.ts          # Fund data interfaces
│   │   └── stock.model.ts         # Stock data interfaces
│   └── shared.module.ts
├── features/                       # Feature modules
│   ├── funds/                     # Mutual funds feature
│   │   ├── fund-list/             # Fund listing component
│   │   ├── fund-detail/           # Fund details component
│   │   └── funds.module.ts
│   └── stocks/                    # Stocks feature
│       ├── stock-list/            # Stock listing component
│       ├── stock-detail/          # Stock details component
│       ├── stock-timeline/        # Timeline chart component
│       └── stocks.module.ts
├── app-routing.module.ts          # Main routing configuration
├── app.component.html             # Main app template
└── app.module.ts                  # Main app module
```

## API Integration

The application is configured to work with a backend API at `http://127.0.0.1:5000`. The API endpoints are:

### Funds API
- `GET /funds?skip={skip}&limit={limit}` - Get paginated list of funds
- `GET /funds/{fundId}?date={date}` - Get fund details with optional date filter

### Stocks API
- `GET /stocks?skip={skip}&limit={limit}` - Get paginated list of stocks
- `GET /stocks/{stockId}` - Get stock details
- `GET /stocks/{stockId}/timeline` - Get stock timeline data

## Getting Started

### Prerequisites
- Node.js 16+ 
- Angular CLI 17+
- Backend API running on port 5000

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Install Tailwind CSS** (if not already installed)
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init
   ```

3. **Start Development Server**
   ```bash
   ng serve
   ```

4. **Open Browser**
   Navigate to `http://localhost:4200`

### Building for Production

```bash
ng build --prod
```

## Key Features Implementation

### 🔄 Lazy Loading
- Both funds and stocks modules are lazy-loaded for optimal performance
- Routes are configured with proper guards and resolvers

### 📱 Responsive Design
- Mobile-first approach with Tailwind CSS
- Responsive tables and cards that adapt to screen size
- Touch-friendly navigation and interactions

### ⚡ Performance Optimizations
- OnPush change detection strategy
- Lazy loading of feature modules
- Efficient data pagination
- Optimized bundle size

### 🎯 Type Safety
- Comprehensive TypeScript interfaces
- Strict type checking enabled
- Proper error handling with typed responses

## Customization

### Styling
The application uses Tailwind CSS for styling. You can customize the design by:
- Modifying the Tailwind configuration in `tailwind.config.js`
- Updating component-specific styles in `.scss` files
- Adding custom CSS classes in `styles.scss`

### API Configuration
Update the API base URL in `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://your-api-url:port'
};
```

### Adding New Features
1. Create new feature modules in the `features/` directory
2. Add routes to `app-routing.module.ts`
3. Implement services in the `core/services/` directory
4. Add shared components to the `shared/` directory

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.