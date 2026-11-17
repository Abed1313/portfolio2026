import type { ExperienceItem } from './types';

/** Work history, newest first. Rendered as a `git log` style timeline. */
export const experience: ExperienceItem[] = [
  /* Promoted after 3 months: RPA Developer (May–Aug 2025) → RPA Support Engineer (Aug 2025–present). */
  {
    id: 'cyborg-rpa-support-engineer',
    role: { en: 'RPA Support Engineer', ar: 'مهندس دعم RPA' },
    company: 'Cyborg Automation Hub',
    logoId: 'cyborg-automation-hub',
    start: { en: 'Aug 2025', ar: 'آب 2025' },
    current: true,
    promotion: { en: 'Promoted from RPA Developer', ar: 'ترقية من مطوّر RPA' },
    tags: ['Blue Prism', 'Excel VBO', 'Outlook VBO', 'Work Queues', 'RCA'],
    bullets: [
      {
        en: 'Corrected approval-status validation logic to accept an additional legitimate status value, then tested the updated workflow and its business-exception behavior.',
        ar: 'تصحيح منطق التحقق من حالة الموافقة ليقبل قيمة حالة مشروعة إضافية، ثم اختبار مسار العمل المحدَّث وسلوك استثناءات الأعمال.',
      },
      {
        en: 'Added and tested exception-notification logic that sends SMEs a screenshot and the affected item reference when a business-application action fails.',
        ar: 'إضافة منطق إشعار بالاستثناءات واختباره، يرسل إلى الخبراء المختصين (SMEs) لقطة شاشة ومرجع العنصر المتأثر عند فشل إجراء في تطبيق الأعمال.',
      },
      {
        en: 'Updated Excel ranges and column mappings in response to source-template changes affecting downstream data extraction and processing.',
        ar: 'تحديث نطاقات Excel وربط الأعمدة استجابةً لتغييرات في قوالب المصدر أثّرت على استخراج البيانات ومعالجتها لاحقًا.',
      },
      {
        en: 'Investigate failures involving Excel collections, queue items, application states, and delayed responses; document findings and coordinate testing with SMEs.',
        ar: 'التحقيق في الأعطال المتعلقة بمجموعات Excel وعناصر قوائم الانتظار وحالات التطبيقات وتأخر الاستجابة، وتوثيق النتائج وتنسيق الاختبار مع الخبراء المختصين.',
      },
    ],
  },
  {
    id: 'cyborg-rpa-developer',
    role: { en: 'RPA Developer', ar: 'مطوّر RPA' },
    company: 'Cyborg Automation Hub',
    logoId: 'cyborg-automation-hub',
    start: { en: 'May 2025', ar: 'أيار 2025' },
    end: { en: 'Aug 2025', ar: 'آب 2025' },
    tags: ['Blue Prism', 'Excel VBO', 'Outlook VBO', 'Work Queues'],
    bullets: [
      {
        en: 'Developed and enhanced Blue Prism workflows for existing business processes, using Excel and Outlook VBOs, Work Queues, and business-application UI interactions.',
        ar: 'تطوير مسارات عمل Blue Prism وتحسينها لعمليات تجارية قائمة، باستخدام Excel وOutlook VBOs وWork Queues والتفاعل مع واجهات تطبيقات الأعمال.',
      },
    ],
  },
  {
    id: 'luminus-internship',
    role: { en: '.NET Full-Stack Developer Intern', ar: 'متدرّب مطوّر ويب متكامل ⁦.NET⁩' },
    company: 'Al Ghurair School / Luminus Life+',
    logoId: 'luminus',
    start: { en: 'Mar 2024', ar: 'آذار 2024' },
    end: { en: 'Nov 2024', ar: 'تشرين الثاني 2024' },
    tags: ['C#', '.NET', 'ASP.NET MVC', 'React', 'Node.js', 'Git'],
    bullets: [
      {
        en: 'Developed and modified web-application features using C#/.NET and ASP.NET MVC, with frontend and backend exposure to React and Node.js.',
        ar: 'تطوير ميزات تطبيقات ويب وتعديلها باستخدام C#/.NET وASP.NET MVC، مع خبرة في الواجهات الأمامية والخلفية باستخدام React وNode.js.',
      },
      {
        en: 'Worked on data-driven CRUD and API-related functionality; debugged and tested application changes using Git and GitHub.',
        ar: 'العمل على وظائف CRUD المعتمدة على البيانات والوظائف المرتبطة بواجهات API، وتتبّع أخطاء تعديلات التطبيق واختبارها باستخدام Git وGitHub.',
      },
    ],
  },
  {
    id: 'freelance-design',
    role: { en: 'Freelance Designer & Video Editor', ar: 'مصمم ومحرر فيديو مستقل' },
    company: { en: 'Self-Employed', ar: 'عمل حر' },
    start: { en: 'Jan 2020', ar: 'كانون الثاني 2020' },
    end: { en: 'Mar 2023', ar: 'آذار 2023' },
    bullets: [
      {
        en: 'Produced design and video-editing deliverables for clients, translating briefs into completed assets and managing feedback and revisions.',
        ar: 'إنتاج أعمال تصميم ومونتاج فيديو للعملاء، وتحويل المتطلبات إلى أعمال مكتملة، وإدارة الملاحظات والتعديلات.',
      },
    ],
  },
];
