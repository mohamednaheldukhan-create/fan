import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Trash2, Printer, User, Pill, FileText, AlertTriangle } from "lucide-react";
import type { DoctorInfo } from "@/App";
import { drugsDb, type Drug } from "@/lib/db";

interface PrescriptionBuilderProps {
  doctor: DoctorInfo;
  onPrint: (data: any) => void;
}

export function PrescriptionBuilder({ doctor, onPrint }: PrescriptionBuilderProps) {
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState("");
  const [patientDiagnosis, setPatientDiagnosis] = useState("");
  const [patientAllergies, setPatientAllergies] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [search, setSearch] = useState("");
  const [selectedDrugs, setSelectedDrugs] = useState<any[]>([]);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    drugsDb.list().then(setDrugs).catch((e) => console.error("Failed to load drugs", e));
  }, []);

  const filteredDrugs = drugs.filter(drug => 
    drug.nameAr.toLowerCase().includes(search.toLowerCase()) ||
    drug.nameEn.toLowerCase().includes(search.toLowerCase()) ||
    drug.activeIngredients.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddDrug = (drug: Drug) => {
    setSelectedDrugs([...selectedDrugs, {
      id: Date.now().toString(),
      drugId: drug.id,
      nameAr: drug.nameAr,
      nameEn: drug.nameEn,
      form: drug.form,
      strength: drug.strength,
      activeIngredients: drug.activeIngredients,
      warnings: drug.warnings,
      dosage: "",
      frequency: "",
      duration: "",
      instructions: ""
    }]);
    setShowSearch(false);
    setSearch("");
  };

  const handleRemoveDrug = (id: string) => {
    setSelectedDrugs(selectedDrugs.filter(d => d.id !== id));
  };

  const handleUpdateDrugDetails = (id: string, field: string, value: string) => {
    setSelectedDrugs(selectedDrugs.map(d => 
      d.id === id ? { ...d, [field]: value } : d
    ));
  };

  const handlePrint = () => {
    onPrint({
      patientName,
      patientAge,
      patientGender,
      patientDiagnosis,
      patientAllergies,
      date,
      drugs: selectedDrugs,
      doctor
    });
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-teal-900 font-serif">إنشاء وصفة طبية</h2>
          <p className="text-slate-500 text-sm mt-1">أدخل بيانات المريض والأدوية المطلوبة</p>
        </div>
        <Button 
          onClick={handlePrint} 
          className="bg-teal-600 hover:bg-teal-700 text-white"
          disabled={selectedDrugs.length === 0 || !patientName}
        >
          <Printer className="w-4 h-4 ml-2" />
          معاينة وطباعة
        </Button>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50 border-b border-slate-100">
          <CardTitle className="flex items-center gap-2 text-lg text-teal-900">
            <User className="w-5 h-5" />
            بيانات المريض
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="patientName">اسم المريض</Label>
            <Input 
              id="patientName"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="الاسم الكامل"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patientAge">العمر</Label>
              <Input 
                id="patientAge"
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
                placeholder="العمر"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="patientGender">الجنس</Label>
              <Select value={patientGender} onValueChange={setPatientGender}>
                <SelectTrigger id="patientGender">
                  <SelectValue placeholder="اختر" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ذكر">ذكر</SelectItem>
                  <SelectItem value="أنثى">أنثى</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">التاريخ</Label>
            <Input 
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="patientAllergies">الحساسية</Label>
            <Input 
              id="patientAllergies"
              value={patientAllergies}
              onChange={(e) => setPatientAllergies(e.target.value)}
              placeholder="لا يوجد / اذكر الدواء"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="patientDiagnosis">التشخيص</Label>
            <Textarea 
              id="patientDiagnosis"
              value={patientDiagnosis}
              onChange={(e) => setPatientDiagnosis(e.target.value)}
              placeholder="التشخيص المبدئي أو سبب الزيارة"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50 border-b border-slate-100 flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg text-teal-900">
            <Pill className="w-5 h-5" />
            الأدوية الموصوفة
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowSearch(!showSearch)}
            className="border-teal-200 text-teal-700 hover:bg-teal-50"
          >
            <Plus className="w-4 h-4 ml-2" />
            إضافة دواء
          </Button>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {showSearch && (
            <div className="relative p-4 border border-slate-200 rounded-lg bg-slate-50 space-y-3">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input 
                  placeholder="ابحث عن دواء..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pr-10 bg-white"
                  autoFocus
                />
              </div>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {filteredDrugs.map((drug) => (
                  <div 
                    key={drug.id}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100 hover:border-teal-300 cursor-pointer"
                    onClick={() => handleAddDrug(drug)}
                  >
                    <div>
                      <p className="font-medium text-teal-900">{drug.nameAr} ({drug.nameEn})</p>
                      <p className="text-xs text-slate-500">{drug.activeIngredients} - {drug.strength} - {drug.form}</p>
                    </div>
                    <Plus className="w-5 h-5 text-teal-600" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedDrugs.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Pill className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>لم يتم إضافة أدوية بعد</p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedDrugs.map((drug, index) => (
                <div key={drug.id} className="p-4 border border-slate-200 rounded-lg bg-white space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-700 font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-teal-900">{drug.nameAr}</h4>
                        <p className="text-sm text-slate-500">{drug.nameEn} - {drug.strength} - {drug.form}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRemoveDrug(drug.id)}
                      className="text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {drug.warnings && (
                    <div className="flex items-start gap-2 p-2 bg-amber-50 text-amber-700 rounded-md text-xs">
                      <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <p>{drug.warnings}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs text-slate-500">الجرعة</Label>
                      <Input 
                        value={drug.dosage}
                        onChange={(e) => handleUpdateDrugDetails(drug.id, "dosage", e.target.value)}
                        placeholder="مثال: حبة واحدة"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-slate-500">التكرار</Label>
                      <Input 
                        value={drug.frequency}
                        onChange={(e) => handleUpdateDrugDetails(drug.id, "frequency", e.target.value)}
                        placeholder="مثال: مرتين يومياً"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-slate-500">المدة</Label>
                      <Input 
                        value={drug.duration}
                        onChange={(e) => handleUpdateDrugDetails(drug.id, "duration", e.target.value)}
                        placeholder="مثال: 7 أيام"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-500">تعليمات للمريض</Label>
                    <Textarea 
                      value={drug.instructions}
                      onChange={(e) => handleUpdateDrugDetails(drug.id, "instructions", e.target.value)}
                      placeholder="مثال: يؤخذ بعد الأكل"
                      className="text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}