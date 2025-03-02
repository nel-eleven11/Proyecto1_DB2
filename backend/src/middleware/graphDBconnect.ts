import neo4j from 'neo4j-driver';

const URI: string = process.env.NEO4J_URI as string;
const USER: string = process.env.NEO4J_USERNAME as string;
const PASSWORD: string = process.env.NEO4J_PASSWORD as string;

console.log('Initializing driver with:', { URI, USER, PASSWORD: '[REDACTED]' });

const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));

(async () => {
  try {
    console.log('Verifying connectivity...');
    const serverInfo = await driver.getServerInfo();
    console.log('Connection established');
    console.log('Server Info:', serverInfo);
  } catch (err: any) {
    console.error(`Connection error: ${err.message}`);
    console.error('Stack:', err.stack);
    if (err.cause) console.error('Cause:', err.cause);
  }
})();

export const executeCypherQuery = async (
  statement: string,
  params: Record<string, any> = {}
) => {
  const session = driver.session({ database: 'neo4j' });
  try {
    console.log('Executing query:', statement);
    const result = await session.run(statement, params);
    return result;
  } catch (error) {
    console.error('Query execution failed:', error);
    throw error;
  } finally {
    await session.close();
  }
};

process.on('exit', () => {
  driver.close();
});

export { driver };
