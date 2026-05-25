export function createItemSlug(
  name: string
) {
  return name
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}