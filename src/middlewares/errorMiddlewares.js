import { logger } from "../utils/logger.js";

function errorHandler(err, req, res, next) {
    if (err) {
        logger.error("App error:", {
        message: err.message,
        stack: err.stack,
        });

    if (!err.status) {
        return res.status(500).json({
            message: "something went wrong..."
        });
    }
    return res.status(err.status).json({
        message: err.message
    });     
    }
    next()
};
export default errorHandler;

