import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBlog,
  deleteBlog,
  fetchBlogById,
  fetchBlogsList,
  type BlogCreatePayload,
} from "@/api/blogs";

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

export function useCreateBlogMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: { blogData: BlogCreatePayload; photo?: File | null }) =>
      createBlog(vars.blogData, vars.photo),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["blogs", "list"] });
    },
  });
}

export function useDeleteBlogMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (blogId: string) => deleteBlog(blogId),
    onSuccess: (_data, blogId) => {
      void queryClient.invalidateQueries({ queryKey: ["blogs", "list"] });
      void queryClient.removeQueries({ queryKey: ["blogs", "detail", blogId] });
    },
  });
}
