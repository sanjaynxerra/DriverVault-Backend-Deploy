// ================= TIME DECAY =================
const getDecayWeight = (date) => {
  const now = new Date();
  const diffYears =
    (now - new Date(date)) / (1000 * 60 * 60 * 24 * 365);

  if (diffYears < 1) return 1;
  if (diffYears < 3) return 0.7;
  if (diffYears < 5) return 0.4;
  return 0.2;
};

// ================= NORMALIZE =================
const normalize = (score, base = 80) => {
  return Math.max(0, Math.min(100, base + score));
};

// ================= SCORE CALCULATION =================
const calculateScores = (records = []) => {
  let safety = 0;
  let reliability = 0;
  let training = 0;

  records.forEach((r) => {
    // 🔒 Safety check
    if (!r || typeof r.impact !== "number" || !r.category) return;

    const weight = getDecayWeight(r.date);
    const value = r.impact * weight;

    if (r.category === "safety") safety += value;
    if (r.category === "reliability") reliability += value;
    if (r.category === "training") training += value;
  });

  const safetyScore = Math.round(normalize(safety));
  const reliabilityScore = Math.round(normalize(reliability));
  const trainingScore = Math.round(normalize(training));

  const overall = Math.round(
    (safetyScore + reliabilityScore + trainingScore) / 3
  );

  return {
    safety: safetyScore,
    reliability: reliabilityScore,
    training: trainingScore, 
    overall,
  };
};

// ================= EXPORT =================
module.exports = {
  calculateScores,
  getDecayWeight, // ✅ FIXED export
};