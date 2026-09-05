const winston = require('winston');
require('winston-daily-rotate-file');

// Definimos los niveles exactos que pide la consigna (0 es el más crítico)
const customLevelsOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5
  },
  colors: {
    fatal: 'bold white redBG',
    error: 'red',
    warning: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue'
  }
};

// Configuramos la rotación de archivos para los errores
const fileTransport = new winston.transports.DailyRotateFile({
  filename: 'logs/error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  level: 'error', // Solo guarda logs de 'error' y 'fatal'
  maxFiles: '14d', 
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(info => `${info.timestamp} [${info.level}] ${info.message}`)
  )
});

winston.addColors(customLevelsOptions.colors);

const currentEnv = process.env.NODE_ENV || 'development';

// Creamos el logger
const logger = winston.createLogger({
  levels: customLevelsOptions.levels,
  transports: [
    new winston.transports.Console({
      level: currentEnv === 'production' ? 'info' : 'debug',
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(info => `${info.timestamp} [${info.level}] ${info.message}`)
      )
    }),
    fileTransport
  ]
});

module.exports = logger;