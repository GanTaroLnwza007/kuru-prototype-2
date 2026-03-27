import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, ArrowLeft, Briefcase, Link, Info } from 'lucide-react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ResponsiveContainer, Legend,
} from 'recharts';
import { programs, Program } from '@/data/programs';
import { careers, Career } from '@/data/careers';

// ─── RIASEC helpers ────────────────────────────────────────────────────────────
const DIMS = ['R', 'I', 'A', 'S', 'E', 'C'] as const;
type Dim = typeof DIMS[number];

const dimLabels: Record<Dim, { th: string; en: string }> = {
  R: { th: 'ลงมือทำ (R)', en: 'Realistic (R)' },
  I: { th: 'วิเคราะห์ (I)', en: 'Investigative (I)' },
  A: { th: 'สร้างสรรค์ (A)', en: 'Artistic (A)' },
  S: { th: 'ช่วยเหลือ (S)', en: 'Social (S)' },
  E: { th: 'ผู้นำ (E)', en: 'Enterprising (E)' },
  C: { th: 'จัดระบบ (C)', en: 'Conventional (C)' },
};

const dimColors: Record<Dim, string> = {
  R: 'bg-orange-100 text-orange-700 border-orange-200',
  I: 'bg-blue-100 text-blue-700 border-blue-200',
  A: 'bg-purple-100 text-purple-700 border-purple-200',
  S: 'bg-green-100 text-green-700 border-green-200',
  E: 'bg-red-100 text-red-700 border-red-200',
  C: 'bg-slate-100 text-slate-700 border-slate-200',
};

const dimReasons: Record<Dim, { th: string; en: string }> = {
  R: { th: 'ความชอบลงมือทำและทำงานภาคสนาม', en: 'hands-on and practical work' },
  I: { th: 'ความสนใจในการวิเคราะห์และสืบค้น', en: 'analytical and investigative thinking' },
  A: { th: 'ความชอบในการสร้างสรรค์', en: 'creative and artistic interests' },
  S: { th: 'ความชอบช่วยเหลือและทำงานร่วมกับผู้อื่น', en: 'social and helping orientation' },
  E: { th: 'ความชอบในการเป็นผู้นำและโน้มน้าว', en: 'leadership and enterprising drive' },
  C: { th: 'ความชอบในการจัดระบบและวางแผน', en: 'organizational and systematic approach' },
};

const ploLabels = ['Analytical', 'Technical', 'Communication', 'Fieldwork', 'Teamwork', 'Problem-solving'];

// ─── Matching algorithms ───────────────────────────────────────────────────────

function dotProduct(vec: Record<string, number>, weights: number[]): number {
  return DIMS.reduce((sum, d, i) => sum + (vec[d] ?? 0) * weights[i], 0);
}

/** Scale raw scores to [minPct, maxPct] range */
function minMaxScale(values: number[], minPct: number, maxPct: number): number[] {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  return values.map(v =>
    range === 0 ? Math.round((minPct + maxPct) / 2) : Math.round(minPct + ((v - min) / range) * (maxPct - minPct))
  );
}

/** Top-N careers matching the user's RIASEC vector, sorted by score */
function matchCareers(vec: Record<string, number>, topN = 3): { career: Career; score: number }[] {
  const raw = careers.map(c => ({ career: c, raw: dotProduct(vec, c.riasecWeights) }));
  const scaled = minMaxScale(raw.map(r => r.raw), 55, 98);
  return raw
    .map((r, i) => ({ career: r.career, score: scaled[i] }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}

/** Programs ranked by fit score, boosted if they share careers with the user's top careers */
function rankPrograms(
  vec: Record<string, number>,
  topCareerIds: string[]
): { program: Program; fitScore: number; matchedCareerIds: string[] }[] {
  const careerSet = new Set(topCareerIds);

  const raw = programs.map(p => {
    const riasecScore = dotProduct(vec, p.riasecWeights);
    // Career bridge boost: +15% raw if program appears in any matched career
    const careerMatch = careers.filter(c => careerSet.has(c.id) && c.programIds.includes(p.id));
    const careerBoost = careerMatch.length > 0 ? 0.15 * riasecScore : 0;
    return {
      program: p,
      raw: riasecScore + careerBoost,
      matchedCareerIds: careerMatch.map(c => c.id),
    };
  });

  const scaled = minMaxScale(raw.map(r => r.raw), 52, 95);
  return raw
    .map((r, i) => ({ program: r.program, fitScore: scaled[i], matchedCareerIds: r.matchedCareerIds }))
    .sort((a, b) => b.fitScore - a.fitScore);
}

/** Convert normalized RIASEC vector to PLO profile (0–100) */
function riasecToPLO(vec: Record<string, number>): number[] {
  const R = vec['R'] ?? 0, I = vec['I'] ?? 0, A = vec['A'] ?? 0;
  const S = vec['S'] ?? 0, E = vec['E'] ?? 0, C = vec['C'] ?? 0;
  return [
    Math.round((I * 0.7 + C * 0.3) * 100),
    Math.round((R * 0.6 + I * 0.4) * 100),
    Math.round((S * 0.5 + E * 0.3 + A * 0.2) * 100),
    Math.round((R * 0.7 + S * 0.3) * 100),
    Math.round((S * 0.5 + E * 0.3 + C * 0.2) * 100),
    Math.round((I * 0.5 + R * 0.3 + E * 0.2) * 100),
  ];
}

function buildReason(vec: Record<string, number>, weights: number[], lang: 'th' | 'en'): string {
  const scored = DIMS.map((d, i) => ({ d, score: (vec[d] ?? 0) * weights[i] }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .filter(x => x.score > 0.05);
  if (scored.length === 0) {
    return lang === 'th' ? 'หลักสูตรนี้เหมาะกับโปรไฟล์โดยรวมของคุณ' : 'This program suits your overall profile.';
  }
  if (lang === 'th') {
    return `ตรงกับ${scored.map(x => dimReasons[x.d].th).join(' และ')}ของคุณ`;
  }
  return `Matches your ${scored.map(x => dimReasons[x.d].en).join(' and ')}.`;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function RiasecProfileCard({
  vec,
  topDims,
  lang,
}: {
  vec: Record<string, number>;
  topDims: Dim[];
  lang: 'th' | 'en';
}) {
  const [open, setOpen] = useState(false);
  const chartData = DIMS.map(d => ({
    subject: d,
    score: Math.round((vec[d] ?? 0) * 100),
    fullMark: 100,
  }));

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold text-primary">
              {lang === 'th' ? 'โปรไฟล์ RIASEC ของคุณ' : 'Your RIASEC Profile'}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              {lang === 'th'
                ? 'Holland Code (รหัสความสนใจ) ที่ใช้จับคู่กับอาชีพ O*NET และหลักสูตร มก.'
                : 'Holland Code used to match O*NET occupations and KU programs'}
            </p>
          </div>
          <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={() => setOpen(o => !o)}>
            <Info className="h-3 w-3" />
            {open
              ? (lang === 'th' ? 'ซ่อน' : 'Hide')
              : (lang === 'th' ? 'ดูรายละเอียด' : 'Details')}
          </Button>
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {topDims.map(d => (
            <span key={d} className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${dimColors[d]}`}>
              {dimLabels[d][lang]}
            </span>
          ))}
        </div>
      </CardHeader>

      {open && (
        <CardContent className="pt-0">
          <div className="space-y-1.5">
            {DIMS.map((d, i) => (
              <div key={d} className="flex items-center gap-2">
                <span className={`text-xs font-bold w-28 shrink-0 px-1.5 rounded ${dimColors[d]}`}>
                  {d} — {lang === 'th'
                    ? { R: 'ลงมือทำ', I: 'วิเคราะห์', A: 'สร้างสรรค์', S: 'ช่วยเหลือ', E: 'ผู้นำ', C: 'จัดระบบ' }[d]
                    : { R: 'Realistic', I: 'Investigative', A: 'Artistic', S: 'Social', E: 'Enterprising', C: 'Conventional' }[d]
                  }
                </span>
                <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full bg-primary transition-all"
                    style={{ width: `${Math.round((vec[d] ?? 0) * 100)}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-8 text-right tabular-nums">
                  {Math.round((vec[d] ?? 0) * 100)}%
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
            {lang === 'th'
              ? 'คะแนนเหล่านี้ได้จากแบบทดสอบ RIASEC ของคุณ และถูกใช้เป็น input ให้กับระบบแนะนำ 2 ขั้นตอน: (1) จับคู่กับอาชีพใน O*NET → (2) จับคู่กับหลักสูตรที่ฝึกทักษะสำหรับอาชีพนั้นผ่าน PLO'
              : 'These scores come from your quiz and feed a 2-stage pipeline: (1) match against O*NET occupation profiles → (2) match against KU programs whose PLOs develop skills for those careers.'}
          </p>
        </CardContent>
      )}
    </Card>
  );
}

function CareerBridgeCard({
  matched,
  lang,
}: {
  matched: { career: Career; score: number }[];
  lang: 'th' | 'en';
}) {
  return (
    <Card className="border-blue-200 bg-blue-50/50">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-blue-600" />
          <CardTitle className="text-sm font-semibold text-blue-800">
            {lang === 'th' ? 'อาชีพ O*NET ที่ตรงกับโปรไฟล์คุณ' : 'O*NET Careers Matching Your Profile'}
          </CardTitle>
        </div>
        <p className="text-xs text-muted-foreground">
          {lang === 'th'
            ? 'อาชีพเหล่านี้มี Holland Code ใกล้เคียงกับของคุณ → ใช้เป็นสะพานหาหลักสูตรที่เหมาะสม'
            : 'These careers share your Holland Code → used as the bridge to find matching programs'}
        </p>
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        {matched.map(({ career, score }) => (
          <div key={career.id} className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{career.name[lang]}</p>
              <p className="text-xs text-muted-foreground">{career.description[lang]}</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {career.topSkills[lang].map(s => (
                  <span key={s} className="text-xs bg-blue-100 text-blue-700 rounded px-1.5 py-0.5">{s}</span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                O*NET: <span className="font-mono">{career.onetCode}</span>
              </p>
            </div>
            <Badge className="shrink-0 bg-blue-600 text-white text-xs">{score}%</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

const ResultsPage = () => {
  const { t, lang } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const state = location.state as {
    riasec?: Record<string, number>;
    riasecVector?: Record<string, number>;
  } | null;
  const riasecVector = state?.riasecVector;

  if (!riasecVector) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-4 gap-4 text-center">
        <p className="text-muted-foreground text-sm">
          {lang === 'th'
            ? 'ยังไม่มีผลลัพธ์ กรุณาทำแบบทดสอบก่อน'
            : 'No results yet. Please complete the quiz first.'}
        </p>
        <Button onClick={() => navigate('/discover')}>
          {lang === 'th' ? 'เริ่มแบบทดสอบ' : 'Start the Quiz'}
        </Button>
      </div>
    );
  }

  const topDims = [...DIMS].sort((a, b) => (riasecVector[b] ?? 0) - (riasecVector[a] ?? 0)).slice(0, 3) as Dim[];
  const matchedCareers = matchCareers(riasecVector, 3);
  const topCareerIds = matchedCareers.map(m => m.career.id);
  const ranked = rankPrograms(riasecVector, topCareerIds);
  const userPLO = riasecToPLO(riasecVector);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] px-4 py-6 max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-xl font-bold text-foreground">{t.results.title}</h1>
        <p className="text-sm text-muted-foreground">{t.results.subtitle}</p>
      </div>

      {/* Step 1: RIASEC Profile */}
      <div className="space-y-1">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">1</span>
          {lang === 'th' ? 'โปรไฟล์ความสนใจของคุณ' : 'Your Interest Profile'}
        </p>
        <RiasecProfileCard vec={riasecVector} topDims={topDims} lang={lang} />
      </div>

      {/* Step 2: Career Bridge */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">2</span>
            {lang === 'th' ? 'สะพานอาชีพ (O*NET Career Bridge)' : 'Career Bridge (O*NET)'}
          </p>
          <Link className="h-3 w-3 text-muted-foreground" />
        </div>
        <CareerBridgeCard matched={matchedCareers} lang={lang} />
      </div>

      {/* Step 3: Program Matches */}
      <div className="space-y-1">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">3</span>
          {lang === 'th' ? 'หลักสูตร มก. ที่แนะนำ' : 'Recommended KU Programs'}
        </p>

        <div className="space-y-3">
          {ranked.map(({ program, fitScore, matchedCareerIds }, index) => {
            const expanded = expandedId === program.id;
            const reason = buildReason(riasecVector, program.riasecWeights, lang);
            const bridgedCareers = careers.filter(c => matchedCareerIds.includes(c.id));
            const chartData = ploLabels.map((label, i) => ({
              subject: label,
              student: userPLO[i],
              program: program.ploData[i],
            }));

            return (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
              >
                <Card className="shadow-card overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <CardTitle className="text-base">
                          {program.facultyIcon} {program.name[lang]}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-0.5">{program.faculty[lang]}</p>

                        {/* Career bridge badges */}
                        {bridgedCareers.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {bridgedCareers.map(c => (
                              <span
                                key={c.id}
                                className="text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded px-1.5 py-0.5 flex items-center gap-0.5"
                              >
                                <Briefcase className="h-2.5 w-2.5" />
                                {c.name[lang]}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <Badge
                        className={`text-sm font-bold px-3 py-1 shrink-0 ${
                          fitScore >= 82
                            ? 'bg-primary text-primary-foreground'
                            : fitScore >= 68
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {fitScore}%
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">{t.results.whyFit}</p>
                      <p className="text-sm text-foreground">{reason}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
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
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-xs"
                        onClick={() => navigate(`/programs/${program.id}`)}
                      >
                        {lang === 'th' ? 'ดูรายละเอียด' : 'View Program'}
                      </Button>
                    </div>

                    {expanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="pt-2 space-y-3"
                      >
                        {/* PLO radar */}
                        <ResponsiveContainer width="100%" height={260}>
                          <RadarChart data={chartData}>
                            <PolarGrid stroke="hsl(var(--border))" />
                            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
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
                            <Legend wrapperStyle={{ fontSize: 11 }} />
                          </RadarChart>
                        </ResponsiveContainer>

                        {/* Reasoning chain summary */}
                        <div className="rounded-md border bg-muted/30 p-3 text-xs space-y-1.5">
                          <p className="font-semibold text-foreground">
                            {lang === 'th' ? 'ทำไมถึงแนะนำหลักสูตรนี้?' : 'Why was this recommended?'}
                          </p>
                          <ol className="space-y-1 text-muted-foreground list-none">
                            <li>
                              <span className="font-medium text-foreground">
                                {lang === 'th' ? '① RIASEC ของคุณ: ' : '① Your RIASEC: '}
                              </span>
                              {topDims.map(d => dimLabels[d][lang]).join(' · ')}
                            </li>
                            {bridgedCareers.length > 0 && (
                              <li>
                                <span className="font-medium text-foreground">
                                  {lang === 'th' ? '② อาชีพ O*NET ที่ตรงกัน: ' : '② Matched O*NET careers: '}
                                </span>
                                {bridgedCareers.map(c => c.name[lang]).join(', ')}
                              </li>
                            )}
                            <li>
                              <span className="font-medium text-foreground">
                                {lang === 'th' ? '③ หลักสูตรนี้ฝึกทักษะสำหรับอาชีพนั้น: ' : '③ This program trains for those careers: '}
                              </span>
                              {program.careers[lang].slice(0, 3).join(', ')}
                            </li>
                            <li>
                              <span className="font-medium text-foreground">
                                {lang === 'th' ? '④ PLO score: ' : '④ PLO fit: '}
                              </span>
                              {program.ploFitScore}%
                              {lang === 'th' ? ' (จาก มคอ.2)' : ' (from มคอ.2)'}
                            </li>
                          </ol>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="text-center pt-2">
        <Button variant="outline" size="sm" onClick={() => navigate('/discover')} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          {lang === 'th' ? 'ทำแบบทดสอบใหม่' : 'Retake the Quiz'}
        </Button>
      </div>
    </div>
  );
};

export default ResultsPage;
