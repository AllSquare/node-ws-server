import * as Sequelize from 'sequelize'
import * as fs from 'fs';

const dialectOptions = (process.env.SSL !== 'disabled' ? {
  ssl: { ca: fs.readFileSync('config/as-ca.pem') },
} : null)

export default new Sequelize(process.env.DATABASE_URL, {
  define: {
    underscored: true,
  },
  dialectOptions
})
