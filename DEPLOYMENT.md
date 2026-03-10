# Deployment Guide

## Backend Deployment (Render)

1. **Create a Render account** at https://render.com

2. **Push your code to GitHub** (if not already done)

3. **Create a new Web Service on Render:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Render will auto-detect the `render.yaml` configuration
   - Or manually configure:
     - Build Command: `npm install`
     - Start Command: `npm start`
     - Environment: Node

4. **Set Environment Variables** (if not using render.yaml auto-config):
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = (generate a secure random string)
   - `PORT` = `10000`
   - `DB_PATH` = `/opt/render/project/src/database.sqlite`

5. **Deploy!** Render will give you a URL like: `https://expenses-tracker-api.onrender.com`

6. **Important:** Free tier on Render spins down after inactivity. First request may take 30-60 seconds.

---

## Frontend Deployment (Netlify)

1. **Create a Netlify account** at https://netlify.com

2. **Deploy via Netlify CLI** (Recommended):
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod
   ```

3. **Or Deploy via Netlify Dashboard:**
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Netlify will auto-detect the `netlify.toml` configuration
   - Or manually configure:
     - Base directory: `frontend`
     - Build command: `npm run build`
     - Publish directory: `frontend/dist`

4. **Set Environment Variable on Netlify:**
   - Go to Site settings → Environment variables
   - Add: `VITE_API_URL` = `https://your-render-backend-url.onrender.com/api`
   - Example: `VITE_API_URL` = `https://expenses-tracker-api.onrender.com/api`

5. **Redeploy** after setting the environment variable

---

## Testing

1. Backend: Visit `https://your-render-url.onrender.com/` - should see "Expenses Tracker API is running"
2. Frontend: Visit your Netlify URL and try logging in/registering

---

## Troubleshooting

- **CORS errors:** Make sure your backend allows your Netlify domain in CORS settings
- **API not connecting:** Double-check the `VITE_API_URL` environment variable on Netlify
- **Database errors:** The SQLite database will be empty on first deploy - you may need to register a new user
- **Render slow start:** Free tier spins down - first request takes time to wake up

---

## Local Development

Backend:
```bash
npm install
npm start
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```
