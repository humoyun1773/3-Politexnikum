# 3-Politexnikum

# 3-Politexnikum Talabalar Axborot Tizimi (Student Hub Dashboard)

Zamonaviy **React**, **TypeScript**, **Tailwind CSS**, **shadcn/ui** va **React Router** asosida yaratilgan 3-Politexnikum talabalari uchun yagona boshqaruv portali (Dashboard).

Loyihada landing page mavjud emas, to'g'ridan-to'g'ri tizimga kirish (Login) va talabalar uchun to'liq funksional Dashboard ishga tushiriladi.

Backend API: `http://169.58.215.170:8090/` (Swagger OpenAPI 3 integratsiyasi).

---

## 🚀 Texnologiyalar steki

- **Frontend kutubxonasi**: React 18 + Vite (ESM)
- **Til**: TypeScript (qat'iy tiplashtirilgan arxitektura)
- **Marshrutlash (Routing)**: React Router v6 (Data Router + Protected Routes)
- **Stillashtirish**: Tailwind CSS + shadcn/ui dizayn tizimi
- **UI Komponentlar**: Radix UI (Dialog, DropdownMenu, Tabs, Avatar, Progress, Slot)
- **Ikonkalar**: Lucide React
- **Grafiklar & Analitika**: Recharts (baholar dinamikasi, davomat statistikasi)
- **HTTP mijoz**: Axios (JWT token avto-injeksiya va `/api/auth/refresh/` orqali yangilash)
- **SEO optimizatsiya**: React Helmet Async, OpenGraph, Meta teglar, `robots.txt`, `sitemap.xml`
- **Mavzular**: To'liq Dark Mode / Light Mode / System rejim qo'llab-quvvatlashi

---

## 📂 Papkalar strukturasi (Clean Architecture)

```
3-politexnikum/
├── public/
│   ├── robots.txt            # SEO qidiruv botlari uchun ko'rsatma
│   ├── sitemap.xml           # Qidiruv tizimlari xaritasi
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── common/           # SEO, ThemeToggle komponentlari
│   │   ├── layout/           # DashboardLayout, Sidebar, Header
│   │   ├── search/           # GlobalSearchModal (⌘K / Ctrl+K)
│   │   └── ui/               # shadcn/ui: button, card, input, dialog, tabs, progress, avatar, badge
│   ├── context/
│   │   ├── AuthContext.tsx   # JWT avtorizatsiya va Demo rejim konteksti
│   │   └── ThemeContext.tsx  # Dark / Light mavzular provayderi
│   ├── data/
│   │   └── mockData.ts       # 3-Politexnikum sxemasiga mos realistik ma'lumotlar
│   ├── lib/
│   │   └── utils.ts          # clsx + twMerge, sana va ball rang formatlagichlari
│   ├── pages/
│   │   ├── announcements/    # E'lonlar va rasmiy xabarlar
│   │   ├── assignments/      # Topshiriqlar, amaliyot va BSB (topshirish modali bilan)
│   │   ├── attendance/       # Davomat jurnali (keldi, qoldirilgan, kechikish)
│   │   ├── auth/             # Kirish sahifasi (Login)
│   │   ├── chat/             # Guruh muloqoti (chat xabarlari almashish)
│   │   ├── dashboard/        # Boshqaruv paneli (GPA, statistika, darslar, grafik)
│   │   ├── goals/            # Talabaning shaxsiy maqsadlari (CRUD)
│   │   ├── grades/           # O'zlashtirish va baholar qaydnomasi
│   │   ├── library/          # Elektron kutubxona va PDF yuklab olish
│   │   ├── not-found/        # 404 sahifa
│   │   ├── profile/          # Talaba profili va statistikasi
│   │   ├── rating/           # Talabalar akademik reytingi (Top 3 shohsupa)
│   │   ├── schedule/         # Dars jadvali (kunlar bo'yicha filter)
│   │   └── settings/         # Tizim sozlamalari va parolni yangilash
│   ├── router/
│   │   └── index.tsx         # Barcha yo'nalishlar va himoyalangan marshrutlar
│   ├── services/
│   │   ├── api.ts            # Axios sozlamalari va JWT interceptor
│   │   └── student.service.ts# Swagger API'ning barcha endpointlari uchun servislar
│   ├── types/
│   │   └── api.types.ts      # OpenAPI 3 ga mos to'liq TypeScript tiplari
│   ├── App.tsx
│   ├── index.css             # Tailwind va shadcn CSS o'zgaruvchilari
│   └── main.tsx
├── .env.example
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🌐 Swagger API integratsiyasi (Endpoints)

Tizim `http://169.58.215.170:8090/` Swagger API bilan to'liq integratsiya qilingan:

| Modul | Endpoint | Metod | Tavsif |
|---|---|---|---|
| **Avtorizatsiya** | `/api/auth/login/` | `POST` | Foydalanuvchi JWT tokenlarini olish |
| | `/api/auth/refresh/` | `POST` | Access tokenni yangilash |
| **Dashboard** | `/api/dashboard/` | `GET` | Bosh sahifa uchun umumiy ma'lumotlar |
| **Dars jadvali** | `/api/schedule/` | `GET` | Haftalik dars jadvali |
| | `/api/schedule/today/` | `GET` | Bugungi mashg'ulotlar |
| | `/api/schedule/next/` | `GET` | Navbatdagi dars |
| **Baholar** | `/api/grades/` | `GET` | Baholar va nazorat natijalari |
| **Davomat** | `/api/attendance/` | `GET` | Davomat jurnali |
| | `/api/attendance/summary/` | `GET` | Umumiy qatnashish foizi |
| **Topshiriqlar** | `/api/assignments/` | `GET` | Amaliyot va BSB vazifalari |
| | `/api/assignments/{id}/submit/` | `POST` | Vazifani topshirish |
| **Reyting** | `/api/rating/` | `GET` | O'rtacha baholar bo'yicha guruh peshqadamlari |
| **Guruh chat** | `/api/chat/` | `GET`, `POST` | Guruhdoshlar o'rtasida muloqot |
| **Kutubxona** | `/api/library/` | `GET` | Elektron darsliklar va PDF manbalar |
| **E'lonlar** | `/api/announcements/` | `GET` | Rasmiy dekanat e'lonlari |
| **Maqsadlar** | `/api/goals/` | `GET`, `POST` | Shaxsiy o'quv maqsadlarini boshqarish |
| | `/api/goals/{id}/` | `PATCH`, `DELETE` | Maqsadni yakunlash / o'chirish |
| **Profil** | `/api/profile/` | `GET`, `PATCH` | Talaba ma'lumotlarini ko'rish va yangilash |
| **Sozlamalar** | `/api/settings/` | `GET`, `PATCH` | Bildirishnoma sozlamalari |
| | `/api/settings/change-password/` | `POST` | Parolni o'zgartirish |
| **Qidiruv** | `/api/search/` | `GET` | Global qidiruv (fan, o'qituvchi, vazifa) |

---

## ⚡ O'rnatish va ishga tushirish

### 1. Loyihani yuklab olish
```bash
git clone https://github.com/humoyun1773/3-Politexnikum.git
cd 3-Politexnikum
```

### 2. Bog'liqliklarni o'rnatish
```bash
npm install
```

### 3. Loyihani dev rejimida ishga tushirish
```bash
npm run dev
```

Brauzerda `http://localhost:3000` manzilini oching.

### 4. Ishlab chiqarish (Production) uchun yig'ish
```bash
npm run build
```

---

## 🎨 Dizayn xususiyatlari

- **Media & Responsive dizayn**: Mobil telefonlar (320px+), planshetlar va katta monitorlar uchun to'liq moslashtirilgan.
- **Dark & Light Mode**: Oson va silliq ranglar almashishi (kun/tun rejimlari).
- **Tezkor Demo rejim**: Login sahifasida mavjud bo'lgan 1-kliklik Demo rejim orqali darhol barcha imkoniyatlarni jonli sinab ko'rish mumkin.
- **Global qidiruv**: Istalgan sahifada `Ctrl+K` yoki `Cmd+K` tugmasini bosib kerakli dars, o'qituvchi yoki kitobni bir lahzada topish mumkin.

---

## 📄 Litsenziya
MIT © 2026 3-Politexnikum Talabalar Portali
