import type { Profile } from './types';

/**
 * Personal profile.
 * Social links + the "availableForWork" flag live in src/data/site.config.ts.
 * The phone number is shown ONLY in the Contact section (call + WhatsApp).
 * Set it to '' to hide it everywhere.
 */
export const profile: Profile = {
  name: { en: 'Abed Al-Rahman Radwan', ar: 'عبد الرحمن رضوان' },
  initials: 'AR',
  title: {
    en: 'Blue Prism RPA Developer | Software & Automation Engineering',
    ar: 'مطوّر أتمتة Blue Prism RPA | هندسة البرمجيات والأتمتة',
  },
  headline: {
    en: 'RPA Developer | Software & Automation Engineer',
    ar: 'مطوّر RPA | مهندس برمجيات وأتمتة',
  },
  valueStatement: {
    en: 'I build, enhance, and troubleshoot Blue Prism automations, backed by a .NET full-stack development background.',
    ar: 'أطوّر أتمتة Blue Prism وأحسّنها وأعالج أعطالها، مستندًا إلى خلفية في تطوير الويب المتكامل بتقنية ‎.NET.',
  },
  location: { en: 'Amman, Jordan', ar: 'عمّان، الأردن' },
  email: 'abedalrahmanradwanaar@gmail.com',
  phone: '+962796026511',
  summary: {
    en: 'Blue Prism RPA developer and support engineer experienced in enhancing and troubleshooting business-process automations, testing workflow changes, and diagnosing exceptions across enterprise applications. I bring a .NET full-stack development background and hands-on experience with Excel/Outlook automation, input validation, root-cause analysis, and technical communication with business stakeholders.',
    ar: 'مطوّر ومهندس دعم في Blue Prism RPA، لديّ خبرة في تحسين أتمتة العمليات التجارية ومعالجة أعطالها، واختبار التعديلات على مسارات العمل، وتشخيص الاستثناءات عبر تطبيقات المؤسسات. أمتلك خلفية في التطوير المتكامل بتقنية ‎.NET، وخبرة عملية في أتمتة Excel وOutlook، والتحقق من صحة المدخلات، وتحليل الأسباب الجذرية، والتواصل التقني مع أصحاب العلاقة في الأعمال.',
  },
  languages: [
    { name: { en: 'Arabic', ar: 'العربية' }, level: { en: 'Native', ar: 'اللغة الأم' } },
    { name: { en: 'English', ar: 'الإنجليزية' }, level: { en: 'Professional', ar: 'مستوى مهني' } },
    { name: { en: 'Turkish', ar: 'التركية' }, level: { en: 'Professional', ar: 'مستوى مهني' } },
  ],
  currentRole: {
    en: 'RPA Developer @ Cyborg Automation Hub',
    ar: 'مطوّر RPA في Cyborg Automation Hub',
  },
  heroStack: ['Blue Prism', 'C#', '.NET', 'React', 'SQL Server'],
  currentlyWorkingOn: [
    {
      en: 'Aura Neurology: final testing before production launch',
      ar: 'Aura Neurology: الاختبار النهائي قبل الإطلاق',
    },
    {
      en: 'Blue Prism automations at Cyborg Automation Hub',
      ar: 'أتمتة Blue Prism في Cyborg Automation Hub',
    },
  ],
};
