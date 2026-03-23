import { useLanguage } from '@/i18n/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Compass, Search, GraduationCap, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)]">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-16 sm:py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto space-y-6"
        >
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-hero shadow-lg">
              <GraduationCap className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            {t.hero.title}
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-lg mx-auto">
            {t.hero.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              variant="hero"
              size="lg"
              className="h-auto py-4 px-6 flex-col items-start text-left sm:min-w-[220px]"
              onClick={() => navigate('/discover')}
            >
              <span className="flex items-center gap-2">
                <Compass className="h-5 w-5" />
                {t.hero.discoverBtn}
              </span>
              <span className="text-xs font-normal opacity-80 mt-1">{t.hero.discoverDesc}</span>
            </Button>

            <Button
              variant="hero-outline"
              size="lg"
              className="h-auto py-4 px-6 flex-col items-start text-left sm:min-w-[220px]"
              onClick={() => navigate('/results')}
            >
              <span className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                {t.hero.searchBtn}
              </span>
              <span className="text-xs font-normal opacity-80 mt-1">{t.hero.searchDesc}</span>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features strip */}
      <section className="border-t bg-muted/30 py-12 px-4">
        <div className="container max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { icon: Compass, title: 'Interest Matching', desc: 'PLO-based algorithm' },
            { icon: GraduationCap, title: '70+ Programs', desc: 'Kasetsart University' },
            { icon: ArrowRight, title: 'TCAS Guidance', desc: 'Admission rounds 1–4' },
          ].map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-sm text-foreground">{title}</h3>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
