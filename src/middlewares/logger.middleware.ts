import { NextFunction, Request, Response } from 'express';
import { logger } from '../config';

const logRequestResponse = (req: Request, res: Response, next: NextFunction) => {
  const startHrTime = global.process.hrtime();

  // Store the original send function
  const originalSend = res.send;

  // Intercept res.send to capture the response body
  res.send = function (body) {
    // When the response finishes
    res.on('finish', () => {
      const elapsedHrTime = global.process.hrtime(startHrTime);
      const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;

      const headers = req.headers;
      let responseBody;
      try {
        responseBody = JSON.parse(body);
      } catch (error) {
        responseBody = body;
      }
      // Log request and response data
      logger.info(
        JSON.stringify({
          time: new Date(),
          host: req.hostname,
          clientRequestIP: req.ip,
          originalUrl: req.originalUrl,
          request: {
            url: req.url,
            path: req.originalUrl,
            body: req.body,
            query: req.query,
            params: req.params,
          },
          method: req.method,
          response: responseBody,
          processTime: `${elapsedTimeInMs.toFixed(3)} ms`,
          headers,
        }),
      );
    });

    // Call the original send method with the response body
    return originalSend.call(this, body);
  };

  next();
};

export { logRequestResponse };
