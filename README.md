# Prompt Library – AI Prompt Marketplace & Community Platform

![Next.js](https://img.shields.io/badge/Next.js%2015-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Razorpay](https://img.shields.io/badge/Razorpay-0A254E?style=for-the-badge&logo=razorpay&logoColor=white)

**A modern full-stack AI prompt marketplace where creators sell their prompts and users buy proven, high-quality AI prompts instantly.**

Live Demo → (Add your Vercel link here after deploy)

---

## 🚀 Features

- **User Authentication** – Login/Signup with Email + Google OAuth
- **Profile Dashboard** – View My Prompts, Purchased Prompts, Liked Prompts
- **Upload & Sell Prompts** – Set price, add preview image, tags, category
- **Razorpay Payment Gateway** – Buy premium prompts securely
- **Like & Comment System** – One like per user, real-time comments
- **Instant Download** – After purchase, download image immediately
- **Fully Responsive** – Works perfectly on mobile & desktop
- **SEO Optimized** – Built with Next.js 14 App Router

---

## 🛠 Tech Stack

| Category              | Technology                              |
|-----------------------|-----------------------------------------|
| Framework             | Next.js 15 (App Router + Server Components) |
| Language              | TypeScript                              |
| Styling               | Tailwind CSS                            |
| Authentication        | NextAuth.js                             |
| Database              | MongoDB + Mongoose                      |
| File Storage          | Amazon S3                               |
| Payment Gateway       | Razorpay                                |
| Deployment            | Vercel                                  |

---

## 🔥 Key Modules

1. **Authentication System**  
2. **User Profile & Dashboard**  
3. **Prompt Marketplace (Masonry Grid)**  
4. **Prompt Creation & Monetization**  
5. **Secure Payment Integration (Razorpay)**  
6. **Like & Comment System**  
7. **Purchase History & Download**  
8. **Responsive & SEO-Friendly UI**

---

## 📸 Screenshots



<div align="center">

### 🏠 Home Page – Beautiful Hero + Prompt Grid
Beautiful hero section with trending prompts in a responsive masonry grid  
Fully mobile-friendly • Dark gradient theme • Instant search ready

![Home Page1](./public/screenshots/hero.png)
![Home Page2](./public/screenshots/home.png)

### 🔐 Login Page - Clean & Minimal
Clean, minimal login with Google OAuth & email/password  
Dark mode • Fast loading • Secure authentication

![Login](./public/screenshots/login.png)


### 👤 Profile Dashboard – My Prompts, Purchased, Liked
Personalized view with My Prompts, Purchased & Liked tabs  
Avatar upload • Name edit • Stats panel

![Profile2](./public/screenshots/profile1.png)
![Profile2](./public/screenshots/profile2.png)

### 🎨 Prompt Detail Page – Full View + Buy Button
Full prompt view with title, description, tags, price & creator info  
Like, comment & real-time interaction • Buy button for paid prompts

![Prompt Detail](./public/screenshots/prompt-detail.png)


### 💸 Razorpay Payment Gateway – Real Payment Flow 
Seamless & secure payment with real Indian Rupee support  
Test + Live mode • Instant confirmation

![Payment Success](./public/screenshots/payment-success.png)

### ⬇️ Instant Download After Purchase
After successful payment → direct high-quality image download  
No waiting • No extra steps

![Prompt details after payment 1](./public/screenshots/prompt_detail_after_pay1.png)
![Prompt details after payment 2](./public/screenshots/prompt_detail_after_pay2.png)


</div>


---

## 🚀 Quick Start (Run Locally)

```bash
git clone https://github.com/yourusername/prompt-library.git
cd prompt-library
npm install
cp .env.example .env.local
# Add your keys in .env.local
npm run dev