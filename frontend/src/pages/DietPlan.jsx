import { Sparkles, Flame, Leaf, Heart } from "lucide-react";

const DietPlan = () => {
  const plan = {
    lowGI: [
      "Oats with chia seeds & berries",
      "Quinoa vegetable bowl",
      "Sweet potato & lentil curry",
      "Brown rice with stir-fried veggies"
    ],
    antiInflammatory: [
      "Salmon with turmeric & garlic",
      "Avocado & olive oil salad",
      "Green tea with ginger",
      "Walnuts & almonds"
    ],
    avoid: [
      "Sugary drinks",
      "Refined carbs",
      "Deep-fried foods",
      "Excess dairy"
    ],
    tips: [
      "Eat every 3–4 hours to balance insulin",
      "Pair carbs with protein",
      "Stay hydrated (2–3L water/day)",
      "Sleep impacts insulin sensitivity!"
    ]
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* HEADER */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-green-700 flex items-center justify-center gap-2">
          <Leaf /> Your PCOS-Friendly Diet Plan
        </h1>
        <p className="text-gray-600 mt-2">
          Designed to reduce inflammation & balance hormones 💚
        </p>
      </div>

      {/* HIGHLIGHT CARDS */}
      <div className="grid md:grid-cols-3 gap-6">

        <HighlightCard
          icon={<Sparkles />}
          title="Low Glycemic Index"
          desc="Keeps blood sugar stable & reduces insulin spikes"
          color="from-green-400 to-emerald-500"
        />

        <HighlightCard
          icon={<Flame />}
          title="Anti-Inflammatory"
          desc="Fights chronic inflammation common in PCOS"
          color="from-orange-400 to-pink-500"
        />

        <HighlightCard
          icon={<Heart />}
          title="Hormone Support"
          desc="Supports ovulation, mood & energy levels"
          color="from-pink-400 to-purple-500"
        />
      </div>

      {/* MEAL SECTIONS */}
      <div className="grid md:grid-cols-2 gap-6">

        <DietSection
          title="🥗 Low-GI Meals"
          items={plan.lowGI}
          bg="bg-green-50"
        />

        <DietSection
          title="🔥 Anti-Inflammatory Foods"
          items={plan.antiInflammatory}
          bg="bg-orange-50"
        />

        <DietSection
          title="🚫 Foods to Avoid"
          items={plan.avoid}
          bg="bg-red-50"
        />

        <DietSection
          title="💡 Daily PCOS Tips"
          items={plan.tips}
          bg="bg-blue-50"
        />
      </div>

      {/* MOTIVATION BANNER */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-xl text-center shadow">
        <h3 className="text-xl font-semibold">
          🌸 Consistency beats perfection
        </h3>
        <p className="text-sm mt-1">
          Even small dietary changes can significantly improve PCOS symptoms.
        </p>
      </div>

    </div>
  );
};

export default DietPlan;

/* =========================
   COMPONENTS
========================= */

const HighlightCard = ({ icon, title, desc, color }) => (
  <div className={`bg-gradient-to-r ${color} text-white p-5 rounded-xl shadow`}>
    <div className="flex items-center gap-2 text-lg font-semibold">
      {icon} {title}
    </div>
    <p className="text-sm mt-2 opacity-90">{desc}</p>
  </div>
);

const DietSection = ({ title, items, bg }) => (
  <div className={`${bg} p-5 rounded-xl shadow-sm`}>
    <h3 className="font-semibold mb-3">{title}</h3>
    <ul className="space-y-2 text-sm">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2">
          <span>✔</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);
