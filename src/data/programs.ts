export interface ProgramTCAS {
  round: number;
  gpax: number;
  requirements: { th: string; en: string };
  examWeights?: { th: string; en: string };
  seats: number;
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
}

export const programs: Program[] = [
  {
    id: 'cs',
    name: { th: 'วิทยาการคอมพิวเตอร์', en: 'Computer Science' },
    faculty: { th: 'คณะวิศวกรรมศาสตร์', en: 'Faculty of Engineering' },
    facultyIcon: '⚙️',
    nutshell: {
      th: 'เรียนรู้การพัฒนาซอฟต์แวร์ AI และระบบคอมพิวเตอร์เพื่อแก้ปัญหาจริง',
      en: 'Learn software development, AI, and computer systems to solve real-world problems',
    },
    careers: {
      th: ['วิศวกรซอฟต์แวร์', 'นักวิทยาศาสตร์ข้อมูล', 'นักวิเคราะห์ระบบ', 'วิศวกร AI'],
      en: ['Software Engineer', 'Data Scientist', 'Systems Analyst', 'AI Engineer'],
    },
    salaryMin: 30000,
    salaryMax: 55000,
    recruiters: ['Agoda', 'KBTG', 'LINE MAN Wongnai', 'SCB', 'True Digital'],
    tcas: [
      { round: 1, gpax: 3.00, requirements: { th: 'Portfolio ด้าน IT/Programming, ผลงานแข่งขัน', en: 'IT/Programming portfolio, competition awards' }, seats: 30 },
      { round: 2, gpax: 2.75, requirements: { th: 'สอบข้อเขียนเฉพาะสาขา', en: 'Department written exam' }, seats: 20 },
      { round: 3, gpax: 2.50, requirements: { th: 'คะแนนสอบ', en: 'Exam scores' }, examWeights: { th: 'TGAT 20%, TPAT3 30%, A-Level คณิต 30%, A-Level ฟิสิกส์ 20%', en: 'TGAT 20%, TPAT3 30%, A-Level Math 30%, A-Level Physics 20%' }, seats: 80 },
      { round: 4, gpax: 2.50, requirements: { th: 'พิจารณาจากที่นั่งเหลือ', en: 'Based on remaining seats' }, seats: 10 },
    ],
    ploFitScore: 95,
  },
  {
    id: 'agri',
    name: { th: 'เกษตรศาสตร์', en: 'Agriculture' },
    faculty: { th: 'คณะเกษตร', en: 'Faculty of Agriculture' },
    facultyIcon: '🌾',
    nutshell: {
      th: 'ศึกษาระบบการเกษตรสมัยใหม่ การผลิตพืชและสัตว์อย่างยั่งยืน',
      en: 'Study modern agricultural systems, sustainable crop and animal production',
    },
    careers: {
      th: ['นักวิชาการเกษตร', 'ผู้จัดการฟาร์ม', 'นักวิจัยพืช', 'ที่ปรึกษาด้านเกษตร'],
      en: ['Agricultural Scientist', 'Farm Manager', 'Crop Researcher', 'Agricultural Consultant'],
    },
    salaryMin: 18000,
    salaryMax: 35000,
    recruiters: ['CP Group', 'Betagro', 'Thai Union', 'Syngenta', 'BASF'],
    tcas: [
      { round: 1, gpax: 2.75, requirements: { th: 'Portfolio กิจกรรมเกษตร, โครงงาน', en: 'Agriculture activities portfolio, projects' }, seats: 40 },
      { round: 2, gpax: 2.50, requirements: { th: 'โควตาภูมิภาค', en: 'Regional quota' }, seats: 50 },
      { round: 3, gpax: 2.00, requirements: { th: 'คะแนนสอบ', en: 'Exam scores' }, examWeights: { th: 'TGAT 30%, A-Level ชีววิทยา 30%, A-Level เคมี 20%, A-Level คณิต 20%', en: 'TGAT 30%, A-Level Biology 30%, A-Level Chemistry 20%, A-Level Math 20%' }, seats: 120 },
      { round: 4, gpax: 2.00, requirements: { th: 'พิจารณาจากที่นั่งเหลือ', en: 'Based on remaining seats' }, seats: 30 },
    ],
    ploFitScore: 88,
  },
  {
    id: 'bba',
    name: { th: 'บริหารธุรกิจ', en: 'Business Administration' },
    faculty: { th: 'คณะบริหารธุรกิจ', en: 'Faculty of Business Administration' },
    facultyIcon: '📊',
    nutshell: {
      th: 'พัฒนาทักษะการบริหาร การตลาด การเงิน และผู้ประกอบการยุคใหม่',
      en: 'Develop management, marketing, finance, and modern entrepreneurship skills',
    },
    careers: {
      th: ['นักการตลาดดิจิทัล', 'นักวิเคราะห์ธุรกิจ', 'ผู้จัดการผลิตภัณฑ์', 'ที่ปรึกษาด้านกลยุทธ์'],
      en: ['Digital Marketer', 'Business Analyst', 'Product Manager', 'Strategy Consultant'],
    },
    salaryMin: 25000,
    salaryMax: 45000,
    recruiters: ['SCB', 'Unilever', 'P&G', 'Deloitte', 'McKinsey'],
    tcas: [
      { round: 1, gpax: 3.00, requirements: { th: 'Portfolio ธุรกิจ, กิจกรรมผู้นำ', en: 'Business portfolio, leadership activities' }, seats: 25 },
      { round: 2, gpax: 2.75, requirements: { th: 'สอบสัมภาษณ์', en: 'Interview' }, seats: 30 },
      { round: 3, gpax: 2.50, requirements: { th: 'คะแนนสอบ', en: 'Exam scores' }, examWeights: { th: 'TGAT 30%, A-Level คณิต 30%, A-Level อังกฤษ 25%, A-Level สังคม 15%', en: 'TGAT 30%, A-Level Math 30%, A-Level English 25%, A-Level Social 15%' }, seats: 100 },
      { round: 4, gpax: 2.50, requirements: { th: 'พิจารณาจากที่นั่งเหลือ', en: 'Based on remaining seats' }, seats: 15 },
    ],
    ploFitScore: 82,
  },
  {
    id: 'env-sci',
    name: { th: 'วิทยาศาสตร์สิ่งแวดล้อม', en: 'Environmental Science' },
    faculty: { th: 'คณะสิ่งแวดล้อม', en: 'Faculty of Environment' },
    facultyIcon: '🌿',
    nutshell: {
      th: 'ศึกษาระบบนิเวศ มลพิษ และการพัฒนาอย่างยั่งยืนเพื่ออนาคตโลก',
      en: 'Study ecosystems, pollution, and sustainable development for a better future',
    },
    careers: {
      th: ['นักวิทยาศาสตร์สิ่งแวดล้อม', 'ที่ปรึกษา ESG', 'นักวิจัยภูมิอากาศ', 'ผู้เชี่ยวชาญ EIA'],
      en: ['Environmental Scientist', 'ESG Consultant', 'Climate Researcher', 'EIA Specialist'],
    },
    salaryMin: 20000,
    salaryMax: 38000,
    recruiters: ['PTT', 'SCG', 'EGCO', 'ERM', 'UNDP'],
    tcas: [
      { round: 1, gpax: 2.75, requirements: { th: 'Portfolio ด้านสิ่งแวดล้อม', en: 'Environmental portfolio' }, seats: 20 },
      { round: 2, gpax: 2.50, requirements: { th: 'โควตาภูมิภาค', en: 'Regional quota' }, seats: 25 },
      { round: 3, gpax: 2.25, requirements: { th: 'คะแนนสอบ', en: 'Exam scores' }, examWeights: { th: 'TGAT 25%, A-Level เคมี 25%, A-Level ชีววิทยา 25%, A-Level คณิต 25%', en: 'TGAT 25%, A-Level Chemistry 25%, A-Level Biology 25%, A-Level Math 25%' }, seats: 60 },
      { round: 4, gpax: 2.00, requirements: { th: 'พิจารณาจากที่นั่งเหลือ', en: 'Based on remaining seats' }, seats: 15 },
    ],
    ploFitScore: 78,
  },
  {
    id: 'econ',
    name: { th: 'เศรษฐศาสตร์', en: 'Economics' },
    faculty: { th: 'คณะเศรษฐศาสตร์', en: 'Faculty of Economics' },
    facultyIcon: '💹',
    nutshell: {
      th: 'วิเคราะห์ระบบเศรษฐกิจ นโยบายสาธารณะ และตลาดการเงิน',
      en: 'Analyze economic systems, public policy, and financial markets',
    },
    careers: {
      th: ['นักเศรษฐศาสตร์', 'นักวิเคราะห์การเงิน', 'ที่ปรึกษานโยบาย', 'นักวิจัยเศรษฐกิจ'],
      en: ['Economist', 'Financial Analyst', 'Policy Advisor', 'Economic Researcher'],
    },
    salaryMin: 25000,
    salaryMax: 50000,
    recruiters: ['Bank of Thailand', 'KBank', 'EIC SCB', 'World Bank', 'TDRI'],
    tcas: [
      { round: 1, gpax: 3.25, requirements: { th: 'Portfolio วิชาการ, ผลงานวิจัย', en: 'Academic portfolio, research work' }, seats: 15 },
      { round: 2, gpax: 3.00, requirements: { th: 'สอบข้อเขียน', en: 'Written exam' }, seats: 20 },
      { round: 3, gpax: 2.50, requirements: { th: 'คะแนนสอบ', en: 'Exam scores' }, examWeights: { th: 'TGAT 20%, A-Level คณิต 40%, A-Level อังกฤษ 25%, A-Level สังคม 15%', en: 'TGAT 20%, A-Level Math 40%, A-Level English 25%, A-Level Social 15%' }, seats: 90 },
      { round: 4, gpax: 2.50, requirements: { th: 'พิจารณาจากที่นั่งเหลือ', en: 'Based on remaining seats' }, seats: 15 },
    ],
    ploFitScore: 85,
  },
  {
    id: 'food-sci',
    name: { th: 'วิทยาศาสตร์และเทคโนโลยีอาหาร', en: 'Food Science & Technology' },
    faculty: { th: 'คณะอุตสาหกรรมเกษตร', en: 'Faculty of Agro-Industry' },
    facultyIcon: '🧪',
    nutshell: {
      th: 'เรียนรู้การผลิต แปรรูป และพัฒนาผลิตภัณฑ์อาหารที่ปลอดภัยและนวัตกรรม',
      en: 'Learn food production, processing, and innovative product development',
    },
    careers: {
      th: ['นักวิทยาศาสตร์อาหาร', 'ผู้จัดการ QA', 'นักพัฒนาผลิตภัณฑ์', 'ที่ปรึกษา Food Safety'],
      en: ['Food Scientist', 'QA Manager', 'Product Developer', 'Food Safety Consultant'],
    },
    salaryMin: 22000,
    salaryMax: 40000,
    recruiters: ['CP Group', 'Thai Union', 'Nestle', 'Mars', 'Osotspa'],
    tcas: [
      { round: 1, gpax: 2.75, requirements: { th: 'Portfolio วิทยาศาสตร์', en: 'Science portfolio' }, seats: 20 },
      { round: 2, gpax: 2.50, requirements: { th: 'โควตาภูมิภาค', en: 'Regional quota' }, seats: 30 },
      { round: 3, gpax: 2.25, requirements: { th: 'คะแนนสอบ', en: 'Exam scores' }, examWeights: { th: 'TGAT 20%, A-Level เคมี 30%, A-Level ชีววิทยา 30%, A-Level คณิต 20%', en: 'TGAT 20%, A-Level Chemistry 30%, A-Level Biology 30%, A-Level Math 20%' }, seats: 80 },
      { round: 4, gpax: 2.00, requirements: { th: 'พิจารณาจากที่นั่งเหลือ', en: 'Based on remaining seats' }, seats: 20 },
    ],
    ploFitScore: 76,
  },
];

export const faculties = {
  th: ['คณะวิศวกรรมศาสตร์', 'คณะเกษตร', 'คณะบริหารธุรกิจ', 'คณะสิ่งแวดล้อม', 'คณะเศรษฐศาสตร์', 'คณะอุตสาหกรรมเกษตร'],
  en: ['Faculty of Engineering', 'Faculty of Agriculture', 'Faculty of Business Administration', 'Faculty of Environment', 'Faculty of Economics', 'Faculty of Agro-Industry'],
};
