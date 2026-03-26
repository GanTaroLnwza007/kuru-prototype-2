import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/i18n/LanguageContext";
import Navbar from "@/components/Navbar";
import LandingPage from "./pages/LandingPage";
import DiscoveryPage from "./pages/DiscoveryPage";
import ResultsPage from "./pages/ResultsPage";
import ExplorePage from "./pages/ExplorePage";
import ChatPage from "./pages/ChatPage";
import PortfolioCoachPage from "./pages/PortfolioCoachPage";
import ProgramDetailPage from "./pages/ProgramDetailPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/discover" element={<DiscoveryPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/portfolio" element={<PortfolioCoachPage />} />
            <Route path="/programs/:programId" element={<ProgramDetailPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
