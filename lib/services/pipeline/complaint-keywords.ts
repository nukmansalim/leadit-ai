/**
 * Complaint keyword list used for pre-filtering bad reviews.
 *
 * Keeping this in a dedicated file makes it easy to extend (or later
 * move into the database / admin panel) without touching business logic.
 */

export const COMPLAINT_KEYWORDS: readonly string[] = [
  // Slow service
  "lambat", "lama", "slow", "antri", "antre", "menunggu", "waiting",
  "lemot", "queue", "delay",
  // Staff / service attitude
  "kecewa", "buruk", "jelek", "pelayanan", "kasir", "staf", "staff",
  "cuek", "sombong", "marah", "kasar", "service", "rude", "bad",
  // Payment
  "tunai", "cash", "qris", "debit", "kartu", "mesin", "payment", "bayar",
  // Cleanliness
  "kotor", "bau", "bersih", "kebersihan", "lalat", "kecoa", "dirty",
  "smelly", "fly", "flies", "cockroach",
  // Food consistency
  "dingin", "asin", "hambar", "raw", "mentah", "basi", "rambut", "hair",
  "salty", "tasteless", "cold", "consistent", "konsisten", "rasa",
] as const;
