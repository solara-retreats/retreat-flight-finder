
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const token = process.env.DUFFEL_ACCESS_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: "Chybí nastavení API klíče Duffel." },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);

  const origin = (searchParams.get("origin") || "PRG").toUpperCase();
  const destination = (searchParams.get("destination") || "").toUpperCase();
  const departureDate = searchParams.get("departureDate") || "";
  const returnDate = searchParams.get("returnDate") || "";

  const validIata = /^[A-Z]{3}$/;
  const validDate = /^\d{4}-\d{2}-\d{2}$/;

  if (
    !validIata.test(origin) ||
    !validIata.test(destination) ||
    !validDate.test(departureDate) ||
    !validDate.test(returnDate) ||
    returnDate <= departureDate
  ) {
    return NextResponse.json(
      {
        error:
          "Zadej platná letiště a datum odletu i návratu ve formátu YYYY-MM-DD.",
      },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      "https://api.duffel.com/air/offer_requests",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          "Duffel-Version": "v2",
        },
        body: JSON.stringify({
          data: {
            slices: [
              {
                origin,
                destination,
                departure_date: departureDate,
              },
              {
                origin: destination,
                destination: origin,
                departure_date: returnDate,
              },
            ],
            passengers: [{ type: "adult" }],
            cabin_class: "economy",
            return_offers: true,
          },
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("Duffel API error:", result);

      return NextResponse.json(
        {
          error:
            "Vyhledávání letů se nezdařilo. Zkontroluj data nebo testovací API přístup.",
        },
        { status: response.status >= 400 && response.status < 600
          ? response.status
          : 502 }
      );
    }

    const offers = result.data?.offers || [];

    return NextResponse.json({
      offers: offers.map((offer: {
        id: string;
        total_amount: string;
        total_currency: string;
        slices: Array<{
          duration?: string;
          segments?: Array<{
            origin?: { iata_code?: string };
            destination?: { iata_code?: string };
          }>;
        }>;
      }) => ({
        id: offer.id,
        totalAmount: offer.total_amount,
        currency: offer.total_currency,
        slices: offer.slices,
      })),
      count: offers.length,
      mode: "Duffel test/live account mode depends on API token",
    });
  } catch (error) {
    console.error("Flight search failed:", error);

    return NextResponse.json(
      { error: "Nepodařilo se spojit s API pro vyhledávání letů." },
      { status: 502 }
    );
  }
}
