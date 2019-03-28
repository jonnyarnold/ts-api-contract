import express = require("express");
import { APIContract, IUser, PatchUserContract } from "../client/contracts";

const app = express();
const db = {
  patch: (username: string, user: IUser) =>
    Promise.resolve({ username, ...user })
};

const patchUser: APIContract<PatchUserContract> = async (req, res) => {
  const username = req.params.username;
  const user = req.body;
  const updatedUser = await db.patch(username, user);

  res.status(200).send(updatedUser);
};
app.patch("/user/:username", patchUser);
