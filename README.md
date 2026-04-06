# Matoma - Full-stack Project

A full-stack project with an Express backend and a React (Vite) frontend.

## Deployment on Render (Manual)

Follow these steps to deploy your backend and frontend for free.

### 1. Deploy the Backend (Web Service)
1. Go to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New + > Web Service**.
3. Select your GitHub repository: `Full-stack-Matoma`.
4. **Settings**:
   - **Name**: `matoma-backend`
   - **Region**: Choose the one closest to you.
   - **Language**: `Node`
   - **Root Directory**: `Backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Select **Free**.
5. **Environment Variables**:
   - `PORT`: `10000`
   - `MONGO_URI`: (Your MongoDB connection string)
   - `MONGO_DB_NAME`: `matoma`
   - `FRONTEND_ORIGIN`: (Your frontend URL after it's live)
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`

### 2. Deploy the Frontend (Static Site)
1. Click **New + > Static Site**.
2. Select your GitHub repository: `Full-stack-Matoma`.
3. **Settings**:
   - **Name**: `matoma-frontend`
   - **Root Directory**: `Frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. **Environment Variables**:
   - `VITE_API_BASE_URL`: (Your backend URL + `/api`)
5. **Redirects/Rewrites**:
   - **Source**: `/*`
   - **Destination**: `/index.html`
   - **Action**: `Rewrite`

### Local Development

1.  Install all dependencies:
    ```bash
    npm run install-all
    ```
2.  Start the backend:
    ```bash
    npm start
    ```
3.  Start the frontend:
    ```bash
    cd Frontend && npm run dev
    ```

## Environment Variables

Check the following files for required environment variables:
- [Backend/.env.example](file:///c:/Users/Laptop%20Click/OneDrive/Desktop/Matoma/Backend/.env.example)
- [Frontend/.env.example](file:///c:/Users/Laptop%20Click/OneDrive/Desktop/Matoma/Frontend/.env.example)
