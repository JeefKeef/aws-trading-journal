import { redirect } from "next/navigation";

export default function FinancialPage() {
  redirect("/screener?tab=Financial");
}
