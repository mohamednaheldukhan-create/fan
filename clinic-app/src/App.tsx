import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Dashboard } from "@/components/Dashboard";
import { PrescriptionBuilder } from "@/components/PrescriptionBuilder";
import { DrugDatabase } from "@/components/DrugDatabase";
import { PrescriptionPrint } from "@/components/PrescriptionPrint";
import { ClinicManagement } from "@/components/ClinicManagement";
import { SettingsView } from "@/components/SettingsView";
import { Menu, Stethoscope } from "lucide-react";
import { initDb, getSetting, setSetting, prescriptionsDb } from "@/lib/db";
import { Button } from "@/components/ui/button";

export type View = "dashboard" | "prescription" | "database" | "settings" | "clinic" | "print";

export interface DoctorInfo {
  name: string;
  nameAr: string;
  credentials: string;
  clinic: string;
  clinicAr: string;
  phone: string;
  email: string;
  address: string;
  addressAr: string;
}

const DEFAULT_DOCTOR: DoctorInfo = {
  name: "Dr. Ghada",
  nameAr: "د. غادة",
  credentials: "",
  clinic: "Mohammed Dukhan Center",
  clinicAr: "مركز محمد دخان",
  phone: "",
  email: "",
  address: "",
  addressAr: "",
};

export default function App() {
  const [view, setView] = useState<View>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [prescriptionData, setPrescriptionData] = useState<any>(null);
  
  const [ready, setReady] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const [doctor, setDoctorState] = useState<DoctorInfo>(DEFAULT_DOCTOR);

  useEffect(() => {
    (async () => {
      try {
        await initDb();
        const saved = await getSetting("doctorInfo");
        if (saved) setDoctorState({ ...DEFAULT_DOCTOR, ...JSON.parse(saved) });
        else await setSetting("doctorInfo", JSON.stringify(DEFAULT_DOCTOR));
        setReady(true);
      } catch (e) {
        console.error("Database init failed", e);
        setDbError(String(e));
      }
    })();
  }, []);

  const setDoctor = (d: DoctorInfo) => {
    setDoctorState(d);
    setSetting("doctorInfo", JSON.stringify(d)).catch((e) => console.error("Failed to save doctor info", e));
  };

  const handleSetView = (v: View) => {
    setView(v);
    setIsSidebarOpen(false);
  };

  if (dbError) {
    return (
      <div className="flex h-screen items-center justify-center p-6 text-center text-red-700" dir="rtl">
        تعذر فتح قاعدة البيانات: {dbError}
      </div>
    );
  }
  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center text-teal-800" dir="rtl">
        جاري التحميل...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-100 text-slate-800 overflow-hidden" dir="rtl">
      <Sidebar view={view} setView={handleSetView} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-200 p-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu className="w-6 h-6 text-teal-800" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-serif font-bold text-teal-900 text-lg">المساعد الطبي</h1>
          </div>
          <div className="w-10"></div>
        </header>
        
        <main className="flex-1 overflow-y-auto">
          {view === "dashboard" && <Dashboard setView={setView} doctor={doctor} />}
          {view === "prescription" && (
            <PrescriptionBuilder 
              doctor={doctor} 
              onPrint={(data) => {
                prescriptionsDb.add(data).catch((e) => console.error("Failed to save prescription", e));
                setPrescriptionData(data);
                setView("print");
              }} 
            />
          )}
          {view === "database" && <DrugDatabase />}
          {view === "clinic" && <ClinicManagement />}
          {view === "print" && prescriptionData && (
            <PrescriptionPrint 
              data={prescriptionData} 
              doctor={doctor} 
              onBack={() => setView("prescription")} 
            />
          )}
          {view === "settings" && <SettingsView doctor={doctor} setDoctor={setDoctor} />}
        </main>
      </div>
    </div>
  );
}