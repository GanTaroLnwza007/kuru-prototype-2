import { Globe } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const { t, toggleLang, lang } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-14 items-center justify-between px-4">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 font-display text-lg font-bold text-primary">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg gradient-hero text-primary-foreground text-sm font-extrabold">K</span>
          KUru
        </button>

        <nav className="hidden sm:flex items-center gap-1">
          {[
            { path: '/', label: t.nav.home },
            { path: '/discover', label: t.nav.discover },
            { path: '/results', label: t.nav.results },
            { path: '/explore', label: t.nav.explore },
            { path: '/portfolio', label: t.nav.portfolio },
            { path: '/chat', label: t.nav.chat },
          ].map(({ path, label }) => (
            <Button
              key={path}
              variant={location.pathname === path ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => navigate(path)}
            >
              {label}
            </Button>
          ))}
        </nav>

        <Button variant="ghost" size="sm" onClick={toggleLang} className="gap-1.5">
          <Globe className="h-4 w-4" />
          {t.nav.lang}
        </Button>
      </div>
    </header>
  );
};

export default Navbar;
