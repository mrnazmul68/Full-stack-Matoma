# Matoma - Full-stack Project

A full-stack project with an Express backend and a React (Vite) frontend.

## Deployment on Render

This project is configured for easy deployment on Render using the [render.yaml](file:///c:/Users/Laptop%20Click/OneDrive/Desktop/Matoma/render.yaml) blueprint.

### Prerequisites

1.  A [Render](https://render.com) account.
2.  A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) database.

### Deployment Steps

1.  Connect your GitHub repository to Render.
2.  Render will automatically detect the [render.yaml](file:///c:/Users/Laptop%20Click/OneDrive/Desktop/Matoma/render.yaml) file and prompt you to create the Blueprint.
3.  **Matoma Backend (Web Service)**:
    - Set the `MONGO_URI` environment variable.
    - Set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET`.
    - Set `SMTP_USER` and `SMTP_PASSWORD` for email functionality.
    - Set `FRONTEND_ORIGIN` to your frontend's URL after it's deployed.
4.  **Matoma Frontend (Static Site)**:
    - Set `VITE_API_BASE_URL` to your backend's URL followed by `/api` (e.g., `https://matoma-backend.onrender.com/api`).

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
