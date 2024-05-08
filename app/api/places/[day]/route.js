import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(req, { params }) {
  const cookieStore = cookies();
  const dayValue = params.day;
  console.log(dayValue);
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore,
  });

  const res = await supabase.from("Places").select("");
  const filteredData = res.data.filter((item) => {
    return item.start_ts.includes(dayValue);
  });
  return NextResponse.json(filteredData);
}
