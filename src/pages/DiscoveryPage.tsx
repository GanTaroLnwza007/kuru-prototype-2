import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Monitor, FlaskConical, Briefcase, Sprout,
  BookOpen, Wrench, HeartPulse, TreePine,
  ChevronRight, ChevronLeft, Sparkles,
} from 'lucide-react';

const topicIcons = {
  technology: Monitor,
  science: FlaskConical,
  business: Briefcase,
  agriculture: Sprout,
  arts: BookOpen,
  engineering: Wrench,
  health: HeartPulse,
  environment: TreePine,
} as const;

const topicKeys = Object.keys(topicIcons) as (keyof typeof topicIcons)[];

const DiscoveryPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0=topics, 1=followup1, 2=followup2, 3=profile
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [followUpAnswers, setFollowUpAnswers] = useState<string[]>([]);

  const totalSteps = 4;
  const progress = ((step + 1) / totalSteps) * 100;

  const toggleTopic = (key: string) => {
    setSelectedTopics(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const handleFollowUp = (answer: string) => {
    setFollowUpAnswers(prev => [...prev, answer]);
    setStep(s => s + 1);
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] px-4 py-6 max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-6 space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{t.discovery.step} {step + 1} {t.discovery.of} {totalSteps}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="topics"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="text-center space-y-1 mb-6">
              <h2 className="text-xl font-bold text-foreground">{t.discovery.title}</h2>
              <p className="text-sm text-muted-foreground">{t.discovery.subtitle}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {topicKeys.map(key => {
                const Icon = topicIcons[key];
                const selected = selectedTopics.includes(key);
                const topicT = t.topics[key as keyof typeof t.topics];
                const descT = t.topics[`${key}Desc` as keyof typeof t.topics];
                return (
                  <Card
                    key={key}
                    className={`p-4 cursor-pointer transition-all duration-200 ${
                      selected
                        ? 'ring-2 ring-primary bg-accent shadow-card-hover'
                        : 'hover:shadow-card hover:bg-muted/50'
                    }`}
                    onClick={() => toggleTopic(key)}
                  >
                    <div className="flex flex-col items-center text-center gap-2">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                        selected ? 'gradient-hero text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="font-semibold text-sm text-foreground">{topicT}</span>
                      <span className="text-xs text-muted-foreground">{descT}</span>
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="flex justify-end pt-4">
              <Button
                variant="hero"
                disabled={selectedTopics.length === 0}
                onClick={() => setStep(1)}
                className="gap-2"
              >
                {t.discovery.next}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {(step === 1 || step === 2) && (
          <motion.div
            key={`followup-${step}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center space-y-1">
              <h2 className="text-xl font-bold text-foreground">{t.discovery.followUp}</h2>
              <p className="text-sm text-muted-foreground">
                {t.followUpQuestions[step - 1]}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {t.followUpOptions[step - 1].map((option, i) => (
                <Card
                  key={i}
                  className="p-4 cursor-pointer hover:shadow-card hover:bg-accent/50 transition-all text-center"
                  onClick={() => handleFollowUp(option)}
                >
                  <span className="text-sm font-medium text-foreground">{option}</span>
                </Card>
              ))}
            </div>

            <Button variant="ghost" onClick={() => setStep(s => s - 1)} className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              {t.discovery.back}
            </Button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, ease: 'linear', repeat: 1 }}
              className="flex justify-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full gradient-hero">
                <Sparkles className="h-8 w-8 text-primary-foreground" />
              </div>
            </motion.div>

            <h2 className="text-xl font-bold text-foreground">{t.discovery.profileTitle}</h2>
            <p className="text-sm text-muted-foreground">{t.discovery.profileDesc}</p>

            <div className="flex flex-wrap gap-2 justify-center">
              {selectedTopics.map(key => {
                const topicT = t.topics[key as keyof typeof t.topics];
                return (
                  <span
                    key={key}
                    className="inline-flex items-center rounded-full bg-accent text-accent-foreground px-3 py-1 text-xs font-medium"
                  >
                    {topicT}
                  </span>
                );
              })}
            </div>

            <Button
              variant="hero"
              size="lg"
              onClick={() => navigate('/results', { state: { topics: selectedTopics, answers: followUpAnswers } })}
              className="gap-2 mt-4"
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
