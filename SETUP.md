# Setup Guide - Investment Platform

## Prerequisites

Before running this application, you need to resolve the Node.js library compatibility issue and install the required dependencies.

## Node.js Issue Resolution

The current Node.js installation has a library compatibility issue. Here are the steps to resolve it:

### Option 1: Fix ICU Library Issue
```bash
# Update Homebrew
brew update

# Reinstall ICU library
brew uninstall icu4c
brew install icu4c

# Reinstall Node.js
brew uninstall node
brew install node
```

### Option 2: Use Node Version Manager (Recommended)
```bash
# Install nvm if not already installed
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal or source the profile
source ~/.bashrc  # or ~/.zshrc

# Install and use Node.js 18 (LTS)
nvm install 18
nvm use 18
nvm alias default 18
```

## Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Install Tailwind CSS Dependencies**
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   ```

3. **Initialize Tailwind CSS**
   ```bash
   npx tailwindcss init -p
   ```

4. **Start Development Server**
   ```bash
   ng serve
   ```

## Alternative: Manual Tailwind Setup

If the npm commands fail due to Node.js issues, you can manually set up Tailwind:

1. **Download Tailwind CSS**
   - Download the latest Tailwind CSS from https://tailwindcss.com
   - Place the CSS file in `src/assets/css/tailwind.css`

2. **Update angular.json**
   Add the Tailwind CSS file to the styles array:
   ```json
   "styles": [
     "src/styles.scss",
     "src/assets/css/tailwind.css"
   ]
   ```

3. **Update styles.scss**
   Replace the Tailwind directives with:
   ```scss
   @import 'assets/css/tailwind.css';
   ```

## Backend API Setup

The application expects a backend API running on `http://127.0.0.1:5000`. You need to implement the following endpoints:

### Funds API
- `GET /funds?skip={skip}&limit={limit}` - Returns paginated fund list
- `GET /funds/{fundId}?date={date}` - Returns fund details

### Stocks API
- `GET /stocks?skip={skip}&limit={limit}` - Returns paginated stock list
- `GET /stocks/{stockId}` - Returns stock details
- `GET /stocks/{stockId}/timeline` - Returns stock timeline data

### Sample API Response Formats

**Fund List Response:**
```json
{
  "funds": [
    {
      "id": "fund1",
      "name": "Growth Fund",
      "symbol": "GF001",
      "description": "High growth mutual fund",
      "totalValue": 1500000.50,
      "changePercent": 2.5,
      "changeAmount": 36500.25,
      "lastUpdated": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 100,
  "skip": 0,
  "limit": 10
}
```

**Stock List Response:**
```json
{
  "stocks": [
    {
      "id": "stock1",
      "symbol": "AAPL",
      "name": "Apple Inc.",
      "currentPrice": 150.25,
      "changePercent": 1.2,
      "changeAmount": 1.78,
      "volume": 50000000,
      "marketCap": 2500000000000,
      "lastUpdated": "2024-01-15T10:30:00Z",
      "sector": "Technology",
      "industry": "Consumer Electronics"
    }
  ],
  "total": 5000,
  "skip": 0,
  "limit": 10
}
```

## Running the Application

1. **Start the Backend API** (your implementation)
2. **Start the Angular Development Server**
   ```bash
   ng serve
   ```
3. **Open Browser**
   Navigate to `http://localhost:4200`

## Troubleshooting

### Common Issues

1. **Node.js Library Error**
   - Use nvm to manage Node.js versions
   - Ensure you're using Node.js 16+ with proper library support

2. **Tailwind CSS Not Working**
   - Check that Tailwind is properly installed
   - Verify the configuration files are in place
   - Ensure the CSS is being imported correctly

3. **API Connection Issues**
   - Verify the backend API is running on port 5000
   - Check CORS settings in your backend
   - Update the API URL in `src/environments/environment.ts`

4. **Build Issues**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Clear Angular cache: `ng cache clean`
   - Check for TypeScript errors: `ng build`

## Development Tips

1. **Hot Reload**: The development server supports hot reload for most changes
2. **TypeScript**: Use strict typing for better development experience
3. **Responsive Design**: Test on different screen sizes using browser dev tools
4. **API Testing**: Use tools like Postman to test your backend API endpoints

## Production Build

```bash
ng build --configuration production
```

The built files will be in the `dist/` directory.

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify all dependencies are installed correctly
3. Ensure the backend API is running and accessible
4. Check the Angular CLI version compatibility
