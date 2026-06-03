import { DashboardSummaryPage } from "@/features/dashboard/components/DashboardSummaryPage";
import { getDashboardSummary } from "@/features/dashboard/lib/dashboard";

export default async function DashboardPage() {
  const { summary, errors } = await getDashboardSummary();

  return <DashboardSummaryPage summary={summary} errors={errors} />;
}
