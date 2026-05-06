# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# BharatSense · भारतसेंस

**Predictive intelligence platform for rural and urban India.**  
20 ML modules. 6 domains. 600 million people.

---

## What it does

BharatSense is a full-stack MLOps platform that delivers early warnings to farmers, women, workers, and communities — before crisis strikes. Every module targets a documented, large-scale Indian problem and predicts it early enough for someone to act.

| Domain | Modules | Coverage |
|---|---|---|
| Agriculture & Rural | M01–M04 | 600M farming dependents |
| Women's Health & Safety | M05–M08 | Maternal, PCOS, cancer, GBV |
| Water & Environment | M09–M12 | Contamination, scarcity, heatwave |
| Urban Health & Air | M13–M16 | AQI, TB, malnutrition, mental health |
| Financial Wellbeing | M17–M18 | UPI stress, farmer loan default |
| Infrastructure & Safety | M19–M20 | Road hotspots, PHC stock-outs |

---

## Live modules

| ID | Module | Status |
|---|---|---|
| M01 | Crop & Soil Advisor | ✅ Live |
| M02–M20 | Coming soon | 🔨 Building |

---

## Tech stack

**Frontend** — React, Vite, Tailwind CSS, Framer Motion  
**Backend** — FastAPI, Python 3.13  
**ML** — scikit-learn, XGBoost, PyTorch  
**Data** — Open-Meteo (weather), Agmarknet (mandi prices), OpenAQ (air quality), CGWB (groundwater)  
**Infra** — Render (API), Vercel (frontend)

Zero paid tools. Zero paid APIs.

---

## M01 — Crop & Soil Advisor

Predicts irrigation need 72 hours ahead using real-time soil moisture and weather data.

- **Model**: Random Forest (irrigation classification) + XGBoost (yield stress index)
- **Data**: Open-Meteo API — soil moisture, ET rate, rainfall forecast
- **Output**: Irrigation decision, best watering window, yield outlook, SMS alert text
- **Crops**: Wheat, Rice, Tomato, Cotton, Sugarcane, Maize, Soybean, Potato

---

## Run locally

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux
python -m pip install -r requirements.txt
uvicorn m01_backend:app --reload --port 8000
```

API docs at `http://localhost:8000/docs`

### Frontend

```bash
npm install
npm run dev
```

App at `http://localhost:5173`

Create `.env` in the project root:
```
VITE_API_URL=http://localhost:8000
```

---

## Project structure

```
bharatsense/
├── backend/
│   ├── m01_backend.py       # M01 FastAPI app
│   └── requirements.txt
├── src/
│   ├── components/
│   │   ├── M01CropAdvisor.jsx
│   │   ├── Modules.jsx
│   │   └── ...
│   └── App.jsx
├── .env                     # local API URL
├── .env.production          # production API URL
└── package.json
```

---

## Roadmap

- [x] M01 Crop & Soil Advisor
- [ ] M02 Mandi Price Predictor — LSTM 14-day forecast
- [ ] M03 Flood & Drought Warning
- [ ] M04 Livestock Disease Risk
- [ ] M05–M20 in progress

---

*Built for the 90% — farmers, women, daily-wage workers, government health workers — who have never had access to predictive intelligence.*