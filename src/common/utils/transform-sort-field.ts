export const transformSortField = (field: string) => {
  const orderBy = {};
  if (field.includes('-')) {
    const sortField = field.split('-')[1];
    orderBy[sortField] = 'DESC';
    return orderBy;
  }
  orderBy[field] = 'ASC';
  return orderBy;
};
