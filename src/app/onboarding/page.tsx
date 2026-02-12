"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  LineChart,
  Briefcase,
  GraduationCap,
  Cpu,
  Heart,
  Zap,
  Building2,
  ShoppingCart,
  Bitcoin,
  Home,
  Globe,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
} from "lucide-react";

const userTypes = [
  { id: "day-trader", label: "Day Trader", icon: Zap, description: "Intraday positions, high frequency" },
  { id: "swing-trader", label: "Swing Trader", icon: TrendingUp, description: "Multi-day to multi-week holds" },
  { id: "long-term", label: "Long-term Investor", icon: LineChart, description: "Buy and hold, fundamentals" },
  { id: "professional", label: "Finance Professional", icon: Briefcase, description: "Work in finance/banking" },
  { id: "beginner", label: "Curious Beginner", icon: GraduationCap, description: "Learning the markets" },
];

const sectors = [
  { id: "tech", label: "Technology", icon: Cpu },
  { id: "healthcare", label: "Healthcare", icon: Heart },
  { id: "energy", label: "Energy", icon: Zap },
  { id: "finance", label: "Financials", icon: Building2 },
  { id: "consumer", label: "Consumer", icon: ShoppingCart },
  { id: "crypto", label: "Crypto", icon: Bitcoin },
  { id: "real-estate", label: "Real Estate", icon: Home },
  { id: "macro", label: "Macro/Economics", icon: Globe },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState("");
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const toggleSector = (id: string) => {
    setSelectedSectors((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleComplete = async () => {
    setSaving(true);
    try {
      await fetch("/api/user/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userType: selectedType,
          sectors: selectedSectors,
          onboardingCompleted: true,
        }),
      });
    } catch {
      // Silently continue — preferences are nice-to-have, not blocking
    }
    router.push("/dashboard");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s === step ? "w-12 bg-indigo-500" : s < step ? "w-8 bg-indigo-500/40" : "w-8 bg-white/10"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: User Type */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Welcome to Finance Brief
                </h1>
                <p className="text-muted-foreground">
                  What best describes you? This helps us tailor your experience.
                </p>
              </div>

              <div className="space-y-3">
                {userTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = selectedType === type.id;
                  return (
                    <Card
                      key={type.id}
                      className={`cursor-pointer transition-all border ${
                        isSelected
                          ? "border-indigo-500/50 bg-indigo-500/5"
                          : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"
                      }`}
                      onClick={() => setSelectedType(type.id)}
                    >
                      <CardContent className="flex items-center gap-4 p-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isSelected ? "bg-indigo-500/20" : "bg-white/[0.06]"
                        }`}>
                          <Icon className={`w-5 h-5 ${isSelected ? "text-indigo-400" : "text-muted-foreground"}`} />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">{type.label}</div>
                          <div className="text-sm text-muted-foreground">{type.description}</div>
                        </div>
                        {isSelected && (
                          <Check className="w-5 h-5 text-indigo-400" />
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="flex justify-end mt-8">
                <Button
                  onClick={() => setStep(2)}
                  disabled={!selectedType}
                  className="bg-indigo-600 hover:bg-indigo-500"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Sector Interests */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  What sectors interest you?
                </h1>
                <p className="text-muted-foreground">
                  Select all that apply. We&apos;ll highlight these in your briefs.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {sectors.map((sector) => {
                  const Icon = sector.icon;
                  const isSelected = selectedSectors.includes(sector.id);
                  return (
                    <Card
                      key={sector.id}
                      className={`cursor-pointer transition-all border ${
                        isSelected
                          ? "border-indigo-500/50 bg-indigo-500/5"
                          : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"
                      }`}
                      onClick={() => toggleSector(sector.id)}
                    >
                      <CardContent className="flex items-center gap-3 p-4">
                        <Icon className={`w-5 h-5 ${isSelected ? "text-indigo-400" : "text-muted-foreground"}`} />
                        <span className={`text-sm font-medium ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                          {sector.label}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-indigo-400 ml-auto" />}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="flex justify-between mt-8">
                <Button variant="ghost" onClick={() => setStep(1)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  className="bg-indigo-600 hover:bg-indigo-500"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: All Set */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.5 }}
                  className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-6"
                >
                  <Sparkles className="w-8 h-8 text-indigo-400" />
                </motion.div>

                <h1 className="text-2xl font-bold text-foreground mb-2">
                  You&apos;re all set!
                </h1>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Your daily market brief will be ready every market day morning.
                  During beta, all features are free.
                </p>

                <Card className="border-indigo-500/20 bg-indigo-500/5 mb-8 text-left">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-indigo-400" />
                      Your Brief Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Profile</span>
                      <Badge variant="outline" className="text-xs">
                        {userTypes.find((t) => t.id === selectedType)?.label || "—"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sectors</span>
                      <span className="text-foreground">
                        {selectedSectors.length > 0
                          ? selectedSectors.map((s) => sectors.find((sec) => sec.id === s)?.label).join(", ")
                          : "All sectors"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery</span>
                      <span className="text-foreground">Every market day, 7am ET</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Plan</span>
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs">
                        Free Beta
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex flex-col gap-3">
                  <Button
                    onClick={handleComplete}
                    disabled={saving}
                    className="bg-indigo-600 hover:bg-indigo-500 w-full"
                    size="lg"
                  >
                    {saving ? "Setting up..." : "Read Today's Brief"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setStep(2)}
                    className="text-muted-foreground"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Go back and adjust
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
