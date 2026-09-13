import { createSupabaseServerClient } from "./supabase/server";

export type PostRow = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export type PostReplyRow = {
  id: string;
  post_id: string;
  content: string;
  is_admin: boolean;
  created_at: string;
};

export async function getPosts() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as PostRow[];
}

export async function getPost(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as PostRow | null;
}

export async function getReplies(postId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("post_replies")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as PostReplyRow[];
}
