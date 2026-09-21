export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const cn = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(" ");
export const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
