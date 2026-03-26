import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

const DIMS = ['R', 'I', 'A', 'S', 'E', 'C'] as const;
type Dim = typeof DIMS[number];

// Pairs of dimensions to compare in pairwise step
// Indices correspond to rt.pairwise.pairs array
const PAIR_DIMS: [Dim, Dim][] = [
  ['R', 'I'], ['A', 'S'], ['E', 'C'], ['I', 'E'], ['R', 'S'], ['A', 'C'],
];

const DIM_GRADIENT: Record<Dim, string> = {
  R: 'from-orange-500 to-amber-400',
  I: 'from-blue-500 to-cyan-400',
  A: 'from-purple-500 to-violet-400',
  S: 'from-green-500 to-emerald-400',
  E: 'from-red-500 to-rose-400',
  C: 'from-slate-500 to-gray-400',
};

const DIM_CARD: Record<Dim, string> = {
  R: 'bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-800',
  I: 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800',
  A: 'bg-purple-50 border-purple-200 dark:bg-purple-950/20 dark:border-purple-800',
  S: 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800',
  E: 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800',
  C: 'bg-slate-50 border-slate-200 dark:bg-slate-950/20 dark:border-slate-800',
};

type LikertVal = 1 | 2 | 3 | 4 | 5;
type PairChoice = 'left' | 'right' | 'both';

// Steps:
// 0  = intro
// 1-6 = dimension question pages (R, I, A, S, E, C)
// 7  = pairwise comparisons (conditional — skipped if no close scores)
// 8-10 = scenario questions
// 11 = profile summary

const DiscoveryPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const rt = t.riasec;

  const [step, setStep] = useState(0);
  const [dimAnswers, setDimAnswers] = useState<Array<Array<LikertVal | null>>>(
    Array.from({ length: 6 }, () => [null, null, null, null])
  );
  const [activePairIdxs, setActivePairIdxs] = useState<number[]>([]);
  const [pairChoices, setPairChoices] = useState<Array<PairChoice | null>>([]);
  const [scenarioChoices, setScenarioChoices] = useState<[number | null, number | null, number | null]>([null, null, null]);
  const [riasecScores, setRiasecScores] = useState<Record<Dim, number>>({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 });

  const TOTAL_STEPS = 11;
  const progress = Math.round((step / TOTAL_STEPS) * 100);

  const computeScores = (answers: Array<Array<LikertVal | null>>): Record<Dim, number> => {
    const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 } as Record<Dim, number>;
    DIMS.forEach((dim, i) => {
      scores[dim] = answers[i].reduce<number>((acc, val) => acc + (val ?? 0), 0);
    });
    return scores;
  };

  // ── Dimension step helpers ──────────────────────────────────────────────────
  const dimIdx = step >= 1 && step <= 6 ? step - 1 : -1;
  const currentDim = dimIdx >= 0 ? DIMS[dimIdx] : null;
  const currentDimData = dimIdx >= 0 ? rt.dimensions[dimIdx] : null;
  const canAdvanceDim = dimIdx >= 0 && dimAnswers[dimIdx].every(v => v !== null);

  const setAnswer = (qIdx: number, val: LikertVal) => {
    setDimAnswers(prev =>
      prev.map((row, ri) =>
        ri === dimIdx ? row.map((a, qi) => (qi === qIdx ? val : a)) : row
      )
    );
  };

  const handleDimNext = () => {
    if (step < 6) {
      setStep(s => s + 1);
      return;
    }
    // Last dimension done — compute and branch
    const scores = computeScores(dimAnswers);
    setRiasecScores(scores);

    const closePairs = PAIR_DIMS
      .map((pair, i) => ({ pair, i }))
      .filter(({ pair: [a, b] }) => Math.abs(scores[a] - scores[b]) <= 3)
      .map(({ i }) => i);

    setActivePairIdxs(closePairs);
    setPairChoices(closePairs.map(() => null));

    setStep(closePairs.length > 0 ? 7 : 8);
  };

  // ── Pairwise helpers ────────────────────────────────────────────────────────
  const setPairChoice = (i: number, choice: PairChoice) => {
    setPairChoices(prev => prev.map((c, ci) => (ci === i ? choice : c)));
  };

  // ── Scenario helpers ────────────────────────────────────────────────────────
  const setScenarioChoice = (scenarioIdx: number, optIdx: number) => {
    setScenarioChoices(prev => {
      const next = [...prev] as typeof prev;
      next[scenarioIdx] = optIdx;
      return next;
    });
  };

  const handleScenarioNext = () => {
    if (step < 10) {
      setStep(s => s + 1);
    } else {
      setStep(11);
    }
  };

  const handleScenarioBack = () => {
    if (step === 8) {
      setStep(activePairIdxs.length > 0 ? 7 : 6);
    } else {
      setStep(s => s - 1);
    }
  };

  // ── Results navigation ──────────────────────────────────────────────────────
  const handleViewResults = () => {
    const vals = DIMS.map(d => riasecScores[d]);
    const magnitude = Math.sqrt(vals.reduce((s, v) => s + v * v, 0));
    const normalized = magnitude > 0 ? vals.map(v => v / magnitude) : vals;
    const riasecVector: Record<Dim, number> = {} as Record<Dim, number>;
    DIMS.forEach((d, i) => { riasecVector[d] = normalized[i]; });

    navigate('/results', { state: { riasec: riasecScores, riasecVector } });
  };

  // For profile summary
  const sortedDims = [...DIMS].sort((a, b) => riasecScores[b] - riasecScores[a]);
  const topDim = sortedDims[0];
  const secondDim = sortedDims[1];

  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <div className="min-h-[calc(100vh-3.5rem)] px-4 py-6 max-w-2xl mx-auto">
      {/* Progress bar */}
      {step > 0 && step < 11 && (
        <div className="mb-6 space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{t.discovery.step} {step} {t.discovery.of} {TOTAL_STEPS}</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      <AnimatePresence mode="wait">

        {/* ── Step 0: Intro ───────────────────────────────────────────────── */}
        {step === 0 && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6 text-center py-8"
          >
            <div className="flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full gradient-hero">
                <Sparkles className="h-10 w-10 text-primary-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">{rt.introTitle}</h2>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">{rt.introSubtitle}</p>
            </div>

            <Card className="p-4 text-left space-y-3 bg-accent/50">
              <p className="text-sm font-semibold text-foreground">{rt.instructions}</p>
              <div className="flex gap-1 flex-wrap">
                {rt.scaleLabels.map((label, i) => (
                  <span key={i} className="text-xs bg-background px-2 py-1 rounded border text-muted-foreground">
                    {i + 1} — {label}
                  </span>
                ))}
              </div>
            </Card>

            <Button variant="hero" size="lg" onClick={() => setStep(1)} className="gap-2">
              {rt.startBtn}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </motion.div>
        )}

        {/* ── Steps 1–6: Dimension question pages ────────────────────────── */}
        {step >= 1 && step <= 6 && currentDim && currentDimData && (
          <motion.div
            key={`dim-${step}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            {/* Dimension header */}
            <div className={`rounded-xl border p-4 ${DIM_CARD[currentDim]}`}>
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 shrink-0 rounded-full bg-gradient-to-br ${DIM_GRADIENT[currentDim]} flex items-center justify-center text-white font-bold text-lg shadow-sm`}>
                  {currentDim}
                </div>
                <div>
                  <p className="font-bold text-foreground">{currentDimData.name}</p>
                  <p className="text-xs text-muted-foreground">{currentDimData.subtitle}</p>
                </div>
              </div>
            </div>

            {/* Scale legend */}
            <div className="flex justify-between text-xs text-muted-foreground px-1">
              <span>1 = {rt.scaleLabels[0]}</span>
              <span>{rt.scaleLabels[4]} = 5</span>
            </div>

            {/* Questions */}
            <div className="space-y-3">
              {currentDimData.questions.map((question, qIdx) => {
                const selected = dimAnswers[dimIdx][qIdx];
                return (
                  <Card key={qIdx} className="p-4 space-y-3">
                    <p className="text-sm font-medium text-foreground leading-relaxed">
                      {(dimIdx) * 4 + qIdx + 1}. {question}
                    </p>
                    <div className="flex gap-2">
                      {([1, 2, 3, 4, 5] as LikertVal[]).map(val => (
                        <button
                          key={val}
                          onClick={() => setAnswer(qIdx, val)}
                          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border transition-all duration-150 ${
                            selected === val
                              ? `bg-gradient-to-br ${DIM_GRADIENT[currentDim]} text-white border-transparent shadow-sm scale-105`
                              : 'bg-background border-border text-muted-foreground hover:border-primary hover:text-foreground'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-2">
              <Button variant="ghost" onClick={() => setStep(s => s - 1)} className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                {t.discovery.back}
              </Button>
              <Button
                variant="hero"
                disabled={!canAdvanceDim}
                onClick={handleDimNext}
                className="gap-2"
              >
                {step < 6 ? t.discovery.next : rt.seeResultsPartial}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* ── Step 7: Pairwise comparisons ───────────────────────────────── */}
        {step === 7 && (
          <motion.div
            key="pairwise"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            <div className="text-center space-y-1">
              <h2 className="text-xl font-bold text-foreground">{rt.pairwise.title}</h2>
              <p className="text-sm text-muted-foreground">{rt.pairwise.subtitle}</p>
            </div>

            <div className="space-y-3">
              {activePairIdxs.map((pairIdx, i) => {
                const pair = rt.pairwise.pairs[pairIdx];
                const choice = pairChoices[i];
                return (
                  <Card key={pairIdx} className="p-4 space-y-2">
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      {(['left', 'both', 'right'] as PairChoice[]).map(side => {
                        const label = side === 'left' ? pair.left : side === 'right' ? pair.right : rt.pairwise.bothLabel;
                        return (
                          <button
                            key={side}
                            onClick={() => setPairChoice(i, side)}
                            className={`p-3 rounded-lg font-medium border text-center leading-snug transition-all duration-150 ${
                              choice === side
                                ? 'bg-primary text-primary-foreground border-transparent shadow-sm'
                                : 'bg-background border-border text-foreground hover:border-primary'
                            } ${side === 'both' ? 'text-muted-foreground' : ''}`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="flex justify-between pt-2">
              <Button variant="ghost" onClick={() => setStep(6)} className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                {t.discovery.back}
              </Button>
              <Button
                variant="hero"
                disabled={pairChoices.some(c => c === null)}
                onClick={() => setStep(8)}
                className="gap-2"
              >
                {t.discovery.next}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* ── Steps 8–10: Scenario questions ─────────────────────────────── */}
        {step >= 8 && step <= 10 && (() => {
          const scenarioIdx = step - 8;
          const scenario = rt.scenarios[scenarioIdx];
          const choice = scenarioChoices[scenarioIdx];
          return (
            <motion.div
              key={`scenario-${step}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {rt.scenarioLabel} {scenarioIdx + 1}
                </p>
                <h2 className="text-lg font-bold text-foreground leading-snug">{scenario.title}</h2>
              </div>

              <div className="space-y-2">
                {scenario.options.map((option, optIdx) => (
                  <Card
                    key={optIdx}
                    className={`p-4 cursor-pointer transition-all duration-150 ${
                      choice === optIdx
                        ? 'ring-2 ring-primary bg-accent'
                        : 'hover:bg-muted/50 hover:shadow-card'
                    }`}
                    onClick={() => setScenarioChoice(scenarioIdx, optIdx)}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                        choice === optIdx
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {letters[optIdx]}
                      </span>
                      <span className="text-sm text-foreground">{option}</span>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="flex justify-between pt-2">
                <Button variant="ghost" onClick={handleScenarioBack} className="gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  {t.discovery.back}
                </Button>
                <Button
                  variant="hero"
                  disabled={choice === null}
                  onClick={handleScenarioNext}
                  className="gap-2"
                >
                  {step < 10 ? t.discovery.next : rt.seeProfile}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          );
        })()}

        {/* ── Step 11: Profile summary ────────────────────────────────────── */}
        {step === 11 && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-5"
          >
            <div className="text-center space-y-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, ease: 'linear', repeat: 1 }}
                className="flex justify-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full gradient-hero">
                  <Sparkles className="h-8 w-8 text-primary-foreground" />
                </div>
              </motion.div>
              <h2 className="text-xl font-bold text-foreground">{rt.profileTitle}</h2>
            </div>

            {/* Top two RIASEC dimensions */}
            <div className="space-y-3">
              {[topDim, secondDim].map((dim, i) => (
                <Card key={dim} className={`p-4 border ${DIM_CARD[dim]}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`h-9 w-9 shrink-0 rounded-full bg-gradient-to-br ${DIM_GRADIENT[dim]} flex items-center justify-center text-white font-bold shadow-sm`}>
                      {dim}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{i === 0 ? rt.topStrengthLabel : rt.alsoLabel}</p>
                      <p className="font-bold text-foreground">{rt.dimNames[dim]}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{rt.dimDescs[dim]}</p>
                </Card>
              ))}
            </div>

            {/* Score breakdown bar chart */}
            <Card className="p-4 space-y-3">
              <p className="text-sm font-semibold text-foreground">{rt.scoreBreakdown}</p>
              <div className="space-y-2">
                {sortedDims.map(dim => (
                  <div key={dim} className="flex items-center gap-2">
                    <span className={`h-5 w-5 shrink-0 rounded-full bg-gradient-to-br ${DIM_GRADIENT[dim]} flex items-center justify-center text-white text-xs font-bold`}>
                      {dim}
                    </span>
                    <span className="text-xs text-muted-foreground w-24 shrink-0">{rt.dimNames[dim]}</span>
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full bg-gradient-to-r ${DIM_GRADIENT[dim]} transition-all duration-500`}
                        style={{ width: `${(riasecScores[dim] / 20) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-8 text-right tabular-nums">{riasecScores[dim]}/20</span>
                  </div>
                ))}
              </div>
            </Card>

            <Button
              variant="hero"
              size="lg"
              onClick={handleViewResults}
              className="gap-2 w-full"
            >
              {t.discovery.viewResults}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default DiscoveryPage;
