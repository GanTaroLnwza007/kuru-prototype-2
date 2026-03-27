export interface ProgramTCAS {
  round: number;
  gpax: number;
  requirements: { th: string; en: string };
  examWeights?: { th: string; en: string };
  seats: number;
}

export interface YearVibe {
  year: number;
  title: { th: string; en: string };
  description: { th: string; en: string };
  skills: { th: string[]; en: string[] };
  workload: 'light' | 'moderate' | 'heavy' | 'intense';
}

export interface Program {
  id: string;
  name: { th: string; en: string };
  faculty: { th: string; en: string };
  facultyIcon: string;
  nutshell: { th: string; en: string };
  careers: { th: string[]; en: string[] };
  salaryMin: number;
  salaryMax: number;
  recruiters: string[];
  tcas: ProgramTCAS[];
  ploFitScore: number;
  hasPortfolioCoach: boolean;
  yearByYear: YearVibe[];
  ploData: number[];
  /** RIASEC affinity weights [R, I, A, S, E, C], values 0–1 */
  riasecWeights: number[];
}

const defaultYearByYear = (faculty: string): YearVibe[] => [
  {
    year: 1, title: { th: 'ปี 1 — ปูพื้นฐาน', en: 'Year 1 — Foundations' },
    description: { th: 'เรียนวิชาพื้นฐานทั่วไป ปรับตัวเข้ากับชีวิตมหาวิทยาลัย ชิลๆ ยังไม่หนักมาก', en: 'General foundation courses, adjusting to university life. Still chill!' },
    skills: { th: ['คิดวิเคราะห์', 'ทำงานกลุ่ม', 'นำเสนอ'], en: ['Critical Thinking', 'Teamwork', 'Presentations'] },
    workload: 'light',
  },
  {
    year: 2, title: { th: 'ปี 2 — ลงลึกเฉพาะทาง', en: 'Year 2 — Going Deeper' },
    description: { th: 'เริ่มเรียนวิชาเอก เจอโปรเจกต์แรกๆ สนุกขึ้นเยอะ!', en: 'Core major courses begin. First real projects — way more fun!' },
    skills: { th: ['ทักษะเฉพาะทาง', 'วิเคราะห์ข้อมูล', 'แก้ปัญหา'], en: ['Domain Skills', 'Data Analysis', 'Problem Solving'] },
    workload: 'moderate',
  },
  {
    year: 3, title: { th: 'ปี 3 — ลงมือทำจริง', en: 'Year 3 — Hands-On' },
    description: { th: 'โปรเจกต์เยอะ ฝึกงานจริง ได้ลองทำสิ่งที่จะใช้ในอาชีพจริงๆ', en: 'Lots of projects, internships. Real-world experience begins!' },
    skills: { th: ['ฝึกงาน', 'โปรเจกต์จริง', 'ทำงานเป็นทีม'], en: ['Internship', 'Real Projects', 'Team Collaboration'] },
    workload: 'heavy',
  },
  {
    year: 4, title: { th: 'ปี 4 — สรุปและก้าวต่อ', en: 'Year 4 — Capstone & Beyond' },
    description: { th: 'ทำโปรเจกต์จบ เตรียมตัวทำงาน หรือเรียนต่อ ตื่นเต้นมาก!', en: 'Senior project, preparing for career or grad school. Exciting times!' },
    skills: { th: ['โปรเจกต์จบ', 'เตรียมสมัครงาน', 'วิจัย'], en: ['Capstone Project', 'Career Prep', 'Research'] },
    workload: 'intense',
  },
];

export const programs: Program[] = [
  {
    id: 'cs',
    name: { th: 'วิทยาการคอมพิวเตอร์', en: 'Computer Science' },
    faculty: { th: 'คณะวิศวกรรมศาสตร์', en: 'Faculty of Engineering' },
    facultyIcon: '⚙️',
    nutshell: { th: 'เรียนรู้การพัฒนาซอฟต์แวร์ AI และระบบคอมพิวเตอร์เพื่อแก้ปัญหาจริง', en: 'Learn software development, AI, and computer systems to solve real-world problems' },
    careers: { th: ['วิศวกรซอฟต์แวร์', 'นักวิทยาศาสตร์ข้อมูล', 'นักวิเคราะห์ระบบ', 'วิศวกร AI'], en: ['Software Engineer', 'Data Scientist', 'Systems Analyst', 'AI Engineer'] },
    salaryMin: 30000, salaryMax: 55000,
    recruiters: ['Agoda', 'KBTG', 'LINE MAN Wongnai', 'SCB', 'True Digital'],
    tcas: [
      { round: 1, gpax: 3.00, requirements: { th: 'Portfolio ด้าน IT/Programming, ผลงานแข่งขัน', en: 'IT/Programming portfolio, competition awards' }, seats: 30 },
      { round: 2, gpax: 2.75, requirements: { th: 'สอบข้อเขียนเฉพาะสาขา', en: 'Department written exam' }, seats: 20 },
      { round: 3, gpax: 2.50, requirements: { th: 'คะแนนสอบ', en: 'Exam scores' }, examWeights: { th: 'TGAT 20%, TPAT3 30%, A-Level คณิต 30%, A-Level ฟิสิกส์ 20%', en: 'TGAT 20%, TPAT3 30%, A-Level Math 30%, A-Level Physics 20%' }, seats: 80 },
      { round: 4, gpax: 2.50, requirements: { th: 'พิจารณาจากที่นั่งเหลือ', en: 'Based on remaining seats' }, seats: 10 },
    ],
    ploFitScore: 95, hasPortfolioCoach: true,
    yearByYear: defaultYearByYear('eng'),
    ploData: [90, 95, 70, 85, 75, 92],
    riasecWeights: [0.5, 0.9, 0.2, 0.2, 0.3, 0.8], // R, I, A, S, E, C
  },
  {
    id: 'agri',
    name: { th: 'เกษตรศาสตร์', en: 'Agriculture' },
    faculty: { th: 'คณะเกษตร', en: 'Faculty of Agriculture' },
    facultyIcon: '🌾',
    nutshell: { th: 'ศึกษาระบบการเกษตรสมัยใหม่ การผลิตพืชและสัตว์อย่างยั่งยืน', en: 'Study modern agricultural systems, sustainable crop and animal production' },
    careers: { th: ['นักวิชาการเกษตร', 'ผู้จัดการฟาร์ม', 'นักวิจัยพืช', 'ที่ปรึกษาด้านเกษตร'], en: ['Agricultural Scientist', 'Farm Manager', 'Crop Researcher', 'Agricultural Consultant'] },
    salaryMin: 18000, salaryMax: 35000,
    recruiters: ['CP Group', 'Betagro', 'Thai Union', 'Syngenta', 'BASF'],
    tcas: [
      { round: 1, gpax: 2.75, requirements: { th: 'Portfolio กิจกรรมเกษตร, โครงงาน', en: 'Agriculture activities portfolio, projects' }, seats: 40 },
      { round: 2, gpax: 2.50, requirements: { th: 'โควตาภูมิภาค', en: 'Regional quota' }, seats: 50 },
      { round: 3, gpax: 2.00, requirements: { th: 'คะแนนสอบ', en: 'Exam scores' }, examWeights: { th: 'TGAT 30%, A-Level ชีววิทยา 30%, A-Level เคมี 20%, A-Level คณิต 20%', en: 'TGAT 30%, A-Level Biology 30%, A-Level Chemistry 20%, A-Level Math 20%' }, seats: 120 },
      { round: 4, gpax: 2.00, requirements: { th: 'พิจารณาจากที่นั่งเหลือ', en: 'Based on remaining seats' }, seats: 30 },
    ],
    ploFitScore: 88, hasPortfolioCoach: true,
    yearByYear: defaultYearByYear('agri'),
    ploData: [80, 75, 65, 85, 90, 70],
    riasecWeights: [0.9, 0.7, 0.3, 0.6, 0.3, 0.5], // R, I, A, S, E, C
  },
  {
    id: 'bba',
    name: { th: 'บริหารธุรกิจ', en: 'Business Administration' },
    faculty: { th: 'คณะบริหารธุรกิจ', en: 'Faculty of Business Administration' },
    facultyIcon: '📊',
    nutshell: { th: 'พัฒนาทักษะการบริหาร การตลาด การเงิน และผู้ประกอบการยุคใหม่', en: 'Develop management, marketing, finance, and modern entrepreneurship skills' },
    careers: { th: ['นักการตลาดดิจิทัล', 'นักวิเคราะห์ธุรกิจ', 'ผู้จัดการผลิตภัณฑ์', 'ที่ปรึกษาด้านกลยุทธ์'], en: ['Digital Marketer', 'Business Analyst', 'Product Manager', 'Strategy Consultant'] },
    salaryMin: 25000, salaryMax: 45000,
    recruiters: ['SCB', 'Unilever', 'P&G', 'Deloitte', 'McKinsey'],
    tcas: [
      { round: 1, gpax: 3.00, requirements: { th: 'Portfolio ธุรกิจ, กิจกรรมผู้นำ', en: 'Business portfolio, leadership activities' }, seats: 25 },
      { round: 2, gpax: 2.75, requirements: { th: 'สอบสัมภาษณ์', en: 'Interview' }, seats: 30 },
      { round: 3, gpax: 2.50, requirements: { th: 'คะแนนสอบ', en: 'Exam scores' }, examWeights: { th: 'TGAT 30%, A-Level คณิต 30%, A-Level อังกฤษ 25%, A-Level สังคม 15%', en: 'TGAT 30%, A-Level Math 30%, A-Level English 25%, A-Level Social 15%' }, seats: 100 },
      { round: 4, gpax: 2.50, requirements: { th: 'พิจารณาจากที่นั่งเหลือ', en: 'Based on remaining seats' }, seats: 15 },
    ],
    ploFitScore: 82, hasPortfolioCoach: true,
    yearByYear: defaultYearByYear('bba'),
    ploData: [75, 60, 90, 88, 80, 85],
    riasecWeights: [0.2, 0.5, 0.4, 0.7, 0.9, 0.8], // R, I, A, S, E, C
  },
  {
    id: 'env-sci',
    name: { th: 'วิทยาศาสตร์สิ่งแวดล้อม', en: 'Environmental Science' },
    faculty: { th: 'คณะสิ่งแวดล้อม', en: 'Faculty of Environment' },
    facultyIcon: '🌿',
    nutshell: { th: 'ศึกษาระบบนิเวศ มลพิษ และการพัฒนาอย่างยั่งยืนเพื่ออนาคตโลก', en: 'Study ecosystems, pollution, and sustainable development for a better future' },
    careers: { th: ['นักวิทยาศาสตร์สิ่งแวดล้อม', 'ที่ปรึกษา ESG', 'นักวิจัยภูมิอากาศ', 'ผู้เชี่ยวชาญ EIA'], en: ['Environmental Scientist', 'ESG Consultant', 'Climate Researcher', 'EIA Specialist'] },
    salaryMin: 20000, salaryMax: 38000,
    recruiters: ['PTT', 'SCG', 'EGCO', 'ERM', 'UNDP'],
    tcas: [
      { round: 1, gpax: 2.75, requirements: { th: 'Portfolio ด้านสิ่งแวดล้อม', en: 'Environmental portfolio' }, seats: 20 },
      { round: 2, gpax: 2.50, requirements: { th: 'โควตาภูมิภาค', en: 'Regional quota' }, seats: 25 },
      { round: 3, gpax: 2.25, requirements: { th: 'คะแนนสอบ', en: 'Exam scores' }, examWeights: { th: 'TGAT 25%, A-Level เคมี 25%, A-Level ชีววิทยา 25%, A-Level คณิต 25%', en: 'TGAT 25%, A-Level Chemistry 25%, A-Level Biology 25%, A-Level Math 25%' }, seats: 60 },
      { round: 4, gpax: 2.00, requirements: { th: 'พิจารณาจากที่นั่งเหลือ', en: 'Based on remaining seats' }, seats: 15 },
    ],
    ploFitScore: 78, hasPortfolioCoach: false,
    yearByYear: defaultYearByYear('env'),
    ploData: [85, 70, 75, 80, 92, 78],
    riasecWeights: [0.7, 0.8, 0.3, 0.7, 0.3, 0.5], // R, I, A, S, E, C
  },
  {
    id: 'econ',
    name: { th: 'เศรษฐศาสตร์', en: 'Economics' },
    faculty: { th: 'คณะเศรษฐศาสตร์', en: 'Faculty of Economics' },
    facultyIcon: '💹',
    nutshell: { th: 'วิเคราะห์ระบบเศรษฐกิจ นโยบายสาธารณะ และตลาดการเงิน', en: 'Analyze economic systems, public policy, and financial markets' },
    careers: { th: ['นักเศรษฐศาสตร์', 'นักวิเคราะห์การเงิน', 'ที่ปรึกษานโยบาย', 'นักวิจัยเศรษฐกิจ'], en: ['Economist', 'Financial Analyst', 'Policy Advisor', 'Economic Researcher'] },
    salaryMin: 25000, salaryMax: 50000,
    recruiters: ['Bank of Thailand', 'KBank', 'EIC SCB', 'World Bank', 'TDRI'],
    tcas: [
      { round: 1, gpax: 3.25, requirements: { th: 'Portfolio วิชาการ, ผลงานวิจัย', en: 'Academic portfolio, research work' }, seats: 15 },
      { round: 2, gpax: 3.00, requirements: { th: 'สอบข้อเขียน', en: 'Written exam' }, seats: 20 },
      { round: 3, gpax: 2.50, requirements: { th: 'คะแนนสอบ', en: 'Exam scores' }, examWeights: { th: 'TGAT 20%, A-Level คณิต 40%, A-Level อังกฤษ 25%, A-Level สังคม 15%', en: 'TGAT 20%, A-Level Math 40%, A-Level English 25%, A-Level Social 15%' }, seats: 90 },
      { round: 4, gpax: 2.50, requirements: { th: 'พิจารณาจากที่นั่งเหลือ', en: 'Based on remaining seats' }, seats: 15 },
    ],
    ploFitScore: 85, hasPortfolioCoach: true,
    yearByYear: defaultYearByYear('econ'),
    ploData: [92, 80, 78, 70, 85, 75],
    riasecWeights: [0.2, 0.8, 0.2, 0.4, 0.6, 0.9], // R, I, A, S, E, C
  },
  {
    id: 'food-sci',
    name: { th: 'วิทยาศาสตร์และเทคโนโลยีอาหาร', en: 'Food Science & Technology' },
    faculty: { th: 'คณะอุตสาหกรรมเกษตร', en: 'Faculty of Agro-Industry' },
    facultyIcon: '🧪',
    nutshell: { th: 'เรียนรู้การผลิต แปรรูป และพัฒนาผลิตภัณฑ์อาหารที่ปลอดภัยและนวัตกรรม', en: 'Learn food production, processing, and innovative product development' },
    careers: { th: ['นักวิทยาศาสตร์อาหาร', 'ผู้จัดการ QA', 'นักพัฒนาผลิตภัณฑ์', 'ที่ปรึกษา Food Safety'], en: ['Food Scientist', 'QA Manager', 'Product Developer', 'Food Safety Consultant'] },
    salaryMin: 22000, salaryMax: 40000,
    recruiters: ['CP Group', 'Thai Union', 'Nestle', 'Mars', 'Osotspa'],
    tcas: [
      { round: 1, gpax: 2.75, requirements: { th: 'Portfolio วิทยาศาสตร์', en: 'Science portfolio' }, seats: 20 },
      { round: 2, gpax: 2.50, requirements: { th: 'โควตาภูมิภาค', en: 'Regional quota' }, seats: 30 },
      { round: 3, gpax: 2.25, requirements: { th: 'คะแนนสอบ', en: 'Exam scores' }, examWeights: { th: 'TGAT 20%, A-Level เคมี 30%, A-Level ชีววิทยา 30%, A-Level คณิต 20%', en: 'TGAT 20%, A-Level Chemistry 30%, A-Level Biology 30%, A-Level Math 20%' }, seats: 80 },
      { round: 4, gpax: 2.00, requirements: { th: 'พิจารณาจากที่นั่งเหลือ', en: 'Based on remaining seats' }, seats: 20 },
    ],
    ploFitScore: 76, hasPortfolioCoach: false,
    yearByYear: defaultYearByYear('food'),
    ploData: [78, 88, 72, 82, 86, 80],
    riasecWeights: [0.7, 0.8, 0.4, 0.5, 0.3, 0.7], // R, I, A, S, E, C
  },
];

export const faculties = {
  th: ['คณะวิศวกรรมศาสตร์', 'คณะเกษตร', 'คณะบริหารธุรกิจ', 'คณะสิ่งแวดล้อม', 'คณะเศรษฐศาสตร์', 'คณะอุตสาหกรรมเกษตร'],
  en: ['Faculty of Engineering', 'Faculty of Agriculture', 'Faculty of Business Administration', 'Faculty of Environment', 'Faculty of Economics', 'Faculty of Agro-Industry'],
};
