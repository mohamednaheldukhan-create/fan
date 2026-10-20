import { Button } from "@/components/ui/button";
import { Printer, ArrowRight } from "lucide-react";
import type { DoctorInfo } from "@/App";

interface PrescriptionPrintProps {
  data: any;
  doctor: DoctorInfo;
  onBack: () => void;
}

export function PrescriptionPrint({ data, doctor, onBack }: PrescriptionPrintProps) {
  const drugs = data?.drugs || [];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6 no-print">
        <Button variant="outline" onClick={onBack}>
          <ArrowRight className="w-4 h-4 ml-2" />
          رجوع للتعديل
        </Button>
        <Button onClick={handlePrint} className="bg-teal-600 hover:bg-teal-700 text-white">
          <Printer className="w-4 h-4 ml-2" />
          طباعة الوصفة
        </Button>
      </div>

      <div id="prescription-print-area" className="bg-white p-8 md:p-12 shadow-lg rounded-lg border border-slate-200" dir="rtl">
        <div className="flex justify-between items-start border-b-2 border-teal-600 pb-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-teal-900 font-serif">{doctor.clinicAr}</h1>
            {doctor.addressAr && <p className="text-slate-600 text-sm mt-1">{doctor.addressAr}</p>}
            {doctor.phone && <p className="text-slate-600 text-sm">هاتف: {doctor.phone}</p>}
          </div>
          <div className="text-left">
            <h2 className="text-xl font-bold text-teal-900">{doctor.nameAr}</h2>
            {doctor.credentials && <p className="text-slate-600 text-sm">{doctor.credentials}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div className="space-y-1">
            <p><span className="font-bold text-slate-700">اسم المريض: </span><span className="text-slate-600">{data?.patientName || "—"}</span></p>
            <p><span className="font-bold text-slate-700">العمر: </span><span className="text-slate-600">{data?.patientAge || "—"}</span></p>
            <p><span className="font-bold text-slate-700">الجنس: </span><span className="text-slate-600">{data?.patientGender || "—"}</span></p>
          </div>
          <div className="space-y-1">
            <p><span className="font-bold text-slate-700">التاريخ: </span><span className="text-slate-600">{data?.date || "—"}</span></p>
            <p><span className="font-bold text-slate-700">التشخيص: </span><span className="text-slate-600">{data?.patientDiagnosis || "—"}</span></p>
            <p><span className="font-bold text-slate-700">الحساسية: </span><span className="text-slate-600">{data?.patientAllergies || "لا يوجد"}</span></p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold text-teal-900 mb-3 border-r-4 border-teal-600 pr-2">الأدوية الموصوفة</h3>
          {drugs.length === 0 ? (
            <p className="text-slate-500 text-center py-4">لا توجد أدوية مضافة.</p>
          ) : (
            <div className="space-y-4">
              {drugs.map((drug: any, index: number) => (
                <div key={drug.id || index} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-teal-900 text-lg">{index + 1}. {drug.nameAr}</h4>
                      <p className="text-sm text-slate-500">{drug.nameEn} - {drug.strength} - {drug.form}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm mt-3 bg-white p-3 rounded-md border border-slate-100">
                    <p><span className="font-bold text-slate-700">الجرعة: </span><span className="text-slate-600">{drug.dosage || "—"}</span></p>
                    <p><span className="font-bold text-slate-700">التكرار: </span><span className="text-slate-600">{drug.frequency || "—"}</span></p>
                    <p><span className="font-bold text-slate-700">المدة: </span><span className="text-slate-600">{drug.duration || "—"}</span></p>
                  </div>
                  {drug.instructions && (
                    <p className="text-sm text-slate-600 mt-2 bg-amber-50 p-2 rounded-md border border-amber-100">
                      <span className="font-bold text-amber-700">تعليمات: </span>{drug.instructions}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-12 pt-6 border-t border-slate-200 flex justify-end">
          <div className="text-center">
            <div className="w-48 h-20 border-b border-dashed border-slate-300 mb-2"></div>
            <p className="text-sm text-slate-600">توقيع الطبيب: {doctor.nameAr}</p>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          #prescription-print-area {
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          body {
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
}