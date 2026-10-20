import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Trash2, Pill, Edit, Save, XCircle } from "lucide-react";
import { drugsDb, type Drug } from "@/lib/db";

export function DrugDatabase() {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [search, setSearch] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [newDrug, setNewDrug] = useState<Drug>({
    id: "",
    nameAr: "",
    nameEn: "",
    activeIngredients: "",
    form: "أقراص",
    strength: "",
    indications: "",
    sideEffects: "",
    warnings: ""
  });

  useEffect(() => {
    drugsDb.list().then(setDrugs).catch((e) => console.error("Failed to load drugs", e));
  }, []);

  const handleAddDrug = () => {
    if (!newDrug.nameAr || !newDrug.nameEn) return;
    
    const drugToAdd: Drug = {
      ...newDrug,
      id: Date.now().toString()
    };
    
    const updated = [...drugs, drugToAdd];
    setDrugs(updated);
    drugsDb.save(drugToAdd).catch((e) => console.error(e));
    
    setNewDrug({
      id: "",
      nameAr: "",
      nameEn: "",
      activeIngredients: "",
      form: "أقراص",
      strength: "",
      indications: "",
      sideEffects: "",
      warnings: ""
    });
    setIsAdding(false);
  };

  const handleDeleteDrug = (id: string) => {
    const updated = drugs.filter(d => d.id !== id);
    setDrugs(updated);
    drugsDb.remove(id).catch((e) => console.error(e));
  };

  const handleUpdateDrug = (id: string, field: keyof Drug, value: string) => {
    const updated = drugs.map(d => 
      d.id === id ? { ...d, [field]: value } : d
    );
    setDrugs(updated);
    const changed = updated.find((d) => d.id === id);
    if (changed) drugsDb.save(changed).catch((e) => console.error(e));
  };

  const filteredDrugs = drugs.filter(drug => 
    drug.nameAr.toLowerCase().includes(search.toLowerCase()) ||
    drug.nameEn.toLowerCase().includes(search.toLowerCase()) ||
    drug.activeIngredients.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-teal-900 font-serif">قاعدة بيانات الأدوية</h2>
          <p className="text-slate-500 text-sm mt-1">إدارة وتعديل الأدوية المتاحة للوصفات</p>
        </div>
        <Button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-teal-600 hover:bg-teal-700 text-white"
        >
          {isAdding ? <XCircle className="w-4 h-4 ml-2" /> : <Plus className="w-4 h-4 ml-2" />}
          {isAdding ? "إلغاء" : "إضافة دواء جديد"}
        </Button>
      </div>

      {isAdding && (
        <Card className="border-teal-200 shadow-md">
          <CardHeader className="bg-teal-50 rounded-t-xl">
            <CardTitle className="text-teal-900">إضافة دواء جديد</CardTitle>
            <CardDescription>أدخل تفاصيل الدواء بدقة</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nameAr">الاسم بالعربية</Label>
                <Input 
                  id="nameAr"
                  value={newDrug.nameAr}
                  onChange={(e) => setNewDrug({...newDrug, nameAr: e.target.value})}
                  placeholder="مثال: باراسيتامول"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nameEn">الاسم العلمي (إنجليزي)</Label>
                <Input 
                  id="nameEn"
                  value={newDrug.nameEn}
                  onChange={(e) => setNewDrug({...newDrug, nameEn: e.target.value})}
                  placeholder="مثال: Paracetamol"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ingredients">المادة الفعالة</Label>
                <Input 
                  id="ingredients"
                  value={newDrug.activeIngredients}
                  onChange={(e) => setNewDrug({...newDrug, activeIngredients: e.target.value})}
                  placeholder="المادة الفعالة"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="form">الشكل الدوائي</Label>
                <Select 
                  value={newDrug.form} 
                  onValueChange={(value) => setNewDrug({...newDrug, form: value})}
                >
                  <SelectTrigger id="form">
                    <SelectValue placeholder="اختر الشكل" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="أقراص">أقراص</SelectItem>
                    <SelectItem value="كبسولات">كبسولات</SelectItem>
                    <SelectItem value="شراب">شراب</SelectItem>
                    <SelectItem value="حقن">حقن</SelectItem>
                    <SelectItem value="كريم">كريم</SelectItem>
                    <SelectItem value="قطرة">قطرة</SelectItem>
                    <SelectItem value="بخاخ">بخاخ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="strength">التركيز</Label>
                <Input 
                  id="strength"
                  value={newDrug.strength}
                  onChange={(e) => setNewDrug({...newDrug, strength: e.target.value})}
                  placeholder="مثال: 500mg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="indications">الدواعي الاستعمال</Label>
              <Textarea 
                id="indications"
                value={newDrug.indications}
                onChange={(e) => setNewDrug({...newDrug, indications: e.target.value})}
                placeholder="مثال: مسكن للألم وخافض للحرارة"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sideEffects">الآثار الجانبية</Label>
                <Textarea 
                  id="sideEffects"
                  value={newDrug.sideEffects}
                  onChange={(e) => setNewDrug({...newDrug, sideEffects: e.target.value})}
                  placeholder="مثال: غثيان، طفح جلدي"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="warnings">التحذيرات وموانع الاستعمال</Label>
                <Textarea 
                  id="warnings"
                  value={newDrug.warnings}
                  onChange={(e) => setNewDrug({...newDrug, warnings: e.target.value})}
                  placeholder="مثال: يحذر لمرضى الكبد"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setIsAdding(false)}>إلغاء</Button>
              <Button onClick={handleAddDrug} className="bg-teal-600 hover:bg-teal-700">
                <Save className="w-4 h-4 ml-2" />
                حفظ الدواء
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input 
          placeholder="ابحث عن دواء بالاسم أو المادة الفعالة..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pr-10 bg-white border-slate-200"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDrugs.map((drug) => (
          <Card key={drug.id} className="hover:shadow-lg transition-shadow border-slate-200 overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                    <Pill className="w-5 h-5 text-teal-700" />
                  </div>
                  <div>
                    {editingId === drug.id ? (
                      <Input 
                        value={drug.nameAr}
                        onChange={(e) => handleUpdateDrug(drug.id, "nameAr", e.target.value)}
                        className="font-bold text-lg"
                      />
                    ) : (
                      <CardTitle className="text-lg text-teal-900">{drug.nameAr}</CardTitle>
                    )}
                    {editingId === drug.id ? (
                      <Input 
                        value={drug.nameEn}
                        onChange={(e) => handleUpdateDrug(drug.id, "nameEn", e.target.value)}
                        className="text-sm text-slate-500"
                      />
                    ) : (
                      <CardDescription className="text-sm">{drug.nameEn}</CardDescription>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setEditingId(editingId === drug.id ? null : drug.id)}
                    className="h-8 w-8 text-slate-500 hover:text-teal-600"
                  >
                    {editingId === drug.id ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDeleteDrug(drug.id)}
                    className="h-8 w-8 text-slate-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-sm">
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-teal-50 text-teal-700 rounded-md text-xs font-medium">{drug.form}</span>
                <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">{drug.strength}</span>
              </div>
              
              {editingId === drug.id ? (
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-slate-500">المادة الفعالة</Label>
                    <Input 
                      value={drug.activeIngredients}
                      onChange={(e) => handleUpdateDrug(drug.id, "activeIngredients", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500">الدواعي</Label>
                    <Textarea 
                      value={drug.indications}
                      onChange={(e) => handleUpdateDrug(drug.id, "indications", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500">الآثار الجانبية</Label>
                    <Textarea 
                      value={drug.sideEffects}
                      onChange={(e) => handleUpdateDrug(drug.id, "sideEffects", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500">التحذيرات</Label>
                    <Textarea 
                      value={drug.warnings}
                      onChange={(e) => handleUpdateDrug(drug.id, "warnings", e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-slate-500 font-medium mb-1">المادة الفعالة:</p>
                    <p className="text-slate-700">{drug.activeIngredients}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium mb-1">الدواعي الاستعمال:</p>
                    <p className="text-slate-700">{drug.indications}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium mb-1">الآثار الجانبية:</p>
                    <p className="text-slate-700">{drug.sideEffects}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium mb-1">التحذيرات:</p>
                    <p className="text-slate-700 text-red-600">{drug.warnings}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}