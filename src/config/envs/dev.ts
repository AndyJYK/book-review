export const config = {
    db: {
        type: process.env.DB_TYPE,
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        logging: true,
        synchronize: true,
        entities: [process.cwd() + '/dist' + '/**/*.entity.{ts,js}'],
    }
}