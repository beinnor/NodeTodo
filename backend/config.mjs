import 'dotenv/config';

const database = {
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_LOCAL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  jwt_secret: process.env.JWT_SECRET
}

export default database;
