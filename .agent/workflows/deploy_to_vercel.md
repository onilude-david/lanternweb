---
description: Deploy Lantern WebApp to Vercel
---

# Deploying to Vercel

Follow these steps to deploy your application to Vercel.

## 1. Push to GitHub

If you haven't already, you need to push your code to a GitHub repository.

1.  **Create a new repository** on GitHub (https://github.com/new). Name it `lantern-webapp` (or whatever you prefer). Do **not** initialize it with a README, .gitignore, or license.
2.  **Push your code**:
    Run the following commands in your terminal (copy and paste them):

    ```bash
    # Link your local repo to GitHub (replace YOUR_USERNAME with your actual GitHub username)
    git remote add origin https://github.com/YOUR_USERNAME/lantern-webapp.git

    # Rename the branch to main
    git branch -M main

    # Push your code
    git push -u origin main
    ```

## 2. Deploy on Vercel

1.  Go to [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New..."** -> **"Project"**.
3.  Select **"Continue with GitHub"**.
4.  Find your `lantern-webapp` repository in the list and click **"Import"**.
5.  **Configure Project**:
    *   **Framework Preset**: Vercel should automatically detect **Vite**.
    *   **Root Directory**: `./` (default)
    *   **Build Command**: `npm run build` (default)
    *   **Output Directory**: `dist` (default)
    *   **Environment Variables**: You will need to add your Firebase config here if you want authentication to work in production.
        *   Go to your `src/lib/firebase.js` file to see the values.
        *   Add them as environment variables in Vercel (e.g., `VITE_FIREBASE_API_KEY`, etc.) and update your code to use `import.meta.env.VITE_FIREBASE_API_KEY`.
        *   *Alternatively*, for a quick test, you can leave the hardcoded values, but it's not recommended for production.

6.  Click **"Deploy"**.

## 3. Verify

Once deployed, Vercel will give you a URL (e.g., `https://lantern-webapp.vercel.app`). Open it and test your app!
