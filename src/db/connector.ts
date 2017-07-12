import { User } from './User'

export function getUserByToken(authentication_token?: string)
{
  return authentication_token ?
    User.findOne({ where: { authentication_token }, attributes: ['id'] })
  : Promise.resolve(null);
}
