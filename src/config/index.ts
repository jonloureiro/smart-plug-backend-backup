export const nodeEnv = process.env.NODE_ENV || 'development';
export const port = process.env.PORT || '8080';
export const databaseUrl = (nodeEnv === 'test')
  ? 'postgres://postgres:postgres@localhost:5432/smart-plug-test'
  : process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/smart-plug';
export const secret = process.env.SECRET || 's3cr3t';
export const expiresIn = process.env.EXPIRES_IN || '604800';
