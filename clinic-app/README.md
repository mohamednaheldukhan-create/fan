# المساعد الطبي – مركز محمد دخان (د. غادة)

تطبيق React + Vite + Tailwind مغلّف بـ Capacitor، وقاعدة البيانات SQLite محلية على الجهاز
(جداول: patients, drugs, prescriptions, settings).

## الطريقة 1: بناء APK تلقائياً عبر GitHub (الأسهل، بدون تثبيت أي شيء)

1. أنشئ مستودعاً جديداً على GitHub وارفع محتوى هذا المجلد إليه.
2. افتح تبويب **Actions** ← **Build APK** ← **Run workflow**.
3. بعد دقائق نزّل الملف `clinic-apk` من قسم Artifacts، وفيه `app-debug.apk`.

## الطريقة 2: البناء على جهازك

المتطلبات: Node 22، JDK 21، Android Studio (أو Android SDK).

```bash
npm install
npm run build
npx cap add android
npx cap sync android
cd android
./gradlew assembleDebug      # على ويندوز: gradlew.bat assembleDebug
```

الملف الناتج: `android/app/build/outputs/apk/debug/app-debug.apk`

## تجربة سريعة في المتصفح

```bash
npm install
npm run dev
```

في المتصفح تُحفظ البيانات في localStorage، وفي التطبيق على الأندرويد تُحفظ في SQLite.
