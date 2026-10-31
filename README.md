# Saiful Islam Rifat - Personal Goal & Vision Board

একটি প্রিমিয়াম, আধুনিক ও প্রতিক্রিয়াশীল ওয়েব অ্যাপ্লিকেশন যা ব্যক্তিগত স্বপ্ন, লক্ষ্য এবং জীবন রূপরেখা সংরক্ষণের জন্য তৈরি করা হয়েছে।

## 🚀 গিটহাব ও লোকাল কম্পিউটারে রান করার নির্দেশিকা (Setup Guide)

### ১. লোকাল কম্পিউটারে রান করার পদ্ধতি:
```bash
# ১. রিপোজিটরি ক্লোন বা ডাউনলোড করুন
git clone <your-repo-url>
cd <repo-folder>

# ২. প্রজেক্টের প্যাকেজ ইনস্টল করুন
npm install

# ৩. ডেভেলপমেন্ট সার্ভার চালু করুন
npm run dev
```
চালু করার পর ব্রাউজারে `http://localhost:3000` এ প্রজেক্টটি দেখতে পাবেন।

---

### ২. গিটহাব পেজেস (GitHub Pages) এ ফ্রি হোস্টিং/লাইভ করার পদ্ধতি:

#### অপশন A: কমান্ড লাইনের মাধ্যমে (gh-pages)
```bash
# ১. প্রজেক্টে গিট শুরু ও কানেক্ট করুন
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main

# ২. এক ক্লিকে গিটহাব পেজেসে ডিপ্লয় করুন
npm run deploy
```

#### অপশন B: অটোমেটিক গিটহাব অ্যাকশনস (GitHub Actions)
প্রজেক্টে `.github/workflows/deploy.yml` ফাইল সংযুক্ত রয়েছে। আপনি কোড গিটহাবে Push করলেই এটি স্বয়ংক্রিয়ভাবে Build করে GitHub Pages-এ পাবলিশ করে দেবে।

1. গিটহাব রিপোজিটরির **Settings** > **Pages** সেকশনে যান।
2. **Build and deployment** > **Source** হিসেবে **GitHub Actions** অথবা `gh-pages` ব্রাঞ্চ নির্বাচন করুন।

---

### 🛠️ ব্যবহৃত টেকনোলজি:
- **React 19** & **TypeScript**
- **Vite** (Ultra fast build tool)
- **Tailwind CSS v4**
- **jspdf & html2canvas** (PDF export & print engine)
- **Lucide Icons**
