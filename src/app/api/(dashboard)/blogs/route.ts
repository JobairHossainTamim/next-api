import connect from "@/lib/db";
import User from "@/lib/modals/modals";
import Category from "@/lib/modals/category";
import { Types } from "mongoose";
import { NextResponse } from "next/server";
import { paginate } from "@/lib/utils/pagination";
import Blog from "@/lib/modals/blog";

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");
    const searchKeyword = searchParams.get("keywords") || "";

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder =
      (searchParams.get("sortOrder") as "asc" | "desc") || "desc";

    // ✅ Validate userId
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing user Id" }),
        { status: 400 }
      );
    }

    await connect();

    // ✅ Ensure user exists
    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    // ✅ Ensure category exists if categoryId is provided
    if (categoryId && !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid category Id" }),
        { status: 400 }
      );
    }

    if (categoryId) {
      const category = await Category.findById(categoryId);
      if (!category) {
        return new NextResponse(
          JSON.stringify({ message: "Category not found" }),
          { status: 404 }
        );
      }
    }

    // ✅ Filter
    const filter: any = {
      user: new Types.ObjectId(userId),
    };

    if (categoryId) {
      filter.category = new Types.ObjectId(categoryId);
    }

    if (searchKeyword) {
      filter.$or = [
        { title: { $regex: searchKeyword, $options: "i" } },
        { content: { $regex: searchKeyword, $options: "i" } },
      ];
    }

    const result = await paginate(Blog, filter, {
      page,
      limit,
      sortBy,
      sortOrder,
    });

    return new NextResponse(JSON.stringify(result), {
      status: 200,
    });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        message: "Failed to fetch blogs",
        error: error.message,
      }),
      { status: 500 }
    );
  }
};
export const POST = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

    const { title, content } = await request.json();

    // ✅ Validate query parameters
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        {
          status: 400,
        }
      );
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing categoryId" }),
        {
          status: 400,
        }
      );
    }

    // ✅ Validate body fields
    if (!title || typeof title !== "string") {
      return new NextResponse(
        JSON.stringify({ message: "Title is required" }),
        {
          status: 400,
        }
      );
    }

    await connect();

    // ✅ Check if user and category exist
    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found" }),
        {
          status: 404,
        }
      );
    }

    // ✅ Create and save the blog
    const newBlog = new Blog({
      title,
      content,
      user: new Types.ObjectId(userId),
      category: new Types.ObjectId(categoryId),
    });

    const saveBlog = await newBlog.save();

    return new NextResponse(
      JSON.stringify({
        message: "Blog created successfully",
        Blogs: saveBlog,
      }),
      {
        status: 201,
      }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        message: "Failed to create blog",
        error: error.message,
      }),
      { status: 500 }
    );
  }
};
