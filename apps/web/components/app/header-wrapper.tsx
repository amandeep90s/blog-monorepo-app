import { getSession } from "@/lib/session";

import HeaderSection from "./header";

export default async function HeaderWrapper() {
  const session = await getSession();

  return <HeaderSection session={session} />;
}
