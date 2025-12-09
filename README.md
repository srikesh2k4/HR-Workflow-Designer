# 🌟 **HR Workflow Designer – Fullstack Application**

A full-featured drag-and-drop workflow automation designer built with **React + Vite + React Flow** on the frontend and **Node + Express** on the backend.

Supports:

* 🔧 Custom workflow nodes
* 🎚 Node configuration editor
* 🔄 Workflow simulation
* ⚙️ Automation actions

---

# 🚀 **Live Demo**

### 🌐 Frontend (Production):

👉 **[https://hr-workflow-designer-theta.vercel.app/](https://hr-workflow-designer-theta.vercel.app/)**

### 🖥 Backend API (Railway):

👉 **[https://hr-workflow-designer-production.up.railway.app](https://hr-workflow-designer-production.up.railway.app)**

You can now use the app online without installing anything.

---

# 📁 **Project Structure**

```
HR-Workflow-Designer/
│
├── frontend/      → React + Vite application
│   ├── components/
│   ├── store/
│   ├── api/
│   └── index.css
│
└── backend/       → Node + Express API
    ├── src/
    ├── routes/
    ├── controllers/
    └── data/
```

---

# 💻 **Local Development**

## 1️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Runs at:
👉 **[http://localhost:5173](http://localhost:5173)**

---

## 2️⃣ Backend Setup

```bash
cd backend
npm install
npm run dev
```

Runs at:
👉 **[http://localhost:4000](http://localhost:4000)**

---

# 🔧 **Environment Variables (Backend)**

Create `/backend/.env`:

```
PORT=4000
```

Backend auto-uses Railway's assigned port in production:

```js
const PORT = process.env.PORT || 4000;
```

---

# 📡 **API Endpoints**

| Method | Route                | Description                |
| ------ | -------------------- | -------------------------- |
| GET    | `/api/automations`   | List of automation actions |
| POST   | `/api/simulate`      | Runs workflow simulation   |
| POST   | `/api/save-workflow` | Saves workflow data        |
| GET    | `/healthz`           | Health check               |

---

# 🌍 **Backend Deployment (Railway)**

### Configuration Used:

| Setting        | Value                                                    |
| -------------- | -------------------------------------------------------- |
| Root Directory | `backend`                                                |
| Build Command  | `npm install`                                            |
| Start Command  | `npm start`                                              |
| Public URL     | `https://hr-workflow-designer-production.up.railway.app` |

Railway auto-deploys on every GitHub commit.

---

# 🎨 **Frontend Deployment (Vercel)**

### Configuration Used:

| Setting          | Value                                            |
| ---------------- | ------------------------------------------------ |
| Framework        | Vite                                             |
| Root Directory   | `frontend`                                       |
| Build Command    | `npm install && npm run build`                   |
| Output Directory | `dist`                                           |
| LIVE URL         | `https://hr-workflow-designer-theta.vercel.app/` |

### Frontend Environment Variable (Vercel)

```
VITE_API_BASE=https://hr-workflow-designer-production.up.railway.app/api
```

Inside `/frontend/src/api/api.ts`:

```ts
export const API_BASE = import.meta.env.VITE_API_BASE;
```

---

# 🧪 **Testing**

```bash
npm test
```

---

# 🏁 **Build for Production**

Frontend:

```bash
cd frontend
npm run build
```

Backend:

```bash
cd backend
npm start
```

---

# 🤝 **Contributing**

PRs are welcome!
Open issues or feature requests anytime.

