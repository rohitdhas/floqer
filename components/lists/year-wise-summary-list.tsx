import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Sidebar } from "primereact/sidebar";
import { Toast } from "primereact/toast";
import React from "react";
import Card from "../misc/Card";
import JobList from "./job-list";

interface YearlySummary {
  _id: number;
  numOfJobs: number;
  avgSalary: number;
}

export default function YearWiseSummaryList() {
  const toastRef = React.useRef<Toast>(null);
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<YearlySummary | null>(
    null
  );
  const [sidebarVisible, setSidebarVisible] = React.useState(false);

  React.useEffect(() => {
    setIsLoading(true);
    fetch("/api/year-wise-summary")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setIsLoading(false);
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

  return (
    <div>
      <Card title="📄 Jobs Summary">
        <DataTable
          selectionMode="single"
          selection={selectedRow}
          loading={isLoading}
          onSelectionChange={(e: any) => {
            setSelectedRow(e.value);
            setSidebarVisible(true);
          }}
          showGridlines
          value={data}
          tableStyle={{ minWidth: "50rem" }}
          className="w-full"
        >
          <Column sortable field="_id" header="Year"></Column>
          <Column sortable field="numOfJobs" header="Number of Jobs"></Column>
          <Column
            sortable
            field="avgSalary"
            header="Avg. Salary (USD)"
            body={(data: YearlySummary) => {
              return new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(data.avgSalary);
            }}
          ></Column>
        </DataTable>
      </Card>
      <Sidebar
        visible={sidebarVisible}
        position="right"
        className="w-screen md:w-[70vw]"
        onHide={() => {
          setSidebarVisible(false);
          setSelectedRow(null);
        }}
      >
        <h3>👨🏻‍💼 {selectedRow?._id} Job Details</h3>
        <JobList selectedYear={selectedRow?._id} />
      </Sidebar>
      <Toast ref={toastRef} />
    </div>
  );
}
