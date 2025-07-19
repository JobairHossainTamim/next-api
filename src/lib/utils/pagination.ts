interface PaginationOptions {
  page?: number;
  limit?: number;
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
  { page = 1, limit = 10 }: PaginationOptions = {},
  projection = null,
  options = {}
): Promise<PaginationResult<T>> {
  const skip = (page - 1) * limit;

  const [data, totalItems] = await Promise.all([
    model.find(filter, projection, { ...options, skip, limit }),
    model.countDocuments(filter),
  ]);

  return {
    data,
    currentPage: page,
    totalPages: Math.ceil(totalItems / limit),
    totalItems,
  };
}
