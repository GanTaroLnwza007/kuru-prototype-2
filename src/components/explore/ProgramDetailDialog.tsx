import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Heart, MessageCircle, GraduationCap, Sparkles, Briefcase, Building2, BookOpen } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { type Program } from '@/data/programs';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

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

interface Props {
  program: Program | null;
  open: boolean;
  onClose: () => void;
  isPinned: boolean;
  onTogglePin: (id: string) => void;
  lang: 'th' | 'en';
  t: any;
}

const ProgramDetailDialog = ({ program: p, open, onClose, isPinned, onTogglePin, lang, t }: Props) => {
  const navigate = useNavigate();
  if (!p) return null;

  const radarData = ploLabels[lang].map((label, i) => ({
    subject: label,
    score: p.ploData[i],
    fullMark: 100,
  }));

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0 rounded-2xl">
        {/* Hero */}
        <div className="gradient-hero p-6 pb-8 rounded-t-2xl relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-primary-foreground/80 hover:text-primary-foreground">
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-start gap-4">
            <span className="text-5xl">{p.facultyIcon}</span>
            <div className="flex-1">
              <h2 className="text-2xl font-display font-bold text-primary-foreground">{p.name[lang]}</h2>
              <p className="text-primary-foreground/80 text-sm mt-1">{p.faculty[lang]}</p>
              <p className="text-primary-foreground/70 text-sm italic mt-1">{p.nutshell[lang]}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <Badge className="bg-primary-foreground/20 text-primary-foreground border-0 text-lg px-4 py-2 font-bold">
              {p.ploFitScore}% PLO Fit
            </Badge>
            {p.hasPortfolioCoach && (
              <Badge className="bg-primary-foreground/20 text-primary-foreground border-0 text-xs px-3 py-1">
                <Sparkles className="h-3 w-3 mr-1" /> Portfolio Coach
              </Badge>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Action buttons */}
          <div className="flex gap-3">
            <Button
              onClick={() => onTogglePin(p.id)}
              variant={isPinned ? 'default' : 'outline'}
              className={`flex-1 gap-2 ${isPinned ? 'gradient-hero text-primary-foreground' : ''}`}
            >
              <Heart className={`h-4 w-4 ${isPinned ? 'fill-current' : ''}`} />
              {isPinned ? (lang === 'th' ? 'ปักหมุดแล้ว' : 'Pinned') : (lang === 'th' ? 'ปักหมุดหลักสูตรนี้' : 'Pin this program')}
            </Button>
            <Button onClick={() => navigate(`/chat?program=${p.id}`)} className="flex-1 gap-2 gradient-hero text-primary-foreground">
              <MessageCircle className="h-4 w-4" />
              {lang === 'th' ? 'ถาม KUru เกี่ยวกับหลักสูตรนี้' : 'Ask KUru about this program'}
            </Button>
          </div>

          {/* Careers & Salary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-muted/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="h-4 w-4 text-primary" />
                <span className="font-semibold text-sm text-foreground">{t.explore.careers}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {p.careers[lang].map(c => <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>)}
              </div>
            </div>
            <div className="bg-muted/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="h-4 w-4 text-primary" />
                <span className="font-semibold text-sm text-foreground">{t.explore.topRecruiters}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {p.recruiters.map(r => <Badge key={r} variant="outline" className="text-xs">{r}</Badge>)}
              </div>
              <Badge className="mt-3 bg-primary/10 text-primary border-primary/20 text-sm font-bold px-3 py-1.5">
                {formatSalary(p.salaryMin)} – {formatSalary(p.salaryMax)}
              </Badge>
            </div>
          </div>

          {/* Year-by-Year Roadmap */}
          <div>
            <h3 className="font-display font-bold text-foreground text-lg mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              {lang === 'th' ? 'ชีวิตแต่ละปีเป็นยังไง?' : 'Year-by-Year Vibe'}
            </h3>
            <div className="relative pl-8">
              {/* Vertical track line */}
              <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-border rounded-full" />
              <div className="space-y-0">
                {p.yearByYear.map((y, i) => (
                  <motion.div
                    key={y.year}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="relative"
                  >
                    {/* Node dot */}
                    <div className={`absolute -left-[18px] top-4 w-4 h-4 rounded-full ring-2 ring-offset-2 ring-offset-background ${workloadColor[y.workload]} ${workloadRing[y.workload]}`} />

                    <div className="bg-card border border-border rounded-xl p-4 mb-3 shadow-card hover:shadow-card-hover transition-shadow">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-primary text-sm">{y.title[lang]}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-base">{workloadEmoji[y.workload]}</span>
                          <span className="text-xs text-muted-foreground">{workloadLabel[y.workload][lang]}</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2.5 leading-relaxed">{y.description[lang]}</p>
                      <div className="flex flex-wrap gap-1">
                        {y.skills[lang].map(s => <Badge key={s} variant="secondary" className="text-[10px] px-1.5 py-0.5">{s}</Badge>)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* PLO Spider Chart */}
          <div>
            <h3 className="font-display font-bold text-foreground text-lg mb-3">
              {lang === 'th' ? 'แผนภูมิ PLO' : 'PLO Radar Chart'}
            </h3>
            <div className="bg-muted/30 rounded-xl p-4">
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="PLO" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.25} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <Separator />

          {/* TCAS */}
          <div>
            <h3 className="font-display font-bold text-foreground text-lg mb-3 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              {t.explore.howToGetIn}
            </h3>
            <Tabs defaultValue="1" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-3">
                {[1, 2, 3, 4].map(r => (
                  <TabsTrigger key={r} value={String(r)} className="text-xs sm:text-sm">{t.explore.round} {r}</TabsTrigger>
                ))}
              </TabsList>
              {p.tcas.map(tc => (
                <TabsContent key={tc.round} value={String(tc.round)} className="space-y-3 bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">{t.explore.seats}: {tc.seats}</Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">{t.explore.gpax}:</span>
                      <span className="ml-2 font-semibold text-foreground">{tc.gpax.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{t.explore.requirements}:</span>
                      <span className="ml-2 text-foreground">{tc.requirements[lang]}</span>
                    </div>
                  </div>
                  {tc.examWeights && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">{t.explore.examWeights}:</span>
                      <p className="mt-1 text-foreground font-medium bg-background rounded-md px-3 py-2">{tc.examWeights[lang]}</p>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
            {p.hasPortfolioCoach && (
              <Button onClick={() => navigate('/portfolio')} variant="outline" className="w-full mt-3 gap-2 border-primary/30 text-primary hover:bg-primary/5">
                <Sparkles className="h-4 w-4" />
                {lang === 'th' ? 'เช็คความพร้อม Portfolio รอบ 1 →' : 'Check Round 1 Portfolio Readiness →'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProgramDetailDialog;
