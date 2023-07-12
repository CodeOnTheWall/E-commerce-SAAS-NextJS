import { auth } from "@clerk/nextjs";
// NextResponse.json() method then calls the JSON.stringify() method to
// convert the JSON data to a JSON string.
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

// individual GET/PATCH/DELETE
export async function GET(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    if (!params.categoryId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    // deleteMany because userId isnt unique
    const category = await prismadb.category.findUnique({
      where: {
        id: params.categoryId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORY_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name, billboardId } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    if (!params.categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
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

    // Prisma.update requires us to pass unique fields inside the where query
    // the only unique field for our model is id, we also have storeId and
    // userId, but but these are not unique for this model, any model can have them
    // since a userId could have many models, its not unique
    const category = await prismadb.category.updateMany({
      where: {
        id: params.categoryId,
      },
      data: {
        name,
        billboardId,
      },
    });

    return NextResponse.json(category);
    // would be the way without NextResponse
    // return new Response(JSON.stringify(store), { status: 200 });
  } catch (error) {
    console.log("[CATEGORY_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
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

    // deleteMany because userId isnt unique
    const category = await prismadb.category.deleteMany({
      where: {
        id: params.categoryId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORY_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
