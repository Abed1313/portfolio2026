import type { Project, RpaProject } from './types';

/* ==================================================================== */
/* A) Full-Stack Development Projects                                    */
/* ==================================================================== */
/*
 * Images (all optional) are picked up automatically from:
 *   src/assets/images/projects/<id>/cover.(webp|jpg|jpeg|png)   → card image
 *   src/assets/images/projects/<id>/1.*, 2.*, 3.* …               → modal gallery
 *
 * Buttons:
 *   githubUrl set           → "View on GitHub"
 *   liveUrl set             → "Live Demo" (or "Visit Website" for client projects)
 *   empty / "[PLACEHOLDER]" → button hidden
 */
export const projects: Project[] = [
  {
    id: 'aura-neurology',
    featured: true,
    title: 'Aura Neurology',
    subtitle: { en: 'React · ASP.NET Core · Appointment booking', ar: 'React · ASP.NET Core · حجز المواعيد' },
    description: {
      en: 'Web application for a neurology and brain clinic in the United States, built end-to-end as the sole developer. It includes an online appointment-booking system, with a React frontend and an ASP.NET Core backend.',
      ar: 'تطبيق ويب لعيادة أعصاب ودماغ في الولايات المتحدة، طوّرته بالكامل كمطوّر وحيد. يتضمن نظامًا لحجز المواعيد عبر الإنترنت، بواجهة أمامية React وواجهة خلفية ASP.NET Core.',
    },
    tags: ['React', 'ASP.NET Core', 'Appointment booking'],
    role: { en: 'Sole full-stack developer (frontend, backend, deployment)', ar: 'المطوّر الوحيد للمشروع (الواجهة الأمامية، الخلفية، النشر)' },
    type: { en: 'Freelance client project · USA · Healthcare', ar: 'مشروع عميل مستقل · الولايات المتحدة · رعاية صحية' },
    date: { en: 'Nov 2026', ar: 'تشرين الثاني 2026' },
    /** Switch to "live" and fill liveUrl → "Live" badge + "Visit Website" button appear. */
    status: 'in-progress',
    liveUrl: '',
    // githubUrl intentionally omitted: private client code.
    badges: [
      { label: { en: 'Client Project', ar: 'مشروع عميل' }, tone: 'accent' },
      { label: { en: 'USA', ar: 'الولايات المتحدة' }, tone: 'neutral' },
      { label: { en: 'Healthcare', ar: 'رعاية صحية' }, tone: 'violet' },
    ],
    note: {
      en: 'Real client project: no patient data is shown. Code is private.',
      ar: 'مشروع لعميل حقيقي: لا تُعرض أي بيانات للمرضى، والشيفرة البرمجية خاصة.',
    },
    placeholder: 'gradient',
  },
  {
    id: 'smart-home-system',
    title: 'Smart Home System',
    subtitle: { en: 'Role-based access · Device management · Scenes', ar: 'صلاحيات حسب الدور · إدارة الأجهزة · المشاهد' },
    description: {
      en: 'Centralized home-management application for Admin, Guest, and Provider roles, covering devices, rooms, access permissions, and automation scenes.',
      ar: 'تطبيق مركزي لإدارة المنزل بأدوار المسؤول والضيف ومزوّد الخدمة، يغطي الأجهزة والغرف وصلاحيات الوصول ومشاهد الأتمتة.',
    },
    tags: ['Role-based access', 'Device management', 'Scenes'],
    githubUrl: '[GITHUB_URL_SMART_HOME]',
    placeholder: 'gradient',
  },
  {
    id: 'red-triangle-property-marketplace',
    title: 'Red-Triangle Property Marketplace',
    subtitle: { en: 'React · Property listings · Search and filters', ar: 'React · عروض العقارات · البحث والتصفية' },
    description: {
      en: 'Property buying and renting web app with location, price, and property-type filters, listing details, seller and agent listings, viewing scheduling, and messaging.',
      ar: 'تطبيق ويب لشراء العقارات واستئجارها، مع تصفية حسب الموقع والسعر ونوع العقار، وتفاصيل العروض، وعروض البائعين والوكلاء، وجدولة المعاينات، والمراسلة.',
    },
    tags: ['React', 'Property listings', 'Search and filters'],
    githubUrl: '[GITHUB_URL_RED_TRIANGLE]',
    placeholder: 'gradient',
  },
  {
    id: 'ev-management-system-api',
    title: 'EV Management System API',
    subtitle: 'ASP.NET Core · Entity Framework Core · SQL Server',
    description: {
      en: 'API for user authentication, charging-station bookings, service requests, and user feedback within an electric-vehicle management workflow.',
      ar: 'واجهة API لمصادقة المستخدمين وحجز محطات الشحن وطلبات الخدمة وملاحظات المستخدمين ضمن مسار إدارة المركبات الكهربائية.',
    },
    tags: ['ASP.NET Core', 'Entity Framework Core', 'SQL Server'],
    githubUrl: '[GITHUB_URL_EV_API]',
    placeholder: 'code',
  },
  {
    id: 'dern-support-system',
    title: 'Dern-Support System',
    subtitle: { en: 'Customer support · Repair workflows · Inventory', ar: 'دعم العملاء · مسارات الصيانة · المخزون' },
    description: {
      en: 'Business-support solution covering individual and business customer accounts, support requests, repair scheduling, quotations, and stock management.',
      ar: 'حل لدعم الأعمال يغطي حسابات العملاء من الأفراد والشركات، وطلبات الدعم، وجدولة الصيانة، وعروض الأسعار، وإدارة المخزون.',
    },
    tags: ['Customer support', 'Repair workflows', 'Inventory'],
    githubUrl: '[GITHUB_URL_DERN]',
    placeholder: 'gradient',
  },
  {
    id: 'movie-library',
    title: 'Movie Library',
    subtitle: { en: 'React · Responsive web application', ar: 'React · تطبيق ويب متجاوب' },
    description: {
      en: 'Movie browsing app with genre and popularity categories, detailed movie information, cast, synopses, ratings, and user reviews.',
      ar: 'تطبيق لتصفح الأفلام حسب النوع والشعبية، مع معلومات تفصيلية عن كل فيلم وطاقم التمثيل والملخصات والتقييمات ومراجعات المستخدمين.',
    },
    tags: ['React', 'Responsive web application'],
    githubUrl: '[GITHUB_URL_MOVIE_LIBRARY]',
    placeholder: 'gradient',
  },
  {
    id: 'adventure-quest-rpg',
    title: 'AdventureQuestRPG',
    subtitle: { en: 'Game logic · Character progression · Inventory', ar: 'منطق اللعبة · تطوّر الشخصية · المخزون' },
    description: {
      en: 'Text-based RPG featuring character progression, monster battles, experience points and levels, items, and exploration across multiple locations.',
      ar: 'لعبة تقمّص أدوار نصية تتضمن تطوّر الشخصية، ومعارك مع الوحوش، ونقاط الخبرة والمستويات، والعناصر، واستكشاف مواقع متعددة.',
    },
    tags: ['Game logic', 'Character progression', 'Inventory'],
    githubUrl: '[GITHUB_URL_ADVENTURE_QUEST]',
    placeholder: 'code',
  },
];

/* ==================================================================== */
/* B) RPA Automation Projects (enterprise work, details confidential)    */
/* ==================================================================== */
/* No screenshots, no repo links. Each card renders `flow` as an animated SVG diagram. */
export const rpaProjects: RpaProject[] = [
  {
    id: 'crm-onboarding',
    title: { en: 'CRM Onboarding & Account Maintenance Automation', ar: 'أتمتة تسجيل العملاء وصيانة الحسابات في CRM' },
    subtitle: 'Blue Prism · CRM workflows · UI automation',
    description: {
      en: 'Supported onboarding and profile-update workflows across CRM and legacy applications; worked on dynamic UI-selector behavior and execution-defect remediation.',
      ar: 'دعم مسارات تسجيل العملاء وتحديث ملفاتهم عبر أنظمة CRM والتطبيقات القديمة، والعمل على سلوك محددات الواجهة الديناميكية ومعالجة أخطاء التنفيذ.',
    },
    tags: ['Blue Prism', 'CRM workflows', 'UI automation'],
    flow: [
      { label: { en: 'Request', ar: 'طلب' }, icon: 'lucide:inbox', kind: 'trigger' },
      { label: { en: 'Queue', ar: 'قائمة' }, icon: 'lucide:list-ordered', kind: 'queue' },
      { label: 'CRM', icon: 'lucide:mouse-pointer-click', kind: 'process' },
      { label: { en: 'Legacy app', ar: 'نظام قديم' }, icon: 'lucide:app-window', kind: 'process' },
      { label: { en: 'Updated', ar: 'تم التحديث' }, icon: 'lucide:circle-check', kind: 'done' },
    ],
  },
  {
    id: 'queue-health',
    title: { en: 'Queue Health & Workload Monitoring', ar: 'مراقبة سلامة قوائم الانتظار وأحمال العمل' },
    subtitle: 'Blue Prism · Work Queues · Retry handling',
    description: {
      en: 'Worked on queue-health checks, retry and failover paths, and exception handling for scheduled automation workloads, including investigation of queue- and lock-related failures.',
      ar: 'العمل على فحوصات سلامة قوائم الانتظار ومسارات إعادة المحاولة والتحويل الاحتياطي ومعالجة الاستثناءات لأحمال الأتمتة المجدولة، بما في ذلك التحقيق في الأعطال المرتبطة بقوائم الانتظار والأقفال.',
    },
    tags: ['Blue Prism', 'Work Queues', 'Retry handling'],
    flow: [
      { label: { en: 'Schedule', ar: 'جدولة' }, icon: 'lucide:calendar-clock', kind: 'trigger' },
      { label: { en: 'Queue', ar: 'قائمة' }, icon: 'lucide:list-ordered', kind: 'queue' },
      { label: { en: 'Health check', ar: 'فحص' }, icon: 'lucide:activity', kind: 'process' },
      { label: { en: 'Retry', ar: 'إعادة' }, icon: 'lucide:rotate-ccw', kind: 'exception' },
      { label: { en: 'Done', ar: 'تم' }, icon: 'lucide:circle-check', kind: 'done' },
    ],
  },
  {
    id: 'excel-batch',
    title: { en: 'Excel Batch Data Processing', ar: 'معالجة دفعات بيانات Excel' },
    subtitle: 'Excel VBOs · Ranges · Collections',
    description: {
      en: 'Updated dynamic range and table parsing, and investigated collection-reading failures, to improve structured-data extraction from changing workbooks.',
      ar: 'تحديث تحليل النطاقات والجداول الديناميكية والتحقيق في أعطال قراءة المجموعات، لتحسين استخراج البيانات المنظمة من مصنفات متغيرة.',
    },
    tags: ['Excel VBOs', 'Ranges', 'Collections'],
    flow: [
      { label: { en: 'Workbook', ar: 'مصنف' }, icon: 'simple-icons:microsoftexcel', kind: 'trigger' },
      { label: { en: 'Read range', ar: 'قراءة' }, icon: 'lucide:table', kind: 'process' },
      { label: { en: 'Collection', ar: 'مجموعة' }, icon: 'lucide:layers', kind: 'queue' },
      { label: { en: 'Validate', ar: 'تحقق' }, icon: 'lucide:shield-check', kind: 'process' },
      { label: { en: 'Output', ar: 'إخراج' }, icon: 'lucide:circle-check', kind: 'done' },
    ],
  },
  {
    id: 'service-request',
    title: { en: 'Service Request & Incident Processing', ar: 'معالجة طلبات الخدمة والحوادث' },
    subtitle: 'Work Queues · Routing · RCA',
    description: {
      en: 'Supported automated service-request and incident workflows, including ticket categorization and routing, and production-exception documentation for support investigation.',
      ar: 'دعم مسارات طلبات الخدمة والحوادث المؤتمتة، بما في ذلك تصنيف التذاكر وتوجيهها، وتوثيق استثناءات بيئة الإنتاج لدعم التحقيق.',
    },
    tags: ['Work Queues', 'Routing', 'RCA'],
    flow: [
      { label: { en: 'Ticket', ar: 'تذكرة' }, icon: 'lucide:ticket', kind: 'trigger' },
      { label: { en: 'Categorize', ar: 'تصنيف' }, icon: 'lucide:tags', kind: 'process' },
      { label: { en: 'Route', ar: 'توجيه' }, icon: 'lucide:split', kind: 'queue' },
      { label: { en: 'Exception', ar: 'استثناء' }, icon: 'lucide:triangle-alert', kind: 'exception' },
      { label: 'RCA', icon: 'lucide:file-search', kind: 'notify' },
    ],
  },
  {
    id: 'scheduled-batch',
    title: { en: 'Scheduled Batch Automation', ar: 'أتمتة الدفعات المجدولة' },
    subtitle: 'Scheduler · Subprocesses · Operational support',
    description: {
      en: 'Worked on scheduling, retry logic, and subprocess behavior for recurring batch processes; investigated application-state issues and documented operational procedures.',
      ar: 'العمل على الجدولة ومنطق إعادة المحاولة وسلوك العمليات الفرعية للدفعات المتكررة، والتحقيق في مشكلات حالة التطبيقات، وتوثيق الإجراءات التشغيلية.',
    },
    tags: ['Scheduler', 'Subprocesses', 'Operational support'],
    flow: [
      { label: { en: 'Scheduler', ar: 'المجدول' }, icon: 'lucide:calendar-clock', kind: 'trigger' },
      { label: { en: 'Main process', ar: 'العملية' }, icon: 'lucide:workflow', kind: 'process' },
      { label: { en: 'Subprocess', ar: 'فرعية' }, icon: 'lucide:git-fork', kind: 'process' },
      { label: { en: 'Retry', ar: 'إعادة' }, icon: 'lucide:rotate-ccw', kind: 'exception' },
      { label: { en: 'Logged', ar: 'موثّق' }, icon: 'lucide:clipboard-check', kind: 'done' },
    ],
  },
];
