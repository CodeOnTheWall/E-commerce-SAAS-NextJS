import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

import { NextResponse } from "next/server";

// api for getting all categories
// add in middleware file to allow public req
export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  console.log("here");
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    // finding the categories that belong to the storeId
    const categories = await prismadb.category.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.log("[CATEGORIES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// api for creating billboard
export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    // clerk
    const { userId } = auth();
    const body = await req.json();

    const { name, billboardId } = body;

    // not logged in
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!billboardId) {
      return new NextResponse("Billboard Id is required", { status: 400 });
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

    const category = await prismadb.category.create({
      data: {
        name,
        billboardId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORIES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
