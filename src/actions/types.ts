/** Per-field validation errors, matching Zod's `flatten().fieldErrors`. */
export type FieldErrors = Record<string, string[] | undefined>;

/** Discriminated result returned by every Server Action. */
export type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: FieldErrors };
