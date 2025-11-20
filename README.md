# 🌐 **SocietyConnect – Smart Event Discovery & Management Platform**

### 🔗 **Live Website:**

👉 [https://frontend-societyconnect.onrender.com/](https://frontend-societyconnect.onrender.com/)

---

# 📌 **Overview**

**SocietyConnect** is a full-stack platform designed to streamline event management for societies and provide personalized event recommendations for students.
It uses **AI-powered tag prediction** and **interest-based filtering** to connect students with relevant events happening across the campus.

This project is built as part of university coursework and demonstrates:

* Real authentication using **Supabase**
* Intelligent event tagging using **Gemini AI**
* Full CRUD event management via **FastAPI**
* A clean and responsive UI using **React + Vite**

---

# ✨ **Key Features**

## 🔹 For Society Admins

* Post events with title, date, and description
* **Automatic AI tag prediction** based on event description
* View, edit, and delete events
* Post announcements
* Society login via **Supabase Auth**
* Events stored securely in a database

## 🔹 For Students

* Login using verified Thapar email
* Choose interest tags
* Get **recommended events** based on selected interests
* View event details + matched interest relevance
* Clean UI for browsing and exploration

---

# 🤖 **AI Tag Prediction (Gemini)**

SocietyConnect integrates **Google Gemini 2.5 Flash** model to auto-detect relevant tags based on event description.

Example:

```
Input: “Hackathon on AI and robotics…”
Output: AI/ML, robotics, tech
```

This removes manual tagging effort for societies and ensures consistency.

---

# 🏗️ **Tech Stack**

### **Frontend**

* React (Vite)
* Tailwind-friendly custom CSS
* Supabase Auth client
* Fetch API for backend integration

### **Backend**

* FastAPI
* Google Gemini API
* Supabase Python client
* CORS enabled

### **Database**

* Supabase Postgres

  * `events` table
  * `profiles` table (role-based auth: student / society)

### **Hosting**

* Frontend → Render (Static Site)
* Backend → Render (Web Service)
* Database + Auth → Supabase

---

# 📁 **Project Structure**

```
Prototype/
│
├── backend/
│   └── app.py         # FastAPI backend + Gemini + Supabase logic
│
└── login-prototype/
    ├── src/
    │   ├── MainLogin.jsx
    │   ├── StudentApp.jsx
    │   ├── SocietyApp.jsx
    │   ├── App1.jsx
    │   ├── supabaseClient.js
    │   └── App.css
    └── index.html
```

---

# 🚀 **Setup Instructions (For Local Development)**

### 1️⃣ Clone the repository

```bash
git clone https://github.com/khushigoyal05/ucs503p-202526odd-pb15-.git
cd ucs503p-202526odd-pb15-
```

---

## 🔧 Backend Setup (FastAPI)

### 2️⃣ Install dependencies

```bash
pip install -r requirements.txt
```

### 3️⃣ Create `.env` file

```
GEMINI_API_KEY=your_gemini_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_service_role_key
```

### 4️⃣ Run backend

```bash
uvicorn app:app --reload
```

Backend runs at:
👉 [http://localhost:8000](http://localhost:8000)

---

## 🖥️ Frontend Setup (React + Vite)

### 5️⃣ Go to frontend

```bash
cd login-prototype
npm install
```

### 6️⃣ Create `.env` file in `login-prototype/`

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_BASE_URL=http://localhost:8000
```

### 7️⃣ Start frontend

```bash
npm run dev
```

Frontend runs at:
👉 [http://localhost:5173](http://localhost:5173)

---

# 🧪 **Features in Action**

## ➤ AI Tag Prediction

When societies create an event, the backend automatically generates a list of relevant tags using Gemini.

## ➤ Role-based Auth

* Student → `/student`
* Society → `/society`
  Users cannot log in under a different role than their signup role.

## ➤ Event Matching

Students only see events that match their chosen interests.

---

---

# 🏁 **Future Enhancements**

* Admin panel for society approval
* Notification system
* Event reminders
* Comments or Q&A for events
* Dark mode

---

# 📜 **License**

This project is for academic and learning purposes.

---

# 👩‍💻 **Author**

**Khushi Goyal**
Thapar Institute of Engineering & Technology
CSE (3rd Year)
