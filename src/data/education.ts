import type { EducationItem } from './types';

export const education: EducationItem[] = [
  {
    id: 'luminus-diploma',
    title: { en: 'International Diploma in Software Engineering', ar: 'الدبلوم الدولي في هندسة البرمجيات' },
    institution: 'Luminus Technical University College',
    location: { en: 'Amman, Jordan', ar: 'عمّان، الأردن' },
    logoId: 'luminus',
    year: '2023',
  },
  {
    id: 'tomer-turkish',
    title: { en: 'Turkish Language Diploma (one-year program)', ar: 'دبلوم اللغة التركية (برنامج لمدة عام)' },
    institution: { en: 'TÖMER, Karabük University', ar: 'TÖMER، جامعة كارابوك' },
    location: { en: 'Türkiye', ar: 'تركيا' },
    logoId: 'karabuk-university',
    year: { en: 'Sep 2019 – 2020', ar: 'أيلول 2019 – 2020' },
  },
];
