// utils.js
export function formatColumnName(name) {
  if (!name) return '';
  if (name.toLowerCase() === 'id') return 'ID';
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, function (str) {
      return str.toUpperCase();
    });
}