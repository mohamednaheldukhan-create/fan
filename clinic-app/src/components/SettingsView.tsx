import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Stethoscope, Save, CheckCircle2 } from "lucide-react";
import type { DoctorInfo } from "@/App";

export function SettingsView({ doctor, setDoctor }: { doctor: DoctorInfo; setDoctor: (d: DoctorInfo) => void }) {
  const [form, setForm] = useState<DoctorInfo>(doctor);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(doctor);
  }, [doctor]);

  const handleSave = () => {
    setDoctor(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };
  
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-teal-900">الإعدادات</h1>
        <p className="text-slate-500 mt-1 text-sm md:text-base">قم بتكوين معلومات الطبيب والعيادة. ستظهر هذه المعلومات على الوصفات المطبوعة.</p>
      </div>
      
      <Card className="shadow-md border-slate-200">
        <CardHeader className="bg-teal-50 border-b border-teal-100">
          <CardTitle className="text-teal-900 flex items-center gap-2">
            <Stethoscope className="w-5 h-5" /> معلومات الطبيب
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">اسم الطبيب (إنجليزي)</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} dir="ltr" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nameAr">اسم الطبيب (عربي)</Label>
              <Input id="nameAr" value={form.nameAr} onChange={(e) => setForm({...form, nameAr: e.target.value})} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="credentials">المؤهلات والتخصص</Label>
            <Input id="credentials" value={form.credentials} onChange={(e) => setForm({...form, credentials: e.target.value})} dir="ltr" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md border-slate-200 mt-6">
        <CardHeader className="bg-teal-50 border-b border-teal-100">
          <CardTitle className="text-teal-900 flex items-center gap-2">
            <Settings className="w-5 h-5" /> معلومات العيادة
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="clinic">اسم العيادة (إنجليزي)</Label>
              <Input id="clinic" value={form.clinic} onChange={(e) => setForm({...form, clinic: e.target.value})} dir="ltr" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clinicAr">اسم العيادة (عربي)</Label>
              <Input id="clinicAr" value={form.clinicAr} onChange={(e) => setForm({...form, clinicAr: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="phone">الهاتف</Label>
              <Input id="phone" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} dir="ltr" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input id="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} dir="ltr" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">العنوان (إنجليزي)</Label>
            <Textarea id="address" value={form.address} onChange={(e) => setForm({...form, address: e.target.value})} dir="ltr" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="addressAr">العنوان (عربي)</Label>
            <Textarea id="addressAr" value={form.addressAr} onChange={(e) => setForm({...form, addressAr: e.target.value})} />
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex flex-col sm:flex-row justify-end items-center gap-4">
        {saved && (
          <div className="flex items-center gap-2 text-teal-700 font-medium">
            <CheckCircle2 className="w-5 h-5" />
            <span>تم الحفظ بنجاح!</span>
          </div>
        )}
        <Button size="lg" className="bg-teal-700 hover:bg-teal-800 w-full sm:w-auto" onClick={handleSave}>
          <Save className="w-4 h-4 ml-2" /> حفظ التغييرات
        </Button>
      </div>
    </div>
  );
}