import Link from "next/link";
import { LegalShell } from "./_components/legal-shell";

export default function NotFound() {
  return (
    <LegalShell eyebrow="404 / ROUTE NOT FOUND" title="That route is unplugged." summary="The requested page does not exist or has moved.">
      <h2>Return to a known route</h2>
      <p><Link href="/">Go to the Spark Plug homepage</Link>, read the <Link href="/docs">documentation</Link>, or check <Link href="/download">release readiness</Link>.</p>
    </LegalShell>
  );
}
