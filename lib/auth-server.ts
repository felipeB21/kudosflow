import { headers } from "next/headers";
import { auth } from "./auth";

export const getServerSession = async () => {
  "use cache: private";
  return await auth.api.getSession({
    headers: await headers(),
  });
};
