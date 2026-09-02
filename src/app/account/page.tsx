import { AuthPanel } from "../_components/auth-panel";
import { LegalShell } from "../_components/legal-shell";
import { currentLaunch } from "@/lib/launch-stage";
import { detailMetadata } from "@/lib/metadata";
import { AccountActions } from "../_components/account-actions";

export const metadata = detailMetadata("Account", "Optional Spark Plug Commercial-stage account access.", "/account");

export default function AccountPage() {
  return <LegalShell eyebrow={`${currentLaunch.stage.toUpperCase()} / OPTIONAL ACCOUNT`} title={currentLaunch.accounts ? "Sign in without turning your node into a cloud service." : "Accounts are not active in Preview."} summary="Community local operation never requires an account. Commercial accounts exist only for optional Pro presentation and hosted conveniences.">
    <h2>Local stays local</h2><p>Authentication, subscription, publishing, and encrypted sync metadata remain separate from node prompts, outputs, models, credentials, private routes, and telemetry.</p>
    {currentLaunch.accounts ? <><AuthPanel /><AccountActions /></> : <p><strong>Coming with the Commercial stage.</strong> No sign-in request is accepted by the Preview deployment.</p>}
    <h2>Account recovery and deletion</h2><p>Commercial activation requires tested Google account recovery, session revocation, data export, deletion, subscription handling, and an auditable support path.</p>
  </LegalShell>;
}
