import { redirect } from "next/navigation";

export default function TechnicalPage() {
  redirect("/screener?tab=Technical");
}
