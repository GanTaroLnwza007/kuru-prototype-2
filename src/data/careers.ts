/**
 * Simplified O*NET-style career dataset.
 * RIASEC weights [R, I, A, S, E, C] are derived from O*NET interest profiles
 * (empirically scored from surveys of workers in each occupation).
 * Source: O*NET OnLine — https://www.onetonline.org/
 */
export interface Career {
  id: string;
  onetCode: string;          // O*NET-SOC code for traceability
  name: { th: string; en: string };
  description: { th: string; en: string };
  riasecWeights: number[];   // [R, I, A, S, E, C] 0–1
  programIds: string[];      // KU programs that prepare for this career
  topSkills: { th: string[]; en: string[] };
}

export const careers: Career[] = [
  {
    id: 'software-engineer',
    onetCode: '15-1252.00',
    name: { th: 'วิศวกรซอฟต์แวร์', en: 'Software Developer' },
    description: {
      th: 'พัฒนาระบบซอฟต์แวร์ แอปพลิเคชัน และโซลูชันดิจิทัล',
      en: 'Develop software systems, applications, and digital solutions.',
    },
    riasecWeights: [0.7, 0.85, 0.2, 0.2, 0.3, 0.65],
    programIds: ['cs'],
    topSkills: {
      th: ['การเขียนโปรแกรม', 'การแก้ปัญหาเชิงระบบ', 'การออกแบบสถาปัตยกรรม'],
      en: ['Programming', 'Systems Thinking', 'Architecture Design'],
    },
  },
  {
    id: 'data-scientist',
    onetCode: '15-2051.00',
    name: { th: 'นักวิทยาศาสตร์ข้อมูล', en: 'Data Scientist' },
    description: {
      th: 'วิเคราะห์ข้อมูลขนาดใหญ่และสร้างโมเดล Machine Learning',
      en: 'Analyze large datasets and build machine learning models.',
    },
    riasecWeights: [0.4, 0.9, 0.2, 0.2, 0.3, 0.75],
    programIds: ['cs', 'econ'],
    topSkills: {
      th: ['สถิติ', 'Machine Learning', 'การวิเคราะห์ข้อมูล'],
      en: ['Statistics', 'Machine Learning', 'Data Analysis'],
    },
  },
  {
    id: 'agricultural-scientist',
    onetCode: '19-1011.00',
    name: { th: 'นักวิชาการเกษตร', en: 'Agricultural Scientist' },
    description: {
      th: 'วิจัยและพัฒนาวิธีการเกษตรที่ยั่งยืนและมีประสิทธิภาพ',
      en: 'Research and develop sustainable and efficient farming methods.',
    },
    riasecWeights: [0.8, 0.85, 0.25, 0.5, 0.3, 0.4],
    programIds: ['agri', 'food-sci'],
    topSkills: {
      th: ['ชีววิทยาพืช', 'การวิจัยภาคสนาม', 'ความยั่งยืน'],
      en: ['Plant Biology', 'Field Research', 'Sustainability'],
    },
  },
  {
    id: 'farm-manager',
    onetCode: '11-9013.00',
    name: { th: 'ผู้จัดการฟาร์ม', en: 'Farm Manager' },
    description: {
      th: 'บริหารจัดการฟาร์มและระบบการผลิตทางการเกษตร',
      en: 'Manage farms and agricultural production systems.',
    },
    riasecWeights: [0.9, 0.55, 0.2, 0.5, 0.65, 0.55],
    programIds: ['agri'],
    topSkills: {
      th: ['การจัดการฟาร์ม', 'ความเป็นผู้นำ', 'การวางแผนการผลิต'],
      en: ['Farm Operations', 'Leadership', 'Production Planning'],
    },
  },
  {
    id: 'business-analyst',
    onetCode: '13-1111.00',
    name: { th: 'นักวิเคราะห์ธุรกิจ', en: 'Business Analyst' },
    description: {
      th: 'วิเคราะห์กระบวนการธุรกิจและแนะนำแนวทางปรับปรุง',
      en: 'Analyze business processes and recommend improvements.',
    },
    riasecWeights: [0.2, 0.75, 0.3, 0.55, 0.7, 0.8],
    programIds: ['bba', 'econ'],
    topSkills: {
      th: ['การวิเคราะห์ข้อมูล', 'การสื่อสาร', 'การจัดการโครงการ'],
      en: ['Data Analysis', 'Communication', 'Project Management'],
    },
  },
  {
    id: 'marketing-manager',
    onetCode: '11-2021.00',
    name: { th: 'ผู้จัดการการตลาด', en: 'Marketing Manager' },
    description: {
      th: 'วางกลยุทธ์การตลาดและสร้างแบรนด์ให้กับองค์กร',
      en: 'Develop marketing strategies and build brand presence.',
    },
    riasecWeights: [0.15, 0.5, 0.55, 0.65, 0.9, 0.5],
    programIds: ['bba'],
    topSkills: {
      th: ['กลยุทธ์การตลาด', 'การสื่อสาร', 'ความคิดสร้างสรรค์'],
      en: ['Marketing Strategy', 'Communication', 'Creativity'],
    },
  },
  {
    id: 'environmental-scientist',
    onetCode: '19-2041.00',
    name: { th: 'นักวิทยาศาสตร์สิ่งแวดล้อม', en: 'Environmental Scientist' },
    description: {
      th: 'ศึกษาและแก้ปัญหาด้านมลพิษและการเปลี่ยนแปลงสภาพภูมิอากาศ',
      en: 'Study and address pollution and climate change issues.',
    },
    riasecWeights: [0.7, 0.85, 0.3, 0.6, 0.3, 0.45],
    programIds: ['env-sci', 'agri'],
    topSkills: {
      th: ['การวิจัยสิ่งแวดล้อม', 'การวิเคราะห์ข้อมูล', 'การเขียนรายงาน'],
      en: ['Environmental Research', 'Data Analysis', 'Report Writing'],
    },
  },
  {
    id: 'esg-consultant',
    onetCode: '13-1199.05',
    name: { th: 'ที่ปรึกษา ESG', en: 'ESG Consultant' },
    description: {
      th: 'ให้คำปรึกษาด้านสิ่งแวดล้อม สังคม และธรรมาภิบาลแก่องค์กร',
      en: 'Advise organizations on environmental, social, and governance matters.',
    },
    riasecWeights: [0.3, 0.65, 0.35, 0.7, 0.7, 0.6],
    programIds: ['env-sci', 'bba', 'econ'],
    topSkills: {
      th: ['นโยบาย ESG', 'การสื่อสาร', 'การวิเคราะห์ความยั่งยืน'],
      en: ['ESG Policy', 'Communication', 'Sustainability Analysis'],
    },
  },
  {
    id: 'economist',
    onetCode: '19-3011.00',
    name: { th: 'นักเศรษฐศาสตร์', en: 'Economist' },
    description: {
      th: 'วิเคราะห์ระบบเศรษฐกิจ นโยบาย และตลาดการเงิน',
      en: 'Analyze economic systems, policy, and financial markets.',
    },
    riasecWeights: [0.15, 0.9, 0.2, 0.4, 0.55, 0.85],
    programIds: ['econ'],
    topSkills: {
      th: ['เศรษฐมิติ', 'การวิเคราะห์นโยบาย', 'การสร้างโมเดล'],
      en: ['Econometrics', 'Policy Analysis', 'Modeling'],
    },
  },
  {
    id: 'financial-analyst',
    onetCode: '13-2051.00',
    name: { th: 'นักวิเคราะห์การเงิน', en: 'Financial Analyst' },
    description: {
      th: 'ประเมินการลงทุนและวิเคราะห์ผลประกอบการทางการเงิน',
      en: 'Evaluate investments and analyze financial performance.',
    },
    riasecWeights: [0.2, 0.8, 0.2, 0.35, 0.6, 0.9],
    programIds: ['econ', 'bba'],
    topSkills: {
      th: ['การวิเคราะห์การเงิน', 'การสร้างแบบจำลอง', 'ความละเอียดรอบคอบ'],
      en: ['Financial Analysis', 'Modeling', 'Attention to Detail'],
    },
  },
  {
    id: 'food-scientist',
    onetCode: '19-1012.00',
    name: { th: 'นักวิทยาศาสตร์อาหาร', en: 'Food Scientist' },
    description: {
      th: 'วิจัยและพัฒนาผลิตภัณฑ์อาหารที่ปลอดภัยและมีนวัตกรรม',
      en: 'Research and develop safe and innovative food products.',
    },
    riasecWeights: [0.6, 0.85, 0.35, 0.4, 0.3, 0.65],
    programIds: ['food-sci', 'agri'],
    topSkills: {
      th: ['เคมีอาหาร', 'การควบคุมคุณภาพ', 'นวัตกรรมผลิตภัณฑ์'],
      en: ['Food Chemistry', 'Quality Control', 'Product Innovation'],
    },
  },
  {
    id: 'product-developer',
    onetCode: '11-9041.01',
    name: { th: 'นักพัฒนาผลิตภัณฑ์', en: 'Product Developer' },
    description: {
      th: 'ออกแบบและพัฒนาผลิตภัณฑ์ใหม่ตั้งแต่แนวคิดจนถึงตลาด',
      en: 'Design and develop new products from concept to market.',
    },
    riasecWeights: [0.5, 0.65, 0.6, 0.45, 0.6, 0.5],
    programIds: ['food-sci', 'bba', 'cs'],
    topSkills: {
      th: ['การออกแบบผลิตภัณฑ์', 'การวิจัยตลาด', 'ความคิดสร้างสรรค์'],
      en: ['Product Design', 'Market Research', 'Creativity'],
    },
  },
];
