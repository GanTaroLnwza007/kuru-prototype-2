import { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Bookmark } from 'lucide-react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ResponsiveContainer, Legend,
} from 'recharts';

const mockPrograms = [
  {
    id: 1,
    name: { th: 'วิทยาการคอมพิวเตอร์', en: 'Computer Science' },
    faculty: { th: 'คณะวิศวกรรมศาสตร์', en: 'Faculty of Engineering' },
    fitScore: 92,
    reason: {
      th: 'ตรงกับความสนใจด้านเทคโนโลยีและการแก้ปัญหาเชิงระบบของคุณ หลักสูตรเน้นทักษะ AI และซอฟต์แวร์',
      en: 'Matches your interest in technology and systematic problem-solving. Focuses on AI and software skills.',
    },
    plo: [85, 90, 70, 40, 60, 95],
  },
  {
    id: 2,
    name: { th: 'วิทยาศาสตร์ข้อมูล', en: 'Data Science' },
    faculty: { th: 'คณะวิทยาศาสตร์', en: 'Faculty of Science' },
    fitScore: 87,
    reason: {
      th: 'เหมาะกับความชอบในการทำงานกับข้อมูลและตัวเลข มีการเรียนรู้ทั้งสถิติและ Machine Learning',
      en: 'Great for your love of data and numbers. Covers both statistics and machine learning.',
    },
    plo: [80, 85, 65, 35, 55, 80],
  },
  {
    id: 3,
    name: { th: 'เกษตรศาสตร์', en: 'Agriculture' },
    faculty: { th: 'คณะเกษตร', en: 'Faculty of Agriculture' },
    fitScore: 74,
    reason: {
      th: 'ตอบโจทย์ความสนใจด้านสิ่งแวดล้อมและความยั่งยืน เน้นภาคสนามและการวิจัย',
      en: 'Addresses your environmental and sustainability interests with fieldwork and research focus.',
    },
    plo: [50, 70, 45, 90, 60, 55],
  },
  {
    id: 4,
    name: { th: 'บริหารธุรกิจ', en: 'Business Administration' },
    faculty: { th: 'คณะบริหารธุรกิจ', en: 'Faculty of Business Administration' },
    fitScore: 68,
    reason: {
      th: 'เหมาะสำหรับผู้ที่ต้องการเป็นผู้ประกอบการ หลักสูตรครอบคลุมการจัดการและการตลาดสมัยใหม่',
      en: 'Perfect for aspiring entrepreneurs. Covers modern management and marketing.',
    },
    plo: [40, 50, 90, 30, 85, 45],
  },
];

const ploLabels = ['Analytical', 'Technical', 'Communication', 'Fieldwork', 'Teamwork', 'Problem-solving'];

const userProfile = [75, 80, 60, 50, 65, 85];

const ResultsPage = () => {
  const { t, lang } = useLanguage();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] px-4 py-6 max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-xl font-bold text-foreground">{t.results.title}</h1>
        <p className="text-sm text-muted-foreground">{t.results.subtitle}</p>
      </div>

      <div className="space-y-4">
        {mockPrograms.map((program, index) => {
          const expanded = expandedId === program.id;
          const chartData = ploLabels.map((label, i) => ({
            subject: label,
            student: userProfile[i],
            program: program.plo[i],
          }));

          return (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="shadow-card overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <CardTitle className="text-base">{program.name[lang]}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">{program.faculty[lang]}</p>
                    </div>
                    <Badge
                      className={`text-sm font-bold px-3 py-1 shrink-0 ${
                        program.fitScore >= 85
                          ? 'bg-primary text-primary-foreground'
                          : program.fitScore >= 70
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {program.fitScore}%
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">{t.results.whyFit}</p>
                    <p className="text-sm text-foreground">{program.reason[lang]}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedId(expanded ? null : program.id)}
                      className="gap-1 text-xs"
                    >
                      {expanded ? (
                        <><ChevronUp className="h-3 w-3" />{t.results.hidePLO}</>
                      ) : (
                        <><ChevronDown className="h-3 w-3" />{t.results.viewPLO}</>
                      )}
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1 text-xs">
                      <Bookmark className="h-3 w-3" />
                      {t.results.save}
                    </Button>
                  </div>

                  {expanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-2"
                    >
                      <ResponsiveContainer width="100%" height={280}>
                        <RadarChart data={chartData}>
                          <PolarGrid stroke="hsl(var(--border))" />
                          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                          <Radar
                            name={t.results.yourProfile}
                            dataKey="student"
                            stroke="hsl(var(--primary))"
                            fill="hsl(var(--primary))"
                            fillOpacity={0.2}
                            strokeWidth={2}
                          />
                          <Radar
                            name={t.results.programPLO}
                            dataKey="program"
                            stroke="hsl(var(--destructive))"
                            fill="hsl(var(--destructive))"
                            fillOpacity={0.1}
                            strokeWidth={2}
                          />
                          <Legend wrapperStyle={{ fontSize: 12 }} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ResultsPage;
