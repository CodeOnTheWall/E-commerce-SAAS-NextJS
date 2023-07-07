// used to connect to to a prisma db
import { PrismaClient } from "@prisma/client";

// all this from prisma docs on using prisma with nextjs

declare global {
  // var prisma is type PrismaClient or undefined
  var prisma: PrismaClient | undefined;
}

// if prisma global variable is undefined, then make new PrismaClient
const prismadb = globalThis.prisma || new PrismaClient();
// if we are in dev
if (process.env.NODE_ENV !== "production") globalThis.prisma = prismadb;

export default prismadb;
