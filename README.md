# 📊 TakeSurvey – Smart Survey Tool  
### AI-Powered, Offline-First & Role-Based Survey Data Collection Platform

**TakeSurvey** is an AI-powered smart survey system designed to modernize how campuses, organizations, and public institutions collect data. It supports **self-filled surveys, assisted in-person surveys, and offline rural data collection**, enabling inclusive, secure, and scalable data gathering.

---

## 🚀 Overview

Surveys are the backbone of decision-making in education, governance, research, and community development. However, traditional paper surveys and basic online forms face major limitations:

- Manual errors and duplicate entries  
- No offline-first support  
- Poor reach to uneducated or low-connectivity populations  
- Slow reporting and monitoring  
- Limited control over large field teams  

**TakeSurvey** solves these challenges by providing a **centralized, intelligent, and role-based platform** that enables real-time monitoring, offline sync, and structured data collection at scale.

---

## 🎯 Problem Statement

Institutions and governments rely heavily on surveys for:

- Campus feedback and audits  
- Community and household studies  
- Public welfare assessments  
- Research and impact measurement  

Yet, current systems struggle with real-world field conditions such as:

- House-to-house surveys  
- Rural and low-network environments  
- Managing large survey teams  
- Ensuring data authenticity and quality  

This results in delayed insights, biased data, and inefficient execution.

---

## 💡 Our Solution

**TakeSurvey** is a smart, modular survey platform that enables:

- Digital and assisted survey collection  
- Offline data capture with auto-sync  
- Multi-level administrative control  
- Risk and integrity monitoring  
- Live dashboards and structured exports  

The platform is suitable for **campuses, NGOs, enterprises, and public sector programs**.

---

## ✨ Key Features

### 🤖 AI Question Extraction  
- Extract survey questions from documents (PDF, DOCX, TXT)  
- Intelligent keyword analysis  
- Smart question generation support  

### 🛡️ Risk Monitoring  
- Detection of duplicate and suspicious submissions  
- Location-based validation  
- Device-level tracking logic (demo level)  

### 👥 Role-Based Access Control  
- **Super Admin:** System-wide control and analytics  
- **Organization Admin:** Manages surveys and conductors  
- **Survey Conductor:** Conducts field and assisted surveys  

### 📝 Survey Management  
- Create and manage surveys  
- Multiple question types  
- Progress tracking  

### 📍 Location & Offline Support  
- GPS-enabled response tagging  
- Works without internet  
- Local data storage with sync-ready design  

### 📊 Analytics Dashboard  
- Live statistics  
- Visual dashboards  
- Exportable datasets  

---

## 👥 User Roles & Responsibilities

### 🔹 Super Admin (Government / Central Authority)  
- Creates national or organizational surveys  
- Manages organizations and admins  
- Assigns surveys  
- Monitors global analytics and coverage  

### 🔹 Organization Admin (College / NGO / Department)  
- Receives assigned surveys  
- Manages local teams  
- Tracks progress and quality  
- Handles regional operations  

### 🔹 Survey Conductor (Field Enumerator)  
- Conducts house-to-house surveys  
- Assists uneducated users  
- Shares digital survey links  
- Collects offline data and syncs later  

---

## 🔄 Example Use Case (Government Scenario)

1. Government creates a public survey  
2. Assigns it to district offices or institutions  
3. Organization admins onboard survey conductors  
4. Conductors visit households or share links  
5. Offline data is synced when internet is available  
6. Government monitors live dashboards  
7. Clean datasets are exported for planning and policy  

---

## 🏗️ System Architecture (High Level)

User Devices (Web/Mobile)  
→ Survey Interface  
→ Backend Services  
→ Database  
→ Analytics & Risk Engine  
→ Dashboards & Exports  

Designed to support **offline-first field collection** and **centralized monitoring**.

---

## 🛠️ Tech Stack

### Frontend  
- Next.js 15 (App Router)  
- React 19  
- TypeScript  
- Tailwind CSS  
- Radix UI  
- Lucide React  

### Forms & UI  
- React Hook Form  
- Zod  
- date-fns  

### Charts  
- Recharts  

### Backend & Platform (Planned / Prototype Layer)  
- API-based architecture  
- Role-based access control  
- Offline data logic  
- Cloud-ready design  

### Google Technologies (Planned Integration)  
- Google Cloud Platform  
- Firebase Authentication  
- Firestore Database  
- Cloud Functions  
- Gemini API (AI layer – future)  

---

## 🧪 MVP Status

This hackathon version is a **functional prototype**:

- Working role-based dashboards  
- Survey flow system  
- Risk monitoring UI  
- Offline-style local storage  
- Demo authentication  
- No paid APIs used  
- No production AI models connected  

The MVP demonstrates **system flow, usability, and real-world feasibility.**

---

## 📈 Impact

- Faster survey execution  
- Reduced operational cost  
- Inclusion of low-literacy populations  
- Better monitoring of field work  
- Higher data quality  
- Scalable from campus to national level  

---

## 🌍 Use Cases

- Campus feedback systems  
- Community surveys  
- Government data drives  
- NGO impact measurement  
- Healthcare & education assessments  
- Public awareness studies  

---

## 🔮 Future Enhancements

- Voice-based multilingual surveys  
- Adaptive AI questioning  
- Advanced fraud detection  
- GIS heatmaps  
- MIS and government system integrations  
- Predictive analytics  
- Progressive Web App (PWA) deployment  

---

## 🏁 Getting Started

### Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```
---

## Run development server

- npm run dev

---

## Run development server

- npm run build
- npm run start

---

## 📂 Project Structure

- app/              # Application routes  
- conductor/        # Survey Conductor dashboard  
- home/             # Landing page  
- login/            # Authentication  
- org-admin/        # Organization Admin panel  
- super-admin/      # Super Admin panel  
- risk-monitoring/  # Risk and integrity features  
- survey/           # Survey execution  
- components/       # Reusable UI  
- hooks/            # Custom hooks  
- lib/              # Utilities  
- public/           # Assets  
- styles/           # Global styles  

---

## 👤 Author

- Charan Karthik
- CSE Student | Full Stack & AI Enthusiast

