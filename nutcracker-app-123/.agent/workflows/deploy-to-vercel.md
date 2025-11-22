---
description: Deploy the Nutcracker App to Vercel via GitHub with Postgres database
---

# Deploy to Vercel via GitHub

Using GitHub is the recommended way to deploy to Vercel. It provides automatic deployments whenever you push changes to your repository.

## Prerequisites

- A GitHub account.
- A Vercel account linked to your GitHub.
- Git installed locally.

## Steps

1.  **Initialize Git (if not already done)**
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```

2.  **Create a GitHub Repository**
    - Go to [GitHub.com/new](https://github.com/new).
    - Create a new repository (e.g., `nutcracker-app-123`).
    - **Do not** initialize with README, .gitignore, or license (you already have them).

3.  **Push to GitHub**
    Follow the instructions provided by GitHub to push your existing repository:
    ```bash
    git remote add origin https://github.com/GISDusty/nutcracker-app-123.git
    git branch -M main
    git push -u origin main
    ```

4.  **Import Project in Vercel**
    - Go to the [Vercel Dashboard](https://vercel.com/dashboard).
    - Click **Add New...** -> **Project**.
    - Beside "Import Git Repository", verify your GitHub account is selected.
    - Find `nutcracker-app-123` and click **Import**.
    - **Framework Preset**: Vite (should be detected automatically).
    - **Root Directory**: `./` (default).
    - Click **Deploy**.

5.  **Add Database**
    - Once deployed (or while it's building), go to the project dashboard.
    - Go to the **Storage** tab.
    - Click **Connect Store**.
    - Select **Postgres**.
    - Click **Create New**.
    - Accept the terms and click **Create**.
    - Choose a region (e.g., Washington, D.C., USA - iad1).
    - Click **Connect**.
    - **IMPORTANT**: Since you are using GitHub, Vercel will automatically add the environment variables to your deployment. You *may* need to redeploy for them to take effect if the database was added *after* the initial deployment started.
    - To redeploy: Go to **Deployments** -> Click the three dots on the latest deployment -> **Redeploy**.

6.  **Run Database Migration**
    You need to create the leaderboard table in your new database.
    - Go to the **Storage** tab -> Select your database.
    - Click **Query** (or "Data" -> "Query Editor").
    - Paste and run the SQL from `database/migration.sql`:

    ```sql
    CREATE TABLE IF NOT EXISTS leaderboard (
      id SERIAL PRIMARY KEY,
      initials VARCHAR(3) NOT NULL,
      age INTEGER,
      score INTEGER NOT NULL CHECK (score >= 0 AND score <= 50),
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard(score DESC, created_at ASC);
    ```

7.  **Verify Deployment**
    Visit the URL provided in the Vercel Dashboard and test the game and leaderboard.

## Local Development with Vercel Postgres

To use the Vercel Postgres database locally:

1.  Link your local project:
    ```bash
    vercel link
    ```
2.  Pull environment variables:
    ```bash
    vercel env pull .env.development.local
    ```
3.  Run the dev server:
    ```bash
    npm run dev
    ```
