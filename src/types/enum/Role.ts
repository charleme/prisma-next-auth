export const Role = {
  Admin: 1,
  User: 2,
} as const;

export type Role = (typeof Role)[keyof typeof Role];
