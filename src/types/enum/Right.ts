export const Right = {
  VIEW_ROLE_LIST: 1,
  VIEW_ROLE: 2,
  UPDATE_ROLE: 3,
  DELETE_ROLE: 4,
} as const;

export type Right = (typeof Right)[keyof typeof Right];
