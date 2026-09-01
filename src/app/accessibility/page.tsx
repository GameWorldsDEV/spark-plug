import { LegalShell } from "../_components/legal-shell";
import { detailMetadata } from "@/lib/metadata";

export const metadata = detailMetadata("Accessibility", "Spark Plug website accessibility goals, testing, and feedback.", "/accessibility");

export default function AccessibilityPage() {
  return <LegalShell eyebrow="ACCESSIBILITY / BUILT INTO THE GATE" title="The product story should work without perfect vision, motion, or a mouse." summary="Spark Plug targets WCAG 2.2 AA for the public website and treats accessibility failures as release blockers, not polish requests.">
    <h2>Current measures</h2><ul><li>Keyboard-accessible navigation, controls, links, and profile tabs.</li><li>Visible focus and semantic headings, landmarks, lists, and status regions.</li><li>Reduced-motion alternatives that preserve the hero’s information.</li><li>Responsive layouts tested from 320 pixels through desktop and iPad desktop mode.</li><li>Text labels alongside color, icons, routes, and availability states.</li></ul>
    <h2>Known limits</h2><p>Preview content and interactions continue to change. A passing automated scan does not replace keyboard, screen-reader, zoom, contrast, reduced-motion, and short-viewport review.</p>
    <h2>Report a barrier</h2><p>Email <a href="mailto:support@gameworlds.ai?subject=Spark%20Plug%20accessibility">support@gameworlds.ai</a> with the page, device, browser, assistive technology, and expected outcome. Do not include sensitive node or account data.</p>
  </LegalShell>;
}

