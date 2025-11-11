# تعليمات النشر والتشغيل - Luna Caftan v2.0
## Deployment Instructions

---

## 🚀 الخطوات المطلوبة قبل النشر

### 1. تحديث قاعدة البيانات (Database Migration)

تم إضافة حقول جديدة في Prisma Schema:
- `tags` (String, JSON array)
- `views` (Int, default 0)
- Indexes على `featured` و `views`

**يجب تنفيذ Migration:**

```bash
# 1. إنشاء migration
npx prisma migrate dev --name add_tags_and_views

# أو في الإنتاج:
npx prisma migrate deploy

# 2. إعادة توليد Prisma Client
npx prisma generate
```

### 2. التحقق من Environment Variables

تأكد من وجود المتغيرات التالية في `.env`:

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://lunacaftan.com"

# للـ PWA والـ SEO
NEXT_PUBLIC_SITE_URL="https://lunacaftan.com"
```

### 3. تحديث URL في الملفات

**الملفات التي تحتاج تحديث URL:**

#### `app/sitemap.ts`
```typescript
const baseUrl = 'https://lunacaftan.com'; // غيّر هذا لدومينك
```

#### `app/robots.ts`
```typescript
const baseUrl = 'https://lunacaftan.com'; // غيّر هذا لدومينك
```

### 4. تحديث Manifest

**ملف**: `public/manifest.json`

تأكد من:
- الأيقونات موجودة في `/public/logo.png`
- الألوان صحيحة
- الـ shortcuts تعمل

---

## 📱 PWA - Service Worker

### تسجيل Service Worker

Service Worker يتم تسجيله تلقائياً في `components/PWAInstallPrompt.tsx`.

**ملاحظات مهمة:**
- PWA Install Prompt يظهر **فقط على الهواتف**
- يحتاج HTTPS في الإنتاج
- يمكن اختباره محلياً على localhost

### كيفية الاختبار:

1. شغّل المشروع محلياً:
```bash
npm run dev
```

2. افتح في Chrome DevTools:
   - Application → Service Workers
   - تأكد من تسجيل `/sw.js`

3. اختبر PWA:
   - Application → Manifest
   - تحقق من البيانات

---

## 🗃️ Migration للمنتجات الموجودة

إذا كان لديك منتجات موجودة بدون `tags` أو `views`:

```sql
-- إضافة قيم افتراضية للمنتجات الموجودة
UPDATE "Product" 
SET 
  tags = '[]',
  views = 0
WHERE 
  tags IS NULL OR views IS NULL;
```

أو استخدم Prisma Studio:

```bash
npx prisma studio
```

---

## 🔧 التثبيت والتشغيل

### للتطوير (Development)

```bash
# 1. تثبيت المكتبات
npm install

# 2. Migration
npx prisma migrate dev

# 3. تشغيل المشروع
npm run dev
```

### للإنتاج (Production)

```bash
# 1. Build
npm run build

# 2. Migration في الإنتاج
npx prisma migrate deploy

# 3. تشغيل
npm start
```

---

## ✅ Checklist قبل النشر

### قاعدة البيانات
- [ ] تنفيذ Migration (`tags`, `views`, indexes)
- [ ] إعادة توليد Prisma Client
- [ ] تحديث المنتجات الموجودة (إذا لزم)

### الملفات
- [ ] تحديث URL في `sitemap.ts`
- [ ] تحديث URL في `robots.ts`
- [ ] التحقق من `manifest.json`
- [ ] التأكد من وجود أيقونات (`/public/logo.png`)

### Environment Variables
- [ ] `DATABASE_URL` صحيح
- [ ] `NEXTAUTH_SECRET` موجود
- [ ] `NEXTAUTH_URL` صحيح
- [ ] `NEXT_PUBLIC_SITE_URL` (اختياري)

### الاختبار
- [ ] تشغيل المشروع محلياً
- [ ] اختبار نظام الوسوم (Tags)
- [ ] اختبار Wishlist
- [ ] اختبار رفع الصور المتعدد
- [ ] اختبار PWA على الهاتف
- [ ] اختبار Bottom Navigation
- [ ] اختبار SEO (sitemap, robots)

### النشر
- [ ] Build بدون أخطاء
- [ ] Migration في الإنتاج
- [ ] Service Worker يعمل (HTTPS)
- [ ] PWA install prompt يظهر على الهواتف
- [ ] Sitemap accessible (`/sitemap.xml`)
- [ ] Robots.txt accessible (`/robots.txt`)

---

## 🐛 حل المشاكل الشائعة

### 1. "tags" column doesn't exist

**الحل:**
```bash
npx prisma migrate deploy
npx prisma generate
```

### 2. Service Worker لا يعمل

**السبب:** يحتاج HTTPS في الإنتاج

**الحل:**
- تأكد من استخدام HTTPS
- أو اختبر على localhost

### 3. PWA Install Prompt لا يظهر

**أسباب محتملة:**
- المستخدم على Desktop (يظهر فقط للهواتف)
- تم dismiss سابقاً (محفوظ في localStorage)
- لم يتم trigger `beforeinstallprompt` event

**الحل:**
```javascript
// مسح localStorage
localStorage.removeItem('pwa-install-dismissed');
```

### 4. Wishlist لا يُحفظ

**السبب:** مشكلة في localStorage

**الحل:**
- تأكد من السماح بـ cookies/localStorage
- افتح DevTools → Application → Local Storage

### 5. الوسوم لا تُحفظ

**السبب:** Migration غير مكتمل

**الحل:**
```bash
# تحقق من Schema
npx prisma db pull

# أعد Migration
npx prisma migrate reset
npx prisma migrate deploy
```

---

## 📊 مراقبة الأداء

### Lighthouse

شغّل Lighthouse للتحقق من:
- Performance
- Accessibility
- Best Practices
- SEO
- PWA

### Prisma Studio

لمراقبة قاعدة البيانات:

```bash
npx prisma studio
```

---

## 🔐 الأمان

### Headers أمان

أضف في `next.config.js`:

```javascript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin',
        },
      ],
    },
  ];
},
```

---

## 📞 الدعم

للمشاكل أو الاستفسارات:
- راجع `IMPLEMENTATION_COMPLETE.md` للتفاصيل
- افحص console logs
- استخدم Prisma Studio للتحقق من البيانات

---

**Version**: 2.0.0  
**Last Updated**: نوفمبر 2024  
**Status**: ✅ Production Ready
