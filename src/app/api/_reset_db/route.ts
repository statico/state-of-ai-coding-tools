import { recreateDb } from "@/server/db";
import { migrate } from "@/server/db/migrate";
import { __TEST__ } from "@/server/env";
import { NextResponse } from "next/server";

export async function GET() {
  // Only allow this route in test mode
  if (!__TEST__) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    // Recreate the database connection
    recreateDb();

    // Run migrations to set up the schema
    await migrate();

    return NextResponse.json({
      success: true,
      message: "Database reset successfully",
    });
  } catch (error) {
    console.error("Failed to reset database:", error);
    return NextResponse.json(
      { error: "Failed to reset database", details: String(error) },
      { status: 500 },
    );
  }
}
