import YearWiseSummaryCharts from "@/components/charts/year-wise-summary-chart";
import YearWiseSummaryList from "@/components/lists/year-wise-summary-list";

export default function Home() {
  return (
    <main className="lg:w-[70%] mx-auto">
      <h1 className="text-2xl font-bold">📊 Dashboard</h1>
      <YearWiseSummaryCharts />
      <YearWiseSummaryList />
    </main>
  );
}
