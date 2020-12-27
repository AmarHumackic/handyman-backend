// not used
export const isNullOrEmpty = (item) => {
  if (Array.isArray(item) && !item.length) {
    return true; // for empty arrays
  }
  if (!item) {
    return true; // no input
  }
  if (!item.trim()) {
    return true; // only spaces
  }
  return false;
};
