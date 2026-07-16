import { NextResponse } from "next/server";
import { getCategories } from "@/lib/catalog";

export async function GET() {
  try {
    const list = await getCategories();
    return NextResponse.json(list);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to load categories.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
