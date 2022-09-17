import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const todouhukenCreateInput: Prisma.todouhukenCreateInput[] = [
  { id: 40, name: "福岡" },
  { id: 41, name: "佐賀" },
  { id: 42, name: "長崎" },
  { id: 43, name: "熊本" },
  { id: 44, name: "大分" },
  { id: 45, name: "宮崎" },
  { id: 46, name: "鹿児島" },
  { id: 47, name: "沖縄" },
];

const main = async () => {
  console.log("初期データの投入を開始します。");
  await prisma.$transaction(
    todouhukenCreateInput.map((input) =>
      prisma.todouhuken.upsert({
        where: { id: input.id },
        update: {},
        create: input,
      })
    )
  );
  console.log("初期データの投入が完了しました。");
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
