export function errorHandler(err, req, res, next) {
    const status = err.status || 500;
    const code   = err.code || 'INTERNAL_SERVER_ERROR';
    const message = err.message || 'An unexpected error occurred.';
    
    if(process.env.NODE_ENV !== 'production') {
        console.error(err);
    }

    res.status(status).json({
        error: {
            code,
            message
        }
    });
}