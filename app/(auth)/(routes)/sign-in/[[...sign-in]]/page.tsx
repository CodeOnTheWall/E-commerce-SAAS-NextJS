import { SignIn } from "@clerk/nextjs";

// "/" goes automatically to SignIn because of the Clerk Api Keys
export default function Page() {
  return <SignIn />;
}
