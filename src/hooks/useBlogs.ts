import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBlog,
  deleteBlog,
  fetchBlogById,
  fetchBlogsList,
  updateBlog,
  type BlogCreatePayload,
  type BlogListItem,
  type BlogUpdatePayload,
} from "@/api/blogs";
import { BLOGS_SNAPSHOT } from "@/data/blogsSnapshot";

// Build-time snapshot of published blogs. Used as react-query initialData so
// blog pages render real content during the prerender (the live API is blocked
// then). initialDataUpdatedAt:0 marks it stale so the client refetches on mount
// to pick up the latest content.
const SNAPSHOT_LIST = BLOGS_SNAPSHOT as unknown as BlogListItem[];

export function useBlogsList(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["blogs", "list"],
    queryFn: fetchBlogsList,
    enabled: options?.enabled ?? true,
    staleTime: 60_000,
    initialData: SNAPSHOT_LIST.length ? SNAPSHOT_LIST : undefined,
    initialDataUpdatedAt: 0,
  });
}

export function useBlogDetail(id: string | undefined) {
  const seed = id
    ? SNAPSHOT_LIST.find((b) => b.id === id || b.slug === id)
    : undefined;
  return useQuery({
    queryKey: ["blogs", "detail", id],
    queryFn: () => fetchBlogById(id!),
    enabled: Boolean(id?.length),
    staleTime: 60_000,
    initialData: seed,
    initialDataUpdatedAt: 0,
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

export function useUpdateBlogMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: {
      blogId: string;
      blogData: BlogUpdatePayload;
      photo?: File | null;
    }) => updateBlog(vars.blogId, vars.blogData, vars.photo),
    onSuccess: (_data, vars) => {
      void queryClient.invalidateQueries({ queryKey: ["blogs", "list"] });
      void queryClient.invalidateQueries({ queryKey: ["blogs", "detail", vars.blogId] });
    },
  });
}
