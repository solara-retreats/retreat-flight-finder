import { NextResponse } from "next/server";

// Orientační kurz pro přepočet EUR → Kč (uveden i na webu a v README)
const EUR_TO_CZK = 24.5;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const origin = (searchParams.get("origin") || "PRG").toUpperCase();
  const destination = (searchParams.get("destination") || "").toUpperCase();
  const month = searchParams.get("month") || "";

  // Kontrola vstupu, aby appka nespadla na špatných datech
  if (!/^[A-Z]{3}$/.test(origin) || !/^[A-Z]{3}$/.test(destination)) {
    return NextResponse.json({ error: "Neplatný kód letiště" }, { status: 400 });
  }
  if (!/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json({ error: "Neplatný měsíc" }, { status: 400 });
  }

  const token = process.env.TRAVELPAYOUTS_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "Chybí API token" }, { status: 500 });
  }

  const url =
    "https://api.travelpayouts.com/aviasales/v3/prices_for_dates" +
    `?origin=${origin}&destination=${destination}&departure_at=${month}` +
    "&one_way=false&currency=eur&sorting=price&limit=1";

  try {
    const res = await fetch(url, {
      headers: { "X-Access-Token": token },
      next: { revalidate: 3600 }, // výsledek si pamatujeme 1 hodinu
    });

    if (!res.ok) {
      return NextResponse.json({ error: "API letenek neodpovídá" }, { status: 502 });
    }

    const json = await res.json();
    const flight = json?.data?.[0];

    if (!flight) {
      return NextResponse.json({ found: false });
    }

    return NextResponse.json({
      found: true,
      priceCzk: Math.round(flight.price * EUR_TO_CZK),
      priceEur: flight.price,
      rate: EUR_TO_CZK,
      transfers: flight.transfers ?? 0,
      returnTransfers: flight.return_transfers ?? 0,
      durationTo: flight.duration_to ?? null,
      durationBack: flight.duration_back ?? null,
      departureAt: flight.departure_at,
      returnAt: flight.return_at,
      airline: flight.airline,
    });
  } catch {
    return NextResponse.json({ error: "Chyba při načítání letenek" }, { status: 502 });
  }
}