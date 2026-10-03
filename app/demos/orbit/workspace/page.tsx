import {
  getChatGPTUser,
  chatGPTSignInPath,
  chatGPTSignOutPath,
} from "@/app/chatgpt-auth";
import { Dashboard } from "../dashboard";
import { LockKeyhole } from "lucide-react";
export const dynamic = "force-dynamic";
export default async function Workspace() {
  const user = await getChatGPTUser();
  if (!user)
    return (
      <main id="main" className="wrap">
        <div className="orbit-login">
          <LockKeyhole size={38} />
          <h1>Your own workspace.</h1>
          <p>
            Sign in to create, edit and manage your demo projects. Your records
            are private to your account.
          </p>
          <a
            className="button blue"
            href={chatGPTSignInPath("/demos/orbit/workspace")}
            target="_top"
          >
            Sign in with ChatGPT
          </a>
          <p style={{ marginTop: 25, fontSize: 14 }}>
            Just looking?{" "}
            <a href="/demos/orbit" style={{ textDecoration: "underline" }}>
              Explore the sample dashboard
            </a>
            .
          </p>
        </div>
      </main>
    );
  return (
    <Dashboard
      preview={false}
      userName={user.displayName}
      loginUrl={chatGPTSignInPath("/demos/orbit/workspace")}
      logoutUrl={chatGPTSignOutPath("/demos/orbit")}
    />
  );
}
