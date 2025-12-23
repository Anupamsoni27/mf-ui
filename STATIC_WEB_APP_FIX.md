# Fix Azure Static Web Apps Deployment Token

## Quick Fix Steps

1. **Get Deployment Token from Azure:**

   - Go to [Azure Portal](https://portal.azure.com)
   - Navigate to your Static Web App: **stockdash**
   - Click **Overview** → **Manage deployment token**
   - Copy the deployment token

2. **Update GitHub Secret:**

   - Go to your GitHub repo: https://github.com/Anupamsoni27/mf-ui
   - Click **Settings** → **Secrets and variables** → **Actions**
   - Find `AZURE_STATIC_WEB_APPS_API_TOKEN_ICY_HILL_0F6A2FA00`
   - Click **Update** and paste the new token
   - Click **Update secret**

3. **Re-run the Workflow:**
   - Go to **Actions** tab on GitHub
   - Click on the failed workflow run
   - Click **Re-run failed jobs**

---

## Alternative: Let Azure Recreate the Workflow

If the above doesn't work:

1. **Delete the old workflow file** in your repo:

   - `.github/workflows/azure-static-web-apps-icy-hill-0f6a2fa00.yml`

2. **In Azure Portal:**
   - Go to your Static Web App
   - Click **Settings** → **Configuration**
   - Under **Deployment configuration**, click **Disconnect**
   - Then click **Reconnect** and select GitHub
   - Choose: `Anupamsoni27/mf-ui`, branch `az-dev`
   - Azure will create a new workflow with the correct token

---

## Your App Details

- **Static Web App Name**: stockdash
- **URL**: https://icy-hill-0f6a2fa00.1.azurestaticapps.net
- **Repository**: Anupamsoni27/mf-ui
- **Branch**: az-dev
