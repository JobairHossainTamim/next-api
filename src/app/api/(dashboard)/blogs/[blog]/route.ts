import connect from "@/lib/db";
import Blog from "@/lib/modals/blog";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// ✅ GET one blog
export async function GET(
  request: NextRequest,
  context: { params: { blog: string } }
) {
  try {
    const { blog: blogId } = await context.params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

    // Validate IDs
    if (!Types.ObjectId.isValid(blogId)) {
      return NextResponse.json({ message: "Invalid blogId" }, { status: 400 });
    }
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: "Invalid userId" }, { status: 400 });
    }
    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return NextResponse.json(
        { message: "Invalid categoryId" },
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
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ blog }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch blog", error: error.message },
      { status: 500 }
    );
  }
}

// ✅ PATCH blog
export async function PATCH(
  request: NextRequest,
  context: { params: { blog: string } }
) {
  try {
    const { blog: blogId } = await context.params;

    if (!Types.ObjectId.isValid(blogId)) {
      return NextResponse.json({ message: "Invalid blogId" }, { status: 400 });
    }

    await connect();

    const { title, content, categoryId } = await request.json();

    const updateData: any = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (categoryId && Types.ObjectId.isValid(categoryId)) {
      updateData.category = categoryId;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(blogId, updateData, {
      new: true,
    });

    if (!updatedBlog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Blog updated", blog: updatedBlog },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to update blog", error: error.message },
      { status: 500 }
    );
  }
}

// ✅ DELETE blog
export async function DELETE(
  request: NextRequest,
  context: { params: { blog: string } }
) {
  try {
    const { blog: blogId } = await context.params;

    if (!Types.ObjectId.isValid(blogId)) {
      return NextResponse.json({ message: "Invalid blogId" }, { status: 400 });
    }

    await connect();

    const deletedBlog = await Blog.findByIdAndDelete(blogId);

    if (!deletedBlog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Blog deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to delete blog", error: error.message },
      { status: 500 }
    );
  }
}
