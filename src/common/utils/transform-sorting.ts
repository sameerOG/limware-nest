import { isEmpty } from 'lodash';
export const transformSortField = (field: string) => {
  const orderBy = {};
  if (isEmpty(field)) {
    orderBy['_id'] = 'ASC';
  } else {
    if (field.includes('-')) {
      const sortField = field.split('-')[1];
      orderBy[sortField] = 'DESC';
      return orderBy;
    }
    orderBy[field] = 'ASC';
  }

  return orderBy;
};
