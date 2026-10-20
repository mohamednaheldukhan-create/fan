import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilePlus2, Database, Settings, Users, Activity, Pill, CalendarClock } from "lucide-react";
import type { View, DoctorInfo } from "@/App";
import { getCounts } from "@/lib/db";

interface DashboardProps {
  setView: (view: View) => void;
  doctor: DoctorInfo;
}

export function Dashboard({ setView, doctor }: DashboardProps) {
  const [counts, setCounts] = useState({ drugs: 0, patients: 0, prescriptionsThisMonth: 0 });

  useEffect(() => {
    getCounts().then(setCounts).catch((e) => console.error("Failed to load counts", e));
  }, []);

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-teal-900">مرحباً، {doctor.nameAr}</h1>
        <p className="text-slate-500 mt-1 text-sm md:text-base">{[doctor.credentials, doctor.clinicAr].filter(Boolean).join(" • ")}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        <Card className="bg-teal-50 border-teal-200 shadow-sm">
          <CardContent className="p-4 md:p-6 flex items-center gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-teal-600 rounded-xl flex items-center justify-center text-white">
              <Pill className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-teal-900">{counts.drugs}</p>
              <p className="text-xs md:text-sm text-teal-700">أدوية في قاعدة البيانات</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-200 shadow-sm">
          <CardContent className="p-4 md:p-6 flex items-center gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-500 rounded-xl flex items-center justify-center text-white">
              <Users className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-amber-900">{counts.patients}</p>
              <p className="text-xs md:text-sm text-amber-700">مرضى مسجلون</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-sky-50 border-sky-200 shadow-sm">
          <CardContent className="p-4 md:p-6 flex items-center gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-sky-600 rounded-xl flex items-center justify-center text-white">
              <Activity className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-sky-900">{counts.prescriptionsThisMonth}</p>
              <p className="text-xs md:text-sm text-sky-700">وصفات طبية هذا الشهر</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-lg md:text-xl font-serif font-semibold text-slate-800 mb-4">إجراءات سريعة</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <Card className="shadow-md hover:shadow-lg transition-shadow border-slate-200">
          <CardHeader>
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mb-2">
              <FilePlus2 className="w-5 h-5 text-teal-700" />
            </div>
            <CardTitle className="text-base md:text-lg">وصفة جديدة</CardTitle>
            <CardDescription className="text-xs md:text-sm">إنشاء وصفة طبية جديدة وطباعتها</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-teal-700 hover:bg-teal-800" onClick={() => setView("prescription")}>
              ابدأ
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow border-slate-200">
          <CardHeader>
            <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center mb-2">
              <CalendarClock className="w-5 h-5 text-sky-700" />
            </div>
            <CardTitle className="text-base md:text-lg">إدارة العيادة</CardTitle>
            <CardDescription className="text-xs md:text-sm">المواعيد وملاحظات المرضى</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full border-sky-200 text-sky-700 hover:bg-sky-50" onClick={() => setView("clinic")}>
              افتح
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow border-slate-200">
          <CardHeader>
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-2">
              <Database className="w-5 h-5 text-indigo-700" />
            </div>
            <CardTitle className="text-base md:text-lg">قاعدة الأدوية</CardTitle>
            <CardDescription className="text-xs md:text-sm">تصفح سجلات الأدوية والتفاعلات</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50" onClick={() => setView("database")}>
              تصفح
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow border-slate-200">
          <CardHeader>
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mb-2">
              <Settings className="w-5 h-5 text-slate-700" />
            </div>
            <CardTitle className="text-base md:text-lg">الإعدادات</CardTitle>
            <CardDescription className="text-xs md:text-sm">تحديث معلومات الطبيب والعيادة</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" onClick={() => setView("settings")}>
              تكوين
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}