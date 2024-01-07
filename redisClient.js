import redis from 'redis';
import {promisify} from 'util'

import dotenv from 'dotenv'
dotenv.config()

const connectionString = process.env.ENVIRONMENT !== 'TEST'? process.env.REDIS_PRODUCTION : 'redis://localhost:6379'
console.log(connectionString)
const client = redis.createClient({url: connectionString});

client.on('error', (err) => console.log('Redis Client Error', err));

await client.connect().catch(a => console.log("cant connect to redis client",a));

await client.set('key', 'value');
const value = await client.get('key');
console.log("value", value)

export default client