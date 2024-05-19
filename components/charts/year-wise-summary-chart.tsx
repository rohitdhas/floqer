import { Chart } from "primereact/chart";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import Card from "../misc/Card";

interface YearlySummary {
  _id: number;
  numOfJobs: number;
  avgSalary: number;
}

export default function YearWiseSummaryCharts() {
  const toastRef = useRef<Toast>(null);
  const [rawData, setRawData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [numOfJobsChartData, setNumOfJobsChartData] = useState({});
  const [numOfJobsChartOptions, setNumOfJobsChartOptions] = useState({});

  const [avgSalaryChartData, setAvgSalaryChartData] = useState({});
  const [avgSalaryChartOptions, setAvgSalaryChartOptions] = useState({});

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/year-wise-summary")
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false);
        setRawData(data);
      })
      .catch((e) => {
        if (toastRef.current) {
          toastRef.current.show({
            severity: "error",
            summary: "Error",
            detail: "Something went wrong!",
            life: 3000,
          });
        }

        console.error(e);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColorSecondary = documentStyle.getPropertyValue(
      "--text-color-secondary"
    );
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

    const numOfJobsChartData = {
      labels: rawData.map((d: YearlySummary) => d._id),
      datasets: [
        {
          label: "Jobs",
          data: rawData.map((d: YearlySummary) => d.numOfJobs),
          fill: false,
          borderColor: documentStyle.getPropertyValue("--blue-500"),
          tension: 0.4,
        },
      ],
    };

    const avgSalaryChartData = {
      labels: rawData.map((d: YearlySummary) => d._id),
      datasets: [
        {
          label: "Avg. Salary",
          data: rawData.map((d: YearlySummary) => d.avgSalary),
          fill: false,
          borderColor: documentStyle.getPropertyValue("--green-500"),
          tension: 0.4,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
      },
    };

    const avgSalaryOptions = {
      ...options,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context: any) {
              let label = context.dataset.label || "";

              if (label) {
                label += ": ";
              }
              if (context.parsed.y !== null) {
                label += new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(context.parsed.y);
              }
              return label;
            },
          },
        },
      },
    };

    setNumOfJobsChartData(numOfJobsChartData);
    setNumOfJobsChartOptions(options);

    setAvgSalaryChartData(avgSalaryChartData);
    setAvgSalaryChartOptions(avgSalaryOptions);
  }, [rawData]);

  return (
    <div className="flex justify-between items-center flex-wrap">
      <Card title="👨🏻‍💼 Jobs Per Year" className="mr-2">
        {isLoading ? (
          <Skeleton width="100%" height="300px"></Skeleton>
        ) : (
          <Chart
            type="line"
            data={numOfJobsChartData}
            options={numOfJobsChartOptions}
            className="h-[300px]"
          />
        )}
      </Card>

      <Card title="💶 Avg. Salary Per Year (USD)">
        {isLoading ? (
          <Skeleton width="100%" height="300px"></Skeleton>
        ) : (
          <Chart
            type="line"
            data={avgSalaryChartData}
            options={avgSalaryChartOptions}
            className="h-[300px]"
          />
        )}
      </Card>
      <Toast ref={toastRef} />
    </div>
  );
}
