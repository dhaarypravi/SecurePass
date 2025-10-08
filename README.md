# 🔐 Secure Vault - Password Manager

A modern, privacy-first password manager built with Next.js 15, featuring client-side encryption, two-factor authentication, and a beautiful user interface.

![Secure Vault](https://img.shields.io/badge/Secure-Vault-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)

## 🌟 Live Demo

🚀 **Live Application:** https://secure-pass-pi.vercel.app

**Video Link** https://drive.google.com/file/d/1zo3seLcLc8pxvDikU3NhWJjy7PAQLDlD/view?usp=sharing

## ✨ Features

### 🔐 Security First
- **Client-Side Encryption** - Passwords encrypted before leaving your device
- **Two-Factor Authentication** - Extra security layer with TOTP support
- **Master Password Protection** - PBKDF2 key derivation for encryption
- **Secure Sessions** - JWT-based authentication with proper expiration

### 🛠️ Core Functionality
- **Smart Password Generator** - Customizable length, symbols, numbers
- **Encrypted Vault** - Secure storage for all your credentials
- **One-Click Copy** - Auto-clearing clipboard for security
- **Search & Filter** - Quickly find your saved items
- **Export/Import** - Backup your data in JSON or CSV format

### 🎨 User Experience
- **Modern UI** - Clean, intuitive interface built with Tailwind CSS
- **Password Strength Meter** - Visual feedback on password quality
- **Responsive Design** - Works perfectly on all devices
- **Real-time Validation** - Instant feedback on forms

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/secure-vault.git
   cd secure-vault
Install dependencies

bash
npm install
Environment Setup
Create .env.local file:

env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_super_secret_key_here
NEXTAUTH_URL=http://localhost:3000
Run the development server

bash
npm run dev
Open your browser
Navigate to http://localhost:3000

🛠️ Tech Stack
Frontend
Next.js 15 - React framework with App Router

TypeScript - Type-safe development

Tailwind CSS - Utility-first CSS framework

React Hook Form - Form handling and validation

Backend
Next.js API Routes - Serverless functions

MongoDB - NoSQL database

Mongoose - MongoDB object modeling

NextAuth.js - Complete authentication

Security
CryptoJS - Client-side encryption

bcryptjs - Password hashing

speakeasy - Two-factor authentication

QRCode - QR code generation for 2FA

📁 Project Structure
text
secure-vault/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── dashboard/         # Protected dashboard
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── auth/              # Authentication components
│   ├── vault/             # Vault-related components
│   └── ui/                # UI components
├── lib/                   # Utility libraries
│   ├── auth.ts            # NextAuth configuration
│   ├── encryption.ts      # Encryption utilities
│   └── mongodb.ts         # Database connection
├── models/                # Database models
└── types/                 # TypeScript definitions
🔧 API Endpoints
Authentication
POST /api/auth/signup - User registration

POST /api/auth/[...nextauth] - NextAuth endpoints

Vault Management
GET /api/vault/items - Get user's vault items

POST /api/vault/items - Create new vault item

PUT /api/vault/items/[id] - Update vault item

DELETE /api/vault/items/[id] - Delete vault item

GET /api/vault/export - Export vault data

2FA Management
GET /api/auth/2fa/generate - Generate 2FA secret

POST /api/auth/2fa/verify - Verify 2FA code

POST /api/auth/2fa/enable - Enable 2FA for user

GET /api/auth/2fa/status - Check 2FA status

🛡️ Security Features
Encryption
All passwords encrypted client-side using AES-256

Master password derivation using PBKDF2 with 100,000 iterations

Encryption keys never leave the client device

Authentication
Secure session management with JWT

Two-factor authentication support

Password hashing with bcrypt

Data Protection
No plaintext passwords stored on server

User data isolation in database

Automatic session expiration

🎯 Usage Guide
1. Getting Started
Create an account with your email and password

Set up your master password for encryption

Start adding your first credentials

2. Managing Passwords
Use the password generator for strong passwords

Organize items with titles, usernames, and notes

Search and filter to quickly find items

3. Security Features
Enable 2FA in settings for extra security

Export your data regularly for backups

Use the strength meter to ensure password quality

🚀 Deployment
Vercel (Recommended)
bash
npm run build
# Deploy to Vercel through GitHub integration
Environment Variables for Production
env
MONGODB_URI=your_production_mongodb_uri
NEXTAUTH_SECRET=your_secure_random_secret
NEXTAUTH_URL=https://yourdomain.com
🤝 Contributing
We welcome contributions! Please see our Contributing Guide for details.

Fork the project

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

🐛 Bug Reports
Found a bug? Please open an issue with detailed information.

🙏 Acknowledgments
Next.js team for the amazing framework

Tailwind CSS for the utility-first CSS framework

NextAuth.js for seamless authentication

MongoDB for reliable data storage

📞 Support
If you need help with setup or have questions:

📧 Email: your-email@example.com

🐛 GitHub Issues

📖 Check our Documentation Wiki

<div align="center">
⭐ Don't forget to star this repository if you find it helpful!

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS

</div> ```
🎯 How to Use This README:
Replace placeholder text:

[Your Live Link Here] → Your actual deployment URL

yourusername → Your GitHub username

your-email@example.com → Your contact email

Add badges (optional but recommended):

Add deployment status badges from Vercel/Netlify

Add package version badges

Add license badge

Add screenshots (highly recommended):

markdown
## 📸 Screenshots

![Dashboard](screenshots/dashboard.png)
![Password Generator](screenshots/generator.png)
![Vault](screenshots/vault.png)
Add video demo (optional but great):

markdown
## 🎥 Demo Video

[![Watch the demo](https://img.youtube.com/vi/VIDEO_ID/0.jpg)](https://youtube.com/watch?v=VIDEO_ID)
🚀 Deployment Platforms:
For your live link, consider:

Vercel (best for Next.js) - https://your-app.vercel.app

Netlify - https://your-app.netlify.app

Railway - https://your-app.up.railway.app

Digital Ocean - https://your-app.ondigitalocean.app

Just replace the placeholder with your actual deployment URL once you deploy!

This README will make your project look professional and help others understand and use your password manager! 🎉
