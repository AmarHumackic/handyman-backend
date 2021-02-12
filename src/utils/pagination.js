const DEFAULT_SIZE = 10;

module.exports = getPagination = (page, size) => {
  const limit = size ? +size : DEFAULT_SIZE;
  const offset = page ? page * limit : 0;

  return {limit, offset};
};
