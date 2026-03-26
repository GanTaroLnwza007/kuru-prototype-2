import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, MessageCircle, Heart, Sparkles, X,
  Building2, Briefcase, GraduationCap, ChevronDown, ChevronUp, GitCompare
} from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { programs, faculties, type Program } from '@/data/programs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import ProgramDetailDialog from '@/components/explore/ProgramDetailDialog';

const formatSalary = (n: number) => `฿${n.toLocaleString()}`;

type SalaryFilter = 'all' | 'high' | 'mid' | 'entry';

const ExplorePage = () => {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [facultyFilter, setFacultyFilter] = useState('all');
  const [salaryFilter, setSalaryFilter] = useState<SalaryFilter>('all');
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  const [detailProgram, setDetailProgram] = useState<Program | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSuggestions(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const togglePin = (id: string) => {
    setPinnedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

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

  const suggestions = useMemo(() => {
    if (!search || search.length < 1) return [];
    const q = search.toLowerCase();
    return programs.filter(p =>
      p.name[lang].toLowerCase().includes(q) || p.faculty[lang].toLowerCase().includes(q) || p.careers[lang].some(c => c.toLowerCase().includes(q))
    ).slice(0, 5);
  }, [search, lang]);

  const pinnedPrograms = programs.filter(p => pinnedIds.includes(p.id));

  return (
    <div className="min-h-screen bg-background">
      {/* Pinned Mini Bar */}
      <AnimatePresence>
        {pinnedPrograms.length > 0 && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border shadow-card"
          >
            <div className="container max-w-6xl mx-auto px-4 py-2.5 flex items-center gap-3">
              <div className="flex items-center gap-2 overflow-x-auto flex-1 scrollbar-hide">
                <Heart className="h-4 w-4 text-primary fill-primary shrink-0" />
                {pinnedPrograms.map(p => (
                  <motion.div key={p.id} layout initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
                    <Badge
                      className="bg-primary/10 text-primary border-primary/20 px-3 py-1.5 cursor-pointer hover:bg-primary/20 transition-colors whitespace-nowrap gap-1.5"
                      onClick={() => setDetailProgram(p)}
                    >
                      <span className="text-base">{p.facultyIcon}</span>
                      <span className="text-xs font-medium">{p.name[lang]}</span>
                      <span className="text-[10px] text-primary/70">{p.ploFitScore}%</span>
                      <button onClick={(e) => { e.stopPropagation(); togglePin(p.id); }} className="ml-1 hover:text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  </motion.div>
                ))}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="ghost" size="sm" onClick={() => setPinnedIds([])} className="text-xs text-muted-foreground">
                  {lang === 'th' ? 'ล้างทั้งหมด' : 'Clear all'}
                </Button>
                <Button
                  size="sm"
                  className="gradient-hero text-primary-foreground gap-1.5 text-xs"
                  onClick={() => navigate(`/chat?programs=${pinnedIds.join(',')}`)}
                >
                  <GitCompare className="h-3.5 w-3.5" />
                  {lang === 'th' ? 'เปรียบเทียบในแชท KUru' : 'Compare in KUru Chat'}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container px-4 py-8 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground">{t.explore.title}</h1>
          <p className="text-muted-foreground mt-2 text-lg">{t.explore.subtitle}</p>
        </motion.div>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <div className="relative sm:col-span-1" ref={searchRef}>
            <div className="relative">
              <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
              <Input
                placeholder={lang === 'th' ? 'ค้นหาด้วยความหมาย (Semantic Search)' : 'Semantic Search...'}
                value={search}
                onChange={e => { setSearch(e.target.value); setShowSuggestions(true); }}
                onFocus={() => search && setShowSuggestions(true)}
                className="pl-9 pr-4 h-11 text-base rounded-xl border-primary/20 focus:border-primary"
              />
            </div>
            {/* Suggestions dropdown */}
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute z-50 w-full mt-1 bg-card border border-border rounded-xl shadow-card-hover overflow-hidden"
                >
                  {suggestions.map(s => (
                    <button
                      key={s.id}
                      onClick={() => { setDetailProgram(s); setShowSuggestions(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
                    >
                      <span className="text-xl">{s.facultyIcon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{s.name[lang]}</p>
                        <p className="text-xs text-muted-foreground truncate">{s.faculty[lang]}</p>
                      </div>
                      <Badge className="bg-primary/10 text-primary border-0 text-xs shrink-0">{s.ploFitScore}%</Badge>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Select value={facultyFilter} onValueChange={setFacultyFilter}>
            <SelectTrigger className="h-11 rounded-xl">
              <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder={t.explore.filterByFaculty} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.explore.allFaculties}</SelectItem>
              {faculties[lang].map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={salaryFilter} onValueChange={v => setSalaryFilter(v as SalaryFilter)}>
            <SelectTrigger className="h-11 rounded-xl">
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

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-4">
          {lang === 'th' ? `แสดง ${filtered.length} หลักสูตร` : `Showing ${filtered.length} programs`}
        </p>

        {/* Program Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 text-muted-foreground col-span-full">{t.explore.noResults}</motion.p>
            )}
            {filtered.map((p, i) => (
              <ProgramCard
                key={p.id}
                program={p}
                lang={lang}
                t={t}
                index={i}
                isPinned={pinnedIds.includes(p.id)}
                onTogglePin={togglePin}
                onClick={() => setDetailProgram(p)}
                onChat={() => navigate(`/chat?program=${p.id}`)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Detail Dialog */}
      <ProgramDetailDialog
        program={detailProgram}
        open={!!detailProgram}
        onClose={() => setDetailProgram(null)}
        isPinned={detailProgram ? pinnedIds.includes(detailProgram.id) : false}
        onTogglePin={togglePin}
        lang={lang}
        t={t}
      />
    </div>
  );
};

/* ---- Card Component ---- */
interface ProgramCardProps {
  program: Program;
  lang: 'th' | 'en';
  t: any;
  index: number;
  isPinned: boolean;
  onTogglePin: (id: string) => void;
  onClick: () => void;
  onChat: () => void;
}

const ProgramCard = ({ program: p, lang, t, index, isPinned, onTogglePin, onClick, onChat }: ProgramCardProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.04 }}
    >
      <Card
        className="shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden cursor-pointer group relative rounded-2xl border-border/50 hover:border-primary/30"
        onClick={onClick}
      >
        {/* Pin button */}
        <button
          onClick={(e) => { e.stopPropagation(); onTogglePin(p.id); }}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
        >
          <Heart className={`h-4 w-4 transition-colors ${isPinned ? 'text-primary fill-primary' : 'text-muted-foreground group-hover:text-primary/50'}`} />
        </button>

        {/* Portfolio Coach badge */}
        {p.hasPortfolioCoach && (
          <div className="absolute top-4 left-4 z-10">
            <Badge className="bg-primary/90 text-primary-foreground text-[10px] px-2 py-0.5 gap-1">
              <Sparkles className="h-2.5 w-2.5" /> Portfolio Coach
            </Badge>
          </div>
        )}

        <CardHeader className="pb-3 pt-12">
          <div className="flex items-start gap-3">
            <span className="text-4xl group-hover:scale-110 transition-transform">{p.facultyIcon}</span>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-display font-bold text-foreground group-hover:text-primary transition-colors">{p.name[lang]}</h2>
              <p className="text-xs text-muted-foreground">{p.faculty[lang]}</p>
              <p className="text-xs text-muted-foreground mt-1 italic line-clamp-2">{p.nutshell[lang]}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pb-4">
          {/* PLO Fit + Salary row */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className="gradient-hero text-primary-foreground text-sm px-3 py-1 font-bold">{p.ploFitScore}% {t.explore.ploFit}</Badge>
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-semibold px-2.5 py-1">
              {formatSalary(p.salaryMin)} – {formatSalary(p.salaryMax)}
            </Badge>
          </div>

          {/* Careers */}
          <div className="flex flex-wrap gap-1">
            {p.careers[lang].slice(0, 3).map(c => (
              <Badge key={c} variant="secondary" className="text-[10px]">{c}</Badge>
            ))}
            {p.careers[lang].length > 3 && (
              <Badge variant="secondary" className="text-[10px]">+{p.careers[lang].length - 3}</Badge>
            )}
          </div>

          {/* Recruiters */}
          <div className="flex flex-wrap gap-1">
            {p.recruiters.slice(0, 3).map(r => (
              <Badge key={r} variant="outline" className="text-[10px] font-medium">{r}</Badge>
            ))}
            {p.recruiters.length > 3 && (
              <Badge variant="outline" className="text-[10px]">+{p.recruiters.length - 3}</Badge>
            )}
          </div>

          <Separator />

          {/* CTA */}
          <div className="flex gap-2">
            <Button
              onClick={(e) => { e.stopPropagation(); onClick(); }}
              variant="outline"
              size="sm"
              className="flex-1 text-xs rounded-xl border-primary/20 text-primary hover:bg-primary/5"
            >
              {lang === 'th' ? 'ดูรายละเอียด' : 'View Details'}
            </Button>
            <Button
              onClick={(e) => { e.stopPropagation(); onChat(); }}
              size="sm"
              className="flex-1 text-xs rounded-xl gradient-hero text-primary-foreground gap-1"
            >
              <MessageCircle className="h-3 w-3" />
              {lang === 'th' ? 'ถาม KUru' : 'Ask KUru'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ExplorePage;
