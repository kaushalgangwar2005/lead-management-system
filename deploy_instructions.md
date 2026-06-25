Render + Vercel deployment and GitHub push instructions

1) Create a GitHub repo and push

# Replace <your-repo-url> with the SSH/HTTPS URL
git init
git add .
git commit -m "Initial lead management system"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main

2) Create MongoDB Atlas cluster
- Sign in to https://cloud.mongodb.com
- Create a free cluster, create a database user and whitelist your IP or allow access from anywhere (0.0.0.0/0) for testing.
- Get the connection string and set it as `MONGODB_URI` in Render service env.

3) Deploy backend on Render
- Go to https://render.com and create a new Web Service linked to your GitHub repo.
- Use the `lead-backend` service from `render.yaml` or configure manually:
  - Build Command: `cd backend && npm install`
  - Start Command: `cd backend && npm start`
  - Environment vars: `MONGODB_URI`, `BACKEND_URL` (set to Render URL), `FRONTEND_URL`, `SMTP_*` as needed.

4) Deploy frontend on Vercel
- Go to https://vercel.com and import your GitHub repo.
- Set the project root to `/frontend` and build command `npm run build`, output directory `dist`.
- Add Environment Variable `VITE_BACKEND_URL` with your backend URL.

5) After both deploy, update `backend/.env` or Render env with production URLs and SMTP creds.

6) (Optional) Set up Render `render.yaml` by replacing `<REPO-URL>` with your repository URL and deploying via the Render dashboard (connect repo and deploy).

Notes:
- I cannot create GitHub, Atlas, Render, or Vercel resources from here—follow these steps to complete the deployment.
- After you push to GitHub and connect services, share the Render and Vercel URLs and I can help verify and finalize configuration.
