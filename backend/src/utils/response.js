/**
 * Standard success response
 */
const successResponse = (res, data, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

/**
 * Standard error response
 */
const errorResponse = (res, message = 'Error occurred', statusCode = 500, errors = null) => {
    const response = {
        success: false,
        message,
    };

    if (errors) {
        response.errors = errors;
    }

    return res.status(statusCode).json(response);
};

/**
 * Paginated response
 */
const paginatedResponse = (res, data, page, limit, total, message = 'Success') => {
    return res.status(200).json({
        success: true,
        message,
        data,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: parseInt(total),
            totalPages: Math.ceil(total / limit),
        },
    });
};

module.exports = {
    successResponse,
    errorResponse,
    paginatedResponse,
};
