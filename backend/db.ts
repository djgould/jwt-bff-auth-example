
import {
  Connection,
  ConnectionManager,
  ConnectionOptions,
  createConnection,
  getConnectionManager
} from 'typeorm';
import config from './config';

/**
 * Database manager class
 */
export class Database {
    private connectionManager: ConnectionManager

    constructor() {
        this.connectionManager = getConnectionManager();
    }

    public async getConnection(): Promise<Connection> {
        const CONNECTION_NAME = 'postgres_connection';

        let connection: Connection;

        if (this.connectionManager.has(CONNECTION_NAME)) {
            connection = await this.connectionManager.get(CONNECTION_NAME);

            if (!connection.isConnected) {
                connection = await connection.connect();
            }
        }
        else {
            const connectionOptions: ConnectionOptions = {
                name: CONNECTION_NAME,
                type: 'mysql',
                port: 3306,
                synchronize: true, // true here could cause data loss!
                logging: true,
                host: config.DB_HOST,
                username: config.DB_USERNAME,
                database: config.DB_NAME,
                password: config.DB_PASSWORD,
                entities: [
                    __dirname + '/entities/*.*'
                ]
            };

            connection = await createConnection(connectionOptions);
        }

        return connection
    }
}