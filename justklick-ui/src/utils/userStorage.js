export const WISHLIST_BASE_KEY = "wishlistItems";
export const DOWNLOADS_BASE_KEY = "downloads";
export const ENQUIRIES_BASE_KEY = "enquiries";

export function safeParse(value, fallback = null) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function getLoggedInUser() {
  const loggedInUser = safeParse(localStorage.getItem("loggedInUser"));
  const authUser = safeParse(localStorage.getItem("authUser"));
  const user = safeParse(localStorage.getItem("user"));

  return loggedInUser || authUser || user || null;
}

export function normalizeLoggedInUser() {
  const user = getLoggedInUser();

  if (!user) return null;

  localStorage.setItem("loggedInUser", JSON.stringify(user));
  localStorage.setItem("isLoggedIn", "true");

  return user;
}

export function isUserLoggedIn() {
  const user = normalizeLoggedInUser();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  return Boolean(isLoggedIn && user);
}

export function getUserKey(user = getLoggedInUser()) {
  if (!user) return null;

  return String(user.email || user.phone || user.id || "guest")
    .trim()
    .toLowerCase();
}

export function getUserStorageKey(baseKey, user = getLoggedInUser()) {
  const normalizedUser = user || normalizeLoggedInUser();
  const userKey = getUserKey(normalizedUser);

  if (!userKey) return null;

  return `${baseKey}_${userKey}`;
}

export function readUserItems(baseKey) {
  const user = normalizeLoggedInUser();
  const key = getUserStorageKey(baseKey, user);

  if (!key) return [];

  return safeParse(localStorage.getItem(key), []);
}

export function writeUserItems(baseKey, items) {
  const user = normalizeLoggedInUser();
  const key = getUserStorageKey(baseKey, user);

  if (!key) return;

  localStorage.setItem(key, JSON.stringify(items));

  window.dispatchEvent(
    new CustomEvent("user-storage-updated", {
      detail: {
        baseKey,
        key,
        items,
      },
    })
  );
}

export function clearOldWishlistKeys() {
  const user = getLoggedInUser();
  const userKey = getUserKey(user);

  localStorage.removeItem("wishlistItems");

  if (userKey) {
    localStorage.removeItem(`wishlist_${userKey}`);
  }
}