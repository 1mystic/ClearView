# 🌍 Clear View – Community-Powered Pollution Reporting Platform

[![Demo Video](https://img.shields.io/badge/Watch-Demo%20Video-blue?style=for-the-badge)](https://drive.google.com/file/d/18UcGIUkUaIaakoNc-T00s3mGGEgI5bQ2/view?usp=sharing)
[![Live Site](https://img.shields.io/badge/Visit-Deployed%20App-brightgreen?style=for-the-badge)](https://clearvieweco.netlify.app/)

> Empowering communities to report, visualize, and act on environmental pollution – starting with India’s invisible informal industry emissions.

---

## 🧠 Problem

Unseen pollution from informal industries across India continues to contaminate local ecosystems and communities. There’s a lack of **real-time, geotagged data** to take timely action or raise awareness.

---

## ✅ Our Solution: Clear View

**Clear View** is a mobile-first, community-powered web app that allows users to **report environmental pollution incidents**. The platform **geotags and visualizes** pollution data on an interactive public map. It supports **AI-assisted classification**, **NGO collaboration**, and **biodiversity hotspot tracking**.

---

## ⚡ Key Features (Hackathon MVP – Built in 24 Hours)

- 📸 **Simple Reporting Interface**: Submit pollution reports via a mobile-friendly form. Auto-captures geolocation. Supports image upload.
- 🗺️ **Geotagged Hotspot Map**: Displays reports on a real-time, interactive Leaflet map.
- 🧠 **AI-Powered Image Classification**: Uses TensorFlow MobileNet to detect pollution in submitted photos.
- 🔍 **Filtering and Clustering**: Filter by pollution type, date range. Visual indicators for high-density zones.
- 🔐 **User Authentication**: Basic login/signup with Firebase. NGOs can apply for verification.
- 🧾 **Dashboards**: Personal dashboards for users, NGOs, and admins to track or manage reports.
- 🐛 **Report Statuses**: Each report moves through `Pending → Approved/Rejected → Resolved`.

---

## 📱 Screenshots

> 📂 _Located in the `/snips` folder_

## 📱 Screenshots

| Login | Register | Report |
|-------|----------|--------|
| ![Login](./snips/login.png) | ![Register](./snips/register.png) | ![Report](./snips/report.png) |

| Map | User Dashboard | Admin Dashboard |
|-----|----------------|-----------------|
| ![Map](./snips/map.png) | ![User](./snips/user.png) | ![Admin](./snips/admin.png) |

| NGO Dashboard | Leaderboard | Landing Page 1 |
|---------------|-------------|----------------|
| ![NGO](./snips/ngo.png) | ![Leaderboard](./snips/leaderboard.png) | ![Landing 1](./snips/land.png) |

| Landing Page 2 |
|----------------|
| ![Landing 2](./snips/land2.png) |

---

## 🎥 Demo Video

📽️ [Watch the Demo](https://drive.google.com/file/d/18UcGIUkUaIaakoNc-T00s3mGGEgI5bQ2/view?usp=sharing)

---

## 🚀 Live App

🌐 [Visit the Deployed Site](https://your-deployed-site-url.com)

---

## 🛠️ Tech Stack

**Frontend:**

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Leaflet.js](https://leafletjs.com/) for maps

**Backend / Infra:**

- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Cloud Firestore](https://firebase.google.com/products/firestore) for data storage
- [Firebase Hosting](https://firebase.google.com/products/hosting)

**AI Integration:**

- [TensorFlow.js](https://www.tensorflow.org/js) with MobileNet for pollution image classification

---

## 📦 How to Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/clear-view.git
cd clear-view

# 2. Install dependencies
npm install

# 3. Add Firebase config
# Replace the placeholders in /src/firebase.js with your Firebase credentials

# 4. Run the development server
npm run dev
---
```

## 🤝 Contributing (Coming soon)

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) to get started.

---

## 📜 License (Not yet licensed)

This project is licensed under the [MIT License](LICENSE).

---

## 🙏 Acknowledgements

- This project was built during the Hackathon Hack Eclipse
- Special thanks to Vighnesh for his mentoring

---

## 🧑‍💻 Team
- [Atharv Khare](https://github.com/1mystic)
- [Deebhika Kumaran](https://github.com/deebhikakumaran/Clear-View)
- [Sumit Kumar](https://github.com/sumitkr2000)
- [Bappaditya](https://github.com/Bappaditya13)

---