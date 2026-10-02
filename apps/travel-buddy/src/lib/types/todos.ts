export const TodoCategories = {
  BeforeYouGo: 'Before You Go',
  Clothes: 'Clothes',
  Documents: 'Documents',
  Health: 'Health',
  Tech: 'Tech',
  Toiletries: 'Toiletries',
} as const;

export type TodoCategory = (typeof TodoCategories)[keyof typeof TodoCategories];
