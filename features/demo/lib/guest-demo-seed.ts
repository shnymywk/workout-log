import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, TablesInsert } from "@/types/database";

type Supabase = SupabaseClient<Database>;

type ResetGuestDemoDataParams = {
  supabase: Supabase;
  userId: string;
};

type ResetGuestDemoDataResult = {
  error: string | null;
};

type BodyPartSeed = {
  name: string;
};

type ExerciseSeed = {
  name: string;
  bodyPartNames: string[];
};

type GoalSeed = {
  exerciseName: string;
  targetWeight: number;
};

type WorkoutLogSeed = {
  exerciseName: string;
  daysAgo: number;
  memo: string | null;
  sets: {
    weight: number;
    reps: number;
  }[];
};

type BodyPartRow = {
  id: string;
  name: string;
};

type ExerciseRow = {
  id: string;
  name: string;
};

const bodyPartSeeds: BodyPartSeed[] = [
  { name: "胸" },
  { name: "背中" },
  { name: "脚" },
  { name: "肩" },
  { name: "腕" }
];

const exerciseSeeds: ExerciseSeed[] = [
  { name: "ベンチプレス", bodyPartNames: ["胸", "腕"] },
  { name: "スクワット", bodyPartNames: ["脚"] },
  { name: "デッドリフト", bodyPartNames: ["背中", "脚"] },
  { name: "ショルダープレス", bodyPartNames: ["肩", "腕"] },
  { name: "ラットプルダウン", bodyPartNames: ["背中"] }
];

const goalSeeds: GoalSeed[] = [
  { exerciseName: "ベンチプレス", targetWeight: 85 },
  { exerciseName: "スクワット", targetWeight: 125 },
  { exerciseName: "デッドリフト", targetWeight: 150 },
  { exerciseName: "ショルダープレス", targetWeight: 55 }
];

const workoutLogSeeds: WorkoutLogSeed[] = [
  {
    exerciseName: "ベンチプレス",
    daysAgo: 1,
    memo: "トップセットは余裕あり",
    sets: [
      { weight: 72.5, reps: 8 },
      { weight: 72.5, reps: 8 },
      { weight: 70, reps: 9 }
    ]
  },
  {
    exerciseName: "スクワット",
    daysAgo: 2,
    memo: "フォーム安定",
    sets: [
      { weight: 105, reps: 5 },
      { weight: 105, reps: 5 },
      { weight: 100, reps: 6 }
    ]
  },
  {
    exerciseName: "ラットプルダウン",
    daysAgo: 4,
    memo: null,
    sets: [
      { weight: 55, reps: 10 },
      { weight: 55, reps: 10 },
      { weight: 52.5, reps: 12 }
    ]
  },
  {
    exerciseName: "ショルダープレス",
    daysAgo: 7,
    memo: "次回は重量を上げる",
    sets: [
      { weight: 42.5, reps: 8 },
      { weight: 42.5, reps: 7 },
      { weight: 40, reps: 9 }
    ]
  },
  {
    exerciseName: "デッドリフト",
    daysAgo: 10,
    memo: "握力に余裕あり",
    sets: [
      { weight: 130, reps: 5 },
      { weight: 125, reps: 5 },
      { weight: 120, reps: 6 }
    ]
  },
  {
    exerciseName: "ベンチプレス",
    daysAgo: 13,
    memo: null,
    sets: [
      { weight: 70, reps: 8 },
      { weight: 70, reps: 8 },
      { weight: 67.5, reps: 10 }
    ]
  },
  {
    exerciseName: "スクワット",
    daysAgo: 16,
    memo: null,
    sets: [
      { weight: 100, reps: 5 },
      { weight: 100, reps: 5 },
      { weight: 95, reps: 8 }
    ]
  },
  {
    exerciseName: "デッドリフト",
    daysAgo: 22,
    memo: "軽めに調整",
    sets: [
      { weight: 122.5, reps: 5 },
      { weight: 120, reps: 5 },
      { weight: 115, reps: 6 }
    ]
  },
  {
    exerciseName: "ショルダープレス",
    daysAgo: 27,
    memo: null,
    sets: [
      { weight: 40, reps: 8 },
      { weight: 40, reps: 8 },
      { weight: 37.5, reps: 10 }
    ]
  }
];

function getSeedErrorMessage(action: string) {
  return `ゲスト用デモデータを${action}できませんでした。`;
}

function toDateValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + days);

  return nextDate;
}

function getSummarySetValues(sets: WorkoutLogSeed["sets"]) {
  return {
    reps: Math.max(...sets.map((set) => set.reps)),
    sets: sets.length,
    weight: Math.max(...sets.map((set) => set.weight))
  };
}

function mapRowsByName<Row extends { name: string }>(rows: Row[]) {
  return new Map(rows.map((row) => [row.name, row]));
}

async function clearGuestDemoData(supabase: Supabase, userId: string) {
  const workoutLogSetsDelete = await supabase
    .from("workout_log_sets")
    .delete()
    .eq("user_id", userId);

  if (workoutLogSetsDelete.error) {
    return getSeedErrorMessage("初期化");
  }

  const workoutLogsDelete = await supabase.from("workout_logs").delete().eq("user_id", userId);

  if (workoutLogsDelete.error) {
    return getSeedErrorMessage("初期化");
  }

  const goalsDelete = await supabase.from("goals").delete().eq("user_id", userId);

  if (goalsDelete.error) {
    return getSeedErrorMessage("初期化");
  }

  const exerciseBodyPartsDelete = await supabase
    .from("exercise_body_parts")
    .delete()
    .eq("user_id", userId);

  if (exerciseBodyPartsDelete.error) {
    return getSeedErrorMessage("初期化");
  }

  const exercisesDelete = await supabase.from("exercises").delete().eq("user_id", userId);

  if (exercisesDelete.error) {
    return getSeedErrorMessage("初期化");
  }

  const bodyPartsDelete = await supabase.from("body_parts").delete().eq("user_id", userId);

  if (bodyPartsDelete.error) {
    return getSeedErrorMessage("初期化");
  }

  return null;
}

async function seedBodyParts(supabase: Supabase, userId: string) {
  const rows: TablesInsert<"body_parts">[] = bodyPartSeeds.map((bodyPart) => ({
    name: bodyPart.name,
    user_id: userId
  }));
  const { data, error } = await supabase
    .from("body_parts")
    .insert(rows)
    .select("id, name")
    .returns<BodyPartRow[]>();

  if (error || !data) {
    return {
      bodyPartsByName: new Map<string, BodyPartRow>(),
      error: getSeedErrorMessage("作成")
    };
  }

  return {
    bodyPartsByName: mapRowsByName(data),
    error: null
  };
}

async function seedExercises({
  bodyPartsByName,
  supabase,
  userId
}: {
  bodyPartsByName: Map<string, BodyPartRow>;
  supabase: Supabase;
  userId: string;
}) {
  const rows: TablesInsert<"exercises">[] = exerciseSeeds.map((exercise) => ({
    body_part_id: bodyPartsByName.get(exercise.bodyPartNames[0])?.id ?? null,
    name: exercise.name,
    user_id: userId
  }));
  const { data, error } = await supabase
    .from("exercises")
    .insert(rows)
    .select("id, name")
    .returns<ExerciseRow[]>();

  if (error || !data) {
    return {
      error: getSeedErrorMessage("作成"),
      exercisesByName: new Map<string, ExerciseRow>()
    };
  }

  return {
    error: null,
    exercisesByName: mapRowsByName(data)
  };
}

async function seedExerciseBodyParts({
  bodyPartsByName,
  exercisesByName,
  supabase,
  userId
}: {
  bodyPartsByName: Map<string, BodyPartRow>;
  exercisesByName: Map<string, ExerciseRow>;
  supabase: Supabase;
  userId: string;
}) {
  const rows: TablesInsert<"exercise_body_parts">[] = exerciseSeeds.flatMap((exercise) => {
    const exerciseId = exercisesByName.get(exercise.name)?.id;

    if (!exerciseId) {
      return [];
    }

    return exercise.bodyPartNames.flatMap((bodyPartName) => {
      const bodyPartId = bodyPartsByName.get(bodyPartName)?.id;

      if (!bodyPartId) {
        return [];
      }

      return {
        body_part_id: bodyPartId,
        exercise_id: exerciseId,
        user_id: userId
      };
    });
  });

  const { error } = await supabase.from("exercise_body_parts").insert(rows);

  if (error) {
    return getSeedErrorMessage("作成");
  }

  return null;
}

async function seedGoals({
  exercisesByName,
  supabase,
  userId
}: {
  exercisesByName: Map<string, ExerciseRow>;
  supabase: Supabase;
  userId: string;
}) {
  const rows: TablesInsert<"goals">[] = goalSeeds.flatMap((goal) => {
    const exerciseId = exercisesByName.get(goal.exerciseName)?.id;

    if (!exerciseId) {
      return [];
    }

    return {
      exercise_id: exerciseId,
      target_weight: goal.targetWeight,
      user_id: userId
    };
  });

  const { error } = await supabase.from("goals").insert(rows);

  if (error) {
    return getSeedErrorMessage("作成");
  }

  return null;
}

async function seedWorkoutLogs({
  exercisesByName,
  supabase,
  userId
}: {
  exercisesByName: Map<string, ExerciseRow>;
  supabase: Supabase;
  userId: string;
}) {
  const today = new Date();

  for (const workoutLog of workoutLogSeeds) {
    const exerciseId = exercisesByName.get(workoutLog.exerciseName)?.id;

    if (!exerciseId) {
      return getSeedErrorMessage("作成");
    }

    const summary = getSummarySetValues(workoutLog.sets);
    const { data, error } = await supabase
      .from("workout_logs")
      .insert({
        exercise_id: exerciseId,
        memo: workoutLog.memo,
        reps: summary.reps,
        sets: summary.sets,
        trained_at: toDateValue(addDays(today, -workoutLog.daysAgo)),
        user_id: userId,
        weight: summary.weight
      })
      .select("id")
      .single();

    if (error || !data) {
      return getSeedErrorMessage("作成");
    }

    const setRows: TablesInsert<"workout_log_sets">[] = workoutLog.sets.map((set, index) => ({
      reps: set.reps,
      set_number: index + 1,
      user_id: userId,
      weight: set.weight,
      workout_log_id: data.id
    }));
    const { error: setsError } = await supabase.from("workout_log_sets").insert(setRows);

    if (setsError) {
      return getSeedErrorMessage("作成");
    }
  }

  return null;
}

export async function resetGuestDemoData({
  supabase,
  userId
}: ResetGuestDemoDataParams): Promise<ResetGuestDemoDataResult> {
  const clearError = await clearGuestDemoData(supabase, userId);

  if (clearError) {
    return { error: clearError };
  }

  const bodyPartsResult = await seedBodyParts(supabase, userId);

  if (bodyPartsResult.error) {
    return { error: bodyPartsResult.error };
  }

  const exercisesResult = await seedExercises({
    bodyPartsByName: bodyPartsResult.bodyPartsByName,
    supabase,
    userId
  });

  if (exercisesResult.error) {
    return { error: exercisesResult.error };
  }

  const exerciseBodyPartsError = await seedExerciseBodyParts({
    bodyPartsByName: bodyPartsResult.bodyPartsByName,
    exercisesByName: exercisesResult.exercisesByName,
    supabase,
    userId
  });

  if (exerciseBodyPartsError) {
    return { error: exerciseBodyPartsError };
  }

  const goalsError = await seedGoals({
    exercisesByName: exercisesResult.exercisesByName,
    supabase,
    userId
  });

  if (goalsError) {
    return { error: goalsError };
  }

  const workoutLogsError = await seedWorkoutLogs({
    exercisesByName: exercisesResult.exercisesByName,
    supabase,
    userId
  });

  if (workoutLogsError) {
    return { error: workoutLogsError };
  }

  return { error: null };
}
