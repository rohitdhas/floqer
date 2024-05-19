import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";

interface JobDetails {
  job_title: string;
  job_count: number;
  salary: number;
}

type Props = {
  selectedYear: number | undefined;
};

export default function JobList(props: Props) {
  const toastRef = useRef<Toast>(null);
  const [data, setData] = useState<JobDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/list-jobs?year=${props.selectedYear}`)
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
  }, [props]);

  if (!props.selectedYear) return <></>;

  return (
    <div className="flex justify-center">
      <DataTable
        paginator
        rows={10}
        loading={isLoading}
        rowsPerPageOptions={[10, 25, 50]}
        showGridlines
        value={data}
        tableStyle={{ minWidth: "50rem" }}
        className="w-full"
      >
        <Column sortable field="job_title" header="Job Title"></Column>
        <Column sortable field="job_count" header="No. of Jobs"></Column>
        <Column
          sortable
          field="salary"
          header="Avg. Salary (USD)"
          body={(data: JobDetails) => {
            return new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(data.salary);
          }}
        ></Column>
      </DataTable>
      <Toast ref={toastRef} />
    </div>
  );
}
