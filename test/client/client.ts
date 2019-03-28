import { ClientContract, PatchUserContract } from "./contracts";

export const patchUser: ClientContract<PatchUserContract> = async (...user) => {
  const response = await fetch("/user", {
    method: "PATCH",
    body: JSON.stringify(user)
  });

  return response.json();
};
