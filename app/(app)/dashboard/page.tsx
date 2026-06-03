import { DashboardSummaryPage } from "@/features/dashboard/components/DashboardSummaryPage";
import { getDashboardSummary } from "@/features/dashboard/lib/dashboard";

export default async function DashboardPage() {
  const { charts, summary, errors } = await getDashboardSummary();

  return <DashboardSummaryPage charts={charts} summary={summary} errors={errors} />;
}
