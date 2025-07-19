import connect from "@/lib/db";
import User from "@/lib/modals/modals";
import Category from "@/lib/modals/category";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing user Id " }),
        {
          status: 400,
        }
      );
    }
    await connect();

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    const category = await Category.find({ user: new Types.ObjectId(userId) });

    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found" }),
        {
          status: 404,
        }
      );
    }

    return new NextResponse(JSON.stringify(category), {
      status: 200,
    });
  } catch (error: any) {
    return new NextResponse("Failed to Fetching Categories", {
      status: 500,
    });
  }
};

export const POST = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const { title } = await request.json();

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing user Id" }),
        {
          status: 400,
        }
      );
    }

    await connect();

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }
    const newCategory = new Category({
      title,
      user: new Types.ObjectId(userId),
    });

    const savedCategory = await newCategory.save();

    return new NextResponse(
      JSON.stringify({
        message: "Category created successfully",
        category: savedCategory,
      }),
      { status: 201 }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ message: "Failed to create category" }),
      {
        status: 500,
      }
    );
  }
};

export const PATCH = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");
    const { title } = await request.json();

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing user Id" }),
        {
          status: 400,
        }
      );
    }

    await connect();

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    const updatedCategory = await Category.findOneAndUpdate(
      { _id: categoryId, user: userId },
      { title },
      { new: true }
    );

    if (!updatedCategory) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found or not owned by user" }),
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: "Category updated successfully",
        category: updatedCategory,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ message: "Failed to update category" }),
      {
        status: 500,
      }
    );
  }
};

export const DELETE = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing user Id" }),
        {
          status: 400,
        }
      );
    }

    await connect();

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }
    const deletedCategory = await Category.findOneAndDelete({
      _id: categoryId,
      user: userId,
    });

    if (!deletedCategory) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found or not owned by user" }),
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: "Category deleted successfully",
        category: deletedCategory,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ message: "Failed to delete category" }),
      {
        status: 500,
      }
    );
  }
};
