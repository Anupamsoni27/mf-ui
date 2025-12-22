# Git Deployment Setup Guide for Azure App Service

Quick guide to deploy your Angular app to Azure using GitHub integration.

---

## 🚀 Step-by-Step Git Deployment

### Step 1: Create Azure App Service

1. Go to [Azure Portal](https://portal.azure.com)
2. Click **Create a resource** → **Web App**
3. Fill in the details:
   - **Subscription**: Select your subscription
   - **Resource Group**: Create new (e.g., `mf-ui-rg`)
   - **Name**: `mf-ui-dev` (must be globally unique)
   - **Publish**: **Code**
   - **Runtime stack**: **Node 18 LTS**
   - **Operating System**: **Windows**
   - **Region**: Choose closest to your API (or same as API)
   - **Pricing Plan**: Free F1 or Basic B1
4. Click **Review + Create** → **Create**
5. Wait for deployment to complete

---

### Step 2: Connect to GitHub

1. Go to your App Service in Azure Portal
2. In the left menu, click **Deployment Center**
3. Select **Source**: **GitHub**
4. Click **Authorize** and sign in to GitHub
5. Configure:
   - **Organization**: Anupamsoni27
   - **Repository**: mf-ui
   - **Branch**: az-dev
6. Click **Save**

Azure will automatically:

- Set up GitHub Actions workflow
- Build your app on every push
- Deploy to Azure App Service

---

### Step 3: Configure Build Settings

Azure needs to know how to build your Angular app. Two options:

#### Option A: Using Azure's Default Build (Recommended)

Azure will auto-detect Node.js and run:

```bash
npm install
npm run build --if-present
```

Make sure your default `build` script works (it does! ✅)

#### Option B: Custom GitHub Actions (Advanced)

If Azure creates a `.github/workflows/azure-webapps-node.yml` file, you can customize it.

---

### Step 4: Monitor Deployment

1. In **Deployment Center**, you'll see deployment status
2. Click on the latest deployment to see logs
3. Wait for build and deployment to complete (~3-5 minutes)

---

### Step 5: Verify Deployment

Once deployed, test your app:

1. **Open your app**: `https://mf-ui-dev.azurewebsites.net`
2. **Test routing**: Navigate to different pages and refresh
3. **Check API calls**: Verify stock/fund data loads
4. **Browser console**: Check for errors

---

## 🔧 Important: Update Backend CORS

Your backend API needs to allow requests from your Azure app:

```python
# In your FastAPI backend (mf-api)
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://mf-ui-dev.azurewebsites.net",  # ← Add this
        "http://localhost:4200"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 🔄 Future Deployments

After initial setup, deploying updates is simple:

```bash
# Make your changes
git add .
git commit -m "Your changes"
git push origin az-dev
```

Azure automatically rebuilds and redeploys! 🎉

---

## 🐛 Troubleshooting

### Build fails in Azure

- Check **Deployment Center** → Logs for error details
- Verify `package.json` scripts are correct
- Ensure all dependencies are in `dependencies` (not just `devDependencies`)

### App shows blank page

- Check browser console for errors
- Verify API CORS is configured
- Check Network tab for API call failures

### 404 errors on page refresh

- Ensure `web.config` is in `src/` folder ✅
- Verify it's being copied to dist folder ✅

---

## ✅ Current Status

✅ All deployment files committed to `az-dev` branch  
✅ Branch pushed to GitHub  
✅ Ready for Azure GitHub integration

**Next Step**: Follow Steps 1-2 above to connect Azure to your GitHub repo!

---

**Your GitHub Repository**: https://github.com/Anupamsoni27/mf-ui  
**Branch**: az-dev  
**Recommended App Name**: mf-ui-dev
