import type { SkillCategory } from './types';

/**
 * Skill groups. No percentage bars: just honest lists.
 * Icons: "simple-icons:*" for official logos, "lucide:*" when no logo exists.
 */
export const skillCategories: SkillCategory[] = [
  {
    id: 'automation',
    title: { en: 'Automation', ar: 'الأتمتة' },
    icon: 'lucide:workflow',
    skills: [
      { name: 'Blue Prism', icon: 'lucide:bot' },
      { name: { en: 'Excel & Outlook VBOs', ar: 'Excel & Outlook VBOs' }, icon: 'simple-icons:microsoftexcel' },
      { name: 'Work Queues', icon: 'lucide:list-ordered' },
      { name: 'Control Room', icon: 'lucide:monitor-cog' },
      { name: 'Scheduler', icon: 'lucide:calendar-clock' },
      { name: { en: 'UI automation', ar: 'أتمتة الواجهات' }, icon: 'lucide:mouse-pointer-click' },
    ],
  },
  {
    id: 'development',
    title: { en: 'Development', ar: 'التطوير' },
    icon: 'lucide:code-xml',
    skills: [
      { name: 'C#', icon: 'simple-icons:csharp' },
      { name: '.NET', icon: 'simple-icons:dotnet' },
      { name: 'ASP.NET MVC', icon: 'simple-icons:dotnet' },
      { name: 'ASP.NET Core', icon: 'simple-icons:dotnet' },
      { name: 'Entity Framework Core', icon: 'lucide:database-zap' },
      { name: 'SQL Server', icon: 'simple-icons:microsoftsqlserver' },
      { name: 'React', icon: 'simple-icons:react' },
      { name: 'Node.js', icon: 'simple-icons:nodedotjs' },
      { name: 'REST APIs / CRUD', icon: 'lucide:plug' },
      { name: 'Git', icon: 'simple-icons:git' },
      { name: 'GitHub', icon: 'simple-icons:github' },
    ],
  },
  {
    id: 'engineering',
    title: { en: 'Engineering', ar: 'الممارسات الهندسية' },
    icon: 'lucide:wrench',
    skills: [
      { name: { en: 'Process debugging', ar: 'تتبّع أخطاء العمليات' }, icon: 'lucide:bug' },
      { name: { en: 'Input validation', ar: 'التحقق من المدخلات' }, icon: 'lucide:shield-check' },
      { name: { en: 'Exception handling', ar: 'معالجة الاستثناءات' }, icon: 'lucide:triangle-alert' },
      { name: { en: 'Root Cause Analysis (RCA)', ar: 'تحليل السبب الجذري (RCA)' }, icon: 'lucide:search-code' },
      { name: { en: 'Change-request testing', ar: 'اختبار طلبات التغيير' }, icon: 'lucide:git-pull-request' },
      { name: { en: 'Technical documentation', ar: 'التوثيق التقني' }, icon: 'lucide:file-text' },
    ],
  },
  {
    id: 'pm-ai',
    title: { en: 'Project Management & AI', ar: 'إدارة المشاريع والذكاء الاصطناعي' },
    icon: 'lucide:sparkles',
    skills: [
      { name: 'Agile', icon: 'lucide:refresh-cw' },
      { name: 'Scrum', icon: 'lucide:users' },
      { name: 'Kanban', icon: 'lucide:square-kanban' },
      { name: { en: 'Generative AI in project management', ar: 'الذكاء الاصطناعي التوليدي في إدارة المشاريع' }, icon: 'lucide:sparkles' },
      { name: { en: 'Applied AI', ar: 'الذكاء الاصطناعي التطبيقي' }, icon: 'lucide:brain-circuit' },
    ],
  },
];
