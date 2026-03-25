import { useLanguage } from '@/i18n/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, GraduationCap, Heart, FolderCheck, Target, CheckCircle2, Quote, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import heroStudent from '@/assets/hero-student.png';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' } }),
};

const LandingPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const features = [
    { icon: Heart, title: t.landing.feature1Title, desc: t.landing.feature1Desc, path: '/discover' },
    { icon: GraduationCap, title: t.landing.feature2Title, desc: t.landing.feature2Desc, path: '/explore' },
    { icon: FolderCheck, title: t.landing.feature3Title, desc: t.landing.feature3Desc, path: '/portfolio' },
    { icon: Target, title: t.landing.feature4Title, desc: t.landing.feature4Desc, path: '/explore' },
  ];

  const testimonials = [
    { quote: t.landing.testimonial1, name: t.landing.testimonial1Name },
    { quote: t.landing.testimonial2, name: t.landing.testimonial2Name },
    { quote: t.landing.testimonial3, name: t.landing.testimonial3Name },
  ];

  const whyItems = [t.landing.why1, t.landing.why2, t.landing.why3];

  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section className="gradient-hero-bg overflow-hidden">
        <div className="container max-w-6xl mx-auto px-4 py-16 sm:py-24 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Text side */}
          <motion.div
            initial="hidden"
            animate="visible"
            className="flex-1 space-y-6 text-center lg:text-left"
          >
            <motion.h1
              variants={fadeUp}
              custom={0}
              className="text-3xl sm:text-4xl lg:text-[3.2rem] font-extrabold leading-tight text-foreground"
            >
              {t.hero.title}
              <br />
              <span className="text-primary">{t.hero.titleHighlight}</span>
            </motion.h1>

            <motion.p variants={fadeUp} custom={1} className="text-base sm:text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0">
              {t.hero.subtitle}
              <br />
              <span className="font-semibold text-foreground">{t.hero.subtitleExtra}</span>
            </motion.p>

            <motion.div variants={fadeUp} custom={2} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
              <Button
                variant="hero"
                size="lg"
                className="h-auto py-4 px-7 text-base rounded-2xl gap-2.5"
                onClick={() => navigate('/discover')}
              >
                <Sparkles className="h-5 w-5" />
                {t.hero.discoverBtn}
              </Button>

              <Button
                variant="hero-outline"
                size="lg"
                className="h-auto py-4 px-7 text-base rounded-2xl gap-2.5"
                onClick={() => navigate('/explore')}
              >
                <GraduationCap className="h-5 w-5" />
                {t.hero.searchBtn}
              </Button>
            </motion.div>

            <motion.p variants={fadeUp} custom={3} className="text-xs text-muted-foreground pt-2">
              {t.hero.trustLine}
            </motion.p>
          </motion.div>

          {/* Illustration side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex-1 flex justify-center max-w-sm lg:max-w-md"
          >
            <img src={heroStudent} alt="Thai M6 student exploring university paths" width={1024} height={1024} className="w-full h-auto drop-shadow-xl" />
          </motion.div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-16 sm:py-20 px-4">
        <div className="container max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-10"
          >
            {t.landing.featuresTitle}
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(({ icon: Icon, title, desc, path }, i) => (
              <motion.div
                key={title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
              >
                <Card
                  className="group cursor-pointer border-border/60 hover:shadow-card-hover hover:scale-[1.03] transition-all duration-300 h-full"
                  onClick={() => navigate(path)}
                >
                  <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-foreground">{title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-16 sm:py-20 px-4 bg-muted/40">
        <div className="container max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-10"
          >
            {t.landing.testimonialsTitle}
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {testimonials.map(({ quote, name }, i) => (
              <motion.div
                key={name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
              >
                <Card className="h-full border-border/60">
                  <CardContent className="p-6 flex flex-col gap-4">
                    <Quote className="h-6 w-6 text-primary/40" />
                    <p className="text-sm text-foreground italic leading-relaxed">{quote}</p>
                    <p className="text-xs font-semibold text-muted-foreground mt-auto">{name}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Different ── */}
      <section className="py-16 sm:py-20 px-4">
        <div className="container max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-10"
          >
            {t.landing.whyTitle}
          </motion.h2>

          <div className="space-y-4">
            {whyItems.map((item, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="flex items-start gap-3"
              >
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-base text-foreground">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-16 sm:py-20 px-4 gradient-hero-bg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container max-w-2xl mx-auto text-center space-y-6"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">{t.landing.finalCta}</h2>
          <Button
            variant="hero"
            size="lg"
            className="h-auto py-4 px-8 text-lg rounded-2xl gap-2.5"
            onClick={() => navigate('/discover')}
          >
            <ArrowRight className="h-5 w-5" />
            {t.hero.discoverBtn}
          </Button>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;
