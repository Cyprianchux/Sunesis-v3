export type UserRole = "user" | "admin";

export type User = {
  username: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  verified: boolean;
};

export type Topic = {
  name: string;
  creator: string;
  createdAt: string;
};

export type Slide = {
  id: string;
  topic: string;
  title: string;
  description: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  creator: string;
};

export type BoardEntry = {
  id: string;
  content: string;
  createdAt: string;
};

export const passwordRules = [
  { label: "At least 8 characters", test: (value: string) => value.length >= 8 },
  { label: "Contains uppercase letter", test: (value: string) => /[A-Z]/.test(value) },
  { label: "Contains a number", test: (value: string) => /[0-9]/.test(value) },
];
