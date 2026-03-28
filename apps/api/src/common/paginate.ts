export const paginate = (page = 1, limit = 20) => ({
  skip: (page - 1) * limit,
  take: limit,
})
