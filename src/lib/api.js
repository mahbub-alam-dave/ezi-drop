import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";
import { collectionNames, dbConnect } from "./dbConnect";


// Get the full user document (with role) from DB
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  if (!session || !session?.user?.email) {
    return null; // Not logged in
  }

  const db = dbConnect(collectionNames.users);
  const user = await db.findOne({ email: session.user.email });

  return user; // { name, email, role, ... }
}
