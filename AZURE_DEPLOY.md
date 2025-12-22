# Azure App Service Deployment Guide

Complete guide for deploying this Angular application to Azure App Service.

---

## 📋 Prerequisites

- Azure subscription
- Azure CLI installed (optional, for CLI deployment)
- Node.js and npm installed locally
- Git configured (for Git deployment)

---

## 🚀 Deployment Methods

### Method 1: ZIP Deployment (Recommended for Quick Deploy)

#### Step 1: Build the Application

```bash
# For development deployment
npm run build:dev

# For production deployment
npm run build:prod
```

This creates optimized files in `dist/my-angular17-app/`

#### Step 2: Create Azure App Service

1. Go to [Azure Portal](https://portal.azure.com)
2. Create a new **App Service**
3. Fill in details:
   - **Resource Group**: Create new or use existing
   - **Name**: `<your-app-name>` (e.g., `mf-ui-dev`)
   - **Publish**: Code
   - **Runtime stack**: Node 18 LTS (or latest)
   - **Operating System**: Windows
   - **Region**: Choose closest to your API
   - **Pricing Plan**: F1 (Free) or B1 (Basic)

#### Step 3: Deploy via ZIP

**Option A: Using Azure Portal**

1. Go to your App Service
2. Navigate to **Deployment Center**
3. Choose **Local Git** or **ZIP Deploy**
4. Upload the contents of `dist/my-angular17-app/` folder

**Option B: Using Azure CLI**

```bash
# Login to Azure
az login

# Compress the build folder
cd dist/my-angular17-app
zip -r ../deploy.zip .
cd ../..

# Deploy
az webapp deployment source config-zip \
  --resource-group <your-resource-group> \
  --name <your-app-name> \
  --src dist/deploy.zip
```

---

### Method 2: Git Deployment

#### Step 1: Enable Local Git in Azure

1. Go to your App Service in Azure Portal
2. Navigate to **Deployment Center**
3. Select **Local Git** as source
4. Save and copy the **Git Clone Uri**

#### Step 2: Add Azure Remote

```bash
# Add Azure as a remote
git remote add azure <Git-Clone-Uri>

# Example:
# git remote add azure https://<app-name>.scm.azurewebsites.net:443/<app-name>.git
```

#### Step 3: Configure Deployment Credentials

1. In Azure Portal, go to **Deployment Center** → **Local Git/FTPS credentials**
2. Set **Application scope** username and password
3. Save credentials

#### Step 4: Push to Azure

```bash
# Commit your changes
git add .
git commit -m "Deploy to Azure"

# Push to Azure (will trigger build)
git push azure az-dev:master

# You'll be prompted for the deployment credentials
```

---

### Method 3: GitHub Actions (CI/CD)

Create `.github/workflows/azure-deploy.yml`:

```yaml
name: Deploy to Azure

on:
  push:
    branches: [az-dev]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build:dev

      - name: Deploy to Azure
        uses: azure/webapps-deploy@v2
        with:
          app-name: "<your-app-name>"
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
          package: dist/my-angular17-app
```

---

## ⚙️ Configuration Files Created

### `web.config`

- **Purpose**: IIS URL rewriting for Angular routing
- **Location**: Root directory (copied to dist during build)
- **Function**: Ensures all routes redirect to index.html

### `environment.prod.ts`

- **Purpose**: Production environment configuration
- **API URL**: `https://stockdash.azurewebsites.net`
- **Used when**: Building with `--configuration=production`

### `.deployment`

- **Purpose**: Azure deployment configuration
- **Function**: Specifies deployment command

---

## 🧪 Testing Your Deployment

After deployment, test these features:

1. **Access your app**: `https://<your-app-name>.azurewebsites.net`
2. **Test routing**: Navigate to different pages, refresh browser
3. **Check API calls**: Verify data loads from backend
4. **Browser console**: Check for errors
5. **Test features**:
   - Stock list loading
   - Fund list loading
   - Stock/Fund details pages
   - Favorites (add/remove)
   - User authentication

---

## 🔧 Post-Deployment Configuration

### Configure CORS on Backend

Ensure your backend API (stockdash.azurewebsites.net) allows CORS for your Angular app:

```python
# In your FastAPI backend
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://<your-app-name>.azurewebsites.net",
        "http://localhost:4200"  # Keep for local dev
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Set Application Settings (Optional)

In Azure Portal → App Service → Configuration:

- Add any environment-specific settings
- Configure connection strings if needed

---

## 📊 Monitoring & Logs

### View Logs

**Azure Portal:**

1. Go to App Service
2. Navigate to **Log stream**
3. View real-time logs

**Azure CLI:**

```bash
az webapp log tail --name <your-app-name> --resource-group <your-resource-group>
```

### Application Insights (Optional)

Enable Application Insights for detailed monitoring:

1. In Azure Portal → App Service → Application Insights
2. Click **Turn on Application Insights**
3. Configure and save

---

## ⚡ Performance Tips

1. **Enable compression**: Already configured in `web.config`
2. **Use CDN**: For static assets (advanced)
3. **Enable caching**: Configure in Azure App Service settings
4. **Scale up/out**: Upgrade pricing tier if needed

---

## 🐛 Troubleshooting

### Issue: Routes return 404 on refresh

- **Solution**: Ensure `web.config` is in dist folder (should be automatic)

### Issue: Blank page after deployment

- **Solution**: Check browser console for errors, verify API CORS settings

### Issue: API calls failing

- **Solution**: Verify backend CORS includes your Azure domain
- **Check**: Browser Network tab for failed requests

### Issue: Build fails

- **Solution**: Run `npm run build:dev` locally first to identify errors

---

## 🔄 Update Deployment

To update your deployed app:

```bash
# 1. Make changes to your code
# 2. Build
npm run build:dev

# 3. Deploy (using your chosen method)
# For ZIP: Re-upload dist folder
# For Git: git push azure az-dev:master
```

---

## 📱 Environment URLs

| Environment           | URL                                         | API Backend                         |
| --------------------- | ------------------------------------------- | ----------------------------------- |
| **Local Development** | http://localhost:4200                       | https://stockdash.azurewebsites.net |
| **Azure Dev**         | https://\<your-app-name\>.azurewebsites.net | https://stockdash.azurewebsites.net |

---

## ✅ Deployment Checklist

- [ ] Azure App Service created
- [ ] Application built successfully (`npm run build:dev`)
- [ ] `web.config` included in build output
- [ ] Deployment completed (ZIP/Git/CI-CD)
- [ ] App accessible at Azure URL
- [ ] Routing works (test navigation and refresh)
- [ ] API calls working (data loads correctly)
- [ ] CORS configured on backend
- [ ] No console errors in browser
- [ ] All features tested

---

## 📞 Support Resources

- **Azure Documentation**: https://docs.microsoft.com/en-us/azure/app-service/
- **Angular Deployment**: https://angular.io/guide/deployment
- **Backend API**: https://stockdash.azurewebsites.net/health

---

**Last Updated**: 2025-12-23  
**Environment**: Development
