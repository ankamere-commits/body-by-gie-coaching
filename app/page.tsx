"use client";

import { type CSSProperties, useEffect, useMemo, useState } from "react";

type Step = "welcome" | "onboarding" | "dashboard" | "reflection";
type MissionKey = "strength" | "food" | "water" | "walk" | "encouragement";
type DashboardSession = "home" | "today" | "profile" | "strength" | "food" | "week" | "progress";

type Onboarding = {
  name: string;
  age: string;
  sex: string;
  measurementSystem: "Metric" | "Imperial";
  heightCm: string;
  heightFeet: string;
  heightInches: string;
  weightKg: string;
  weight: string;
  activityLevel: string;
  goal: string;
  trainingExperience: string;
  workoutLocation: string;
  equipment: string[];
  days: string;
  foodPrefs: string;
  dislikedFoods: string;
  struggle: string;
  sleepQuality: string;
  healthConsiderations: string;
};

type WorkoutMove = {
  name: string;
  sets: string;
  reps: string;
  rest: string;
  instruction: string;
};

type PlanDay = {
  day: number;
  title: string;
  coachLine: string;
  workout: {
    type: "Strength" | "Gentle movement" | "Rest and reset";
    time: string;
    moves: WorkoutMove[];
  };
  missions: Record<MissionKey, string>;
};

type CoachingInsights = {
  bmi: number | null;
  calories: number | null;
  startingFocus: string;
  foodTarget: string;
  mealPriority: string;
  routineLevel: string;
  recoveryNote: string;
  careNote: string;
};

type TrainingLevel = "beginner" | "intermediate" | "advanced";

type CoachingEngine = {
  framework: CoachingFramework;
  level: TrainingLevel;
  weeklyWorkouts: number;
  planStyle: "full-body" | "upper-lower" | "push-pull-legs" | "specialised";
  adaptationMode: "protect" | "simplify" | "steady" | "progress";
  progression: ProgressionDecision;
  dashboardFocus: string;
  workoutTone: string;
  walkingNudge: string;
  missedWorkoutMessage: string;
  nextWeekAdjustment: string;
  dailyMessage: string;
  nextAchievableStep: string;
  coachMemory: CoachingMemory;
  successSignals: string[];
  wins: {
    gold: string;
    silver: string;
    bronze: string;
  };
};

type ProgressionDecision = {
  action: "increase" | "maintain" | "reduce" | "simplify" | "deload";
  difficulty: "lighter" | "baseline" | "slightly harder";
  reason: string;
  trainingEmphasis: string;
  deloadRecommended: boolean;
  progressionRule: string;
};

type CoachingFramework = {
  coreBelief: string;
  coachingRule: string;
  pillars: {
    strengthFirst: string;
    proteinFirst: string;
    steadyEnergy: string;
    consistencyWins: string;
    graceAndDiscipline: string;
  };
  successMetrics: string[];
  personality: string[];
};

type CoachingMemory = {
  goals: string[];
  why: string;
  challenges: string[];
  previousStruggles: string[];
  previousSuccesses: string[];
};

type AdherenceSnapshot = {
  completedStrength: number;
  completedWalks: number;
  completedFood: number;
  missedStrength: number;
  completedHabits: number;
  reflectionDone: boolean;
  consistencyScore: number;
  consistencyBand: "low" | "building" | "steady";
};

type DailyCheckIn = {
  feeling: string;
  time: string;
  sleep: string;
  motivation: string;
};

type Reflection = {
  worked: string;
  hard: string;
  adjust: string;
  energy: string;
  consistency: string;
  nextFocus: string;
};

type DatabaseSyncStatus = "idle" | "saving" | "saved" | "offline";

const APP_NAME = "BODY BY GIE";
const APP_TAGLINE = "Stronger Body. Stronger Mind. Stronger You.";
const lifestylePhotos = {
  landing: "/images/body-by-gie-splash-subject-replaced.png",
  hero: "/images/coach-strength.png",
  strength: "/images/coach-strength.png",
  meal: "/images/coach-meal-prep.png",
  walk: "/images/coach-walking.png",
  confidence: "/images/coach-confidence.png",
};

const sessionBacksplashes: Record<DashboardSession, { image: string; tone: string }> = {
  home: { image: lifestylePhotos.hero, tone: "strength-tone" },
  today: { image: lifestylePhotos.confidence, tone: "confidence-tone" },
  profile: { image: lifestylePhotos.walk, tone: "walk-tone" },
  strength: { image: lifestylePhotos.strength, tone: "strength-tone" },
  food: { image: lifestylePhotos.meal, tone: "food-tone" },
  week: { image: lifestylePhotos.walk, tone: "walk-tone" },
  progress: { image: lifestylePhotos.confidence, tone: "confidence-tone" },
};

const defaultOnboarding: Onboarding = {
  name: "",
  age: "",
  sex: "Prefer not to say",
  measurementSystem: "Metric",
  heightCm: "",
  heightFeet: "",
  heightInches: "",
  weightKg: "",
  weight: "",
  activityLevel: "Somewhere in between",
  goal: "Have more energy",
  trainingExperience: "Completely new",
  workoutLocation: "At home",
  equipment: ["Bodyweight"],
  days: "3 days",
  foodPrefs: "",
  dislikedFoods: "",
  struggle: "Consistency",
  sleepQuality: "Okay",
  healthConsiderations: "",
};

const equipmentOptions = ["Bodyweight", "Dumbbells", "Resistance bands", "Gym machines"];
const goals = [
  "Lose body fat",
  "Feel stronger",
  "Build muscle",
  "Have more energy",
  "Improve my health",
  "Build consistency",
];
const sexOptions = ["Female", "Male", "Prefer not to say"];
const measurementOptions = ["Metric", "Imperial"];
const activityLevels = ["Mostly sitting", "Somewhere in between", "Mostly moving"];
const experienceLevels = [
  "Completely new",
  "I've started and stopped many times",
  "I exercise occasionally",
  "I'm fairly consistent",
  "I've trained for years",
];
const workoutLocations = ["At home", "At the gym", "Both"];
const struggles = [
  "Lack of time",
  "Low motivation",
  "Cravings",
  "Stress",
  "Family commitments",
  "Not knowing what to do",
  "Low energy",
];
const sleepOptions = ["Great", "Okay", "Not great"];
const dayOptions = ["2 days", "3 days", "4 days", "5 days"];
const feelingOptions = ["Energised", "Good", "Tired", "Stressed", "Unwell"];
const timeOptions = ["10 minutes", "20 minutes", "30 minutes", "45+ minutes"];
const dailySleepOptions = ["Great", "Okay", "Poor"];
const motivationOptions = ["High", "Medium", "Low"];
const BODY_BY_GIE_FRAMEWORK: CoachingFramework = {
  coreBelief:
    "The goal is not perfection. The goal is becoming stronger, healthier, and more consistent over time.",
  coachingRule:
    "Ask what the smallest successful action is today, then build from there.",
  pillars: {
    strengthFirst:
      "Strength training is the foundation. Women should be encouraged to become stronger with patience and confidence.",
    proteinFirst:
      "Protein comes first at meals before adding more complicated nutrition targets.",
    steadyEnergy:
      "Steady energy comes from protein first, fibre and vegetables, balanced meals, whole foods most of the time, and fewer sugary snacks or drinks.",
    consistencyWins:
      "Consistency matters more than perfection. A missed day is feedback, not failure.",
    graceAndDiscipline:
      "Coaching should combine accountability with encouragement: honest, warm, practical, and never shaming.",
  },
  successMetrics: ["Showing up", "Strength", "Energy", "Consistency", "Confidence", "Healthy habits"],
  personality: ["Wise", "Warm", "Encouraging", "Practical", "Honest"],
};
const missionLabels: Record<MissionKey, string> = {
  strength: "Strength",
  food: "Food",
  water: "Water",
  walk: "Walk",
  encouragement: "Encouragement",
};
const dashboardSessions: { id: DashboardSession; label: string; helper: string }[] = [
  { id: "home", label: "Home", helper: "Your calm starting point" },
  { id: "today", label: "Today", helper: "Check in and choose your win" },
  { id: "profile", label: "Profile", helper: "Why this plan fits you" },
  { id: "strength", label: "Strength", helper: "Your movement practice" },
  { id: "food", label: "Food", helper: "Steady-energy meals" },
  { id: "week", label: "Week", helper: "Your 7-day map" },
  { id: "progress", label: "Progress", helper: "Reflect and adjust" },
];

export default function Home() {
  const [step, setStep] = useState<Step>("welcome");
  const [selectedDay, setSelectedDay] = useState(1);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState<Onboarding>(defaultOnboarding);
  const [reflection, setReflection] = useState<Reflection>({
    worked: "",
    hard: "",
    adjust: "",
    energy: "About the same",
    consistency: "Some days",
    nextFocus: "Keep the plan small enough to repeat",
  });
  const [dailyCheckIn, setDailyCheckIn] = useState<DailyCheckIn>({
    feeling: "Good",
    time: "20 minutes",
    sleep: "Okay",
    motivation: "Medium",
  });
  const [clientId, setClientId] = useState("");
  const [syncStatus, setSyncStatus] = useState<DatabaseSyncStatus>("idle");

  const engine = useMemo(
    () => buildCoachingEngine(form, completed, reflection, dailyCheckIn),
    [form, completed, reflection, dailyCheckIn],
  );
  const plan = useMemo(() => createSevenDayPlan(form, engine), [form, engine]);
  const insights = useMemo(() => createCoachingInsights(form), [form]);
  const currentDay = plan.find((day) => day.day === selectedDay) ?? plan[0];
  const consistencyScore = calculateConsistencyScore(completed, reflection);

  useEffect(() => {
    const storedId = window.localStorage.getItem("body-by-gie-client-id");
    const nextId =
      storedId ||
      (window.crypto?.randomUUID?.() ?? `client-${Date.now()}-${Math.random().toString(16).slice(2)}`);

    window.localStorage.setItem("body-by-gie-client-id", nextId);
    setClientId(nextId);
  }, []);

  async function syncToDatabase(endpoint: "/api/profiles" | "/api/progress", payload: Record<string, unknown>) {
    if (!clientId) return;

    setSyncStatus("saving");

    try {
      const response = await fetch(endpoint, {
        body: JSON.stringify({ clientId, ...payload }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const result = (await response.json()) as { saved?: boolean };

      setSyncStatus(response.ok && result.saved ? "saved" : "offline");
    } catch {
      setSyncStatus("offline");
    }
  }

  function updateField<K extends keyof Onboarding>(field: K, value: Onboarding[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function toggleEquipment(option: string) {
    setForm((current) => {
      const hasOption = current.equipment.includes(option);
      const equipment = hasOption
        ? current.equipment.filter((item) => item !== option)
        : [...current.equipment, option];

      return { ...current, equipment: equipment.length ? equipment : ["Bodyweight"] };
    });
  }

  function completeOnboarding() {
    if (getFullOnboardingValidation(form)) return;
    setStep("dashboard");
    setSelectedDay(1);
    void syncToDatabase("/api/profiles", {
      insights,
      onboarding: form,
      planSummary: {
        level: engine.level,
        nextStep: engine.nextAchievableStep,
        weeklyWorkouts: engine.weeklyWorkouts,
      },
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function toggleMission(day: number, mission: MissionKey) {
    const key = `${day}-${mission}`;
    setCompleted((current) => {
      const next = {
        ...current,
        [key]: !current[key],
        [`${day}-missed-strength`]: mission === "strength" && !current[key] ? false : (current[`${day}-missed-strength`] ?? false),
      };

      void syncToDatabase("/api/progress", {
        eventType: "mission_toggled",
        payload: {
          completed: next[key],
          consistencyScore: calculateConsistencyScore(next, reflection),
          day,
          mission,
        },
      });

      return next;
    });
  }

  function markWorkoutMissed(day: number) {
    setCompleted((current) => {
      const next = {
        ...current,
        [`${day}-strength`]: false,
        [`${day}-missed-strength`]: true,
      };

      void syncToDatabase("/api/progress", {
        eventType: "workout_missed",
        payload: {
          consistencyScore: calculateConsistencyScore(next, reflection),
          day,
          message: engine.missedWorkoutMessage,
        },
      });

      return next;
    });
  }

  function updateDailyCheckIn(nextCheckIn: DailyCheckIn) {
    setDailyCheckIn(nextCheckIn);
    void syncToDatabase("/api/progress", {
      eventType: "daily_check_in",
      payload: {
        checkIn: nextCheckIn,
        selectedDay,
      },
    });
  }

  function finishReflection() {
    void syncToDatabase("/api/progress", {
      eventType: "weekly_reflection",
      payload: {
        consistencyScore,
        reflection,
      },
    });
    setStep("dashboard");
  }

  return (
    <main className={step === "welcome" ? "app-shell welcome-shell" : "app-shell"}>
      <div className="app-frame">
        {step !== "welcome" && (
          <header className="topbar" aria-label="App header">
            <div className="brand-lockup">
              <div className="brand-mark" aria-hidden="true">
                B
              </div>
              <div>
                <p className="brand-note">Coaching app</p>
                <p className="brand-name">{APP_NAME}</p>
              </div>
            </div>
            <button className="ghost-button" type="button" onClick={() => setStep("dashboard")}>
              Dashboard
            </button>
            <DatabaseSyncBadge status={syncStatus} />
          </header>
        )}

        {step === "welcome" && <Welcome onSignIn={() => setStep("dashboard")} onStart={() => setStep("onboarding")} />}

        {step === "onboarding" && (
          <OnboardingForm
            form={form}
            onComplete={completeOnboarding}
            onField={updateField}
            onEquipment={toggleEquipment}
          />
        )}

        {step === "dashboard" && (
          <Dashboard
            completed={completed}
            consistencyScore={consistencyScore}
            currentDay={currentDay}
            engine={engine}
            form={form}
            insights={insights}
            dailyCheckIn={dailyCheckIn}
            onEdit={() => setStep("onboarding")}
            onReflection={() => setStep("reflection")}
            onMarkWorkoutMissed={markWorkoutMissed}
            onSelectDay={setSelectedDay}
            onToggleMission={toggleMission}
            setDailyCheckIn={updateDailyCheckIn}
            plan={plan}
            selectedDay={selectedDay}
          />
        )}

        {step === "reflection" && (
          <WeeklyReflection
            consistencyScore={consistencyScore}
            engine={engine}
            reflection={reflection}
            setReflection={setReflection}
            onDone={finishReflection}
          />
        )}
      </div>
    </main>
  );
}

function Welcome({ onSignIn, onStart }: { onSignIn: () => void; onStart: () => void }) {
  return (
    <section className="welcome" aria-label="BODY BY GIE onboarding">
      <section className="mobile-hero-screen">
        <LifestyleImage
          alt="BODY BY GIE fitness coach splash screen"
          className="mobile-hero-image"
          src={lifestylePhotos.landing}
        />
        <div className="mobile-cta-gradient" aria-hidden="true" />

        <div className="mobile-hero-bottom">
          <button className="journey-button" type="button" onClick={onStart}>
            START YOUR JOURNEY
          </button>
          <button className="signin-link" type="button" onClick={onSignIn}>
            Already a member? <span>Sign In</span>
          </button>
        </div>
      </section>
    </section>
  );
}

function DatabaseSyncBadge({ status }: { status: DatabaseSyncStatus }) {
  const label =
    status === "saving"
      ? "Saving"
      : status === "saved"
        ? "Saved"
        : status === "offline"
          ? "Local mode"
          : "Ready";

  return <span className={`sync-badge ${status}`}>{label}</span>;
}

function OnboardingForm({
  form,
  onComplete,
  onField,
  onEquipment,
}: {
  form: Onboarding;
  onComplete: () => void;
  onField: <K extends keyof Onboarding>(field: K, value: Onboarding[K]) => void;
  onEquipment: (option: string) => void;
}) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const totalQuestions = 16;
  const summaryIndex = totalQuestions;
  const isSummary = questionIndex === summaryIndex;
  const coachName = getCoachName(form);
  const currentValidation = getOnboardingValidation(form, questionIndex);
  const healthStop = questionIndex === 15 || isSummary ? getHealthStopMessage(form) : "";
  const canContinue = isSummary ? !getFullOnboardingValidation(form) : !currentValidation;

  function next() {
    if (currentValidation) return;
    setQuestionIndex((current) => Math.min(current + 1, summaryIndex));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function back() {
    setQuestionIndex((current) => Math.max(current - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <section className="stack">
      <section className="conversation-card">
        <p className="eyebrow">{isSummary ? "Coach summary" : `Question ${questionIndex + 1} of ${totalQuestions}`}</p>
        <div className="coach-bubble">
          {questionIndex === 0 && (
            <>
              <h1>Hi! I&apos;m here to help you build strength, improve your health, and create habits that fit your real life.</h1>
              <p>Before we build your plan, I&apos;d love to get to know you a little better.</p>
              <p>First, what should I call you?</p>
              <input
                aria-label="First name"
                className="text-input"
                placeholder="Example: Angela"
                value={form.name}
                onChange={(event) => onField("name", cleanNameInput(event.target.value))}
              />
            </>
          )}

          {questionIndex === 1 && (
            <CoachQuestion title={`Nice to meet you${form.name ? `, ${form.name}` : ""}. How old are you?`}>
              <input
                aria-label="Age"
                className="text-input"
                inputMode="numeric"
                placeholder="Example: 42"
                value={form.age}
                onChange={(event) => onField("age", cleanIntegerInput(event.target.value))}
              />
            </CoachQuestion>
          )}

          {questionIndex === 2 && (
            <CoachQuestion title="Which option should I use for basic food estimates?">
              <Segmented options={sexOptions} value={form.sex} onChange={(value) => onField("sex", value)} />
            </CoachQuestion>
          )}

          {questionIndex === 3 && (
            <CoachQuestion title="How tall are you?">
              <Segmented
                options={measurementOptions}
                value={form.measurementSystem}
                onChange={(value) => onField("measurementSystem", value as Onboarding["measurementSystem"])}
              />
              {form.measurementSystem === "Metric" ? (
                <input
                  aria-label="Height in centimetres"
                  className="text-input"
                  inputMode="numeric"
                  placeholder="Example: 168 cm"
                  value={form.heightCm}
                  onChange={(event) => onField("heightCm", cleanDecimalInput(event.target.value))}
                />
              ) : (
                <div className="measure-grid two">
                  <input
                    aria-label="Height feet"
                    className="text-input"
                    inputMode="numeric"
                    placeholder="Feet"
                    value={form.heightFeet}
                    onChange={(event) => onField("heightFeet", cleanIntegerInput(event.target.value))}
                  />
                  <input
                    aria-label="Height inches"
                    className="text-input"
                    inputMode="numeric"
                    placeholder="Inches"
                    value={form.heightInches}
                    onChange={(event) => onField("heightInches", cleanIntegerInput(event.target.value))}
                  />
                </div>
              )}
            </CoachQuestion>
          )}

          {questionIndex === 4 && (
            <CoachQuestion title="What does the scale currently say?">
              {form.measurementSystem === "Metric" ? (
                <input
                  aria-label="Weight in kilograms"
                  className="text-input"
                  inputMode="decimal"
                  placeholder="Example: 74 kg"
                  value={form.weightKg}
                  onChange={(event) => onField("weightKg", cleanDecimalInput(event.target.value))}
                />
              ) : (
                <input
                  aria-label="Weight in pounds"
                  className="text-input"
                  inputMode="numeric"
                  placeholder="Example: 165 lb"
                  value={form.weight}
                  onChange={(event) => onField("weight", cleanDecimalInput(event.target.value))}
                />
              )}
            </CoachQuestion>
          )}

          {questionIndex === 5 && (
            <CoachQuestion title="Outside of exercise, would you say you're mostly sitting, mostly moving, or somewhere in between during the day?">
              <Segmented
                options={activityLevels}
                value={form.activityLevel}
                onChange={(value) => onField("activityLevel", value)}
              />
            </CoachQuestion>
          )}

          {questionIndex === 6 && (
            <CoachQuestion title="What would make you happiest over the next 6 months?">
              <Segmented options={goals} value={form.goal} onChange={(value) => onField("goal", value)} />
            </CoachQuestion>
          )}

          {questionIndex === 7 && (
            <CoachQuestion title="What's your relationship with exercise right now?">
              <Segmented
                options={experienceLevels}
                value={form.trainingExperience}
                onChange={(value) => onField("trainingExperience", value)}
              />
            </CoachQuestion>
          )}

          {questionIndex === 8 && (
            <CoachQuestion title="Where will most of your workouts happen?">
              <Segmented
                options={workoutLocations}
                value={form.workoutLocation}
                onChange={(value) => onField("workoutLocation", value)}
              />
            </CoachQuestion>
          )}

          {questionIndex === 9 && (
            <CoachQuestion title="What equipment do you have available?">
              <div className="choice-grid">
                {equipmentOptions.map((option) => (
                  <label className="check-choice" key={option}>
                    <input
                      checked={form.equipment.includes(option)}
                      onChange={() => onEquipment(option)}
                      type="checkbox"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </CoachQuestion>
          )}

          {questionIndex === 10 && (
            <CoachQuestion title="How many days each week feel realistic for training?">
              <Segmented options={dayOptions} value={form.days} onChange={(value) => onField("days", value)} />
            </CoachQuestion>
          )}

          {questionIndex === 11 && (
            <CoachQuestion title="Tell me about foods you genuinely enjoy eating.">
              <textarea
                aria-label="Food preferences"
                placeholder="Examples: eggs, chicken bowls, oats, rice, fruit, quick lunches"
                value={form.foodPrefs}
                onChange={(event) => onField("foodPrefs", event.target.value)}
              />
            </CoachQuestion>
          )}

          {questionIndex === 12 && (
            <CoachQuestion title="Anything you absolutely don't want included in your plan?">
              <textarea
                aria-label="Foods disliked"
                placeholder="Examples: tuna, mushrooms, cottage cheese"
                value={form.dislikedFoods}
                onChange={(event) => onField("dislikedFoods", event.target.value)}
              />
            </CoachQuestion>
          )}

          {questionIndex === 13 && (
            <CoachQuestion title="When things go off track, what's usually the reason?">
              <Segmented
                options={struggles}
                value={form.struggle}
                onChange={(value) => onField("struggle", value)}
              />
            </CoachQuestion>
          )}

          {questionIndex === 14 && (
            <CoachQuestion title="How have you been sleeping lately?">
              <Segmented
                options={sleepOptions}
                value={form.sleepQuality}
                onChange={(value) => onField("sleepQuality", value)}
              />
            </CoachQuestion>
          )}

          {questionIndex === 15 && (
            <CoachQuestion title="Is there anything we should work around to keep you safe and comfortable?">
              <textarea
                aria-label="Injuries or health considerations"
                placeholder="Type No if there is nothing to work around. If there is anything, this pilot will pause and ask you to speak with a qualified professional."
                value={form.healthConsiderations}
                onChange={(event) => onField("healthConsiderations", event.target.value)}
              />
            </CoachQuestion>
          )}

          {isSummary && <CoachSummaryPreview form={form} />}
          {(currentValidation || healthStop) && (
            <div className={healthStop ? "governance-message danger" : "governance-message"} role="alert" aria-live="polite">
              <strong>{healthStop ? "Before we continue" : "Quick check"}</strong>
              <p>{healthStop || currentValidation}</p>
            </div>
          )}
        </div>

        <div className="conversation-actions">
          <button className="small-button" type="button" onClick={back} disabled={questionIndex === 0}>
            Back
          </button>
          {isSummary ? (
            <button className="primary-button" type="button" onClick={onComplete} disabled={!canContinue}>
              Let&apos;s build that together
            </button>
          ) : (
            <button className="primary-button" type="button" onClick={next} disabled={!canContinue}>
              Continue
            </button>
          )}
        </div>
      </section>
      <Disclaimer />
    </section>
  );
}

function CoachQuestion({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <h1>{title}</h1>
      {children}
    </>
  );
}

function CoachSummaryPreview({ form }: { form: Onboarding }) {
  return (
    <div className="summary-preview">
      <h1>Thanks, {getCoachName(form)}.</h1>
      <p>Here&apos;s what I&apos;ve learned:</p>
      <ul>
        <li>You want to {form.goal.toLowerCase()}.</li>
        <li>Your biggest challenge is {form.struggle.toLowerCase()}.</li>
        <li>You&apos;re currently {form.trainingExperience.toLowerCase()}.</li>
        <li>You&apos;ll mostly train {form.workoutLocation.toLowerCase()}.</li>
      </ul>
      <p>The good news is you don&apos;t need a perfect plan.</p>
      <p>You need a plan you can actually stick to.</p>
      <p>Let&apos;s build that together.</p>
    </div>
  );
}

function Dashboard({
  completed,
  consistencyScore,
  currentDay,
  dailyCheckIn,
  engine,
  form,
  insights,
  onEdit,
  onReflection,
  onMarkWorkoutMissed,
  onSelectDay,
  onToggleMission,
  plan,
  selectedDay,
  setDailyCheckIn,
}: {
  completed: Record<string, boolean>;
  consistencyScore: number;
  currentDay: PlanDay;
  dailyCheckIn: DailyCheckIn;
  engine: CoachingEngine;
  form: Onboarding;
  insights: CoachingInsights;
  onEdit: () => void;
  onReflection: () => void;
  onMarkWorkoutMissed: (day: number) => void;
  onSelectDay: (day: number) => void;
  onToggleMission: (day: number, mission: MissionKey) => void;
  plan: PlanDay[];
  selectedDay: number;
  setDailyCheckIn: (nextCheckIn: DailyCheckIn) => void;
}) {
  const coachName = getCoachName(form);
  const completedHabits = Object.values(completed).filter(Boolean).length;
  const [activeSession, setActiveSession] = useState<DashboardSession>("home");
  const activeSessionMeta = dashboardSessions.find((session) => session.id === activeSession) ?? dashboardSessions[0];
  const activeSessionVisual = sessionBacksplashes[activeSession] ?? sessionBacksplashes.home;

  function openSession(session: DashboardSession) {
    setActiveSession(session);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <section className="wellness-home">
      <DashboardNav activeSession={activeSession} onSessionChange={openSession} />

      {activeSession === "home" ? (
        <DashboardHome
          completed={completed}
          completedHabits={completedHabits}
          consistencyScore={consistencyScore}
          currentDay={currentDay}
          engine={engine}
          form={form}
          insights={insights}
          onOpenSession={openSession}
        />
      ) : (
        <section className="session-page" key={activeSession}>
          <div className={`session-hero session-hero-visual ${activeSessionVisual.tone}`}>
            <LifestyleImage alt="" className="session-hero-bg" src={activeSessionVisual.image} />
            <div className="session-hero-content">
              <p className="eyebrow">{activeSessionMeta.label} session</p>
              <h1>{activeSessionMeta.helper}</h1>
              <p>
                Stay with this one area for a moment. A calmer plan is easier to follow than a crowded
                one.
              </p>
            </div>
          </div>

          {(activeSession === "today" || activeSession === "strength" || activeSession === "week") && (
            <DaySelector plan={plan} selectedDay={selectedDay} onSelectDay={onSelectDay} />
          )}

          {activeSession === "today" && (
            <ResultSection
              eyebrow="Start here"
              id="today"
              title="Today's coaching result"
              summary="Check in, see your right-sized plan, then choose the smallest win that fits real life."
            >
              <DailyReadinessCard dailyCheckIn={dailyCheckIn} engine={engine} setDailyCheckIn={setDailyCheckIn} />
              <CoachCard completed={completed} consistencyScore={consistencyScore} day={currentDay} engine={engine} form={form} />
              <DailyMissions completed={completed} day={currentDay} onMarkWorkoutMissed={onMarkWorkoutMissed} onToggle={onToggleMission} />
            </ResultSection>
          )}

          {activeSession === "profile" && (
            <ResultSection
              eyebrow="Your coach's read"
              id="profile"
              title="Why this plan fits you"
              summary="A plain-language summary of the plan level, food focus, movement focus, and care notes from onboarding."
            >
              <CoachSummary form={form} currentDay={currentDay} engine={engine} insights={insights} />
            </ResultSection>
          )}

          {activeSession === "strength" && (
            <ResultSection
              eyebrow="Strength"
              id="strength"
              title="Your beginner strength plan"
              summary="Simple movement practice with clear sets, reps, rest, and instructions for the selected day."
            >
              <LifestyleBand
                eyebrow="Real-life strength"
                imageAlt="A woman strength training with a barbell in a gym"
                imageSrc={lifestylePhotos.strength}
                title="Strong can look calm, steady, and repeatable."
              >
                <p>
                  Your plan is not built around looking perfect in a gym. It is built around learning simple
                  movements, feeling more capable, and coming back again.
                </p>
              </LifestyleBand>
              <WorkoutCard day={currentDay} framework={engine.framework} />
            </ResultSection>
          )}

          {activeSession === "food" && (
            <ResultSection
              eyebrow="Food"
              id="food"
              title="Your steady-energy eating plan"
              summary="Begin with protein, add plants and fibre, then use smart carbs and simpler snack choices."
            >
              <FoodGuidance
                dislikes={form.dislikedFoods}
                framework={engine.framework}
                insights={insights}
                preferences={form.foodPrefs}
              />
              <LifestyleBand
                eyebrow="Steady-energy food"
                imageAlt="A woman preparing a warm meal in a home kitchen"
                imageSrc={lifestylePhotos.meal}
                reverse
                title="Food support should feel practical, not fussy."
              >
                <p>
                  Start with meals you already know how to make. Add protein first, plants or fibre next,
                  and enough simple carbs to help the meal feel complete.
                </p>
              </LifestyleBand>
            </ResultSection>
          )}

          {activeSession === "week" && (
            <ResultSection
              eyebrow="Week"
              id="week"
              title="Your 7-day map"
              summary="See the whole starter week in one place, then jump between days without losing your place."
            >
              <LifestylePhotoRow />
              <SevenDayOverview engine={engine} plan={plan} selectedDay={selectedDay} onSelectDay={onSelectDay} />
            </ResultSection>
          )}

          {activeSession === "progress" && (
            <ResultSection
              eyebrow="Progress"
              id="progress"
              title="Review and adjust"
              summary="Track consistency by showing up, then use the weekly check-in to make next week easier to follow."
            >
              <section className="card action-card">
                <div>
                  <p className="eyebrow">End of week</p>
                  <h2>Reflect with honesty and care</h2>
                  <p className="muted">A useful check-in looks for clues, not blame.</p>
                </div>
                <button className="secondary-button" type="button" onClick={onReflection}>
                  Weekly reflection
                </button>
                <button className="small-button" type="button" onClick={onEdit}>
                  Adjust onboarding answers
                </button>
              </section>
            </ResultSection>
          )}
        </section>
      )}

      <Disclaimer />
    </section>
  );
}

function DashboardHome({
  completed,
  completedHabits,
  consistencyScore,
  currentDay,
  engine,
  form,
  insights,
  onOpenSession,
}: {
  completed: Record<string, boolean>;
  completedHabits: number;
  consistencyScore: number;
  currentDay: PlanDay;
  engine: CoachingEngine;
  form: Onboarding;
  insights: CoachingInsights;
  onOpenSession: (session: DashboardSession) => void;
}) {
  const coachName = getCoachName(form);

  return (
    <section className="session-page">
      <section className="premium-hero">
        <LifestyleImage
          alt="Women strength training together in a calm, welcoming studio"
          className="premium-hero-image"
          src={lifestylePhotos.hero}
        />
        <div className="premium-hero-copy">
          <p className="eyebrow">Today&apos;s coaching</p>
          <h1>{getDashboardGreeting(coachName)}</h1>
          <p className="hero-statement">Small steps. Real strength. Lasting change.</p>
          <p>Today we&apos;re keeping things simple: {engine.nextAchievableStep}</p>
          <div className="hero-pulse" aria-label="Today at a glance">
            <span>
              <strong>{consistencyScore}%</strong>
              Showing up
            </span>
            <span>
              <strong>{engine.weeklyWorkouts}x</strong>
              Strength
            </span>
            <span>
              <strong>{completedHabits}</strong>
              Wins logged
            </span>
          </div>
        </div>
      </section>

      <section className="coach-strip" aria-label="Coach decision">
        <div>
          <p className="eyebrow">Coach decision</p>
          <h2>{decisionLabelFor(engine.adaptationMode)}</h2>
        </div>
        <p>{progressionCopyFor(engine.progression)}</p>
      </section>

      <section className="home-grid">
        <TodayFocus day={currentDay} engine={engine} insights={insights} />
        <CoachNote
          completed={completed}
          consistencyScore={consistencyScore}
          day={currentDay}
          engine={engine}
          form={form}
        />
        <WhyCard form={form} />
        <WeeklyMomentum completedHabits={completedHabits} score={consistencyScore} />
        <SuccessSignals engine={engine} />
        <TodaysWins engine={engine} />
      </section>

      <section className="session-library" aria-label="Coaching sessions">
        <div className="panel-heading">
          <p className="eyebrow">Choose a session</p>
          <h2>One clear place for each part of your plan</h2>
        </div>
        <div className="session-card-grid">
          {dashboardSessions
            .filter((session) => session.id !== "home")
            .map((session, index) => (
              <button className="session-card" key={session.id} type="button" onClick={() => onOpenSession(session.id)}>
                <span className="session-number">{String(index + 1).padStart(2, "0")}</span>
                <span>{session.label}</span>
                <strong>{session.helper}</strong>
                <small>Open session</small>
              </button>
            ))}
        </div>
      </section>
    </section>
  );
}

function DaySelector({
  plan,
  selectedDay,
  onSelectDay,
}: {
  plan: PlanDay[];
  selectedDay: number;
  onSelectDay: (day: number) => void;
}) {
  return (
    <div className="day-strip" aria-label="Choose a day">
      {plan.map((day) => (
        <button
          className={selectedDay === day.day ? "selected" : ""}
          key={day.day}
          type="button"
          onClick={() => onSelectDay(day.day)}
        >
          <span>Day</span>
          {day.day}
        </button>
      ))}
    </div>
  );
}

function TodayFocus({
  day,
  engine,
  insights,
}: {
  day: PlanDay;
  engine: CoachingEngine;
  insights: CoachingInsights;
}) {
  const focusItems = [
    {
      label: "Workout",
      title: day.title,
      body: `${day.workout.time} of calm strength practice.`,
    },
    {
      label: "Nutrition focus",
      title: "Protein first",
      body: insights.mealPriority,
    },
    {
      label: "Movement goal",
      title: "Easy walking",
      body: engine.walkingNudge,
    },
    {
      label: "Recovery goal",
      title: "Leave energy in reserve",
      body: insights.recoveryNote,
    },
  ];

  return (
    <section className="home-panel today-focus">
      <div className="panel-heading">
        <p className="eyebrow">Today&apos;s focus</p>
        <h2>Four calm anchors for the day</h2>
      </div>
      <div className="focus-grid">
        {focusItems.map((item) => (
          <article className="focus-card" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.title}</strong>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function CoachNote({
  completed,
  consistencyScore,
  day,
  engine,
  form,
}: {
  completed: Record<string, boolean>;
  consistencyScore: number;
  day: PlanDay;
  engine: CoachingEngine;
  form: Onboarding;
}) {
  const newer =
    form.trainingExperience === "Completely new" || form.trainingExperience === "I've started and stopped many times";
  const message = dailyCoachMessage({
    consistencyScore,
    engine,
    form,
    newer,
    strengthDone: Boolean(completed[`${day.day}-strength`]),
  });

  return (
    <section className="home-panel coach-note-panel">
      <p className="eyebrow">Coach&apos;s note</p>
      <h2>{day.coachLine}</h2>
      <p>{message}</p>
    </section>
  );
}

function WhyCard({ form }: { form: Onboarding }) {
  return (
    <section className="home-panel why-panel">
      <p className="eyebrow">Your why</p>
      <h2>{whyFor(form)}</h2>
      <p>Remember why you started. Progress comes from showing up consistently, with patience and care.</p>
    </section>
  );
}

function WeeklyMomentum({ completedHabits, score }: { completedHabits: number; score: number }) {
  return (
    <section className="home-panel momentum-panel">
      <div>
        <p className="eyebrow">Weekly progress</p>
        <h2>Momentum is building</h2>
      </div>
      <MomentumCircle score={score} />
      <p className="momentum-copy">
        {completedHabits === 0
          ? "Your first small win is enough to begin."
          : `${completedHabits} habit ${completedHabits === 1 ? "step" : "steps"} completed this week.`}
      </p>
    </section>
  );
}

function SuccessSignals({ engine }: { engine: CoachingEngine }) {
  return (
    <section className="home-panel success-panel">
      <p className="eyebrow">Success signals</p>
      <h2>Progress is more than weight loss</h2>
      <ul className="memory-list">
        {engine.successSignals.map((signal) => (
          <li key={signal}>{signal}</li>
        ))}
      </ul>
    </section>
  );
}

function MomentumCircle({ score }: { score: number }) {
  const ringSize = 132;
  const ringRadius = 54;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference - (score / 100) * ringCircumference;

  return (
    <div className="momentum-circle" aria-label={`Showing up momentum ${score}%`}>
      <svg height={ringSize} viewBox={`0 0 ${ringSize} ${ringSize}`} width={ringSize}>
        <circle className="score-ring-bg" cx="66" cy="66" r={ringRadius} />
        <circle
          className="score-ring-value"
          cx="66"
          cy="66"
          r={ringRadius}
          style={
            {
              "--ring-dash": ringCircumference,
              "--ring-offset": ringOffset,
            } as CSSProperties
          }
        />
      </svg>
      <div>
        <strong>{score}%</strong>
        <span>Showing up</span>
      </div>
    </div>
  );
}

function TodaysWins({ engine }: { engine: CoachingEngine }) {
  return (
    <section className="home-panel wins-panel">
      <div className="panel-heading">
        <p className="eyebrow">Today&apos;s wins</p>
        <h2>Choose the version that fits your life</h2>
      </div>
      <div className="wins-grid compact">
        <article>
          <span>Gold</span>
          <strong>{engine.wins.gold}</strong>
        </article>
        <article>
          <span>Silver</span>
          <strong>{engine.wins.silver}</strong>
        </article>
        <article>
          <span>Bronze</span>
          <strong>{engine.wins.bronze}</strong>
        </article>
      </div>
    </section>
  );
}

function DashboardNav({
  activeSession,
  onSessionChange,
}: {
  activeSession: DashboardSession;
  onSessionChange: (session: DashboardSession) => void;
}) {
  return (
    <nav className="dashboard-nav" aria-label="Dashboard sections">
      {dashboardSessions.map((session) => (
        <button
          aria-current={activeSession === session.id ? "page" : undefined}
          className={activeSession === session.id ? "selected" : ""}
          key={session.id}
          type="button"
          onClick={() => onSessionChange(session.id)}
        >
          {session.label}
        </button>
      ))}
    </nav>
  );
}

function ResultSection({
  children,
  eyebrow,
  id,
  summary,
  title,
}: {
  children: React.ReactNode;
  eyebrow: string;
  id: string;
  summary: string;
  title: string;
}) {
  return (
    <section className="result-section" id={id}>
      <div className="result-heading">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
        <p>{summary}</p>
      </div>
      <div className="result-body">{children}</div>
    </section>
  );
}

function LifestyleImage({
  alt,
  className,
  src,
}: {
  alt: string;
  className?: string;
  src: string;
}) {
  return <img alt={alt} className={className} loading="eager" src={src} />;
}

function LifestyleBand({
  children,
  eyebrow,
  imageAlt,
  imageSrc,
  reverse = false,
  title,
}: {
  children: React.ReactNode;
  eyebrow: string;
  imageAlt: string;
  imageSrc: string;
  reverse?: boolean;
  title: string;
}) {
  return (
    <section className={reverse ? "lifestyle-band reverse" : "lifestyle-band"}>
      <LifestyleImage alt={imageAlt} className="lifestyle-band-image" src={imageSrc} />
      <div className="lifestyle-band-copy">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        {children}
      </div>
    </section>
  );
}

function LifestylePhotoRow() {
  return (
    <section className="photo-row" aria-label="Everyday coaching moments">
      <article>
        <LifestyleImage alt="Two women walking outside on a sunny path" src={lifestylePhotos.walk} />
        <div>
          <span>Movement</span>
          <strong>A walk is a real win.</strong>
        </div>
      </article>
      <article>
        <LifestyleImage alt="Two women walking with relaxed confidence outdoors" src={lifestylePhotos.confidence} />
        <div>
          <span>Confidence</span>
          <strong>Small steps done faithfully still count.</strong>
        </div>
      </article>
    </section>
  );
}

function ScoreCard({ score }: { score: number }) {
  const ringSize = 108;
  const ringRadius = 44;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference - (score / 100) * ringCircumference;
  const scoreMessage =
    score === 0
      ? "No pressure. Your first check mark is enough to begin."
      : score < 35
        ? "You are building proof that small counts."
        : score < 70
          ? "You are showing up in repeatable ways."
          : "You have a steady rhythm forming.";

  return (
    <section className="score-card" aria-label="Consistency score">
      <p>Consistency support</p>
      <div className="score-ring" aria-hidden="true">
        <svg height={ringSize} viewBox={`0 0 ${ringSize} ${ringSize}`} width={ringSize}>
          <circle className="score-ring-bg" cx="54" cy="54" r={ringRadius} />
          <circle
            className="score-ring-value"
            cx="54"
            cy="54"
            r={ringRadius}
            style={
              {
                "--ring-dash": ringCircumference,
                "--ring-offset": ringOffset,
              } as CSSProperties
            }
          />
        </svg>
        <strong>{score}%</strong>
      </div>
      <small>{scoreMessage} Missed days do not erase progress.</small>
    </section>
  );
}

function DailyReadinessCard({
  dailyCheckIn,
  engine,
  setDailyCheckIn,
}: {
  dailyCheckIn: DailyCheckIn;
  engine: CoachingEngine;
  setDailyCheckIn: (nextCheckIn: DailyCheckIn) => void;
}) {
  function update(field: keyof DailyCheckIn, value: string) {
    setDailyCheckIn({ ...dailyCheckIn, [field]: value });
  }

  return (
    <section className="card readiness-card">
      <p className="eyebrow">Today&apos;s check-in</p>
      <h2>Tell your coach what real life looks like today.</h2>
      <div className="readiness-grid">
        <ReadinessQuestion title="How are you feeling today?">
          <Segmented options={feelingOptions} value={dailyCheckIn.feeling} onChange={(value) => update("feeling", value)} />
        </ReadinessQuestion>
        <ReadinessQuestion title="How much time do you realistically have today?">
          <Segmented options={timeOptions} value={dailyCheckIn.time} onChange={(value) => update("time", value)} />
        </ReadinessQuestion>
        <ReadinessQuestion title="How did you sleep last night?">
          <Segmented options={dailySleepOptions} value={dailyCheckIn.sleep} onChange={(value) => update("sleep", value)} />
        </ReadinessQuestion>
        <ReadinessQuestion title="How motivated do you feel?">
          <Segmented options={motivationOptions} value={dailyCheckIn.motivation} onChange={(value) => update("motivation", value)} />
        </ReadinessQuestion>
      </div>
      <p className="coach-hint">{engine.dailyMessage}</p>
      <p className="coach-hint">
        Coaching decision: {decisionLabelFor(engine.adaptationMode)} Next achievable step: {engine.nextAchievableStep}
      </p>
      <div className="wins-grid">
        <article>
          <span>Gold win</span>
          <strong>{engine.wins.gold}</strong>
        </article>
        <article>
          <span>Silver win</span>
          <strong>{engine.wins.silver}</strong>
        </article>
        <article>
          <span>Bronze win</span>
          <strong>{engine.wins.bronze}</strong>
        </article>
      </div>
    </section>
  );
}

function ReadinessQuestion({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="readiness-question">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

function CoachSummary({
  form,
  currentDay,
  engine,
  insights,
}: {
  form: Onboarding;
  currentDay: PlanDay;
  engine: CoachingEngine;
  insights: CoachingInsights;
}) {
  return (
    <section className="coach-summary">
      <div>
        <p className="eyebrow">Your coach noticed</p>
        <h2>{getCoachName(form)}, your plan should feel doable before it feels impressive.</h2>
        <p className="coach-hint">{engine.framework.coreBelief}</p>
      </div>
      <div className="summary-grid">
        <article>
          <span>Starting focus</span>
          <strong>{insights.startingFocus}</strong>
        </article>
        <article>
          <span>Food target</span>
          <strong>{insights.foodTarget}</strong>
        </article>
        <article>
          <span>Routine level</span>
          <strong>{insights.routineLevel} {engine.workoutTone}</strong>
        </article>
        <article>
          <span>Movement focus</span>
          <strong>{engine.walkingNudge}</strong>
        </article>
        <article>
          <span>Sleep and recovery</span>
          <strong>{insights.recoveryNote}</strong>
        </article>
        <article>
          <span>Care note</span>
          <strong>{insights.careNote}</strong>
        </article>
        <article>
          <span>Today&apos;s minimum</span>
          <strong>{currentDay.workout.moves[0]?.name ?? "Take one kind step"} plus one protein-first meal.</strong>
        </article>
        <article>
          <span>Your why</span>
          <strong>{engine.coachMemory.why}</strong>
        </article>
        <article>
          <span>Known challenge</span>
          <strong>{engine.coachMemory.challenges[0] ?? "Keeping the plan realistic"}</strong>
        </article>
        <article>
          <span>Next achievable step</span>
          <strong>{engine.nextAchievableStep}</strong>
        </article>
        <article>
          <span>Framework rule</span>
          <strong>{engine.framework.coachingRule}</strong>
        </article>
        <article>
          <span>Progression decision</span>
          <strong>{progressionCopyFor(engine.progression)}</strong>
        </article>
        <article>
          <span>Training emphasis</span>
          <strong>{engine.progression.trainingEmphasis}</strong>
        </article>
        <article>
          <span>How we coach</span>
          <strong>{engine.framework.pillars.graceAndDiscipline}</strong>
        </article>
      </div>
    </section>
  );
}

function CoachCard({
  completed,
  consistencyScore,
  day,
  engine,
  form,
}: {
  completed: Record<string, boolean>;
  consistencyScore: number;
  day: PlanDay;
  engine: CoachingEngine;
  form: Onboarding;
}) {
  const newer =
    form.trainingExperience === "Completely new" || form.trainingExperience === "I've started and stopped many times";
  const strengthDone = Boolean(completed[`${day.day}-strength`]);
  const message = dailyCoachMessage({
    consistencyScore,
    engine,
    form,
    newer,
    strengthDone,
  });

  return (
    <section className="coach-card">
      <p className="eyebrow">Daily coach</p>
      <h2>{day.coachLine}</h2>
      <p>{message}</p>
      <p>{engine.missedWorkoutMessage}</p>
      <p>{engine.framework.pillars.consistencyWins}</p>
      <p>{progressionCopyFor(engine.progression)}</p>
      <p>Before adding more, we ask: what is the next achievable step? Today, it is {engine.nextAchievableStep}</p>
      <div className="coach-note">
        <span>Today&apos;s anchor</span>
        <strong>{day.title}</strong>
      </div>
    </section>
  );
}

function DailyMissions({
  completed,
  day,
  onMarkWorkoutMissed,
  onToggle,
}: {
  completed: Record<string, boolean>;
  day: PlanDay;
  onMarkWorkoutMissed: (day: number) => void;
  onToggle: (day: number, mission: MissionKey) => void;
}) {
  const missionKeys = Object.keys(missionLabels) as MissionKey[];
  const doneCount = missionKeys.filter((mission) => completed[`${day.day}-${mission}`]).length;
  const missionMessage =
    doneCount === 0
      ? "Pick one. You do not need to earn your way into a fresh start."
      : doneCount < missionKeys.length
        ? `${doneCount} of 5 done. That is real evidence, not nothing.`
        : "All five done. Let that feel quietly good.";

  return (
    <section className="card">
      <p className="eyebrow">Daily missions</p>
      <h2>Five small promises for today</h2>
      <p className="coach-hint">{missionMessage}</p>
      <div className="mission-grid">
        {missionKeys.map((mission) => {
          const key = `${day.day}-${mission}`;
          return (
            <label className={completed[key] ? "mission-card done" : "mission-card"} key={mission}>
              <input
                checked={Boolean(completed[key])}
                onChange={() => onToggle(day.day, mission)}
                type="checkbox"
              />
              <span>{missionLabels[mission]}</span>
              <strong>{day.missions[mission]}</strong>
            </label>
          );
        })}
      </div>
      {day.workout.type === "Strength" && (
        <button className="text-button" type="button" onClick={() => onMarkWorkoutMissed(day.day)}>
          I missed this workout today
        </button>
      )}
    </section>
  );
}

function WorkoutCard({ day, framework }: { day: PlanDay; framework: CoachingFramework }) {
  return (
    <section className="card workout-card">
      <div className="card-title-row">
        <div>
          <p className="eyebrow">{day.workout.type}</p>
          <h2>{day.title}</h2>
          <p className="coach-hint">{framework.pillars.strengthFirst}</p>
          <p className="coach-hint">Start with one round. If your body and day both say yes, do the rest.</p>
        </div>
        <span className="time-pill">{day.workout.time}</span>
      </div>
      <div className="move-list">
        {day.workout.moves.map((move) => (
          <article className="move-card" key={move.name}>
            <div>
              <h3>{move.name}</h3>
              <p>{move.instruction}</p>
            </div>
            <dl>
              <div>
                <dt>Sets</dt>
                <dd>{move.sets}</dd>
              </div>
              <div>
                <dt>Reps</dt>
                <dd>{move.reps}</dd>
              </div>
              <div>
                <dt>Rest</dt>
                <dd>{move.rest}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}

function FoodGuidance({
  dislikes,
  framework,
  insights,
  preferences,
}: {
  dislikes: string;
  framework: CoachingFramework;
  insights: CoachingInsights;
  preferences: string;
}) {
  const cards = [
    {
      title: "Protein first",
      body: `${framework.pillars.proteinFirst} Start with a simple protein you like: eggs, Greek yogurt, tofu, beans, lentils, fish, chicken, or lean meat.`,
    },
    {
      title: "Plants/fibre next",
      body: "Add colour and texture: vegetables, fruit, beans, oats, potatoes with skin, or whole grains.",
    },
    {
      title: "Smart carbs last",
      body: "Choose carbs that help the meal feel complete, like oats, rice, potatoes, wholegrain bread, or pasta.",
    },
    {
      title: "Less sugary snacks",
      body: "Keep sugary snacks and drinks as sometimes choices, and pair snacks with protein or fibre when you can.",
    },
    {
      title: "Whole foods most of the time",
      body: "Build around foods that feel simple and familiar. You do not need perfect meals to make steady progress.",
    },
    {
      title: "Steady energy, not restriction",
      body: `${framework.pillars.steadyEnergy} ${insights.mealPriority}`,
    },
  ];

  return (
    <section className="card eating-card">
      <p className="eyebrow">Food support</p>
      <h2>Steady-energy eating, without perfection</h2>
      <p className="coach-hint">
        {framework.coreBelief} Use this order for one meal today. One useful meal is enough practice.
      </p>
      {preferences && <p className="soft-note">Keeping in mind: {preferences}</p>}
      {dislikes && <p className="soft-note">We will work around: {dislikes}</p>}
      <div className="food-grid">
        {cards.map((card) => (
          <article className="food-card" key={card.title}>
            <h3>{card.title}</h3>
            <p>{card.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function SevenDayOverview({
  engine,
  plan,
  selectedDay,
  onSelectDay,
}: {
  engine: CoachingEngine;
  plan: PlanDay[];
  selectedDay: number;
  onSelectDay: (day: number) => void;
}) {
  return (
    <section className="card">
      <p className="eyebrow">Starter week</p>
      <h2>Your 7 days at a glance</h2>
      <p className="coach-hint">{engine.nextWeekAdjustment}</p>
      <div className="overview-list">
        {plan.map((day) => (
          <button
            className={selectedDay === day.day ? "overview-item selected" : "overview-item"}
            key={day.day}
            type="button"
            onClick={() => onSelectDay(day.day)}
          >
            <span>Day {day.day}</span>
            <strong>{day.title}</strong>
            <small>{day.workout.type}</small>
          </button>
        ))}
      </div>
    </section>
  );
}

function WeeklyReflection({
  consistencyScore,
  engine,
  reflection,
  setReflection,
  onDone,
}: {
  consistencyScore: number;
  engine: CoachingEngine;
  reflection: {
    worked: string;
    hard: string;
    adjust: string;
    energy: string;
    consistency: string;
    nextFocus: string;
  };
  setReflection: React.Dispatch<
    React.SetStateAction<{
      worked: string;
      hard: string;
      adjust: string;
      energy: string;
      consistency: string;
      nextFocus: string;
    }>
  >;
  onDone: () => void;
}) {
  return (
    <section className="stack">
      <div className="intro-card">
        <p className="eyebrow">Weekly reflection</p>
        <h1>Let&apos;s listen to the week with honesty and care.</h1>
        <p>
          Your consistency support score is <strong>{consistencyScore}%</strong>. It is information your coach can use, not a grade.
        </p>
        <p>
          BODY BY GIE celebrates {engine.framework.successMetrics.join(", ").toLowerCase()}. The scale is never the only measure of progress.
        </p>
        <p>{engine.nextWeekAdjustment}</p>
      </div>

      <Field title="What worked, even a little?">
        <textarea
          aria-label="What worked"
          placeholder="Example: Short workouts felt easier to start."
          value={reflection.worked}
          onChange={(event) => setReflection((current) => ({ ...current, worked: event.target.value }))}
        />
      </Field>

      <Field title="What was hard?">
        <textarea
          aria-label="What was hard"
          placeholder="Example: I was tired after work and forgot my water bottle."
          value={reflection.hard}
          onChange={(event) => setReflection((current) => ({ ...current, hard: event.target.value }))}
        />
      </Field>

      <Field title="What needs adjusting for next week?">
        <textarea
          aria-label="What needs adjusting"
          placeholder="Example: I need two shorter sessions and easier lunches."
          value={reflection.adjust}
          onChange={(event) => setReflection((current) => ({ ...current, adjust: event.target.value }))}
        />
      </Field>

      <Field title="How was your energy overall?">
        <Segmented
          options={["Better than usual", "About the same", "Lower than usual"]}
          value={reflection.energy}
          onChange={(value) => setReflection((current) => ({ ...current, energy: value }))}
        />
      </Field>

      <Field title="How consistent did the week feel?">
        <Segmented
          options={["Most days", "Some days", "Hard to get started"]}
          value={reflection.consistency}
          onChange={(value) => setReflection((current) => ({ ...current, consistency: value }))}
        />
      </Field>

      <Field title="Choose one kind focus">
        <Segmented
          options={[
            "Keep the plan small enough to repeat",
            "Prepare one protein option",
            "Walk after one meal",
            "Put workouts on the calendar",
          ]}
          value={reflection.nextFocus}
          onChange={(value) => setReflection((current) => ({ ...current, nextFocus: value }))}
        />
      </Field>

      <button className="primary-button sticky-action" type="button" onClick={onDone}>
        Save reflection
      </button>
      <Disclaimer />
    </section>
  );
}

function Field({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="field-card">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function Segmented({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="segmented">
      {options.map((option) => (
        <button
          className={value === option ? "selected" : ""}
          key={option}
          type="button"
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function Disclaimer() {
  return (
    <p className="disclaimer">
      This app provides general fitness and nutrition education. It is not medical advice. Speak to a
      qualified professional before making major changes, especially if you have a medical condition,
      are pregnant, take medication, or have a history of eating disorders.
    </p>
  );
}

function getCoachName(form: Onboarding) {
  return form.name.trim() || "friend";
}

function cleanNameInput(value: string) {
  return value.replace(/[^a-zA-Z '\-]/g, "").slice(0, 40);
}

function cleanIntegerInput(value: string) {
  return value.replace(/\D/g, "").slice(0, 3);
}

function cleanDecimalInput(value: string) {
  const cleaned = value.replace(/[^0-9.]/g, "");
  const [whole = "", ...rest] = cleaned.split(".");
  const decimal = rest.join("").slice(0, 1);

  return `${whole.slice(0, 3)}${rest.length ? `.${decimal}` : ""}`;
}

function getFullOnboardingValidation(form: Onboarding) {
  for (let index = 0; index < 16; index += 1) {
    const message = getOnboardingValidation(form, index);
    if (message) return message;
  }

  return "";
}

function getOnboardingValidation(form: Onboarding, questionIndex: number) {
  if (questionIndex === 0) {
    const name = form.name.trim();
    if (name.length < 2) return "Please enter your first name so your plan can feel personal.";
    if (!/^[a-zA-Z][a-zA-Z '\-]{1,39}$/.test(name)) {
      return "Please use letters for your name. No numbers or random characters.";
    }
  }

  if (questionIndex === 1) {
    const age = Number.parseInt(form.age, 10);
    if (!form.age) return "Please enter your age.";
    if (!Number.isInteger(age) || `${age}` !== form.age) return "Please enter age as a whole number.";
    if (age < 16) return "This pilot is only for users aged 16 or older. We cannot build a plan here.";
    if (age > 100) return "Please enter a realistic age so the guidance can stay sensible.";
  }

  if (questionIndex === 3) {
    if (form.measurementSystem === "Metric") {
      const heightCm = Number.parseFloat(form.heightCm);
      if (!form.heightCm) return "Please enter your height in centimetres.";
      if (!Number.isFinite(heightCm) || heightCm < 120 || heightCm > 230) {
        return "Please enter a realistic height between 120 cm and 230 cm.";
      }
    } else {
      const feet = Number.parseInt(form.heightFeet, 10);
      const inches = Number.parseInt(form.heightInches || "0", 10);
      if (!form.heightFeet) return "Please enter your height in feet and inches.";
      if (!Number.isInteger(feet) || feet < 4 || feet > 7 || !Number.isInteger(inches) || inches < 0 || inches > 11) {
        return "Please enter a realistic height. Inches should be between 0 and 11.";
      }
    }
  }

  if (questionIndex === 4) {
    if (form.measurementSystem === "Metric") {
      const weightKg = Number.parseFloat(form.weightKg);
      if (!form.weightKg) return "Please enter your weight in kilograms.";
      if (!Number.isFinite(weightKg) || weightKg < 35 || weightKg > 250) {
        return "Please enter a realistic weight between 35 kg and 250 kg.";
      }
    } else {
      const weightLb = Number.parseFloat(form.weight);
      if (!form.weight) return "Please enter your weight in pounds.";
      if (!Number.isFinite(weightLb) || weightLb < 75 || weightLb > 550) {
        return "Please enter a realistic weight between 75 lb and 550 lb.";
      }
    }
  }

  if (questionIndex === 9 && form.equipment.length === 0) {
    return "Please choose at least one equipment option. Bodyweight is completely fine.";
  }

  if (questionIndex === 11 && form.foodPrefs.trim().length < 2) {
    return "Please share at least one food you genuinely enjoy, even if it is simple.";
  }

  if (questionIndex === 12 && form.dislikedFoods.trim().length < 2) {
    return "Please tell me any foods to avoid, or type No if there are none.";
  }

  if (questionIndex === 15) {
    return getHealthStopMessage(form);
  }

  return "";
}

function getHealthStopMessage(form: Onboarding) {
  const value = form.healthConsiderations.trim().toLowerCase();
  const clearNo = ["no", "none", "n/a", "na", "nope", "nothing", "no injuries", "no health considerations"];

  if (!value) return "Please type No if there is nothing to work around.";
  if (clearNo.includes(value)) return "";

  return "Because you mentioned something we may need to work around, this pilot should pause here. Please speak with a qualified professional before using a new fitness or nutrition plan.";
}

function getDashboardGreeting(name: string) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return `${greeting}, ${name}.`;
}

function whyFor(form: Onboarding) {
  if (form.goal === "Have more energy") return "More steady energy for real life.";
  if (form.goal === "Feel stronger") return "Feeling stronger and more capable in your body.";
  if (form.goal === "Build muscle") return "Building strength with patience and care.";
  if (form.goal === "Lose body fat") return "Gentle progress without extreme restriction.";
  if (form.goal === "Improve my health") return "Caring for your health one small step at a time.";
  if (form.goal === "Build consistency") return "Trusting yourself to keep showing up.";
  return "A stronger, steadier version of everyday life.";
}

function createCoachingInsights(form: Onboarding): CoachingInsights {
  const age = Number.parseInt(form.age, 10);
  const heightFeet = Number.parseInt(form.heightFeet, 10);
  const heightInchesOnly = Number.parseInt(form.heightInches || "0", 10);
  const heightInches =
    Number.isFinite(heightFeet) && Number.isFinite(heightInchesOnly)
      ? heightFeet * 12 + heightInchesOnly
      : Number.NaN;
  const metricHeightCm = Number.parseFloat(form.heightCm);
  const imperialWeightLb = Number.parseFloat(form.weight);
  const metricWeightKg = Number.parseFloat(form.weightKg);
  const heightCm =
    form.measurementSystem === "Metric"
      ? metricHeightCm
      : Number.isFinite(heightInches)
        ? heightInches * 2.54
        : Number.NaN;
  const weightKg =
    form.measurementSystem === "Metric"
      ? metricWeightKg
      : Number.isFinite(imperialWeightLb)
        ? imperialWeightLb * 0.453592
        : Number.NaN;
  const heightMeters = Number.isFinite(heightCm) ? heightCm / 100 : Number.NaN;
  const bmi =
    Number.isFinite(weightKg) && Number.isFinite(heightMeters) && heightMeters > 0
      ? weightKg / (heightMeters * heightMeters)
      : null;
  const base =
    Number.isFinite(age) && Number.isFinite(heightCm) && Number.isFinite(weightKg)
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + sexAdjustment(form.sex)
      : null;
  const maintenance = base ? base * activityFactor(form.activityLevel) : null;
  const calories = maintenance ? Math.round(maintenance + goalAdjustment(form.goal)) : null;
  const hasHealthNote = form.healthConsiderations.trim().length > 0;

  return {
    bmi,
    calories,
    startingFocus: startingFocusFor(form),
    foodTarget: foodTargetFor(form, calories),
    mealPriority: mealPriorityFor(form),
    routineLevel: routineLevelFor(form),
    recoveryNote:
      form.sleepQuality === "Not great"
        ? "Keep training gentle and protect sleep where you can. Strength is built with patience."
        : "Your plan leaves space for recovery, because consistency grows better when rest is respected.",
    careNote: hasHealthNote
      ? "Because you mentioned a health or injury consideration, choose the easiest version and get personal advice when needed."
      : "Your body is worth caring for. Today's goal is stewardship and steady care.",
  };
}

function sexAdjustment(sex: string) {
  if (sex === "Male") return 5;
  if (sex === "Female") return -161;
  return -78;
}

function activityFactor(activityLevel: string) {
  if (activityLevel === "Somewhere in between") return 1.375;
  if (activityLevel === "Mostly moving") return 1.55;
  return 1.2;
}

function goalAdjustment(goal: string) {
  if (goal === "Lose body fat") return -300;
  if (goal === "Build muscle") return 180;
  if (goal === "Feel stronger") return 80;
  return 0;
}

function startingFocusFor(form: Onboarding) {
  if (form.goal === "Have more energy" || form.goal === "Improve my health") {
    return "Your starting focus is building consistency and improving energy.";
  }
  if (form.goal === "Lose body fat") return "Your starting focus is steady habits that support gentle fat loss.";
  if (form.goal === "Build muscle") return "Your starting focus is strength practice, enough food, and patient progress.";
  if (form.goal === "Feel stronger") return "Your starting focus is learning the basics and repeating them faithfully.";
  return "Your starting focus is building a steady routine you can keep.";
}

function foodTargetFor(form: Onboarding, calories: number | null) {
  if (!calories) return "Your food target is a realistic starting point, not a strict rule.";
  if (form.goal === "Lose body fat") return "Your food target is a gentle fat-loss approach, not extreme restriction.";
  if (form.goal === "Build muscle") return "Your food target supports strength work with enough steady meals.";
  if (form.goal === "Have more energy" || form.goal === "Improve my health") {
    return "Your food target is steady energy across the day, not restriction.";
  }
  return "Your food target is balanced and realistic for your current routine.";
}

function mealPriorityFor(form: Onboarding) {
  if (form.struggle === "Cravings") {
    return "Your meals should prioritise protein, fibre, and steady energy so snack choices feel calmer.";
  }
  if (form.struggle === "Low energy" || form.sleepQuality === "Not great") {
    return "Your meals should be simple, filling, and steady so low-energy days are easier to navigate.";
  }
  return "Your meals should prioritise protein, fibre, whole foods most of the time, and steady energy.";
}

function routineLevelFor(form: Onboarding) {
  const experience =
    form.trainingExperience === "Completely new" || form.trainingExperience === "I've started and stopped many times"
      ? "gentle starting"
      : "steady";
  return `Your plan is set at a realistic ${experience} level for a ${form.activityLevel.toLowerCase()} routine.`;
}

function buildCoachingEngine(
  form: Onboarding,
  completed: Record<string, boolean>,
  reflection: {
    worked: string;
    hard: string;
    adjust: string;
    energy: string;
    consistency: string;
    nextFocus: string;
  },
  dailyCheckIn: DailyCheckIn,
): CoachingEngine {
  const adherence = getAdherenceSnapshot(completed, reflection);
  const memory = buildCoachingMemory(form, reflection);
  const level = determineTrainingLevel(form, completed, reflection);
  const requestedDays = Number.parseInt(form.days, 10);
  const baseWeeklyWorkouts =
    level === "beginner"
      ? Math.min(Math.max(requestedDays, 2), 3)
      : level === "intermediate"
        ? Math.min(Math.max(requestedDays, 3), 5)
        : Math.min(Math.max(requestedDays, 4), 5);
  const stressHigh = dailyCheckIn.feeling === "Stressed" || form.struggle === "Stress";
  const poorSleep = dailyCheckIn.sleep === "Poor" || form.sleepQuality === "Not great" || reflection.energy === "Lower than usual";
  const lowMotivation = dailyCheckIn.motivation === "Low" || form.struggle === "Low motivation";
  const lowTime = dailyCheckIn.time === "10 minutes";
  const progression = chooseProgressionDecision({
    adherence,
    dailyCheckIn,
    form,
    level,
    poorSleep,
    reflection,
    stressHigh,
  });
  const adaptationMode = chooseAdaptationMode({
    adherence,
    lowMotivation,
    lowTime,
    poorSleep,
    progression,
    stressHigh,
  });
  const weeklyWorkouts =
    adaptationMode === "protect" || adaptationMode === "simplify"
      ? Math.max(2, Math.min(baseWeeklyWorkouts, level === "beginner" ? 2 : 3))
      : adaptationMode === "progress"
        ? Math.min(baseWeeklyWorkouts + (level === "beginner" ? 0 : 1), 5)
        : baseWeeklyWorkouts;
  const planStyle = choosePlanStyle(level, form.goal, weeklyWorkouts);
  const lowEnergy =
    form.struggle === "Low energy" ||
    form.sleepQuality === "Not great" ||
    reflection.energy === "Lower than usual" ||
    dailyCheckIn.feeling === "Tired" ||
    dailyCheckIn.sleep === "Poor";
  const nextAchievableStep = chooseNextAchievableStep({
    adaptationMode,
    dailyCheckIn,
    form,
    adherence,
  });
  const dailyPlan = dailyPlanFor(form, dailyCheckIn, level, adaptationMode, nextAchievableStep, memory);

  return {
    framework: BODY_BY_GIE_FRAMEWORK,
    level,
    weeklyWorkouts,
    planStyle,
    adaptationMode,
    progression,
    dashboardFocus: dashboardFocusFor(form, level),
    workoutTone: workoutToneFor(level, planStyle),
    walkingNudge: walkingNudgeFor(form, adaptationMode),
    missedWorkoutMessage:
      adherence.missedStrength >= 2
        ? `If workouts keep getting missed, we will make the plan smaller and look for the obstacle: ${memory.challenges[0]?.toLowerCase() ?? "real life getting crowded"}.`
        : adherence.missedStrength === 1
          ? "One missed workout is just feedback. Come back with the smallest useful version."
          : lowEnergy
            ? "Let's keep today simple and focus on movement."
            : "You've got a clear next step today. Keep it steady.",
    nextWeekAdjustment: nextWeekAdjustmentFor(reflection, adherence.missedStrength, lowEnergy, adaptationMode, progression),
    dailyMessage: dailyPlan.message,
    nextAchievableStep,
    coachMemory: memory,
    successSignals: successSignalsFor(form, adherence, reflection),
    wins: dailyPlan.wins,
  };
}

function chooseAdaptationMode({
  adherence,
  lowMotivation,
  lowTime,
  poorSleep,
  progression,
  stressHigh,
}: {
  adherence: AdherenceSnapshot;
  lowMotivation: boolean;
  lowTime: boolean;
  poorSleep: boolean;
  progression: ProgressionDecision;
  stressHigh: boolean;
}): CoachingEngine["adaptationMode"] {
  if (progression.action === "deload" || poorSleep || stressHigh) return "protect";
  if (progression.action === "reduce" || progression.action === "simplify") return "simplify";
  if (lowMotivation || lowTime || adherence.consistencyBand === "low" || adherence.missedStrength >= 2) return "simplify";
  if (progression.action === "increase") return "progress";
  return "steady";
}

function chooseProgressionDecision({
  adherence,
  dailyCheckIn,
  form,
  level,
  poorSleep,
  reflection,
  stressHigh,
}: {
  adherence: AdherenceSnapshot;
  dailyCheckIn: DailyCheckIn;
  form: Onboarding;
  level: TrainingLevel;
  poorSleep: boolean;
  reflection: {
    worked: string;
    hard: string;
    adjust: string;
    energy: string;
    consistency: string;
    nextFocus: string;
  };
  stressHigh: boolean;
}): ProgressionDecision {
  const lowEnergy = dailyCheckIn.feeling === "Tired" || reflection.energy === "Lower than usual" || form.struggle === "Low energy";
  const userStruggled = reflection.hard.trim().length > 0 || reflection.adjust.trim().length > 0;
  const completedEasily =
    adherence.completedStrength >= 3 &&
    adherence.missedStrength === 0 &&
    adherence.consistencyBand === "steady" &&
    dailyCheckIn.motivation === "High" &&
    dailyCheckIn.sleep === "Great" &&
    !userStruggled;
  const recoveryDeclined = poorSleep || stressHigh || lowEnergy;
  const repeatedStruggle =
    adherence.missedStrength >= 2 ||
    adherence.consistencyBand === "low" ||
    reflection.consistency === "Hard to get started";
  const trainingEmphasis = trainingEmphasisFor(level);
  const baseRule = "The best plan is not the hardest plan. The best plan is the one the user can sustain.";

  if (recoveryDeclined && (adherence.missedStrength > 0 || reflection.consistency !== "Most days")) {
    return {
      action: "deload",
      difficulty: "lighter",
      reason: "Recovery indicators are down, so this week should feel lighter and more repeatable.",
      trainingEmphasis,
      deloadRecommended: true,
      progressionRule: baseRule,
    };
  }

  if (poorSleep || stressHigh) {
    return {
      action: "maintain",
      difficulty: "baseline",
      reason: "Sleep or stress is not in a good place, so progression waits.",
      trainingEmphasis,
      deloadRecommended: false,
      progressionRule: baseRule,
    };
  }

  if (repeatedStruggle) {
    return {
      action: "reduce",
      difficulty: "lighter",
      reason: "Repeated struggle means the plan should get easier before it gets harder.",
      trainingEmphasis,
      deloadRecommended: adherence.missedStrength >= 2,
      progressionRule: baseRule,
    };
  }

  if (dailyCheckIn.motivation === "Low" || dailyCheckIn.time === "10 minutes") {
    return {
      action: "simplify",
      difficulty: "lighter",
      reason: "Motivation or time is low, so the plan should focus on minimum wins.",
      trainingEmphasis,
      deloadRecommended: false,
      progressionRule: baseRule,
    };
  }

  if (completedEasily && level !== "beginner") {
    return {
      action: "increase",
      difficulty: "slightly harder",
      reason: "Workouts are being completed with good energy, so challenge can rise carefully.",
      trainingEmphasis,
      deloadRecommended: false,
      progressionRule: baseRule,
    };
  }

  if (completedEasily && level === "beginner") {
    return {
      action: "maintain",
      difficulty: "baseline",
      reason: "For beginners, easy completion means confidence is building. Keep practising before adding complexity.",
      trainingEmphasis,
      deloadRecommended: false,
      progressionRule: baseRule,
    };
  }

  return {
    action: "maintain",
    difficulty: "baseline",
    reason: userStruggled
      ? "The user gave feedback that something was hard, so maintain difficulty and adjust support."
      : "The current plan is still useful. Keep building steady progress.",
    trainingEmphasis,
    deloadRecommended: false,
    progressionRule: baseRule,
  };
}

function trainingEmphasisFor(level: TrainingLevel) {
  if (level === "beginner") return "Movement quality, confidence, and habit formation.";
  if (level === "intermediate") return "Progressive overload, strength gains, and muscle development.";
  return "Goal-specific programming and advanced progression.";
}

function dailyPlanFor(
  form: Onboarding,
  dailyCheckIn: DailyCheckIn,
  level: TrainingLevel,
  adaptationMode: CoachingEngine["adaptationMode"],
  nextAchievableStep: string,
  memory: CoachingMemory,
) {
  const lowSleep = dailyCheckIn.sleep === "Poor";
  const lowTime = dailyCheckIn.time === "10 minutes";
  const lowMotivation = dailyCheckIn.motivation === "Low";
  const tired = dailyCheckIn.feeling === "Tired";
  const stressed = dailyCheckIn.feeling === "Stressed";
  const unwell = dailyCheckIn.feeling === "Unwell";
  const highMomentum =
    dailyCheckIn.feeling === "Energised" && dailyCheckIn.sleep === "Great" && dailyCheckIn.motivation === "High";
  const motivationMemory = motivationMemoryFor(form);
  const memoryLine = memory.previousSuccesses.length
    ? `Remember: ${memory.previousSuccesses[0].toLowerCase()} worked for you.`
    : motivationMemory;

  if (adaptationMode === "protect") {
    return {
      message: `A good coach protects the person, not just the plan. ${memoryLine} Today's next achievable step is: ${nextAchievableStep}`,
      wins: {
        gold: "A gentle movement session and a protein-first meal.",
        silver: "A 10-minute walk or stretch.",
        bronze: nextAchievableStep,
      },
    };
  }

  if (adaptationMode === "simplify") {
    return {
      message: `The plan gets smaller so you can keep trusting yourself. ${memory.challenges[0] ? `We know ${memory.challenges[0].toLowerCase()} can get in the way. ` : ""}Start here: ${nextAchievableStep}`,
      wins: {
        gold: "A short minimum win workout.",
        silver: "One round of two simple moves.",
        bronze: nextAchievableStep,
      },
    };
  }

  if (unwell) {
    return {
      message:
        "Your body is asking for care today. Keep the promise tiny, choose comfort, and get qualified help if something feels concerning.",
      wins: {
        gold: "A gentle 10-minute walk or stretch if it feels okay.",
        silver: "Five minutes of easy movement and water.",
        bronze: "Protein with your next meal and permission to rest.",
      },
    };
  }

  if ((tired && lowSleep) || (lowTime && lowMotivation)) {
    return {
      message: `Let's keep today simple. ${motivationMemory} A smaller day can still move you forward.`,
      wins: {
        gold: "A 10-minute minimum win workout.",
        silver: "One round of the first two moves.",
        bronze: "A 5-minute walk and protein with your next meal.",
      },
    };
  }

  if (stressed) {
    return {
      message:
        "Stress does not need a harder plan. Today we will use movement to help you show up, then call that a real win.",
      wins: {
        gold: "A calm 20-minute strength session.",
        silver: "A 10-minute walk or one easy round.",
        bronze: "Step outside for five minutes and choose a protein-first meal.",
      },
    };
  }

  if (lowTime) {
    return {
      message: "Time is tight, so the plan gets smaller. Showing up matters more than doing everything.",
      wins: {
        gold: "A focused 10-minute workout.",
        silver: "Five minutes of squats, wall push-ups, and easy walking.",
        bronze: "Protein first at your next meal.",
      },
    };
  }

  if (highMomentum) {
    return {
      message:
        level === "beginner"
          ? `You've got good momentum today. Use it to practise well, not to rush ahead. Next step: ${nextAchievableStep}`
          : `You've got good momentum today. Add one careful set if the movement still feels steady. Next step: ${nextAchievableStep}`,
      wins: {
        gold: "Your planned workout, plus one careful extra round if it feels good.",
        silver: "The planned workout as written.",
        bronze: "Ten minutes of movement and one steady-energy meal.",
      },
    };
  }

  return {
    message: `${motivationMemory} Today is a normal-life training day: steady, kind, and practical. Next achievable step: ${nextAchievableStep}`,
    wins: {
      gold: "Your planned 20-30 minute workout.",
      silver: "A 10-minute reduced workout.",
      bronze: "A 5-minute walk and protein with your next meal.",
    },
  };
}

function motivationMemoryFor(form: Onboarding) {
  if (form.goal === "Have more energy" || form.struggle === "Low energy") {
    return "You told me energy matters, so we are protecting it while building it.";
  }
  if (form.goal === "Feel stronger") return "You told me strength matters, and strength is built with patience.";
  if (form.goal === "Build consistency") return "You told me consistency matters, so today's win is showing up.";
  if (form.goal === "Improve my health") return "You told me your health matters, and your body is worth caring for.";
  if (form.goal === "Lose body fat") return "You told me gentle progress matters, not extreme restriction.";
  if (form.goal === "Build muscle") return "You told me building muscle matters, so we will pair strength with steady meals.";
  return "Small steps done faithfully still count.";
}

function buildCoachingMemory(
  form: Onboarding,
  reflection: {
    worked: string;
    hard: string;
    adjust: string;
    energy: string;
    consistency: string;
    nextFocus: string;
  },
): CoachingMemory {
  const challenges = [form.struggle, form.sleepQuality === "Not great" ? "Sleep has been difficult" : ""].filter(Boolean);
  const previousStruggles = [reflection.hard, reflection.adjust].filter((item) => item.trim().length > 0);
  const previousSuccesses = [reflection.worked, reflection.consistency === "Most days" ? "Showing up most days" : ""].filter(
    (item) => item.trim().length > 0,
  );

  return {
    goals: [form.goal],
    why: whyFor(form),
    challenges,
    previousStruggles,
    previousSuccesses,
  };
}

function getAdherenceSnapshot(
  completed: Record<string, boolean>,
  reflection: {
    worked: string;
    hard: string;
    adjust: string;
    energy: string;
    consistency: string;
    nextFocus: string;
  },
): AdherenceSnapshot {
  const completedKeys = Object.keys(completed).filter((key) => completed[key]);
  const completedStrength = completedKeys.filter((key) => key.endsWith("-strength")).length;
  const completedWalks = completedKeys.filter((key) => key.endsWith("-walk")).length;
  const completedFood = completedKeys.filter((key) => key.endsWith("-food")).length;
  const missedStrength = countMissedStrength(completed);
  const reflectionDone = [reflection.worked, reflection.hard, reflection.adjust].some((answer) => answer.trim().length > 0);
  const consistencyScore = calculateConsistencyScore(completed, reflection);
  const consistencyBand =
    consistencyScore < 35 || reflection.consistency === "Hard to get started"
      ? "low"
      : consistencyScore >= 70 || reflection.consistency === "Most days"
        ? "steady"
        : "building";

  return {
    completedStrength,
    completedWalks,
    completedFood,
    missedStrength,
    completedHabits: completedKeys.length,
    reflectionDone,
    consistencyScore,
    consistencyBand,
  };
}

function chooseNextAchievableStep({
  adaptationMode,
  adherence,
  dailyCheckIn,
  form,
}: {
  adaptationMode: CoachingEngine["adaptationMode"];
  adherence: AdherenceSnapshot;
  dailyCheckIn: DailyCheckIn;
  form: Onboarding;
}) {
  if (dailyCheckIn.feeling === "Unwell") return "rest, hydrate, and choose protein with your next meal if that feels okay.";
  if (dailyCheckIn.sleep === "Poor") return "take a 5-minute walk and keep the workout easy today.";
  if (dailyCheckIn.feeling === "Stressed") return "use movement to reset: 10 minutes of walking or one calm round.";
  if (dailyCheckIn.time === "10 minutes") return "do the 10-minute version and stop there.";
  if (dailyCheckIn.motivation === "Low") return "complete one tiny promise: protein first or five minutes of movement.";
  if (adherence.consistencyBand === "low") return "repeat the easiest win from this plan before adding anything new.";
  if (adaptationMode === "progress") return "add one careful set or a slightly longer walk, only if the first plan feels steady.";
  if (form.goal === "Have more energy") return "protect energy with a simple workout and a steady meal.";
  if (form.goal === "Feel stronger" || form.goal === "Build muscle") return "practice the first strength move with control.";
  return "show up for the smallest version that still feels honest.";
}

function successSignalsFor(
  form: Onboarding,
  adherence: AdherenceSnapshot,
  reflection: {
    worked: string;
    hard: string;
    adjust: string;
    energy: string;
    consistency: string;
    nextFocus: string;
  },
) {
  const signals = [
    adherence.completedHabits > 0 ? `${adherence.completedHabits} habit steps completed` : "Showing up for one small promise",
    adherence.completedStrength > 0 ? "Strength practice is building" : "Strength starts with learning the basics",
    reflection.energy === "Higher than usual" || form.goal === "Have more energy"
      ? "Energy is part of progress"
      : "Energy is being protected",
    form.goal === "Feel stronger" || form.goal === "Build consistency"
      ? "Confidence grows through repeated wins"
      : "Confidence counts as progress too",
    `${BODY_BY_GIE_FRAMEWORK.successMetrics.join(", ")} matter more than perfection`,
    "The scale is never the only measure of progress",
  ];

  return signals;
}

function decisionLabelFor(adaptationMode: CoachingEngine["adaptationMode"]) {
  if (adaptationMode === "protect") return "protect recovery and reduce pressure.";
  if (adaptationMode === "simplify") return "make the plan smaller so it is easier to repeat.";
  if (adaptationMode === "progress") return "increase challenge gently because consistency is showing up.";
  return "keep the plan steady and sustainable.";
}

function progressionCopyFor(progression: ProgressionDecision) {
  const deload = progression.deloadRecommended ? " A lighter week is recommended." : "";
  return `${progression.reason} ${progression.progressionRule}${deload}`;
}

function determineTrainingLevel(
  form: Onboarding,
  completed: Record<string, boolean>,
  reflection: { consistency: string },
): TrainingLevel {
  const days = Number.parseInt(form.days, 10);
  const completedStrength = Object.keys(completed).filter((key) => key.endsWith("-strength") && completed[key]).length;
  const inconsistent =
    form.trainingExperience === "Completely new" ||
    form.trainingExperience === "I've started and stopped many times" ||
    form.goal === "Build consistency" ||
    form.struggle === "Not knowing what to do" ||
    form.struggle === "Low motivation" ||
    reflection.consistency === "Hard to get started";

  if (inconsistent || days <= 3 || form.activityLevel === "Mostly sitting") return "beginner";
  if (
    form.trainingExperience === "I've trained for years" &&
    days >= 4 &&
    form.activityLevel === "Mostly moving" &&
    completedStrength >= 3
  ) {
    return "advanced";
  }

  return "intermediate";
}

function choosePlanStyle(level: TrainingLevel, goal: string, days: number): CoachingEngine["planStyle"] {
  if (level === "beginner") return "full-body";
  if (level === "advanced") return "specialised";
  if (goal === "Build muscle" && days >= 5) return "push-pull-legs";
  if (days >= 4) return "upper-lower";
  return "full-body";
}

function dashboardFocusFor(form: Onboarding, level: TrainingLevel) {
  if (form.goal === "Lose body fat") {
    return "Strength stays the anchor, and walking helps create momentum without extremes.";
  }
  if (form.goal === "Build muscle") {
    return "We will build strength patiently and give your body enough steady meals to support the work.";
  }
  if (form.goal === "Feel stronger") {
    return "We will make the basic movements feel more familiar before asking for more.";
  }
  if (form.goal === "Have more energy" || form.goal === "Improve my health") {
    return "We will start with a lower workload, better recovery, and steady meals.";
  }
  if (level === "beginner") return "The first win is a routine you can repeat.";
  return "The goal is steady progress without making life feel crowded.";
}

function workoutToneFor(level: TrainingLevel, planStyle: CoachingEngine["planStyle"]) {
  if (level === "beginner") return "We will use simple whole-body sessions, daily walking, and protein-first meals.";
  if (planStyle === "upper-lower") return "Your week alternates upper-body and lower-body focus in a simple way.";
  if (planStyle === "push-pull-legs") return "Your week gives each area enough attention while keeping recovery in mind.";
  if (planStyle === "specialised") return "Your week uses more focused strength practice while still protecting consistency.";
  return "Your week keeps whole-body practice as the foundation.";
}

function walkingNudgeFor(form: Onboarding, adaptationMode: CoachingEngine["adaptationMode"]) {
  if (adaptationMode === "protect") return "Use walking as recovery and a calm reset, not a test.";
  if (adaptationMode === "simplify") return "A short walk is enough to keep the habit alive today.";
  if (adaptationMode === "progress") return "Add a slightly longer walk if energy stays steady.";
  if (form.goal === "Lose body fat") return "Add a short walk most days, especially when energy allows.";
  if (form.goal === "Have more energy" || form.struggle === "Low energy") return "Use easy walks to support energy and keep the habit alive.";
  return "Daily walking keeps the habit alive between strength days.";
}

function countMissedStrength(completed: Record<string, boolean>) {
  return Object.keys(completed).filter((key) => key.endsWith("-missed-strength") && completed[key]).length;
}

function calculateConsistencyScore(
  completed: Record<string, boolean>,
  reflection: {
    worked: string;
    hard: string;
    adjust: string;
    energy: string;
    consistency: string;
    nextFocus: string;
  },
) {
  const missionKeys = Object.keys(completed).filter((key) => completed[key]);
  const strengthDone = missionKeys.filter((key) => key.endsWith("-strength")).length;
  const walkDone = missionKeys.filter((key) => key.endsWith("-walk")).length;
  const foodDone = missionKeys.filter((key) => key.endsWith("-food")).length;
  const reflectionDone = [reflection.worked, reflection.hard, reflection.adjust].some((answer) => answer.trim().length > 0);
  const weeklyFeeling =
    reflection.consistency === "Most days" ? 1 : reflection.consistency === "Some days" ? 0.65 : 0.25;

  const workoutScore = Math.min(strengthDone / 3, 1) * 35;
  const movementScore = Math.min(walkDone / 5, 1) * 25;
  const proteinScore = Math.min(foodDone / 5, 1) * 25;
  const checkInScore = (reflectionDone ? 0.7 : 0) * 15 + (reflectionDone ? weeklyFeeling * 0.3 * 15 : 0);

  return Math.min(100, Math.round(workoutScore + movementScore + proteinScore + checkInScore));
}

function nextWeekAdjustmentFor(
  reflection: {
    worked: string;
    hard: string;
    adjust: string;
    energy: string;
    consistency: string;
    nextFocus: string;
  },
  missedStrength: number,
  lowEnergy: boolean,
  adaptationMode: CoachingEngine["adaptationMode"],
  progression: ProgressionDecision,
) {
  if (progression.action === "deload") {
    return "Next week should be a lighter week: fewer sets, easier walks, and one repeatable strength promise.";
  }
  if (progression.action === "increase") {
    return "Next week can increase carefully: one small challenge, no big jump.";
  }
  if (progression.action === "reduce") {
    return "Next week should reduce challenge until consistency feels reachable again.";
  }
  if (adaptationMode === "protect") {
    return "Next week should protect recovery first: fewer hard decisions, more easy movement, and one repeatable strength promise.";
  }
  if (adaptationMode === "simplify") {
    return "Next week should get simpler before it gets harder. Adherence comes before optimisation.";
  }
  if (adaptationMode === "progress") {
    return "Next week can gently progress: add a little challenge while keeping the plan easy to repeat.";
  }
  if (reflection.consistency === "Hard to get started" || missedStrength >= 2) {
    return "Next week should get smaller: fewer decisions, shorter workouts, and one clear first step.";
  }
  if (lowEnergy || reflection.energy === "Lower than usual") {
    return "Next week should protect energy: keep strength steady, use easier walks, and leave room for rest.";
  }
  if (reflection.consistency === "Most days") {
    return "Next week can stay steady. Progress grows from discipline, grace, and consistency.";
  }
  return "Next week should keep the same foundation and adjust one thing that felt difficult.";
}

function dailyCoachMessage({
  consistencyScore,
  engine,
  form,
  newer,
  strengthDone,
}: {
  consistencyScore: number;
  engine: CoachingEngine;
  form: Onboarding;
  newer: boolean;
  strengthDone: boolean;
}) {
  if (strengthDone) return "Good work. Let that count, then move on with your day.";
  if (form.struggle === "Low energy" || form.sleepQuality === "Not great") {
    return "Let's keep today simple and focus on movement. The smaller version still counts.";
  }
  if (consistencyScore >= 60) {
    return "You've got good momentum today. Let's make the most of it without overdoing it.";
  }
  if (engine.level === "advanced") {
    return "Choose focused effort today, then recover well. Strong progress still needs patience.";
  }
  if (newer) {
    return "Keep this light enough that you finish thinking, I could do that again. That is the kind of win we are looking for.";
  }
  return "Choose a steady pace and leave some energy in the tank. The goal is practice you can trust yourself to repeat.";
}

function createSevenDayPlan(form: Onboarding, engine: CoachingEngine): PlanDay[] {
  const hasWeights = form.equipment.some((item) => item === "Dumbbells" || item === "Gym machines");
  const hasBands = form.equipment.includes("Resistance bands");
  const trainingDays = engine.weeklyWorkouts;
  const strengthSlots = trainingDays >= 5 ? [1, 2, 4, 5, 7] : trainingDays >= 4 ? [1, 3, 5, 7] : trainingDays === 2 ? [1, 4] : [1, 3, 6];
  const isNewer =
    engine.level === "beginner" || form.trainingExperience === "I've started and stopped many times";
  const mainSets =
    engine.progression.action === "deload" || engine.progression.action === "reduce" || engine.adaptationMode === "protect" || engine.adaptationMode === "simplify"
      ? "1-2"
      : engine.progression.action === "increase" && engine.level !== "beginner"
        ? "3-4"
        : engine.level === "advanced"
          ? "4"
          : isNewer
            ? "2"
            : "3";
  const gentleRest =
    engine.progression.action === "deload" || engine.adaptationMode === "protect" || form.sleepQuality === "Not great"
      ? "75-90 sec"
      : "60 sec";
  const strengthTime =
    engine.progression.action === "deload" || engine.progression.action === "reduce" || engine.adaptationMode === "protect" || engine.adaptationMode === "simplify"
      ? "10-18 min"
      : engine.progression.action === "increase"
        ? "24-30 min"
        : "18-24 min";
  const exercises = exerciseLibraryFor(form, hasWeights, hasBands);

  const strengthWorkouts: PlanDay["workout"][] = [
    {
      type: "Strength",
      time: strengthTime,
      moves: [
        move(exercises.squat, mainSets, "6-8", gentleRest, "Sit back slowly, stand tall, and stop before it feels messy."),
        move(exercises.pull, mainSets, "8 each side", gentleRest, "Pull gently and lower with control."),
        move(exercises.hips, "2", "8-10", "45 sec", "Move slowly and stop while it still feels steady."),
      ],
    },
    {
      type: "Strength",
      time: strengthTime,
      moves: [
        move(exercises.press, mainSets, "6-8", gentleRest, "Move slowly. Choose a version that feels calm."),
        move(exercises.hinge, mainSets, "8", gentleRest, "Push your hips back, then stand tall again."),
        move("Easy side hold", "2", "10-20 sec", "45 sec", "Rest on your side and hold a shape you can breathe in."),
      ],
    },
    {
      type: "Strength",
      time: strengthTime,
      moves: [
        move(exercises.squat, mainSets, "6", gentleRest, "Use the same smooth movement each time."),
        move(exercises.pull, mainSets, "6-8", gentleRest, "Keep your shoulders relaxed as you pull."),
        move(exercises.carry, "2", "20-30 sec", "60 sec", "Stand tall and move slowly, or hold still if space is tight."),
      ],
    },
    {
      type: "Strength",
      time: engine.adaptationMode === "progress" ? "20-25 min" : "10-18 min",
      moves: [
        move(exercises.easyLegs, "2", "8", "45 sec", "Use this as practice, not a test."),
        move(exercises.easyPush, "2", "8-10", "45 sec", "Move slowly and keep breathing."),
        move(exercises.step, "2", "6 each side", "60 sec", "Use support if you want it."),
      ],
    },
    {
      type: "Strength",
      time: strengthTime,
      moves: [
        move(exercises.press, mainSets, "6-10", gentleRest, "Keep the movement controlled from start to finish."),
        move(exercises.pull, mainSets, "8-10", gentleRest, "Pull with control and pause before lowering."),
        move(exercises.hinge, mainSets, "8", gentleRest, "Keep this steady and leave energy in reserve."),
      ],
    },
  ];

  let strengthIndex = 0;

  return Array.from({ length: 7 }, (_, index) => {
    const day = index + 1;
    const isStrength = strengthSlots.includes(day);
    const workout = isStrength
      ? strengthWorkouts[strengthIndex++ % strengthWorkouts.length]
      : createLightDay(day);

    return {
      day,
      title: isStrength ? strengthDayTitle(strengthIndex, engine) : day === 7 ? "Review and reset" : "Steady habit day",
      coachLine: coachLineForDay(day, form),
      workout,
      missions: {
        strength: isStrength ? strengthMissionFor(form) : "Do the light movement or stretch.",
        food: foodMissionForDay(day, form),
        water: "Drink one extra glass of water today.",
        walk: "Take a 5-10 minute easy walk, or step outside for air.",
        encouragement: encouragementForDay(day),
      },
    };
  });
}

function exerciseLibraryFor(form: Onboarding, hasWeights: boolean, hasBands: boolean) {
  const gym = form.workoutLocation === "At the gym";
  const hybrid = form.workoutLocation === "Both";
  const gymOk = gym || hybrid;

  return {
    squat: gymOk && form.equipment.includes("Gym machines")
      ? "Leg press or chair squat"
      : hasWeights
        ? "Squat with a weight or chair squat"
        : "Chair squat",
    pull: gymOk && form.equipment.includes("Gym machines")
      ? "Seated row machine"
      : hasWeights
        ? "Supported one-arm pull with a dumbbell"
        : hasBands
          ? "Pull a band toward your ribs"
          : "Pull a towel toward your ribs",
    press: gymOk && form.equipment.includes("Gym machines")
      ? "Chest press machine"
      : hasWeights
        ? "Press dumbbells while lying on the floor"
        : "Hands-on-bench push-up",
    hinge: gymOk && form.equipment.includes("Gym machines")
      ? "Cable pull-through or hip bridge"
      : hasWeights
        ? "Slow bend and stand with dumbbells"
        : "Hip bridge",
    hips: gymOk && form.equipment.includes("Gym machines") ? "Machine leg curl or hip bridge" : "Hip bridge",
    carry: hasWeights ? "Carry weight at your side" : "Tall suitcase hold with a backpack",
    easyLegs: gymOk ? "Supported step-up" : "Sit-to-stand",
    easyPush: gymOk ? "Incline push-up or chest press machine" : "Wall push-up",
    step: gymOk ? "Low step-up" : "Slow step-up",
  };
}

function strengthDayTitle(index: number, engine: CoachingEngine) {
  if (engine.planStyle === "upper-lower") return index % 2 === 0 ? "Lower-body strength" : "Upper-body strength";
  if (engine.planStyle === "push-pull-legs") {
    const names = ["Chest and shoulders", "Back and arms", "Leg strength"];
    return names[(index - 1) % names.length];
  }
  if (engine.planStyle === "specialised") return `Focused strength ${index}`;
  return `Whole-body strength ${index}`;
}

function move(name: string, sets: string, reps: string, rest: string, instruction: string): WorkoutMove {
  return { name, sets, reps, rest, instruction };
}

function createLightDay(day: number): PlanDay["workout"] {
  if (day === 7) {
    return {
      type: "Rest and reset",
      time: "10 min",
      moves: [
        move("Easy walk or gentle stretch", "1", "5-10 min", "As needed", "Move in a way that feels kind today."),
        move("Plan next week", "1", "5 min", "None", "Pick the days that look most realistic."),
      ],
    };
  }

  return {
    type: "Gentle movement",
    time: "10-15 min",
    moves: [
      move("Easy walk", "1", "8-12 min", "As needed", "Walk at a pace where talking still feels easy."),
      move("Shoulder circles", "1", "6 each way", "None", "Move slowly and keep your neck relaxed."),
      move("Gentle sit-to-stand", "1", "6", "None", "Use this as practice, not a test."),
    ],
  };
}

function coachLineForDay(day: number, form: Onboarding) {
  const lines = [
    `Day 1 is just about starting with care.`,
    `Today, make ${form.goal.toLowerCase()} feel doable.`,
    "A small repeatable day still counts.",
    "You are allowed to choose the easier version.",
    "Notice what gives you a little more steadiness.",
    "Keep the promise small and kind.",
    "Look back for clues, then choose one next step.",
  ];

  return lines[day - 1];
}

function strengthMissionFor(form: Onboarding) {
  if (form.healthConsiderations.trim()) {
    return "Do the easiest safe version, or stop after one gentle round.";
  }

  return "Do the workout, or one round if time is tight.";
}

function foodMissionForDay(day: number, form: Onboarding) {
  const missions = [
        form.goal === "Lose body fat" ? "Build one meal protein first, with steady portions." : "Add protein first to one meal.",
    "Add plants or fibre to one meal.",
    "Put smart carbs after protein and plants at one meal.",
    "Swap one sugary snack or drink for a steadier option if that feels okay.",
    "Repeat the easiest meal from earlier this week.",
    "Prep or choose one protein for tomorrow.",
    "Notice which meal kept you satisfied longest.",
  ];

  return missions[day - 1];
}

function encouragementForDay(day: number) {
  const lines = [
    "Small steps done faithfully still count.",
    "Your body is worth caring for.",
    "Strength is built with patience.",
    "Today's goal is stewardship and steady care.",
    "Progress grows from discipline, grace, and consistency.",
    "You are not starting over; you are continuing with wisdom.",
    "Choose one thing to carry into next week with care.",
  ];

  return lines[day - 1];
}
