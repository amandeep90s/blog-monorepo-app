import { DEFAULT_PAGE_SIZE } from "@/constants/app";

export function transformTakeSkip({ page, pageSize }: { page?: number; pageSize?: number }) {
  return {
    skip: ((page ?? 1) - 1) * (pageSize ?? DEFAULT_PAGE_SIZE),
    take: pageSize ?? DEFAULT_PAGE_SIZE,
  };
}
