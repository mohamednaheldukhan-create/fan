export interface Drug {
  id: string;
  nameAr: string;
  nameEn: string;
  activeIngredients: string;
  form: string;
  strength: string;
  indications: string;
  sideEffects: string;
  warnings: string;
}

export const initialDrugs: Drug[] = [
  {
    id: "1",
    nameAr: "باراسيتامول",
    nameEn: "Paracetamol",
    activeIngredients: "Acetaminophen",
    form: "أقراص",
    strength: "500mg",
    indications: "مسكن للألم وخافض للحرارة",
    sideEffects: "غثيان، طفح جلدي (نادر)",
    warnings: "جرعات كبيرة قد تسبب تلف الكبد"
  },
  {
    id: "2",
    nameAr: "أموكسيسيلين",
    nameEn: "Amoxicillin",
    activeIngredients: "Amoxicillin",
    form: "كبسولات",
    strength: "500mg",
    indications: "مضاد حيوي لعلاج الالتهابات البكتيرية",
    sideEffects: "إسهال، طفح جلدي، حساسية",
    warnings: "يحذر استخدامه لمرضى الحساسية من البنسلين"
  },
  {
    id: "3",
    nameAr: "ميتفورمين",
    nameEn: "Metformin",
    activeIngredients: "Metformin HCl",
    form: "أقراص",
    strength: "850mg",
    indications: "علاج السكري من النوع الثاني",
    sideEffects: "اضطرابات هضمية، نقص فيتامين B12",
    warnings: "يوقف قبل العمليات الجراحية بـ 48 ساعة"
  },
  {
    id: "4",
    nameAr: "أملوديبين",
    nameEn: "Amlodipine",
    activeIngredients: "Amlodipine Besylate",
    form: "أقراص",
    strength: "5mg",
    indications: "علاج ارتفاع ضغط الدم",
    sideEffects: "وذمة محيطية، صداع، احمرار الوجه",
    warnings: "يستخدم بحذر مع مثبطات CYP3A4"
  }
];