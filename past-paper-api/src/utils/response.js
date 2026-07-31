export function successResponse(res, data, status = 200, extra = {}) {
  return res.status(status).json({
    success: true,
    data,
    ...extra,
  });
}

export function paginatedResponse(res, data, meta, status = 200) {
  return res.status(status).json({
    success: true,
    data,
    meta: {
      page: meta.page,
      limit: meta.limit,
      total: meta.total,
      totalPages: Math.ceil(meta.total / meta.limit) || 1,
    },
  });
}

export function errorResponse(res, message, status = 400, code = 'BAD_REQUEST', details = null) {
  return res.status(status).json({
    success: false,
    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
  });
}
