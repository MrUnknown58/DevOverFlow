import { NextResponse } from "next/server";
export const GET = async (req: Request) => {
  //   console.log(req.url);
  // const ip = req.headers..get("x-forwarded-for") || req.connection.remoteAddress;
  const ip =
    req.headers.get("x-forwarded-for") === "::1"
      ? "121.0.0.1"
      : req.headers.get("x-forwarded-for");
  console.log(ip);
  const loc = await fetch(`https://ipapi.co/${ip}/json/`);
  const res = await loc.json();
  console.log("Logging Location here: ", res);
  //   const geo = geoip.lookup(ip);
  //   return NextResponse.json(geo);
  return NextResponse.json({ country_name: res?.country_name || "India" });
};
