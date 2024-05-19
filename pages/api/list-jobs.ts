import mongoClient from "@/lib/mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

interface JobDetails {
  job_title: string;
  job_count: number;
  salary: number;
}

type SuccessResponse = JobDetails[];

interface ErrorResponse {
  error: string;
}

type Data = SuccessResponse | ErrorResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const year = req.query.year as string;

    const client = await mongoClient;
    const db = client.db("main");

    const data = await db
      .collection("salaries")
      .aggregate([
        {
          $match: {
            work_year: parseInt(year),
          },
        },
        {
          $group: {
            _id: "$job_title",
            count: { $sum: 1 },
            avgSalary: { $avg: "$salary_in_usd" },
          },
        },
      ])
      .toArray();

    res.status(200).json(
      data.map((doc) => {
        return {
          job_title: doc._id,
          salary: doc.avgSalary,
          job_count: doc.count,
        };
      })
    );
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Unable to fetch data" });
  }
}
