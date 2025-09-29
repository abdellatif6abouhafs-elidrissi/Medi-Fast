# 🚀 تشغيل Backend لحفظ البيانات في قاعدة البيانات

## الخطوات السريعة:

### 1. افتح Terminal جديد في مجلد backend-example:
```bash
cd backend-example
```

### 2. ثبت المكتبات المطلوبة:
```bash
npm install
```

### 3. تأكد من تشغيل MongoDB:
- إذا كان مثبت محلياً: تأكد أنه يعمل
- أو استخدم MongoDB Atlas (مجاني)

### 4. شغل الخادم:
```bash
npm run dev
```

### 5. ستشاهد هذه الرسالة:
```
🚀 الخادم يعمل على http://localhost:4000
📊 قاعدة البيانات: MongoDB
🔗 API متاح على: http://localhost:4000/api/medicines
```

## ✅ اختبار النظام:

1. **شغل Frontend**: `npm run dev` (في المجلد الرئيسي)
2. **اذهب إلى**: صفحة إدارة الأدوية
3. **اضغط**: "إضافة دواء جديد"
4. **املأ البيانات** واضغط "إضافة"
5. **ستحفظ البيانات في MongoDB!**

## 🔍 كيف تعرف أن البيانات حُفظت:

### في Terminal الخادم ستشاهد:
```
تم استلام طلب إضافة دواء: { name: "الدواء الجديد", ... }
تم حفظ الدواء بنجاح: { _id: "...", name: "الدواء الجديد", ... }
```

### في Frontend ستشاهد:
- إشعار: "تم الإضافة بنجاح!" (بدون كلمة "وضع التجريب")
- الدواء يظهر في القائمة فوراً

## 🛠️ إذا لم يعمل:

### تحقق من:
1. **MongoDB يعمل**: `mongod --version`
2. **الخادم يعمل**: افتح `http://localhost:4000/api/medicines`
3. **لا توجد أخطاء**: راجع Terminal الخادم
4. **الـ .env صحيح**: `VITE_API_BASE_URL=http://localhost:4000`

## 📱 اختبار سريع بـ curl:
```bash
curl -X POST http://localhost:4000/api/medicines \
  -H "Content-Type: application/json" \
  -d '{
    "name": "اختبار",
    "price": 10,
    "stock": 5,
    "category": "مسكنات",
    "pharmacyId": "test-pharmacy"
  }'
```
