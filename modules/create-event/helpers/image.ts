// Image limits shared by the server validation and the create-event form.
// Kept in their own module so importing them in the client bundle does not
// pull in zod and the whole city list from `validation.ts`.
export const MAX_IMAGE_BYTES = 3 * 1024 * 1024;

export const MAX_IMAGE_LABEL = "3 MB";

export const IMAGE_SIZE_ERROR = `Zdjęcie może mieć maksymalnie ${MAX_IMAGE_LABEL}.`;

export const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};
