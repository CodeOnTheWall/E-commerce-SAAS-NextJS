import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

import { NextResponse } from "next/server";

// api for getting all sizes
// add in middleware file to allow public req
export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    // finding the sizes that belong to the storeId
    const sizes = await prismadb.size.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(sizes);
  } catch (error) {
    console.log("[SIZES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// api for creating size
export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    // clerk
    const { userId } = auth();
    const body = await req.json();

    const { name, value } = body;

    // not logged in
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!value) {
      return new NextResponse("Value is required", { status: 400 });
    }
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    // confirming that this storeId exists for this userId
    // trying to find the store that is passed in via [storeId]
    // with the userId, ensuring that that store belongs to that user
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        // id of store
        id: params.storeId,
        // current user
        userId,
      },
    });

    // if the storeId the user is req in combination with their userId
    // is not available, they are trying to update someone else store
    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const size = await prismadb.size.create({
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
