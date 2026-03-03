# Deploy WizardOfOz to Google Cloud Run via GitHub

## Prerequisites
- GitHub repository with this code
- Google Cloud Platform account
- Backend WebSocket server already deployed

## Deployment Steps

### 1. Push Code to GitHub
```bash
cd /Users/guanruijia/Desktop/205Web
git add .
git commit -m "Add WizardOfOz control panel"
git push
```

### 2. Deploy via Google Cloud Run Console

1. Go to [Google Cloud Run Console](https://console.cloud.google.com/run)

2. Click **"Create Service"** or **"Deploy from source"**

3. Select **"Deploy from GitHub"**
   - Connect your GitHub repository if not already connected
   - Select your repository: `205Web`
   - Select branch: `main` (or your working branch)

4. Configure Build Settings:
   - **Build type**: Dockerfile
   - **Dockerfile path**: `WizardOfOz/Dockerfile`
   - **Build context directory**: `WizardOfOz`

5. Configure Service Settings:
   - **Service name**: `parking-wizard-of-oz`
   - **Region**: `us-central1` (or your preferred region)
   - **Allow unauthenticated invocations**: ✅ Yes

6. Configure Environment Variables (Advanced Settings):
   - Click **"Container, Variables & Secrets, Connections, Security"**
   - Add build-time variable:
     - Name: `VITE_WS_URL`
     - Value: `wss://parking-system-189958237522.us-central1.run.app`
       (or your backend WebSocket URL)

7. Click **"Create"** and wait for deployment

### 3. Get Your URL

After deployment completes, you'll get a URL like:
```
https://parking-wizard-of-oz-[hash].us-central1.run.app
```

### 4. Test the WoZ Interface

1. Open the URL in your browser
2. Check that WebSocket connection shows "Connected"
3. Click "Start Parking Simulation" button
4. Verify that connected Infotainment and App clients receive the START_SESSION event

## Updating the Deployment

Every time you push to GitHub, Cloud Run will automatically rebuild and deploy (if you set up continuous deployment).

Or manually trigger a new deployment from the Cloud Run console.

## Troubleshooting

### WebSocket Connection Failed
- Check that `VITE_WS_URL` is correctly set to your backend URL
- Verify backend is deployed and running
- Check browser console for error messages

### Build Failed
- Verify Dockerfile path is correct: `WizardOfOz/Dockerfile`
- Check build logs in Cloud Run console
- Ensure all dependencies in package.json are correct

## Notes
- This interface should only be accessible to researchers
- Consider adding authentication for production use
- Monitor usage in Cloud Run console
