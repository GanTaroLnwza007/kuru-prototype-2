import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/i18n/LanguageContext';
import { programs } from '@/data/programs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Upload, FileText, CheckCircle2, AlertTriangle, XCircle,
  Loader2, Sparkles, Target, Download, ChevronRight, Edit3, Save
} from 'lucide-react';

type Step = 'upload' | 'scanning' | 'profile' | 'analysis';

interface ExtractedProfile {
  gpax: number;
  competitions: string[];
  leadership: string[];
  projects: string[];
  volunteer: string[];
  englishTest: string;
  certificates: string[];
}

const defaultProfile: ExtractedProfile = {
  gpax: 3.45,
  competitions: ['Thailand Olympiad in Informatics (Bronze)', 'National Science Fair 2025'],
  leadership: ['Student Council Vice President', 'Science Club Leader'],
  projects: ['IoT Smart Farm Monitoring System', 'LINE Bot for School Announcements'],
  volunteer: [],
  englishTest: '',
  certificates: ['Google IT Support Certificate'],
};

const PortfolioCoachPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const pc = t.portfolioCoach;
  const [step, setStep] = useState<Step>('upload');
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [profile, setProfile] = useState<ExtractedProfile>(defaultProfile);
  const [selectedProgram, setSelectedProgram] = useState('cs');
  const [editing, setEditing] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files).filter(
      f => f.type === 'application/pdf' || f.type.startsWith('image/')
    );
    if (files.length) {
      setUploadedFiles(prev => [...prev, ...files]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const startScan = () => {
    setStep('scanning');
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setStep('profile'), 400);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 300);
  };

  const program = programs.find(p => p.id === selectedProgram)!;

  const getGapItems = () => {
    const round1 = program.tcas.find(r => r.round === 1);
    if (!round1) return [];
    const items: { key: string; label: string; status: 'met' | 'warning' | 'missing'; detail: string }[] = [];

    items.push({
      key: 'gpax',
      label: pc.gpaxLabel,
      status: profile.gpax >= round1.gpax ? 'met' : profile.gpax >= round1.gpax - 0.25 ? 'warning' : 'missing',
      detail: `${profile.gpax.toFixed(2)} / ${round1.gpax.toFixed(2)}`,
    });
    items.push({
      key: 'competition',
      label: pc.competitionLabel,
      status: profile.competitions.length >= 1 ? 'met' : 'missing',
      detail: profile.competitions.length > 0 ? profile.competitions.join(', ') : pc.noneFound,
    });
    items.push({
      key: 'project',
      label: pc.projectLabel,
      status: profile.projects.length >= 1 ? 'met' : 'missing',
      detail: profile.projects.length > 0 ? profile.projects.join(', ') : pc.noneFound,
    });
    items.push({
      key: 'leadership',
      label: pc.leadershipLabel,
      status: profile.leadership.length >= 1 ? 'met' : 'warning',
      detail: profile.leadership.length > 0 ? profile.leadership.join(', ') : pc.noneFound,
    });
    items.push({
      key: 'english',
      label: pc.englishLabel,
      status: profile.englishTest ? 'met' : 'missing',
      detail: profile.englishTest || pc.noneFound,
    });
    items.push({
      key: 'volunteer',
      label: pc.volunteerLabel,
      status: profile.volunteer.length >= 1 ? 'met' : 'warning',
      detail: profile.volunteer.length > 0 ? profile.volunteer.join(', ') : pc.noneFound,
    });
    return items;
  };

  const getReadinessScore = () => {
    const items = getGapItems();
    const score = items.reduce((acc, item) => {
      if (item.status === 'met') return acc + 100 / items.length;
      if (item.status === 'warning') return acc + 50 / items.length;
      return acc;
    }, 0);
    return Math.round(score);
  };

  const getAdvice = () => {
    const items = getGapItems();
    const missing = items.filter(i => i.status === 'missing' || i.status === 'warning');
    if (missing.length === 0) return pc.adviceAllMet;
    return missing.map(m => {
      if (m.key === 'english') return pc.adviceEnglish;
      if (m.key === 'volunteer') return pc.adviceVolunteer;
      if (m.key === 'competition') return pc.adviceCompetition;
      if (m.key === 'gpax') return pc.adviceGpax;
      return '';
    }).filter(Boolean).join('\n\n');
  };

  const downloadRoadmap = () => {
    const items = getGapItems();
    const lines = [
      `=== ${pc.roadmapTitle} ===`,
      `${pc.targetProgram}: ${program.name[lang]}`,
      `${pc.readinessLabel}: ${getReadinessScore()}%`,
      '',
      '--- Checklist ---',
      ...items.map(item => {
        const icon = item.status === 'met' ? '✅' : item.status === 'warning' ? '⚠️' : '❌';
        return `${icon} ${item.label}: ${item.detail}`;
      }),
      '',
      `--- ${pc.adviceTitle} ---`,
      getAdvice(),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'KUru_Preparation_Roadmap.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const StatusIcon = ({ status }: { status: 'met' | 'warning' | 'missing' }) => {
    if (status === 'met') return <CheckCircle2 className="h-5 w-5 text-primary" />;
    if (status === 'warning') return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    return <XCircle className="h-5 w-5 text-destructive" />;
  };

  const readiness = getReadinessScore();

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container max-w-3xl px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
            <Sparkles className="h-7 w-7 text-primary" />
            {pc.title}
          </h1>
          <p className="mt-2 text-muted-foreground">{pc.subtitle}</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* STEP 1: Upload */}
          {step === 'upload' && (
            <motion.div key="upload" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">{pc.uploadTitle}</CardTitle>
                  <CardDescription>{pc.uploadDesc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-colors ${
                      dragActive ? 'border-primary bg-accent' : 'border-input hover:border-primary/50 hover:bg-accent/50'
                    }`}
                  >
                    <Upload className="mb-3 h-10 w-10 text-muted-foreground" />
                    <p className="font-medium text-foreground">{pc.dropHere}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{pc.supportedFormats}</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,image/*"
                      multiple
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {uploadedFiles.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 rounded-lg bg-secondary p-3 text-sm">
                          <FileText className="h-4 w-4 text-primary" />
                          <span className="flex-1 truncate text-foreground">{f.name}</span>
                          <Badge variant="secondary" className="text-xs">{(f.size / 1024).toFixed(0)} KB</Badge>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button
                    className="mt-6 w-full"
                    variant="hero"
                    size="lg"
                    disabled={uploadedFiles.length === 0}
                    onClick={startScan}
                  >
                    {pc.scanBtn} <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* STEP 2: Scanning */}
          {step === 'scanning' && (
            <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full gradient-hero"
              >
                <Loader2 className="h-10 w-10 text-primary-foreground" />
              </motion.div>
              <h2 className="text-xl font-semibold text-foreground">{pc.scanningTitle}</h2>
              <p className="mt-2 text-muted-foreground">{pc.scanningDesc}</p>
              <div className="mx-auto mt-6 max-w-sm">
                <Progress value={Math.min(scanProgress, 100)} className="h-2" />
                <p className="mt-2 text-sm text-muted-foreground">{Math.min(Math.round(scanProgress), 100)}%</p>
              </div>
              <div className="mt-6 space-y-2 text-sm text-muted-foreground">
                {scanProgress > 10 && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>✓ {pc.scanStep1}</motion.p>}
                {scanProgress > 35 && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>✓ {pc.scanStep2}</motion.p>}
                {scanProgress > 60 && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>✓ {pc.scanStep3}</motion.p>}
                {scanProgress > 85 && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>✓ {pc.scanStep4}</motion.p>}
              </div>
            </motion.div>
          )}

          {/* STEP 3: Normalised Profile */}
          {step === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <Card className="shadow-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{pc.profileTitle}</CardTitle>
                      <CardDescription>{pc.profileDesc}</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setEditing(!editing)}>
                      {editing ? <Save className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                      <span className="ml-1">{editing ? pc.save : pc.edit}</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* GPAX */}
                  <div>
                    <label className="text-sm font-medium text-foreground">{pc.gpaxLabel}</label>
                    {editing ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={profile.gpax}
                        onChange={e => setProfile({ ...profile, gpax: parseFloat(e.target.value) || 0 })}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-foreground font-semibold">{profile.gpax.toFixed(2)}</p>
                    )}
                  </div>
                  {/* List fields */}
                  {([
                    ['competitions', pc.competitionLabel],
                    ['leadership', pc.leadershipLabel],
                    ['projects', pc.projectLabel],
                    ['volunteer', pc.volunteerLabel],
                    ['certificates', pc.certificateLabel],
                  ] as const).map(([key, label]) => (
                    <div key={key}>
                      <label className="text-sm font-medium text-foreground">{label}</label>
                      {editing ? (
                        <Textarea
                          value={(profile[key] as string[]).join('\n')}
                          onChange={e => setProfile({ ...profile, [key]: e.target.value.split('\n').filter(Boolean) })}
                          className="mt-1"
                          rows={2}
                        />
                      ) : (
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          {(profile[key] as string[]).length > 0 ? (
                            (profile[key] as string[]).map((item, i) => (
                              <Badge key={i} variant="secondary">{item}</Badge>
                            ))
                          ) : (
                            <span className="text-sm text-muted-foreground">{pc.noneFound}</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  {/* English */}
                  <div>
                    <label className="text-sm font-medium text-foreground">{pc.englishLabel}</label>
                    {editing ? (
                      <Input
                        value={profile.englishTest}
                        onChange={e => setProfile({ ...profile, englishTest: e.target.value })}
                        placeholder="e.g., IELTS 6.5, TOEFL 80"
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-foreground">{profile.englishTest || <span className="text-muted-foreground">{pc.noneFound}</span>}</p>
                    )}
                  </div>

                  <Button variant="hero" size="lg" className="mt-4 w-full" onClick={() => setStep('analysis')}>
                    {pc.analyzeBtn} <Target className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* STEP 4: Gap Analysis */}
          {step === 'analysis' && (
            <motion.div key="analysis" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-6">
              {/* Program selector */}
              <Card className="shadow-card">
                <CardContent className="pt-6">
                  <label className="text-sm font-medium text-foreground">{pc.targetProgram}</label>
                  <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {programs.map(p => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.facultyIcon} {p.name[lang]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Readiness Gauge */}
              <Card className="shadow-card text-center">
                <CardContent className="pt-6">
                  <p className="text-sm font-medium text-muted-foreground mb-2">{pc.readinessLabel}</p>
                  <div className="relative mx-auto h-32 w-32">
                    <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                      <circle cx="50" cy="50" r="42" fill="none" strokeWidth="8" className="stroke-secondary" />
                      <circle
                        cx="50" cy="50" r="42" fill="none" strokeWidth="8"
                        strokeDasharray={`${readiness * 2.64} 264`}
                        strokeLinecap="round"
                        className={readiness >= 70 ? 'stroke-primary' : readiness >= 40 ? 'stroke-yellow-500' : 'stroke-destructive'}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-foreground">{readiness}%</span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {program.facultyIcon} {program.name[lang]}
                  </p>
                </CardContent>
              </Card>

              {/* Gap Items */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">{pc.comparisonTitle}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {getGapItems().map(item => (
                    <div key={item.key} className="flex items-start gap-3 rounded-lg border p-3">
                      <StatusIcon status={item.status} />
                      <div className="flex-1">
                        <p className="font-medium text-foreground text-sm">{item.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.detail}</p>
                      </div>
                      <Badge
                        variant={item.status === 'met' ? 'default' : 'secondary'}
                        className={
                          item.status === 'met' ? 'bg-primary text-primary-foreground' :
                          item.status === 'warning' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                          'bg-destructive/10 text-destructive'
                        }
                      >
                        {item.status === 'met' ? pc.statusMet : item.status === 'warning' ? pc.statusWarning : pc.statusMissing}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* KUru Advice */}
              <Card className="shadow-card border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    {pc.adviceTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="whitespace-pre-line text-sm text-foreground leading-relaxed bg-accent/50 rounded-lg p-4">
                    {getAdvice()}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="hero" size="lg" className="flex-1" onClick={downloadRoadmap}>
                  <Download className="mr-2 h-4 w-4" /> {pc.downloadBtn}
                </Button>
                <Button variant="hero-outline" size="lg" className="flex-1" onClick={() => { setStep('profile'); setEditing(true); }}>
                  <Edit3 className="mr-2 h-4 w-4" /> {pc.editProfile}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PortfolioCoachPage;
