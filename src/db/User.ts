import db from './'
import * as Sequelize from 'sequelize'

export const User = db.define('users', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  authentication_token: { type: Sequelize.STRING },
}, {
  timestamps: true,
  paranoid: true,
})

export default User
