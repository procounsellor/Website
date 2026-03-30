import { useQuery } from "@tanstack/react-query";
import { fetchBlogById, fetchBlogsList } from "@/api/blogs";

export function useBlogsList() {
  return useQuery({
    queryKey: ["blogs", "list"],
    queryFn: fetchBlogsList,
    staleTime: 60_000,
  });
}

export function useBlogDetail(id: string | undefined) {
  return useQuery({
    queryKey: ["blogs", "detail", id],
    queryFn: () => fetchBlogById(id!),
    enabled: Boolean(id?.length),
    staleTime: 60_000,
  });
}
