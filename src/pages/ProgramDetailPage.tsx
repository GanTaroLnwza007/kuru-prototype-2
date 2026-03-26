import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Heart, MessageCircle, GraduationCap, Sparkles,
  Briefcase, Building2, BookOpen, ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/i18n/LanguageContext';
import { programs } from '@/data/programs';
import { useState } from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
} from 'recharts';

const formatSalary = (n: number) => `฿${n.toLocaleString()}`;

const workloadEmoji: Record<string, string> = { light: '😌', moderate: '📚', heavy: '💪', intense: '🔥' };
const workloadLabel: Record<string, { th: string; en: string }> = {
  light: { th: 'ชิลๆ', en: 'Chill' },
  moderate: { th: 'ปานกลาง', en: 'Moderate' },
  heavy: { th: 'หนักพอตัว', en: 'Heavy' },
  intense: { th: 'เข้มข้นมาก', en: 'Intense' },
};
const workloadColor: Record<string, string> = {
  light: 'bg-green-400',
  moderate: 'bg-yellow-400',
  heavy: 'bg-orange-400',
  intense: 'bg-red-500',
};
const workloadRing: Record<string, string> = {
  light: 'ring-green-400',
  moderate: 'ring-yellow-400',
  heavy: 'ring-orange-400',
  intense: 'ring-red-500',
};

const ploLabels = {
  th: ['คิดวิเคราะห์', 'เทคนิค', 'สื่อสาร', 'ทีมเวิร์ค', 'จริยธรรม', 'นวัตกรรม'],
  en: ['Critical Thinking', 'Technical', 'Communication', 'Teamwork', 'Ethics', 'Innovation'],
};

const PINNED_KEY = 'kuru_pinned_ids';
const getPinned = (): string[] => {
  try { return JSON.parse(sessionStorage.getItem(PINNED_KEY) || '[]'); } catch { return []; }
};
const setPinned = (ids: string[]) => sessionStorage.setItem(PINNED_KEY, JSON.stringify(ids));

const ProgramDetailPage = () => {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const [pinnedIds, setPinnedIds] = useState<string[]>(getPinned);

  const p = programs.find(x => x.id === programId);
  if (!p) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-2xl font-bold text-foreground">{lang === 'th' ? 'ไม่พบหลักสูตรนี้' : 'Program not found'}</p>
          <Button onClick={() => navigate('/explore')} variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {lang === 'th' ? 'กลับไปหน้า Explore' : 'Back to Explore'}
          </Button>
        </div>
      </div>
    );
  }

  const isPinned = pinnedIds.includes(p.id);
  const togglePin = () => {
    const next = isPinned ? pinnedIds.filter(x => x !== p.id) : [...pinnedIds, p.id];
    setPinnedIds(next);
    setPinned(next);
  };

  const radarData = ploLabels[lang].map((label, i) => ({
    subject: label,
    score: p.ploData[i],
    fullMark: 100,
  }));

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/explore');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-3xl mx-auto px-4 py-6 space-y-8">

        {/* Back */}
        <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>
          <Button variant="ghost" size="sm" onClick={handleBack} className="gap-2 text-muted-foreground -ml-2">
            <ArrowLeft className="h-4 w-4" />
            {lang === 'th' ? 'กลับไป Explore' : 'Back to Explore'}
          </Button>
        </motion.div>

        {/* ── HERO ── */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <div className="gradient-hero rounded-2xl p-6 pb-8 relative overflow-hidden">
            <div className="flex items-start gap-4">
              <span className="text-6xl drop-shadow">{p.facultyIcon}</span>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-primary-foreground leading-tight">
                  {p.name[lang]}
                </h1>
                <p className="text-primary-foreground/80 text-sm mt-1">{p.faculty[lang]}</p>
                <p className="text-primary-foreground/70 text-sm italic mt-1 leading-relaxed">{p.nutshell[lang]}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge className="bg-primary-foreground/20 text-primary-foreground border-0 text-xs">
                    {lang === 'th' ? 'หลักสูตร 4 ปี' : '4-Year Program'}
                  </Badge>
                  <Badge className="bg-primary-foreground/20 text-primary-foreground border-0 text-xs">
                    {lang === 'th' ? 'ภาษาไทย' : 'Thai Language'}
                  </Badge>
                  <Badge className="bg-primary-foreground/20 text-primary-foreground border-0 text-xs">
                    {lang === 'th' ? 'วิทยาเขตบางเขน' : 'Bangkhen Campus'}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-5">
              <Badge className="bg-primary-foreground/25 text-primary-foreground border-0 text-lg px-4 py-2 font-bold">
                {p.ploFitScore}% PLO Fit
              </Badge>
              {p.hasPortfolioCoach && (
                <Badge className="bg-primary-foreground/20 text-primary-foreground border-0 text-xs px-3 py-1.5 gap-1">
                  <Sparkles className="h-3 w-3" /> Portfolio Coach
                </Badge>
              )}
            </div>
          </div>

          {/* CTAs */}
          <div className="flex gap-3 mt-3">
            <Button
              onClick={togglePin}
              variant={isPinned ? 'default' : 'outline'}
              className={`flex-1 gap-2 ${isPinned ? 'gradient-hero text-primary-foreground' : ''}`}
            >
              <Heart className={`h-4 w-4 ${isPinned ? 'fill-current' : ''}`} />
              {isPinned
                ? (lang === 'th' ? 'ปักหมุดแล้ว' : 'Pinned')
                : (lang === 'th' ? 'ปักหมุด' : 'Pin')}
            </Button>
            <Button
              onClick={() => navigate(`/chat?program=${p.id}`)}
              className="flex-1 gap-2 gradient-hero text-primary-foreground"
            >
              <MessageCircle className="h-4 w-4" />
              {lang === 'th' ? 'ถาม KUru' : 'Ask KUru'}
            </Button>
          </div>
        </motion.div>

        {/* ── CAREERS ── */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="font-display font-bold text-foreground text-xl mb-4 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            {lang === 'th' ? 'อาชีพที่รองรับ' : 'Career Paths'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {p.careers[lang].map((career, i) => (
              <div key={career} className="bg-card border border-border rounded-xl p-3.5 flex items-center justify-between group hover:border-primary/30 hover:shadow-card transition-all">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{['💻', '📊', '🔬', '🎯', '🏗️', '📱'][i % 6]}</span>
                  <span className="text-sm font-medium text-foreground">{career}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            ))}
          </div>

          <div className="bg-muted/50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-4 w-4 text-primary" />
                <span className="font-semibold text-sm text-foreground">{t.explore.topRecruiters}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {p.recruiters.map(r => <Badge key={r} variant="outline" className="text-xs">{r}</Badge>)}
              </div>
            </div>
            <div className="shrink-0 text-center sm:text-right">
              <p className="text-xs text-muted-foreground mb-1">{lang === 'th' ? 'เงินเดือน' : 'Salary Range'}</p>
              <Badge className="bg-primary/10 text-primary border-primary/20 text-sm font-bold px-3 py-1.5">
                {formatSalary(p.salaryMin)} – {formatSalary(p.salaryMax)}
              </Badge>
            </div>
          </div>
        </motion.section>

        <Separator />

        {/* ── YEAR ROADMAP ── */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <h2 className="font-display font-bold text-foreground text-xl mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            {lang === 'th' ? 'ชีวิตแต่ละปีเป็นยังไง?' : 'Year-by-Year Vibe'}
          </h2>
          <div className="relative pl-8">
            {/* Track line */}
            <div className="absolute left-3.5 top-3 bottom-3 w-0.5 bg-border rounded-full" />
            <div className="space-y-0">
              {p.yearByYear.map((y, i) => (
                <motion.div
                  key={y.year}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.07 }}
                  className="relative"
                >
                  {/* Node */}
                  <div className={`absolute -left-[18px] top-5 w-4 h-4 rounded-full ring-2 ring-offset-2 ring-offset-background ${workloadColor[y.workload]} ${workloadRing[y.workload]}`} />
                  <div className="bg-card border border-border rounded-xl p-4 mb-3 hover:shadow-card-hover transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-primary text-sm">{y.title[lang]}</span>
                      <div className="flex items-center gap-1.5 bg-muted/60 rounded-full px-2.5 py-1">
                        <span className="text-sm">{workloadEmoji[y.workload]}</span>
                        <span className="text-xs text-muted-foreground">{workloadLabel[y.workload][lang]}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{y.description[lang]}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {y.skills[lang].map(s => (
                        <Badge key={s} variant="secondary" className="text-xs px-2 py-0.5">{s}</Badge>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        <Separator />

        {/* ── PLO RADAR ── */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="font-display font-bold text-foreground text-xl mb-4">
            {lang === 'th' ? 'แผนภูมิ PLO' : 'PLO Radar Chart'}
          </h2>
          <div className="bg-muted/30 rounded-xl p-4">
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="PLO" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.25} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        <Separator />

        {/* ── TCAS ── */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <h2 className="font-display font-bold text-foreground text-xl mb-4 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            {t.explore.howToGetIn}
          </h2>
          <Tabs defaultValue="1" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              {[1, 2, 3, 4].map(r => (
                <TabsTrigger key={r} value={String(r)} className="text-xs sm:text-sm">
                  {t.explore.round} {r}
                </TabsTrigger>
              ))}
            </TabsList>
            {p.tcas.map(tc => (
              <TabsContent key={tc.round} value={String(tc.round)} className="space-y-3 bg-muted/50 rounded-xl p-5">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">{t.explore.seats}: {tc.seats}</Badge>
                  <Badge className="bg-primary/10 text-primary border-0 text-xs">
                    {t.explore.gpax} {tc.gpax.toFixed(2)}+
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{t.explore.requirements}:</p>
                  <p className="text-sm text-foreground font-medium bg-background rounded-lg px-3 py-2">
                    {tc.requirements[lang]}
                  </p>
                </div>
                {tc.examWeights && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">{t.explore.examWeights}:</p>
                    <p className="text-sm text-foreground font-medium bg-background rounded-lg px-3 py-2">
                      {tc.examWeights[lang]}
                    </p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
          {p.hasPortfolioCoach && (
            <Button
              onClick={() => navigate('/portfolio')}
              variant="outline"
              className="w-full mt-3 gap-2 border-primary/30 text-primary hover:bg-primary/5"
            >
              <Sparkles className="h-4 w-4" />
              {lang === 'th' ? 'เช็คความพร้อม Portfolio รอบ 1 →' : 'Check Round 1 Portfolio Readiness →'}
            </Button>
          )}
        </motion.section>

        {/* ── RELATED ── */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Separator className="mb-8" />
          <h2 className="font-display font-bold text-foreground text-xl mb-4">
            {lang === 'th' ? 'หลักสูตรที่คล้ายกัน' : 'Related Programs'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {programs
              .filter(x => x.id !== p.id)
              .sort((a, b) => {
                // sort by PLO vector similarity (dot product approximation)
                const dot = (v: number[], w: number[]) => v.reduce((s, x, i) => s + x * w[i], 0);
                return dot(b.ploData, p.ploData) - dot(a.ploData, p.ploData);
              })
              .slice(0, 4)
              .map(rel => (
                <button
                  key={rel.id}
                  onClick={() => navigate(`/programs/${rel.id}`)}
                  className="bg-card border border-border rounded-xl p-3.5 flex items-center gap-3 hover:border-primary/30 hover:shadow-card transition-all text-left"
                >
                  <span className="text-3xl">{rel.facultyIcon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{rel.name[lang]}</p>
                    <p className="text-xs text-muted-foreground truncate">{rel.faculty[lang]}</p>
                  </div>
                  <Badge className="bg-primary/10 text-primary border-0 text-xs shrink-0">{rel.ploFitScore}%</Badge>
                </button>
              ))}
          </div>
        </motion.section>

      </div>
    </div>
  );
};

export default ProgramDetailPage;
