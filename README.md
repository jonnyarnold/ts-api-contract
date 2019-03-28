# TypeScript API Contracts

This package provides a way to provide better type safety for Express servers
and their clients.

> This package is **currently not used in production:** this package aims to
> demonstrate the concept of API Contracts. Please use extreme caution when
> using this in production, as there is likely to be some unexpected behaviour.

## The Problem

In Express, you define a route like this:

```ts
const getUser = async (req, res) => {
  const username = req.params.username
  const user = await db.getUser(username)

  res.status(200).send({
    username,
    displayName: user.username
  })
}
```

By default, properties like `req.params` and `req.body` are of type `any`.
Similarly, the response body `res.send` accepts `any`.
Surely we can do better than this?

The client for this API is also loosely typed:

```ts
const getUser = ({ username }) => fetch(`/user/${username}`)
```

How do we know that `/user` accepts a parameter `username`, and what type is it?
What is the type of the response?

## The Solution

API Contracts provides you with three useful types to give your server and
client more type safety:

- `Contract` is used to define how your server and client will interact:

```ts
type GetUserContract = {
  requestParams: { username: string }
  responseBody: { username: string; displayName: string }
}
```

- `APIContract` takes your `Contract` and type-checks your request parameters,
  body and response body:

```ts
const getUser: APIContract<GetUserContract> = async (req, res) => {
  const username = req.params.username // req.params : { username: string }
  const user = await db.getUser(username)

  res.status(200).send({ // res.send({ username: string; displayName: string })
    username,
    displayName: user.username
  })
}
```

- `ClientContract` takes your `Contract` and type-checks your arguments and
  response:

```ts
// getUser : ({ username: string }) => { username: string; displayName: string }
const getUser: ClientContract<GetUserContract> =
  ({ username }) => fetch(`${api}/user/${username}`)
```

## Usage

- Install the package:

```
npm install --save-dev ts-api-contract
```

It's recommended to split your code into a Client package (containing the
contracts and the client) and a Server package (containing Express), which
ensures that unnecessary dependencies are not installed into the UI.

- For each endpoint, create a contract type in the client package:

```ts
// client/contracts.ts

export { APIContract, ClientContract } from "ts-api-contract"

export interface IUser {
  username: string
  firstName: string
  lastName: string
}

export type PatchUserContract = {
  requestParams: { username: string }
  requestBody: Partial<IUser>
  responseBody: IUser
}
```

> You could type-check your contracts against `Contract` in the package, but
> this will cause some duplication in your definition:
> ```ts
> import { Contract } from "ts-api-contract"
>
> export type PatchUserContract: Contract<
>   { username: string },
>   Partial<IUser>,
>   IUser
> > = {
>   requestParams: { username: string }
>   requestBody: Partial<IUser>
>   responseBody: IUser
> }
> ```
>
> Instead, I'd recommend just reading `Contract` in this repository.

- Next, write your client method (in the client package, duh):

```ts
// client/client.ts

import { ClientContract, PatchUserContract } from "./contracts";

export const patchUser: ClientContract<PatchUserContract> = async (...user) => {
  const response = await fetch("/user", {
    method: "PATCH",
    body: JSON.stringify(user)
  });

  return response.json();
};
```

- Finally, write your route handler in your server package:

```ts
// server/server.ts

import { APIContract, PatchUserContract } from "client/contracts"

const patchUser: APIContract<PatchUserContract> = async (req, res) => {
  const username = req.params.username;
  const user = req.body;
  const updatedUser = await db.patch(username, user);

  res.status(200).send(updatedUser);
};
app.patch("/user/:username", patchUser);
```

## Problems?

This package aims to demonstrate the concept of API Contracts. If you've
spotted a problem or would like to improve this, then submit a Pull Request!
