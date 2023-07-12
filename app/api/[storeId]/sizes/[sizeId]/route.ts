import { auth } from "@clerk/nextjs";
// NextResponse.json() method then calls the JSON.stringify() method to
// convert the JSON data to a JSON string.
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

// individual Size GET
export async function GET(
  req: Request,
  { params }: { params: { sizeId: string } }
) {
  try {
    if (!params.sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    const size = await prismadb.size.findUnique({
      where: {
        id: params.sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// individual Size PATCH
export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name, value } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!value) {
      return new NextResponse("Value is required", { status: 400 });
    }

    if (!params.sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
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
    const size = await prismadb.size.updateMany({
      where: {
        id: params.sizeId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(size);
    // would be the way without NextResponse
    // return new Response(JSON.stringify(store), { status: 200 });
  } catch (error) {
    console.log("[SIZE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
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
    const size = await prismadb.size.deleteMany({
      where: {
        id: params.sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZE_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
