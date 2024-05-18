export const Right = {
  VIEW_RIGHT_LIST: 1,
  VIEW_RIGHT: 2,
  UPDATE_RIGHT: 3,
  DELETE_RIGHT: 4,
} as const;

export type Right = (typeof Right)[keyof typeof Right];
