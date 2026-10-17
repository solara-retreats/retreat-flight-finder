"use client";

import { useEffect, useState } from "react";

type Flight = {
  priceCzk: number;
  transfers: number;
  returnTransfers: number;
  durationTo: number | null;
  durationBack: number | null;
  departureAt: string;
  returnAt: string;
  airline: string;
};

const EUR_TO_CZK = 24.5;

const MONTHS = [
  { label: "Listopad", value: "2026-11" },
  { label: "Prosinec", value: "2026-12" },
  { label: "Leden", value: "2027-01" },
  { label: "Únor", value: "2027-02" },
  { label: "Březen", value: "2027-03" },
];

const ALL = ["Listopad", "Prosinec", "Leden", "Únor", "Březen"];
const IMAGES: Record<string, string> = {
  "Yoga & Ocean Escape": "/images/tenerife.jpg",
  "Mindful Bali Retreat": "/images/bali.jpg",
  "Sunshine Wellness": "/images/marrakech.jpg",
  "Madeira Yoga & Nature": "/images/madeira.jpg",
  "Costa Rica Wellness Escape": "/images/costarica.jpg",
  "Thailand Island Yoga": "/images/thailand.jpg",
  "Bali Wellness & Meditation": "/images/bali2.jpg",
  "Greek Islands Yoga Escape": "/images/crete.jpg",
  "Morocco Desert Reset": "/images/agafay.jpg",
  "Algarve Ocean Wellness": "/images/algarve.jpg",
};
// Ukázkové (smyšlené) retreaty. flightPrice = orientační cena pro případ výpadku API.
const retreats = [
  {
    name: "Yoga & Ocean Escape",
    location: "Tenerife, Španělsko",
    airport: "TFS",
    flightPrice: 5000,
    type: "Jóga",
    minDays: 7,
    maxDays: 14,
    months: ALL,
    price: 12500,
    description: "Ranní jóga s výhledem na oceán, odpoledne volno na pláži a sopečné túry.",
    image: "",
    color: "from-orange-100 to-rose-100",
    emoji: "🌴",
  },
  {
    name: "Mindful Bali Retreat",
    location: "Ubud, Indonésie",
    airport: "DPS",
    flightPrice: 12000,
    type: "Meditace",
    minDays: 10,
    maxDays: 14,
    months: ALL,
    price: 18500,
    description: "Tichá meditace mezi rýžovými poli, zdravá kuchyně a balijské rituály.",
    image: "",
    color: "from-emerald-100 to-teal-100",
    emoji: "🌿",
  },
  {
    name: "Sunshine Wellness",
    location: "Marrákeš, Maroko",
    airport: "RAK",
    flightPrice: 4500,
    type: "Wellness",
    minDays: 7,
    maxDays: 12,
    months: ALL,
    price: 9800,
    description: "Hammam, masáže a jóga na střešní terase uprostřed marocké medíny.",
    image: "",
    color: "from-amber-100 to-orange-100",
    emoji: "☀️",
  },
  {
    name: "Madeira Yoga & Nature",
    location: "Funchal, Madeira",
    airport: "FNC",
    flightPrice: 6500,
    type: "Jóga",
    minDays: 7,
    maxDays: 10,
    months: ALL,
    price: 14500,
    description: "Jóga v zahradách, procházky podél levád a věčné jaro na ostrově.",
    image: "",
    color: "from-emerald-100 to-teal-100",
    emoji: "🌿",
  },
  {
    name: "Costa Rica Wellness Escape",
    location: "Nosara, Kostarika",
    airport: "LIR",
    flightPrice: 22000,
    type: "Wellness",
    minDays: 10,
    maxDays: 14,
    months: ["Prosinec", "Leden", "Únor", "Březen"],
    price: 16500,
    description: "Surf, jóga v džungli a pura vida na pobřeží Tichého oceánu.",
    image: "",
    color: "from-lime-100 to-green-100",
    emoji: "🌴",
  },
  {
    name: "Thailand Island Yoga",
    location: "Koh Samui, Thajsko",
    airport: "USM",
    flightPrice: 18000,
    type: "Jóga a meditace",
    minDays: 10,
    maxDays: 14,
    months: ALL,
    price: 12000,
    description: "Jóga na pláži pod palmami, thajská masáž a ostrovní klid.",
    image: "",
    color: "from-sky-100 to-cyan-100",
    emoji: "🌊",
  },
  {
    name: "Bali Wellness & Meditation",
    location: "Ubud, Bali",
    airport: "DPS",
    flightPrice: 12500,
    type: "Meditace a wellness",
    minDays: 10,
    maxDays: 14,
    months: ALL,
    price: 15500,
    description: "Zvukové lázně, dechová cvičení a wellness v tropické zahradě.",
    image: "",
    color: "from-orange-100 to-amber-100",
    emoji: "🧘",
  },
  {
    name: "Greek Islands Yoga Escape",
    location: "Chania, Kréta",
    airport: "CHQ",
    flightPrice: 7500,
    type: "Jóga a moře",
    minDays: 7,
    maxDays: 10,
    months: ["Listopad", "Březen"],
    price: 13500,
    description: "Jóga v olivovém háji, středomořská kuchyně a klidné pláže mimo sezónu.",
    image: "",
    color: "from-blue-100 to-indigo-100",
    emoji: "🌊",
  },
  {
    name: "Morocco Desert Reset",
    location: "Agafay, Maroko",
    airport: "RAK",
    flightPrice: 4500,
    type: "Jóga a meditace",
    minDays: 5,
    maxDays: 7,
    months: ALL,
    price: 11000,
    description: "Noci ve stanech pod hvězdami, meditace v kamenné poušti a digitální detox.",
    image: "",
    color: "from-amber-100 to-orange-100",
    emoji: "☀️",
  },
  {
    name: "Algarve Ocean Wellness",
    location: "Lagos, Portugalsko",
    airport: "FAO",
    flightPrice: 6000,
    type: "Wellness a jóga",
    minDays: 7,
    maxDays: 10,
    months: ["Listopad", "Březen"],
    price: 14000,
    description: "Útesy, oceánské procházky a jemná jóga pro zpomalení.",
    image: "",
    color: "from-teal-100 to-cyan-100",
    emoji: "🌊",
  },
];

function formatDuration(minutes: number | null) {
  if (!minutes) return "neznámá";
  return `${Math.floor(minutes / 60)} h ${minutes % 60} min`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("cs-CZ", { day: "numeric", month: "numeric" });
}

function formatTransfers(n: number) {
  if (n === 0) return "přímý let";
  if (n === 1) return "1 přestup";
  if (n < 5) return `${n} přestupy`;
  return `${n} přestupů`;
}

export default function Home() {
  const [month, setMonth] = useState("2026-11");
  const [searchedMonth, setSearchedMonth] = useState("2026-11");
  const [days, setDays] = useState("any");
  const [maxFlight, setMaxFlight] = useState("unlimited");
  const [sort, setSort] = useState("price");
  const [flights, setFlights] = useState<Record<string, Flight | null>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function searchFlights(selectedMonth: string) {
    setLoading(true);
    setError("");
    const airports = Array.from(new Set(retreats.map((r) => r.airport)));
    let failed = 0;

    const entries = await Promise.all(
      airports.map(async (code) => {
        try {
          const res = await fetch(
            `/api/flights?origin=PRG&destination=${code}&month=${selectedMonth}`
          );
          const data = await res.json();
          if (!res.ok) {
            failed++;
            return [code, null] as const;
          }
          return [code, data.found ? (data as Flight) : null] as const;
        } catch {
          failed++;
          return [code, null] as const;
        }
      })
    );

    setFlights(Object.fromEntries(entries));
    setSearchedMonth(selectedMonth);
    if (failed === airports.length) {
      setError(
        "Nepodařilo se načíst aktuální letenky. Zkus to prosím za chvíli znovu. Zatím ukazujeme orientační ceny."
      );
    }
    setLoading(false);
  }

  useEffect(() => {
    searchFlights("2026-11");
  }, []);

  const apiFailed = error !== "";
  const monthLabel = MONTHS.find((m) => m.value === searchedMonth)?.label ?? "";

  const results = retreats
    .map((r) => {
      const flight = flights[r.airport] ?? null;
      const flightPrice = flight ? flight.priceCzk : apiFailed ? r.flightPrice : null;
      const total = flightPrice !== null ? r.price + flightPrice : null;
      return { ...r, flight, flightPrice, total };
    })
    .filter((r) => r.months.includes(monthLabel))
    .filter((r) => days === "any" || (Number(days) >= r.minDays && Number(days) <= r.maxDays))
    .filter(
      (r) =>
        maxFlight === "unlimited" ||
        (r.flightPrice !== null && r.flightPrice <= Number(maxFlight))
    )
    .sort((a, b) => {
      if (sort === "duration") {
        return (a.flight?.durationTo ?? Infinity) - (b.flight?.durationTo ?? Infinity);
      }
      return (a.total ?? Infinity) - (b.total ?? Infinity);
    });

  return (
    <main className="min-h-screen bg-[#faf8f4] text-[#253b32]">
      <header className="flex items-center justify-between border-b border-[#e7e1d7] px-6 py-5 md:px-12">
        <a href="#" className="text-xl font-semibold tracking-tight">
          elsewhere<span className="text-[#bd805d]">.</span>
        </a>
        <span className="hidden text-xs uppercase tracking-[0.2em] text-[#7a8278] sm:block">
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
            kde <span className="font-serif italic text-[#bd805d]">znovu</span> nadechneš.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-[#6f786f] md:text-lg">
            Retreat, letenka a celková cena na jednom místě. Méně plánování. Více času pro sebe.
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
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm text-[#69736b]">
            Délka pobytu
            <select
              value={days}
              onChange={(e) => setDays(e.target.value)}
              className="mt-2 w-full rounded-lg border border-[#e7e1d7] bg-[#faf8f4] p-3 text-base text-[#253b32]"
            >
              <option value="any">Libovolná</option>
              <option value="7">7 dní</option>
              <option value="10">10 dní</option>
              <option value="12">12 dní</option>
              <option value="14">14 dní</option>
            </select>
          </label>

          <label className="text-sm text-[#69736b]">
            Max. cena letenky
            <select
              value={maxFlight}
              onChange={(e) => setMaxFlight(e.target.value)}
              className="mt-2 w-full rounded-lg border border-[#e7e1d7] bg-[#faf8f4] p-3 text-base text-[#253b32]"
            >
              <option value="6000">Do 6 000 Kč</option>
              <option value="10000">Do 10 000 Kč</option>
              <option value="14000">Do 14 000 Kč</option>
              <option value="18000">Do 18 000 Kč</option>
              <option value="unlimited">Bez omezení</option>
            </select>
          </label>

          <button
            onClick={() => searchFlights(month)}
            disabled={loading}
            className="rounded-lg bg-[#253b32] px-5 py-4 font-medium text-white transition hover:bg-[#365447] disabled:opacity-60 md:col-span-4"
          >
            {loading ? "Hledám letenky…" : "Najít svůj retreat →"}
          </button>
        </div>

        {error && (
          <p className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p>
        )}

        <div className="mb-6 mt-14 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#bd805d]">TVŮJ VÝBĚR</p>
            <h2 className="mt-2 text-2xl font-medium md:text-3xl">Místa, která stojí za cestu</h2>
            <p className="mt-2 text-sm text-[#7a8278]">
              {monthLabel} · odlet z Prahy · zpáteční letenka
            </p>
          </div>

          <label className="text-sm text-[#69736b]">
            Seřadit podle{" "}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="ml-2 rounded-lg border border-[#e7e1d7] bg-white p-2 text-[#253b32]"
            >
              <option value="price">Celkové ceny</option>
              <option value="duration">Délky cesty</option>
            </select>
          </label>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 animate-pulse rounded-2xl border border-[#e7e1d7] bg-white" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="rounded-2xl border border-[#e7e1d7] bg-white p-8 text-center">
            <p className="text-lg font-medium">Pro tohle zadání jsme nic nenašli</p>
            <p className="mt-2 text-sm text-[#7a8278]">
              Zkus zvýšit max. cenu letenky, zvolit „Libovolná“ délku pobytu nebo jiný měsíc.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {results.map((r) => (
              <article
                key={r.name}
                className="overflow-hidden rounded-2xl border border-[#e7e1d7] bg-white transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className={`flex h-48 items-center justify-center bg-gradient-to-br ${r.color}`}>
                  {IMAGES[r.name] ? (
                    <img src={IMAGES[r.name]} alt={r.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-7xl" role="img" aria-label={r.type}>
                      {r.emoji}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <span className="rounded-full bg-[#f5eee6] px-3 py-1 text-xs text-[#98694f]">
                    {r.type}
                  </span>
                  <h3 className="mt-4 text-xl font-medium">{r.name}</h3>
                  <p className="mt-1 text-sm text-[#7a8278]">
                    {r.location} · letiště {r.airport}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-[#69736b]">{r.description}</p>
                  <p className="mt-2 text-xs text-[#9a9d95]">
                    Pobyt {r.minDays}–{r.maxDays} dní · termíny: {r.months.join(", ").toLowerCase()}
                  </p>

                  <div className="mt-4 space-y-1 border-t border-[#eee8df] pt-4 text-sm">
                    <p className="flex justify-between">
                      <span className="text-[#69736b]">Retreat</span>
                      <span>{r.price.toLocaleString("cs-CZ")} Kč</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-[#69736b]">
                        Letenka {r.flight ? "" : apiFailed ? "(orientačně)" : ""}
                      </span>
                      <span>
                        {r.flightPrice !== null
                          ? `${r.flightPrice.toLocaleString("cs-CZ")} Kč`
                          : "nenalezena"}
                      </span>
                    </p>
                    <p className="flex justify-between pt-2 text-lg font-semibold">
                      <span>Celkem</span>
                      <span>{r.total !== null ? `${r.total.toLocaleString("cs-CZ")} Kč` : "–"}</span>
                    </p>
                  </div>

                  {r.flight ? (
                    <p className="mt-3 text-xs leading-5 text-[#7a8278]">
                      ✈️ Cesta tam {formatDuration(r.flight.durationTo)} ·{" "}
                      {formatTransfers(r.flight.transfers)} · zpět{" "}
                      {formatTransfers(r.flight.returnTransfers)}
                      <br />
                      Odlet {formatDate(r.flight.departureAt)}, návrat {formatDate(r.flight.returnAt)}
                    </p>
                  ) : (
                    !apiFailed && (
                      <p className="mt-3 text-xs text-[#7a8278]">
                        Pro tento měsíc jsme letenku nenašli. Zkus jiný měsíc.
                      </p>
                    )
                  )}

                  <p className="mt-4 text-xs text-[#9a9d95]">Ukázkový (smyšlený) retreat.</p>
                </div>
              </article>
            ))}
          </div>
        )}

        <footer className="mt-16 border-t border-[#e7e1d7] pt-6 text-center text-xs leading-6 text-[#8a9087]">
          <p>elsewhere. — Najdi si čas pro sebe.</p>
          <p>
            Ceny letenek: Travelpayouts (Aviasales), nejlevnější zpáteční let v měsíci z
            nedávných vyhledávání. Skutečná cena se může lišit.
          </p>
          <p>Přepočet měny: 1 EUR = {EUR_TO_CZK} Kč (orientační kurz). Retreaty jsou ukázkové.</p>
        </footer>
      </section>
    </main>
  );
}