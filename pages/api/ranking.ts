import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

type Data = {
  result?: unknown;
  error?: string;
};

interface Request extends NextApiRequest {
  body: {
    name?: string;
    rank?: number;
    todouhukenId?: number;
  };
}

export default async function handler(req: Request, res: NextApiResponse<Data>) {
  switch (req.method) {
    case "GET":
      // GETなら全件取得
      const getResult = await prisma.ranking.findMany({
        select: {
          name: true,
          todouhuken: {
            select: {
              name: true,
            },
          },
          rank: true,
        },
      });
      res.status(200).json({ result: getResult });
      return;

    case "POST":
      // POSTならランキング名と都道府県IDに基づいて更新
      const { name, rank, todouhukenId } = req.body;
      if (!name || !rank || !todouhukenId) {
        res.status(400).json({ error: "Bad Request" });
        return;
      }
      const postResult = await prisma.ranking.upsert({
        where: {
          name_todouhukenId: { name, todouhukenId },
        },
        update: { name, rank },
        create: {
          name,
          rank,
          todouhuken: {
            connect: { id: todouhukenId },
          },
        },
      });
      res.status(200).json({ result: postResult });
      return;

    case "DELETE":
      // DELETEならランキング全削除
      const deleteResult = await prisma.ranking.deleteMany();
      res.status(200).json({ result: deleteResult });
      return;

    default:
      res.status(405).end();
      return;
  }
}
