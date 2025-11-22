# Sharing Your PeakPath App

This guide will walk you through deploying your application to the web for free. Once you're done, you'll have a public link that you can share with anyone!

We'll use a service called **Netlify**, which is perfect for this kind of project and is very easy to use.

## What You'll Need

1.  **Your Project Files:** All the files for your app (`index.html`, `index.tsx`, etc.).
2.  **A GitHub Account:** This is a free account on [GitHub.com](https://github.com) that will store your code.
3.  **Your Google AI API Key:** The secret key you have for the Gemini API.

---

## Step 1: Put Your Code on GitHub

Think of GitHub as a cloud drive for your code. Netlify will connect to it to get your app's files.

1.  **Create a New "Repository":**
    *   Go to [GitHub.com](https://github.com) and log in.
    *   Click the `+` icon in the top-right corner and select **"New repository"**.
    *   Give it a name, like `peakpath-app`.
    *   Make sure it's set to **Public**.
    *   Click **"Create repository"**.

2.  **Upload Your Files:**
    *   On your new repository page, click the **"Add file"** button and choose **"Upload files"**.
    *   Drag and drop ALL of your project files (`index.html`, `index.tsx`, `README.md`, `sw.js`, etc.) and all the folders (`components`, `pages`, etc.) into the upload box.
    *   Once they are all uploaded, click the **"Commit changes"** button.

Great! Your code is now saved online.

---

## Step 2: Deploy with Netlify

Now, we'll tell Netlify to grab your code from GitHub and put it online.

1.  **Create a Netlify Account:**
    *   Go to [Netlify.com](https://www.netlify.com) and click **"Sign up"**.
    *   The easiest way is to sign up using your GitHub account. Authorize it when prompted.

2.  **Import Your Project:**
    *   From your Netlify dashboard, click **"Add new site"** and then **"Import an existing project"**.
    *   Click the **"Deploy with GitHub"** button.
    *   A new window will open. Find the `peakpath-app` repository you just created and select it.

3.  **Configure Site Settings:**
    *   Netlify will show you a "Deploy settings" page. Your project is very simple, so you don't need a build step.
    *   **Leave all the settings as they are.** The "Build command" should be blank and the "Publish directory" should be empty or set to the project root. Netlify is smart enough to figure it out.
    *   Click the **"Deploy site"** button.

Netlify will now build and deploy your app. It usually takes less than a minute!

---

## Step 3: Set Your API Key (Crucial!)

Your app needs the Google AI API key to work. You must provide it to Netlify securely.

1.  **Go to Site Settings:** After deployment, you'll be on your site's overview page. Go to **"Site configuration"** or **"Site settings"**.
2.  **Find Environment Variables:** In the side menu, go to **"Build & deploy"** -> **"Environment"**.
3.  **Add the Variable:**
    *   Click **"Edit variables"**.
    *   For the **Key**, type exactly: `API_KEY`
    *   For the **Value**, paste in your secret Google AI API key.
    *   Click **"Save"**.
4.  **Redeploy:**
    *   Go back to the "Deploys" tab for your site.
    *   At the top, click the **"Trigger deploy"** dropdown and select **"Deploy site"**. This will restart your app with the new API key included.

---

## Step 4: Share Your Link!

At the top of your site's overview page on Netlify, you'll see a public URL, like `https://random-words-12345.netlify.app`.

**That's it!** You can now copy that link and share it with your friends. They can open it on any device and use the live application you created. Congratulations!


synthax ani was here 