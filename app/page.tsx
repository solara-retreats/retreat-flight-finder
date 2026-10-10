
"use client";

import { useState } from "react";

const retreats = [
  {
    name: "Yoga & Ocean Escape",
    location: "Tenerife, Španělsko",
    airport: "TFS",
    flightPrice: 5000,
    type: "Jóga",
    duration: "7–14 dní",
    price: 12500,
    color: "from-orange-100 to-rose-100",
    emoji: "🌴",
  },
  {
    name: "Mindful Bali Retreat",
    location: "Ubud, Indonésie",
    airport: "DPS",
    flightPrice: 12000,
    type: "Meditace",
    duration: "10–14 dní",
    price: 18500,
    color: "from-emerald-100 to-teal-100",
    emoji: "🌿",
  },
  {
    name: "Sunshine Wellness",
    location: "Marrákeš, Maroko",
    airport: "RAK",
    flightPrice: 4500,
    type: "Wellness",
    duration: "7–12 dní",
    price: 9800,
    color: "from-amber-100 to-orange-100",
    emoji: "☀️",
  },
];

export default function Home() {
  const [month, setMonth] = useState("Listopad");
  const [days, setDays] = useState("12");
  const [budget, setBudget] = useState("32000");
  const [sort, setSort] = useState("price");
  const [searched, setSearched] = useState(false);

  const results = retreats
    .filter((retreat) => retreat.price + retreat.flightPrice <= Number(budget || 0))
    .sort((a, b) =>
      sort === "price"
        ? a.price - b.price
        : Number(a.duration.split("-")[0]) -
          Number(b.duration.split("-")[0])
    );

  return (
    <main className="min-h-screen bg-[#faf8f4] text-[#253b32]">
      <header className="flex items-center justify-between border-b border-[#e7e1d7] px-6 py-5 md:px-12">
        <a href="#" className="text-xl font-semibold tracking-tight">
          elsewhere<span className="text-[#bd805d]">.</span>
        </a>
        <span className="text-xs uppercase tracking-[0.2em] text-[#7a8278]">
          Your journey to yourself
        </span>
      </header>

      <section className="mx-auto max-w-6xl px-5 pb-16 pt-14 md:px-10 md:pt-20">
        <div className="max-w-3xl">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-[#bd805d]">
            CESTA ZA SLUNCEM ZAČÍNÁ TADY
          </p>
          <h1 className="text-4xl font-medium leading-tight tracking-tight md:text-6xl">
            Najdi místo,
            <br />
            kde <span className="font-serif italic text-[#bd805d]">znovu</span>{" "}
            nadechneš.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-[#6f786f] md:text-lg">
            Retreat, letenka a celková cena na jednom místě.
            Méně plánování. Více času pro sebe.
          </p>
        </div>

        <div className="mt-10 grid gap-4 rounded-2xl border border-[#e7e1d7] bg-white p-5 shadow-sm md:grid-cols-4 md:p-6">
          <label className="text-sm text-[#69736b]">
            Odkud poletíš?
            <select
              className="mt-2 w-full rounded-lg border border-[#e7e1d7] bg-[#faf8f4] p-3 text-base text-[#253b32]"
              defaultValue="PRG"
            >
              <option value="PRG">Praha (PRG)</option>
            </select>
          </label>

          <label className="text-sm text-[#69736b]">
            Kdy chceš vyrazit?
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="mt-2 w-full rounded-lg border border-[#e7e1d7] bg-[#faf8f4] p-3 text-base text-[#253b32]"
            >
              {["Listopad", "Prosinec", "Leden", "Únor", "Březen"].map(
                (m) => (
                  <option key={m}>{m}</option>
                )
              )}
            </select>
          </label>

          <label className="text-sm text-[#69736b]">
            Délka pobytu
            <select
              value={days}
              onChange={(e) => setDays(e.target.value)}
              className="mt-2 w-full rounded-lg border border-[#e7e1d7] bg-[#faf8f4] p-3 text-base text-[#253b32]"
            >
              <option value="10">10 dní</option>
              <option value="12">12 dní</option>
              <option value="14">14 dní</option>
            </select>
          </label>

          <label className="text-sm text-[#69736b]">
            Rozpočet na letenku
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="mt-2 w-full rounded-lg border border-[#e7e1d7] bg-[#faf8f4] p-3 text-base text-[#253b32]"
            >
              <option value="10000">Do 10 000 Kč</option>
              <option value="14000">Do 14 000 Kč</option>
              <option value="18000">Do 18 000 Kč</option>
              <option value="32000">Do 32 000 Kč</option>
            </select>
          </label>

          <button
            onClick={() => setSearched(true)}
            className="rounded-lg bg-[#253b32] px-5 py-4 font-medium text-white transition hover:bg-[#365447] md:col-span-4"
          >
            Najít svůj retreat →
          </button>
        </div>

        <div className="mb-6 mt-14 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#bd805d]">
              TVŮJ VÝBĚR
            </p>
            <h2 className="mt-2 text-2xl font-medium md:text-3xl">
              Místa, která stojí za cestu
            </h2>
            <p className="mt-2 text-sm text-[#7a8278]">
              {searched
                ? `${month} · ${days} dní · Praha`
                : "Inspirace pro tvůj příští únik do tepla"}
            </p>
          </div>

          <label className="text-sm text-[#69736b]">
            Seřadit podle{" "}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="ml-2 rounded-lg border border-[#e7e1d7] bg-white p-2 text-[#253b32]"
            >
              <option value="price">Ceny pobytu</option>
              <option value="duration">Délky pobytu</option>
            </select>
          </label>
        </div>

        {results.length === 0 ? (
          <div className="rounded-2xl border border-[#e7e1d7] bg-white p-8 text-center">
            <p className="text-lg font-medium">Zkusíme najít jinou cestu?</p>
            <p className="mt-2 text-sm text-[#7a8278]">
              Pro zadaný rozpočet nemáme ukázkový retreat. Zkus vyšší rozpočet.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {results.map((retreat) => (
              <article
                key={retreat.name}
                className="overflow-hidden rounded-2xl border border-[#e7e1d7] bg-white transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className={`flex h-48 items-center justify-center bg-gradient-to-br ${retreat.color}`}
                >
                  <span className="text-7xl" role="img" aria-label={retreat.type}>
                    {retreat.emoji}
                  </span>
                </div>
                <div className="p-5">
                  <span className="rounded-full bg-[#f5eee6] px-3 py-1 text-xs text-[#98694f]">
                    {retreat.type}
                  </span>
                  <h3 className="mt-4 text-xl font-medium">{retreat.name}</h3>
                  <p className="mt-2 text-sm text-[#7a8278]">
                    {retreat.location} · letiště {retreat.airport}
                  </p>
                  <p className="mt-4 text-sm text-[#69736b]">
  Cena retreatu
</p>
<p className="mt-1 text-2xl font-semibold">
  {retreat.price.toLocaleString("cs-CZ")} Kč
</p>
<p className="mt-2 text-sm text-[#69736b]">
  Orientační cena letenky
</p>
<p className="text-lg font-medium">
  {retreat.flightPrice.toLocaleString("cs-CZ")} Kč
</p>
<p className="mt-2 text-sm font-semibold text-[#253b32]">
  Celkem za cestu: {(retreat.price + retreat.flightPrice).toLocaleString("cs-CZ")} Kč
</p>
                 
                  <p className="mt-2 text-xs text-[#9a9d95]">
                    Orientační délka: {retreat.duration}
                  </p>
                  <p className="mt-4 border-t border-[#eee8df] pt-4 text-xs leading-5 text-[#9a9d95]">
                    Ukázkový retreat · cena nezahrnuje letenku.
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}

        <footer className="mt-16 border-t border-[#e7e1d7] pt-6 text-center text-xs leading-6 text-[#8a9087]">
          <p>elsewhere. — Najdi si čas pro sebe.</p>
          <p>
            Ceny a retreaty jsou zatím ukázkové. Živé vyhledávání letenek
            doplníme v dalším kroku.
          </p>
        </footer>
      </section>
    </main>
  );
}
