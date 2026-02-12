"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Send, Check } from "lucide-react";

interface BriefRatingProps {
  date: string;
}

export function BriefRating({ date }: BriefRatingProps) {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setSubmitting(true);
    try {
      await fetch("/api/rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, rating, feedback: feedback || undefined }),
      });
      setSubmitted(true);
    } catch {
      // Silent fail
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="glass border-white/[0.06] bg-white/[0.02]">
          <CardContent className="p-6 text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
              <Check className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-sm text-muted-foreground">
              Thanks for your feedback! It helps us improve your daily brief.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card className="glass border-white/[0.06] bg-white/[0.02]">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-sm font-medium text-foreground mb-1">
              How useful was today&apos;s brief?
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Your feedback helps us improve
            </p>

            {/* Star rating */}
            <div className="flex items-center justify-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-7 h-7 transition-colors ${
                      star <= (hoveredStar || rating)
                        ? "text-amber-400 fill-amber-400"
                        : "text-white/[0.1]"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Feedback text */}
            <AnimatePresence>
              {rating > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Any specific feedback? (optional)"
                    rows={2}
                    className="w-full p-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-foreground text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                  />
                  <Button
                    onClick={handleSubmit}
                    disabled={submitting}
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white"
                  >
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                    {submitting ? "Sending..." : "Submit Rating"}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
