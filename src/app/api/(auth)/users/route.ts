import connect from "@/lib/db";
import Users from "@/lib/modals/modals";
import { paginate } from "@/lib/utils/pagination";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    await connect();

    // 🔁 Apply pagination utility
    const result = await paginate(Users, {}, { page, limit });

    return new NextResponse(JSON.stringify(result), {
      status: 200,
    });
  } catch (error: any) {
    console.error("GET /api/users error:", error);
    return new NextResponse("Failed to fetch users", {
      status: 500,
    });
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    await connect();
    const newUser = new Users(body);
    await newUser.save();

    return new NextResponse("User created successfully", {
      status: 201,
    });
  } catch (error: any) {
    return new NextResponse("Failed to create user", {
      status: 500,
    });
  }
};

export const PATCH = async (request: Request) => {
  try {
    const body = await request.json();
    const { userId, newUserName } = body;

    await connect();

    if (!userId || !newUserName) {
      return new NextResponse("User ID and new username are required", {
        status: 400,
      });
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse("Invalid user ID", {
        status: 400,
      });
    }

    const updatedUser = await Users.findOneAndUpdate(
      { _id: userId },
      { userName: newUserName },
      { new: true }
    );

    if (!updatedUser) {
      return new NextResponse("User not found", {
        status: 404,
      });
    }

    return new NextResponse(
      JSON.stringify({ message: "User is updated", user: updatedUser }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Failed to update user", {
      status: 500,
    });
  }
};

export const DELETE = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    await connect();

    if (!userId) {
      return new NextResponse("User ID is required", {
        status: 400,
      });
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse("Invalid user ID", {
        status: 400,
      });
    }

    const deletedUser = await Users.findOneAndDelete({ _id: userId });

    if (!deletedUser) {
      return new NextResponse("User not found", {
        status: 404,
      });
    }

    return new NextResponse(
      JSON.stringify({ message: "User is Deleted", user: deletedUser }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Failed to Delete user", {
      status: 500,
    });
  }
};
