require('dotenv').config()

export default {
    db: {
        user: process.env.DB_USER           || 'razer',
        password: process.env.DB_PASSWORD   || "Password1!",
        database: process.env.DB_NAME       || "db",
        host: process.env.DB_HOST           || 'localhost',
        port:                                   3306,
        dialect: process.env.DIALECT        || 'mysql',
        dialectOptions: process.env.DIALECT ? {ssl:'Amazon RDS'} : {}
    },
    port: process.env.PORT || 3000,
    tokenSecret: "lyglutfkthkgvvggvkhvgh787654",
    expiry:  "15m"
}
