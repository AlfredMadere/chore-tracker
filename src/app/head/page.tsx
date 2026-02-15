import { execSync } from "child_process";

export const dynamic = "force-dynamic";

export default function HeadPage() {
  const sha = execSync("git rev-parse HEAD").toString().trim();
  return <pre>{sha}</pre>;
}
