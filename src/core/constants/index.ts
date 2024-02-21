export const SEQUELIZE = 'SEQUELIZE';
export const LOGS_REPOSITORY = 'LOGS_REPOSITORY';
export const API_PREFIX = 'api/v1/';
export const KAFKA_CONFIG = {
  clientId: 'kafka-example-client',
  broker: 'kafka:9092',
  groupId: 'pdf-generator-consumer',
  connectionTimeout: 3000,
  authenticationTimeout: 1000,
  reauthenticationThreshold: 10000
};
