import neo4j, { Driver, Session } from 'neo4j-driver';

const URI = process.env.NEO4J_URI || 'neo4j://localhost:7687';
const USER = process.env.NEO4J_USER || 'neo4j';
const PASSWORD = process.env.NEO4J_PASSWORD || 'password';

let driver: Driver;

try {
  driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
} catch (error) {
  console.error('Failed to initialize Neo4j driver:', error);
}

export function getNeo4jSession(): Session {
  if (!driver) {
    throw new Error('Neo4j driver is not initialized');
  }
  return driver.session();
}

export async function executeCypherQuery(cypher: string, params: Record<string, any> = {}) {
  const session = getNeo4jSession();
  try {
    const result = await session.run(cypher, params);
    return result.records;
  } finally {
    await session.close();
  }
}