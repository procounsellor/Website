import { API_CONFIG } from "./config";

const baseUrl = API_CONFIG.baseUrl;

export type BlogRaw = {
  id?: string | number;
  blogId?: string | number;
  _id?: string | number;
  category?: string;
  title?: string;
  publisherName?: string;
  description?: string;
  publishedOnMillis?: number;
  publishedOn?: string;
  photoUrl?: string;
  imageUrl?: string;
  photo?: string;
  thumbnailUrl?: string;
};

export type BlogListItem = {
  id: string;
  title: string;
  author: string;
  publishedOn: string;
  tag: string;
  imageUrl: string;
  readTime: string;
  description: string;
  category: string;
  publishedOnMillis?: number;
};

export type BlogCreatePayload = {
  category: string;
  title: string;
  publisherName: string;
  description: string;
  publishedOnMillis: number;
};

export type BlogUpdatePayload = Partial<Pick<BlogCreatePayload, "title" | "description" | "publishedOnMillis">> & {
  category?: string;
  publisherName?: string;
};

export type BlogMutationResponse = {
  success?: boolean;
  status?: string;
  id?: string | number;
  message?: string;
  [key: string]: unknown;
};

function getId(raw: BlogRaw): string {
  const v = raw.id ?? raw.blogId ?? raw._id;
  if (v === undefined || v === null) return "";
  return String(v);
}

export function resolveBlogImageUrl(url?: string | null): string {
  const fallback = "/blogCard.jpg";
  if (!url || !String(url).trim()) return fallback;
  const s = String(url).trim();
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  if (!baseUrl) return s.startsWith("/") ? s : `/${s}`;
  const path = s.startsWith("/") ? s : `/${s}`;
  try {
    return new URL(path, baseUrl).toString();
  } catch {
    return `${baseUrl}${path}`;
  }
}

export function formatPublishedLine(millis?: number): string {
  if (millis == null || Number.isNaN(Number(millis))) return "Published on: —";
  const d = new Date(millis);
  return `Published on: ${d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "2-digit" })}`;
}

export function formatPublishedHeading(millis?: number): string {
  if (millis == null || Number.isNaN(Number(millis))) return "—";
  const d = new Date(millis);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatPublishedLineFlexible(raw: BlogRaw): string {
  if (raw.publishedOn && typeof raw.publishedOn === "string") {
    const s = raw.publishedOn.trim();
    if (s.toLowerCase().startsWith("published")) return s;
    // Backend sometimes returns a raw date string; keep UI stable.
    return `Published on: ${s}`;
  }
  return formatPublishedLine(raw.publishedOnMillis);
}

function estimateReadTime(description?: string): string {
  if (!description?.trim()) return "Article";
  const words = description.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.ceil(words / 200));
  return `${mins} min read`;
}

function parseListPayload(json: unknown): BlogRaw[] {
  if (!json) return [];
  if (Array.isArray(json)) return json as BlogRaw[];
  if (typeof json !== "object") return [];
  const o = json as Record<string, unknown>;
  const keys = ["data", "blogs", "items", "content", "result", "payload"] as const;
  for (const k of keys) {
    const c = o[k];
    if (Array.isArray(c)) return c as BlogRaw[];
  }
  return [];
}

function extractDetailRaw(json: unknown): BlogRaw | null {
  if (!json || typeof json !== "object") return null;
  const o = json as Record<string, unknown>;
  if (o.data !== undefined && typeof o.data === "object" && o.data !== null && !Array.isArray(o.data)) {
    return o.data as BlogRaw;
  }
  return json as BlogRaw;
}

export function normalizeBlog(raw: BlogRaw, fallbackId?: string): BlogListItem | null {
  const id = getId(raw) || (fallbackId ?? "");
  if (!id) return null;
  const title = raw.title?.trim() || "Untitled";
  const author = raw.publisherName?.trim() || "—";
  const category = raw.category?.trim() || "General";
  const tag = category.replace(/_/g, " ");
  return {
    id,
    title,
    author,
    publishedOn: formatPublishedLineFlexible(raw),
    tag,
    imageUrl: resolveBlogImageUrl(
      raw.photoUrl ?? raw.imageUrl ?? raw.photo ?? raw.thumbnailUrl
    ),
    readTime: estimateReadTime(raw.description),
    description: raw.description?.trim() ?? "",
    category,
    publishedOnMillis: raw.publishedOnMillis,
  };
}

function ensureMutationSuccess(data: BlogMutationResponse, fallbackMessage: string) {
  const success = data.success;
  const status = data.status;
  const message = data.message;

  const looksOk =
    success === true ||
    (typeof status === "string" && status.toLowerCase() === "success") ||
    typeof data.id !== "undefined";

  if (!looksOk) {
    throw new Error(message || fallbackMessage);
  }
}

export async function createBlog(
  blogData: BlogCreatePayload,
  photo?: File | null
): Promise<BlogMutationResponse> {
  const formData = new FormData();
  formData.append("blogData", JSON.stringify(blogData));
  if (photo) formData.append("photo", photo);

  const res = await fetch(`${baseUrl}/api/blogs`, {
    method: "POST",
    body: formData,
  });

  const json: BlogMutationResponse = await res.json().catch(() => ({} as BlogMutationResponse));
  if (!res.ok) throw new Error(json.message || `Failed to create blog (${res.status})`);

  ensureMutationSuccess(json, "Failed to create blog");
  return json;
}

export async function updateBlog(
  blogId: string,
  blogData: BlogUpdatePayload,
  photo?: File | null
): Promise<BlogMutationResponse> {
  const formData = new FormData();
  formData.append("blogData", JSON.stringify(blogData ?? {}));
  if (photo) formData.append("photo", photo);

  const res = await fetch(`${baseUrl}/api/blogs/${encodeURIComponent(blogId)}`, {
    method: "PUT",
    body: formData,
  });

  const json: BlogMutationResponse = await res.json().catch(() => ({} as BlogMutationResponse));
  if (!res.ok) throw new Error(json.message || `Failed to update blog (${res.status})`);

  ensureMutationSuccess(json, "Failed to update blog");
  return json;
}

export async function deleteBlog(blogId: string): Promise<BlogMutationResponse> {
  const res = await fetch(`${baseUrl}/api/blogs/${encodeURIComponent(blogId)}`, {
    method: "DELETE",
  });

  const json: BlogMutationResponse = await res.json().catch(() => ({} as BlogMutationResponse));
  if (!res.ok) throw new Error(json.message || `Failed to delete blog (${res.status})`);

  ensureMutationSuccess(json, "Failed to delete blog");
  return json;
}

export async function fetchBlogsList(): Promise<BlogListItem[]> {
  if (!baseUrl) {
    console.warn("VITE_API_BASE_URL is not set; blog requests will fail.");
  }
  const res = await fetch(`${baseUrl}/api/blogs/list`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Failed to load blogs (${res.status})`);
  }
  const json: unknown = await res.json();
  const rows = parseListPayload(json);
  return rows
    .map((r) => normalizeBlog(r))
    .filter((b): b is BlogListItem => b !== null);
}

export async function fetchBlogById(id: string): Promise<BlogListItem | null> {
  const res = await fetch(`${baseUrl}/api/blogs/${encodeURIComponent(id)}`, {
    headers: { Accept: "application/json" },
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Failed to load blog (${res.status})`);
  }
  const json: unknown = await res.json();
  const raw = extractDetailRaw(json);
  if (!raw) return null;
  return normalizeBlog(raw, id);
}
