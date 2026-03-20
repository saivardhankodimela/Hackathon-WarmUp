# 🏛️ Civic AI - Smart Complaints Management

A modern, full-stack application leveraging Gemini AI for multimodal civic issue analysis (e.g., road damage, sanitation) and Google Cloud for scalable processing.

---

## 📁 Project Structure

This is a monorepo consisting of:

-   **`backend/`**: FastAPI (Python) driving complaint intake, multimodal Gemini inference wrapper, and Firestore persistence.
-   **`frontend/`**: Next.js 15+ (TypeScript) dashboard rendered with modern dark-mode Glassmorphic styling layouts (via Tailwind CSS).

---

## 🚀 Getting Started

### 🟢 1. Backend (FastAPI) Setup
Navigate to `/backend`:
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

**Variables**: Provide a `.env` file containing:
```env
GOOGLE_API_KEY=your_gemini_api_key
FIREBASE_PROJECT_ID=your_firebase_project
CORS_ORIGINS=["http://localhost:3000"]
```

**Run API**:
```bash
uvicorn main:app --port 8080 --reload
```
*Docs accessible at:* `http://localhost:8080/docs`

---

### 🔵 2. Frontend (Next.js) Setup
Navigate to `/frontend`:
```bash
cd frontend
npm install
```

**Variables**: Add `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

**Run Client**:
```bash
npm run dev
```
*Local address:* `http://localhost:3000`

---

## 🏗️ Architecture & Stack
-   **Core Interface**: `Next.js` standalone static standalone compilations.
-   **Analytics Framework**: `FastAPI` + **`Google GenAI SDK (Gemini 2.5 Flash)`**
-   **Safety fallbacks**: Custom Memory diagnostics mock bundles to prevent crashes on non-auth scopes!

---

💡 *Designed for high-end Luminescent Oversight addressing urban scalability.*
