const { RequestLog } = require('../models');

const requestLogger = (req, res, next) => {
    const start = Date.now();

    // Log the incoming request


    // Capture the original send function
    const originalSend = res.send;

    // Override res.send to intercept the response body
    res.send = function (body) {
        const duration = Date.now() - start;

        let logBody = body;
        let dbResponseBody = body;

        try {
            // If body is a JSON string, parse it for prettier logging
            if (typeof body === 'string') {
                try {
                    const parsed = JSON.parse(body);
                    logBody = JSON.stringify(parsed, null, 2);
                    // dbResponseBody is already a string, which is good for TEXT column
                } catch (e) {
                    // Not a JSON string, keep as is
                }
            } else if (typeof body === 'object') {
                logBody = JSON.stringify(body, null, 2);
                dbResponseBody = JSON.stringify(body); // Stringify for storage in TEXT column
            }

        } catch (e) {
        }

        // Save to Database asynchronously (don't await to avoid slowing down response)
        RequestLog.create({
            method: req.method,
            url: req.originalUrl,
            headers: req.headers,
            body: req.body,
            query: req.query,
            responseStatus: res.statusCode,
            responseBody: typeof dbResponseBody === 'string' ? dbResponseBody : String(dbResponseBody),
            durationMs: duration,
            ip: req.ip,
            userAgent: req.get('User-Agent')
        }).catch(err => {

        });

        // Restore original method to avoid double logging if called internally
        // (though res.send usually terminates)
        return originalSend.apply(this, arguments);
    };

    next();
};

module.exports = requestLogger;
