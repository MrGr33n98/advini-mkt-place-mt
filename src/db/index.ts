import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Use mock data in development if no database URL is provided
const connectionString = process.env.POSTGRES_URL || 'postgresql://mock:mock@localhost:5432/mock';

let db: any;

try {
  // Configure postgres client
  const client = postgres(connectionString, {
    ssl: process.env.NODE_ENV === 'production',
    max: 1,
    connect_timeout: 5
  });
  
  db = drizzle(client);
} catch (error) {
  console.warn('Database connection failed, using mock data for development');
  // Create a mock db object for development
  db = {
    select: () => ({ from: () => ({ where: () => [] }) }),
    insert: () => ({ values: () => ({ returning: () => [] }) }),
    update: () => ({ set: () => ({ where: () => [] }) }),
    delete: () => ({ where: () => [] })
  };
}

export { db };