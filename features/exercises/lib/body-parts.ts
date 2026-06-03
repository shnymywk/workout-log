import { createClient } from "@/lib/supabase/server";
import type { BodyPart } from "@/features/exercises/types/body-part";

type BodyPartsResult = {
  bodyParts: BodyPart[];
  error: string | null;
};

export async function getBodyParts(): Promise<BodyPartsResult> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("body_parts")
    .select("id, name, created_at")
    .order("created_at", { ascending: true });

  if (error) {
    return {
      bodyParts: [],
      error: "部位一覧を取得できませんでした。"
    };
  }

  return {
    bodyParts: data,
    error: null
  };
}
