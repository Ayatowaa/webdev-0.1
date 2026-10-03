import {
  getChatGPTUser,
  chatGPTSignInPath,
  chatGPTSignOutPath,
} from "@/app/chatgpt-auth";
import { Dashboard } from "./dashboard";
export const dynamic = "force-dynamic";
export default async function Orbit() {
  const user = await getChatGPTUser();
  return (
    <Dashboard
      preview
      userName={user?.displayName}
      loginUrl={chatGPTSignInPath("/demos/orbit/workspace")}
      logoutUrl={chatGPTSignOutPath("/demos/orbit")}
    />
  );
}
