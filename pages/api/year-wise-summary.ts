import mongoClient from "@/lib/mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

interface YearlySummary {
  _id: number;
  numOfJobs: number;
  avgSalary: number;
}

type SuccessResponse = YearlySummary[];

interface ErrorResponse {
  error: string;
}

type Data = SuccessResponse | ErrorResponse;

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const client = await mongoClient;
    const db = client.db("main");

    const summary = await db
      .collection("salaries")
      .aggregate([
        {
          $group: {
            _id: "$work_year",
            numOfJobs: { $sum: 1 },
            avgSalary: { $avg: "$salary_in_usd" },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ])
      .toArray();

    res.status(200).json(
      summary.map((doc) => ({
        _id: doc._id,
        numOfJobs: doc.numOfJobs,
        avgSalary: doc.avgSalary,
      }))
    );
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Unable to fetch data" });
  }
}
