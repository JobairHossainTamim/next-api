interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface PaginationResult<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export async function paginate<T>(
  model: any,
  filter = {},
  {
    page = 1,
    limit = 10,
    sortBy = "createdAt", // ✅ default sort field
    sortOrder = "desc", // ✅ default order
  }: PaginationOptions = {},
  projection = null,
  options = {}
): Promise<PaginationResult<T>> {
  const skip = (page - 1) * limit;
  const sortOptions = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

  const [data, totalItems] = await Promise.all([
    model.find(filter, projection, {
      ...options,
      skip,
      limit,
      sort: sortOptions,
    }),
    model.countDocuments(filter),
  ]);

  return {
    data,
    currentPage: page,
    totalPages: Math.ceil(totalItems / limit),
    totalItems,
  };
}
