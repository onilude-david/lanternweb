---
description: Deploy Lantern WebApp to Vercel
---

# Deploying to Vercel

Follow these steps to deploy your application to Vercel.

## 1. Push to GitHub

I have already initialized the local repository and committed your code.
**You need to run the following command in your terminal to push the code:**

```bash
git remote set-url origin https://onilude-david@github.com/onilude-david/lanternweb.git
git branch -M main
git push -u origin main
```

> [!NOTE]
> If it asks for a username and password, use your GitHub username and a **Personal Access Token** (not your password).

## Troubleshooting: Permission Denied (403)

If you see an error like `Permission to ... denied to [OTHER_USER]`, it means your computer is remembering an old GitHub account.

**To fix this:**
1.  **Update the remote URL** (as shown above) to include your username:
    `git remote set-url origin https://onilude-david@github.com/onilude-david/lanternweb.git`
2.  **Try pushing again**. It should ask for your password/token.
3.  **If that fails**, open **Windows Credential Manager**:
    *   Search for "Credential Manager" in the Start menu.
    *   Click "Windows Credentials".
    *   Find `git:https://github.com` and remove it.
    *   Try pushing again.

## 2. Deploy on Vercel

1.  Go to [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New..."** -> **"Project"**.
3.  Select **"Continue with GitHub"**.
4.  Find your `lanternweb` repository in the list and click **"Import"**.
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

Once deployed, Vercel will give you a URL (e.g., `https://lanternweb.vercel.app`). Open it and test your app!
