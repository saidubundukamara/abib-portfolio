/**
 * Converts Mongoose lean documents to plain JSON-serializable objects.
 * Strips BSON ObjectId (→ string), converts Dates (→ ISO string), etc.
 * Must be called before passing DB results as React props.
 */
export function serialize<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc))
}
