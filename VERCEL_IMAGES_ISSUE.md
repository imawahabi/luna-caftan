# مشكلة صور المنتجات على Vercel

## المشكلة
الصور لا تظهر على Vercel لأن النظام الحالي يحفظ الصور في `/public/uploads` محلياً.
Vercel هو serverless ولا يحفظ الملفات بشكل دائم.

## الحل المقترح
استخدام خدمة تخزين سحابية مثل:

### 1. Cloudinary (مجاني - موصى به)
- التسجيل: https://cloudinary.com
- 25 GB تخزين مجاني
- سهل التكامل مع Next.js

### 2. UploadThing (المكتبة موجودة بالفعل)
- التسجيل: https://uploadthing.com
- 2 GB مجاني
- مصمم خصيصاً لـ Next.js

### 3. AWS S3
- أكثر تعقيداً
- يحتاج إعداد أكثر

## خطوات الحل السريع باستخدام Cloudinary:

1. سجل حساب على https://cloudinary.com
2. احصل على:
   - Cloud Name
   - API Key
   - API Secret

3. أضف المتغيرات في `.env`:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. ثبت المكتبة:
```bash
npm install cloudinary
```

5. عدّل `/app/api/upload/route.ts` لاستخدام Cloudinary بدلاً من الحفظ المحلي

6. أضف نفس المتغيرات في Vercel → Settings → Environment Variables

## ملاحظة مهمة
الصور الموجودة حالياً في `/public/uploads` يجب رفعها يدوياً إلى Cloudinary
ثم تحديث روابطها في قاعدة البيانات.
