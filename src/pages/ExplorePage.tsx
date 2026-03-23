import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MessageCircle, ChevronDown, ChevronUp, Building2, Briefcase, GraduationCap, BadgeCheck } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { programs, faculties, type Program } from '@/data/programs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

const formatSalary = (n: number) => `฿${n.toLocaleString()}`;

type SalaryFilter = 'all' | 'high' | 'mid' | 'entry';

const ExplorePage = () => {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [facultyFilter, setFacultyFilter] = useState('all');
  const [salaryFilter, setSalaryFilter] = useState<SalaryFilter>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return programs.filter(p => {
      const q = search.toLowerCase();
      const nameMatch = !q || p.name[lang].toLowerCase().includes(q) || p.faculty[lang].toLowerCase().includes(q) || p.careers[lang].some(c => c.toLowerCase().includes(q));
      const facMatch = facultyFilter === 'all' || p.faculty[lang] === facultyFilter;
      const salMatch = salaryFilter === 'all' ||
        (salaryFilter === 'high' && p.salaryMax >= 40000) ||
        (salaryFilter === 'mid' && p.salaryMin >= 25000 && p.salaryMax < 40000) ||
        (salaryFilter === 'entry' && p.salaryMax < 25000);
      return nameMatch && facMatch && salMatch;
    });
  }, [search, facultyFilter, salaryFilter, lang]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground">{t.explore.title}</h1>
          <p className="text-muted-foreground mt-1">{t.explore.subtitle}</p>
        </motion.div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="relative sm:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t.explore.searchPlaceholder} value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={facultyFilter} onValueChange={setFacultyFilter}>
            <SelectTrigger>
              <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder={t.explore.filterByFaculty} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.explore.allFaculties}</SelectItem>
              {faculties[lang].map(f => (
                <SelectItem key={f} value={f}>{f}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={salaryFilter} onValueChange={v => setSalaryFilter(v as SalaryFilter)}>
            <SelectTrigger>
              <SelectValue placeholder={t.explore.filterBySalary} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.explore.allSalaries}</SelectItem>
              <SelectItem value="high">{t.explore.salaryHigh}</SelectItem>
              <SelectItem value="mid">{t.explore.salaryMid}</SelectItem>
              <SelectItem value="entry">{t.explore.salaryEntry}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Program Cards */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 text-muted-foreground">{t.explore.noResults}</motion.p>
            )}
            {filtered.map((p, i) => (
              <ProgramCard key={p.id} program={p} lang={lang} t={t} index={i} expanded={expandedId === p.id} onToggle={() => setExpandedId(prev => prev === p.id ? null : p.id)} onChat={() => navigate(`/chat?program=${p.id}`)} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

interface ProgramCardProps {
  program: Program;
  lang: 'th' | 'en';
  t: any;
  index: number;
  expanded: boolean;
  onToggle: () => void;
  onChat: () => void;
}

const ProgramCard = ({ program: p, lang, t, index, expanded, onToggle, onChat }: ProgramCardProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="shadow-card hover:shadow-card-hover transition-shadow overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="text-3xl">{p.facultyIcon}</span>
              <div>
                <h2 className="text-xl font-display font-bold text-foreground">{p.name[lang]}</h2>
                <p className="text-sm text-muted-foreground">{p.faculty[lang]}</p>
                <p className="text-sm text-muted-foreground mt-1 italic">{p.nutshell[lang]}</p>
              </div>
            </div>
            <Badge className="gradient-hero text-primary-foreground shrink-0 text-sm px-3 py-1">{p.ploFitScore}% {t.explore.ploFit}</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Careers */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">{t.explore.careers}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {p.careers[lang].map(c => (
                <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
              ))}
            </div>
          </div>

          {/* Salary */}
          <div className="flex items-center gap-3">
            <Badge className="bg-primary/10 text-primary border-primary/20 text-sm font-bold px-3 py-1.5">
              {formatSalary(p.salaryMin)} – {formatSalary(p.salaryMax)}
            </Badge>
            <span className="text-xs text-muted-foreground">{t.explore.salary}</span>
          </div>

          {/* Top Recruiters */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">{t.explore.topRecruiters}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {p.recruiters.map(r => (
                <Badge key={r} variant="outline" className="text-xs font-medium">{r}</Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Expand toggle for TCAS */}
          <Button variant="ghost" size="sm" onClick={onToggle} className="w-full flex items-center gap-2 text-primary">
            <GraduationCap className="h-4 w-4" />
            {t.explore.howToGetIn}
            {expanded ? <ChevronUp className="h-4 w-4 ml-auto" /> : <ChevronDown className="h-4 w-4 ml-auto" />}
          </Button>

          <AnimatePresence>
            {expanded && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <TCASSection program={p} lang={lang} t={t} />
              </motion.div>
            )}
          </AnimatePresence>

          <Separator />

          {/* Chat CTA */}
          <Button onClick={onChat} className="w-full gradient-hero text-primary-foreground gap-2">
            <MessageCircle className="h-4 w-4" />
            {t.explore.chatAbout}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const TCASSection = ({ program: p, lang, t }: { program: Program; lang: 'th' | 'en'; t: any }) => {
  const roundLabels = [t.explore.round1, t.explore.round2, t.explore.round3, t.explore.round4];

  return (
    <Tabs defaultValue="1" className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-3">
        {[1, 2, 3, 4].map(r => (
          <TabsTrigger key={r} value={String(r)} className="text-xs sm:text-sm">
            {t.explore.round} {r}
          </TabsTrigger>
        ))}
      </TabsList>
      {p.tcas.map(tc => (
        <TabsContent key={tc.round} value={String(tc.round)} className="space-y-3 bg-muted/50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-foreground text-sm">{roundLabels[tc.round - 1]}</h4>
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
  );
};

export default ExplorePage;
