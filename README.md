<h1 align="center">🧠 AI Interview Coach</h1>
<p align="center">
An <b>AI-powered mock interview simulator</b> that helps users practice technical interviews in real time.<br/>
Built with <b>React (frontend)</b>, <b>Django REST Framework (backend)</b>, <b>MySQL</b>, and <b>Azure OpenAI</b> for intelligent question generation and feedback.
</p>

## 🚀 Features

✅ **AI-Powered Question Generation** — Generates domain-specific interview questions (Python Developer, ML Engineer, etc.)  
✅ **Real-Time Feedback & Scoring** — Uses Azure OpenAI to evaluate answers and provide detailed feedback  
✅ **Session History Tracking** — View previous interview sessions and progress  
✅ **Secure Authentication** — JWT-based login/logout with automatic session expiry  
✅ **Smooth UI/UX** — Built using React + TailwindCSS with Framer Motion animations  

## 🏗️ Tech Stack

### Frontend
- ⚛️ React.js  
- 🎨 TailwindCSS  
- 💫 Framer Motion  
- 🌐 Axios  
- 🧭 React Router DOM  

### Backend
- 🐍 Django  
- ⚙️ Django REST Framework  
- 🗄️ MySQL  
- 🤖 Azure OpenAI API  

### Authentication
- 🔐 JWT (JSON Web Tokens)

## ⚙️ Project Structure

```
ai-interview-coach/
│
├── backend/
│   ├── api/
│   ├── users/
│   ├── interviews/
│   ├── manage.py
│   └── settings.py
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.js
│   └── package.json
│
├── venv/
└── README.md
```

## 🧩 How It Works

1️⃣ User logs in or registers  
2️⃣ Selects a role (e.g., Data Scientist, Python Developer)  
3️⃣ The system generates a realistic AI interview question  
4️⃣ User types the answer  
5️⃣ AI evaluates and returns structured feedback + score (1–10)  
6️⃣ Session data is saved in the **Session History** page

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Mucharla-Sowmya/AI-Interview-Coach.git
cd AI-Interview-Coach
```

### 2️⃣ Backend Setup (Django)
```bash
cd backend
python -m venv venv
venv\Scripts\activate   # On Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 3️⃣ Frontend Setup (React)
```bash
cd ../frontend
npm install
npm start
```

## 🔑 Environment Variables

### Backend (.env)
```
SECRET_KEY=your_django_secret
DEBUG=True
DATABASE_NAME=your_db
DATABASE_USER=root
DATABASE_PASSWORD=yourpassword
AZURE_OPENAI_KEY=your_azure_openai_key
AZURE_OPENAI_ENDPOINT=https://your-endpoint.openai.azure.com/
```

### Frontend (.env)
```
REACT_APP_API_BASE=http://127.0.0.1:8000/api
```

## 🧠 Example Roles

-  Python Developer
-  React Developer
-  Machine Learning Engineer
-  Data Scientist
-  DevOps Engineer

## 📈 Future Improvements

✨ **Voice-Based Interview Simulation** — Integrate Azure Speech-to-Text & Text-to-Speech for interactive mock interviews  
📊 **Leaderboard & Analytics Dashboard** — Visualize progress and compare user performance  
📄 **Resume-Based Question Generation** — Generate custom interview questions from uploaded resumes  
🌍 **Multi-Language Support** — Allow users to practice interviews in different languages  

## 👩‍💻 Author

**Mucharla Sowmya**  
💼 *Full-Stack Developer | AI Enthusiast*  
📧 sowmyaoff209@gmail.com  
🌐 [LinkedIn](https://www.linkedin.com/in/sowmya-mucharla)

## 🧠 Inspiration

> "This project was created to help developers practice real technical interviews using AI-driven insights — improving both confidence and performance before actual interviews."
