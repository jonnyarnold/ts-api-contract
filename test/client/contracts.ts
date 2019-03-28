export { APIContract, ClientContract } from "../../src"

export interface IUser {
  username: string
  firstName: string
  lastName: string
}

export type PatchUserContract = {
  requestParams: { username: string }
  requestBody: IUser
  responseBody: IUser
}
