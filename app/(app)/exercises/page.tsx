import { BodyPartManager } from "@/features/exercises/components/BodyPartManager";
import { getBodyParts } from "@/features/exercises/lib/body-parts";

export default async function ExercisesPage() {
  const { bodyParts, error } = await getBodyParts();

  return <BodyPartManager bodyParts={bodyParts} fetchError={error} />;
}
