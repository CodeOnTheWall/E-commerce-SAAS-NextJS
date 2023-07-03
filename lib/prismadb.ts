import { PrismaClient } from "@prisma/client";

declare global {
  // var prisma is type pf PrismaClient or undefined
  var prisma: PrismaClient | undefined;
}

const prismadb = globalThis.prisma || new PrismaClient();
// if we are in dev
if (process.env.NODE_ENV !== "production") globalThis.prisma = prismadb;

export default prismadb;
