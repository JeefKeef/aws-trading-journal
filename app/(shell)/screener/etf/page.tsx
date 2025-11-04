import { redirect } from "next/navigation";

export default function ETFPage() {
  redirect("/screener?tab=ETF");
}
