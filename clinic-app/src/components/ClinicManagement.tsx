import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { patientsDb, type Patient } from "@/lib/db";
import { Plus, Search, Trash2, Edit, Save, User, Users, XCircle } from "lucide-react";

export type { Patient };

export function ClinicManagement() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [newPatient, setNewPatient] = useState<Patient>({
    id: "",
    name: "",
    age: "",
    gender: "ذكر",
    phone: "",
    diagnosis: "",
    allergies: "",
    notes: "",
    lastVisit: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    patientsDb.list().then(setPatients).catch((e) => console.error("Failed to load patients", e));
  }, []);

  const handleAddPatient = () => {
    if (!newPatient.name) return;
    
    const patientToAdd: Patient = {
      ...newPatient,
      id: Date.now().toString()
    };
    
    const updated = [...patients, patientToAdd];
    setPatients(updated);
    patientsDb.save(patientToAdd).catch((e) => console.error(e));
    
    setNewPatient({
      id: "",
      name: "",
      age: "",
      gender: "ذكر",
      phone: "",
      diagnosis: "",
      allergies: "",
      notes: "",
      lastVisit: new Date().toISOString().split('T')[0]
    });
    setIsAdding(false);
  };

  const handleDeletePatient = (id: string) => {
    const updated = patients.filter(p => p.id !== id);
    setPatients(updated);
    patientsDb.remove(id).catch((e) => console.error(e));
  };

  const handleUpdatePatient = (id: string, field: keyof Patient, value: string) => {
    const updated = patients.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    );
    setPatients(updated);
    const changed = updated.find((p) => p.id === id);
    if (changed) patientsDb.save(changed).catch((e) => console.error(e));
  };

  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(search.toLowerCase()) ||
    patient.age.toLowerCase().includes(search.toLowerCase()) ||
    patient.gender.toLowerCase().includes(search.toLowerCase()) ||
    patient.phone.toLowerCase().includes(search.toLowerCase()) ||
    patient.diagnosis.toLowerCase().includes(search.toLowerCase()) ||
    patient.allergies.toLowerCase().includes(search.toLowerCase()) ||
    patient.notes.toLowerCase().includes(search.toLowerCase()) ||
    patient.lastVisit.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-teal-900 font-serif">إدارة العيادة</h2>
          <p className="text-slate-500 text-sm mt-1">سجل المرضى والبيانات السريرية</p>
        </div>
        <Button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-teal-600 hover:bg-teal-700 text-white"
        >
          {isAdding ? <XCircle className="w-4 h-4 ml-2" /> : <Plus className="w-4 h-4 ml-2" />}
          {isAdding ? "إلغاء" : "إضافة مريض جديد"}
        </Button>
      </div>

      {isAdding && (
        <Card className="border-teal-200 shadow-md">
          <CardHeader className="bg-teal-50 rounded-t-xl">
            <CardTitle className="text-teal-900">إضافة مريض جديد</CardTitle>
            <CardDescription>أدخل البيانات الأساسية للمريض</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">اسم المريض</Label>
                <Input 
                  id="name"
                  value={newPatient.name}
                  onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
                  placeholder="الاسم الكامل"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input 
                  id="phone"
                  value={newPatient.phone}
                  onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})}
                  placeholder="رقم للتواصل"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">العمر</Label>
                <Input 
                  id="age"
                  value={newPatient.age}
                  onChange={(e) => setNewPatient({...newPatient, age: e.target.value})}
                  placeholder="العمر"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">الجنس</Label>
                <Select 
                  value={newPatient.gender} 
                  onValueChange={(value) => setNewPatient({...newPatient, gender: value})}
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="اختر الجنس" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ذكر">ذكر</SelectItem>
                    <SelectItem value="أنثى">أنثى</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastVisit">تاريخ آخر زيارة</Label>
                <Input 
                  id="lastVisit"
                  type="date"
                  value={newPatient.lastVisit}
                  onChange={(e) => setNewPatient({...newPatient, lastVisit: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="diagnosis">التشخيص</Label>
                <Input 
                  id="diagnosis"
                  value={newPatient.diagnosis}
                  onChange={(e) => setNewPatient({...newPatient, diagnosis: e.target.value})}
                  placeholder="التشخيص الحالي"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="allergies">الحساسية</Label>
                <Input 
                  id="allergies"
                  value={newPatient.allergies}
                  onChange={(e) => setNewPatient({...newPatient, allergies: e.target.value})}
                  placeholder="أي حساسية معروفة (لا يوجد / ...)"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">ملاحظات</Label>
              <Textarea 
                id="notes"
                value={newPatient.notes}
                onChange={(e) => setNewPatient({...newPatient, notes: e.target.value})}
                placeholder="ملاحظات إضافية، تاريخ طبي، أدوية حالية..."
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setIsAdding(false)}>إلغاء</Button>
              <Button onClick={handleAddPatient} className="bg-teal-600 hover:bg-teal-700">
                <Save className="w-4 h-4 ml-2" />
                حفظ بيانات المريض
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input 
          placeholder="ابحث في جميع الحقول (الاسم، التشخيص، الهاتف، الحساسية، الملاحظات...)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pr-10 bg-white border-slate-200"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPatients.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-slate-400">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>لا يوجد مرضى مسجلون بعد</p>
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <Card key={patient.id} className="hover:shadow-lg transition-shadow border-slate-200 overflow-hidden">
              <CardHeader className="bg-slate-50 border-b border-slate-100">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-teal-700" />
                    </div>
                    <div>
                      {editingId === patient.id ? (
                        <Input 
                          value={patient.name}
                          onChange={(e) => handleUpdatePatient(patient.id, "name", e.target.value)}
                          className="font-bold text-lg"
                        />
                      ) : (
                        <CardTitle className="text-lg text-teal-900">{patient.name}</CardTitle>
                      )}
                      <CardDescription className="text-sm">
                        {patient.age} سنة - {patient.gender} - آخر زيارة: {patient.lastVisit}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setEditingId(editingId === patient.id ? null : patient.id)}
                      className="h-8 w-8 text-slate-500 hover:text-teal-600"
                    >
                      {editingId === patient.id ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeletePatient(patient.id)}
                      className="h-8 w-8 text-slate-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3 text-sm">
                {editingId === patient.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-slate-500">رقم الهاتف</Label>
                        <Input 
                          value={patient.phone}
                          onChange={(e) => handleUpdatePatient(patient.id, "phone", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-slate-500">العمر</Label>
                        <Input 
                          value={patient.age}
                          onChange={(e) => handleUpdatePatient(patient.id, "age", e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-slate-500">التشخيص</Label>
                      <Input 
                        value={patient.diagnosis}
                        onChange={(e) => handleUpdatePatient(patient.id, "diagnosis", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-slate-500">الحساسية</Label>
                      <Input 
                        value={patient.allergies}
                        onChange={(e) => handleUpdatePatient(patient.id, "allergies", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-slate-500">الملاحظات</Label>
                      <Textarea 
                        value={patient.notes}
                        onChange={(e) => handleUpdatePatient(patient.id, "notes", e.target.value)}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {patient.phone && (
                      <div>
                        <p className="text-xs text-slate-500 font-medium mb-1">رقم الهاتف:</p>
                        <p className="text-slate-700">{patient.phone}</p>
                      </div>
                    )}
                    {patient.diagnosis && (
                      <div>
                        <p className="text-xs text-slate-500 font-medium mb-1">التشخيص:</p>
                        <p className="text-slate-700">{patient.diagnosis}</p>
                      </div>
                    )}
                    {patient.allergies && (
                      <div>
                        <p className="text-xs text-slate-500 font-medium mb-1">الحساسية:</p>
                        <p className="text-slate-700 text-red-600">{patient.allergies}</p>
                      </div>
                    )}
                    {patient.notes && (
                      <div>
                        <p className="text-xs text-slate-500 font-medium mb-1">ملاحظات:</p>
                        <p className="text-slate-700">{patient.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}