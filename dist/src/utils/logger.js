import pino from 'pino';
const logger = pino({
    // This is where Pino-Pretty is implemented
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true, // Makes logs colorful
            translateTime: 'SYS:standard', // Adds a timestamp
        },
    },
});
export default logger;
