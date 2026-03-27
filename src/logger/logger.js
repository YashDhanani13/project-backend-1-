import pino from 'pino';

// For development, use pino-pretty for readable logs
export const logger = pino({
  transport: {
    target: 'pino-pretty'
  }
});

logger.info('Hello Pino!');  
logger.error('This is an error');
export default logger;
