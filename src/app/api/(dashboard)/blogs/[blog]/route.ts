import connect from "@/lib/db";
import User from "@/lib/modals/modals";
import Category from "@/lib/modals/category";
import { Types } from "mongoose";
import { NextResponse } from "next/server";
import Blog from "@/lib/modals/blog";

export const GET = async (request: Request, context: { params: any }) => {
  try {
    const blogId = context.params.blog;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

    // ✅ Validate ObjectIds
    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing blog Id" }),
        { status: 400 }
      );
    }

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing user Id" }),
        { status: 400 }
      );
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing category Id" }),
        { status: 400 }
      );
    }

    await connect();

    const blog = await Blog.findOne({
      _id: blogId,
      user: userId,
      category: categoryId,
    });

    if (!blog) {
      return new NextResponse(JSON.stringify({ message: "Blog not found" }), {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify({ blog }), { status: 200 });
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

export const PATCH = async (
  request: Request,
  context: { params: { blog: string } }
) => {
  try {
    const blogId = context.params.blog;
    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(JSON.stringify({ message: "Invalid blogId" }), {
        status: 400,
      });
    }

    await connect();
    const body = await request.json();
    const { title, content, categoryId } = body;

    const updateData: any = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (categoryId && Types.ObjectId.isValid(categoryId)) {
      updateData.category = new Types.ObjectId(categoryId);
    }

    const updatedBlog = await Blog.findByIdAndUpdate(blogId, updateData, {
      new: true,
    });

    if (!updatedBlog) {
      return new NextResponse(JSON.stringify({ message: "Blog not found" }), {
        status: 404,
      });
    }

    return new NextResponse(
      JSON.stringify({ message: "Blog updated", blog: updatedBlog }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        message: "Failed to update blog",
        error: error.message,
      }),
      { status: 500 }
    );
  }
};

export const DELETE = async (
  request: Request,
  context: { params: { blog: string } }
) => {
  try {
    const blogId = context.params.blog;
    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(JSON.stringify({ message: "Invalid blogId" }), {
        status: 400,
      });
    }

    await connect();
    const deletedBlog = await Blog.findByIdAndDelete(blogId);

    if (!deletedBlog) {
      return new NextResponse(JSON.stringify({ message: "Blog not found" }), {
        status: 404,
      });
    }

    return new NextResponse(
      JSON.stringify({ message: "Blog deleted successfully" }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        message: "Failed to delete blog",
        error: error.message,
      }),
      { status: 500 }
    );
  }
};
