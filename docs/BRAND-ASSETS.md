# Brand asset provenance

Retrieved 2026-08-31. Spark Plug uses these marks only to identify compatible
tools, runtimes, services, and the developer. They remain the property of their
owners and do not imply partnership, sponsorship, certification, or endorsement.
All third-party files are local, unmodified copies unless noted.

## Compatible agent and coding tools

| Public asset or tile | Owner | Pinned first-party source | Revision | Terms / license | SHA-256 | Modification |
| --- | --- | --- | --- | --- | --- | --- |
| `public/integrations/openclaw.svg` | OpenClaw | [`openclaw/openclaw`, Linux app icon](https://github.com/openclaw/openclaw/blob/8b76283180b23664b6aaafa82ac7ddd27c98cfb7/apps/linux/src-tauri/icons/icon.svg) | `8b76283180b23664b6aaafa82ac7ddd27c98cfb7` | Upstream repository reports no asserted SPDX license for the mark; trademark rights remain separate | `9eb03f05096830f46db0eeacf3f47fbf60a07f7f95ea41c639b0b3702ec598db` | None |
| `public/integrations/hermes.png` | Nous Research | [`NousResearch/hermes-agent`, website logo](https://github.com/NousResearch/hermes-agent/blob/38b7d0f4cf8a11137d8da5e3d95d7b5b7e41fb46/website/static/img/logo.png) | `38b7d0f4cf8a11137d8da5e3d95d7b5b7e41fb46` | MIT repository; trademark rights remain separate | `2eaff911b9da9b1f1fcc81adb02f4992bb9ea6b781f4dd048cd79349927ddb7a` | None |
| `public/integrations/paperclip.svg` | Paperclip | [`PaperclipAI/paperclip`, documentation favicon](https://github.com/PaperclipAI/paperclip/blob/8478ddbcee6e5a721db9d0f5b302155ac0836fd0/docs/favicon.svg) | `8478ddbcee6e5a721db9d0f5b302155ac0836fd0` | MIT repository; trademark rights remain separate | `7cb6b1400ea9b38c1e9bf3f9250851849856f0311271764bb83105692baade66` | None |
| `public/integrations/codex.png` | OpenAI | Signed Codex desktop bundle resource, `/Applications/ChatGPT.app/Contents/Resources/icon-codex-dark-color.png` | Bundle `com.openai.codex`, version `26.814.41407` (6720), signed by OpenAI OpCo, LLC (`2DC432GLL2`) | Official application artwork used descriptively; OpenAI trademark rights reserved | Source `69fb4384e161be8a20dcb94a9ac34aea4fbfaeb67514110a71e7b0732eccb0fc`; public asset `051c1731e00275c8750fab436141b166c59cce519410681c34dfeca16fda1040` | Resampled from 1024×1024 to 256×256; no visual edits |
| `public/integrations/claude-code.png` | Anthropic | Signed Claude desktop bundle icon, `/Applications/Claude.app/Contents/Resources/electron.icns` | Bundle `com.anthropic.claudefordesktop`, version `1.40609.0`, signed by Anthropic PBC (`Q6L2SF6YDW`) | Official Claude application artwork labels Claude Code compatibility; Anthropic trademark rights reserved | Source ICNS `7d0ffbc29b82d47ec63962f60d6dcb8c0659c62959a19d650191006e0d84cc27`; public asset `c29fb64e11a824ad180813b392de4da890b704ae545a11fb7eece7b6e62850fc` | Exported and resampled to 256×256; no visual edits |

Anthropic does not currently ship a separate Claude Code product icon in the
reviewed `anthropics/claude-code` repository. The official Claude application
mark is therefore shown beside the explicit “Claude Code” label; it is not
presented as a separate Claude Code trademark or partnership badge.

## Other public marks

| Public asset | Owner | Upstream source | Terms / license | Modification |
| --- | --- | --- | --- | --- |
| `public/integrations/hugging-face.svg` | Hugging Face | Official `huggingface/brand-assets`, `hf-logo-monochrome.svg`; see `huggingface.co/brand` | Official brand asset for descriptive compatibility use; trademark rights reserved | SVG formatting optimized; geometry retained |
| `public/engines/vllm.svg` | vLLM project | `vllm-project/media-kit`, `vLLM-Full-Dark-Mode-Logo.svg` | Official media kit; no SPDX license metadata in media-kit repository; trademark rights separate | None |
| `public/engines/colibri.svg` | JustVugg / Colibri | `JustVugg/colibri`, `assets/colibri-logo.svg` | Apache-2.0 repository; trademark rights separate | None |
| `public/engines/comfyui.svg` | Comfy Org | `Comfy-Org/ComfyUI_frontend`, `apps/website/public/affiliates/brand/comfy-full-logo-yellow.svg` | GPL-3.0 repository; brand rights separate | None |
| `public/engines/mlx.svg` | Apple / MLX project | `ml-explore/mlx`, `docs/logo/mlx_logo_dark.svg` | MIT repository; Apple trademark rights separate | None |
| `public/engines/ollama.svg` | Ollama | `ollama/ollama`, `docs/favicon.svg` | MIT repository; trademark rights separate | None |
| `public/connectivity/tailscale.svg` | Tailscale | `tailscale/tailscale`, `client/web/src/assets/icons/tailscale-icon.svg`; see `tailscale.com/press` | Official mark for referential use; trademark rights reserved | None |
| `public/connectivity/headscale.svg` | Headscale project | `juanfont/headscale`, `docs/assets/logo/headscale3-dots.svg` | BSD-3-Clause repository; trademark rights separate | None |
| `public/brand/gameworlds.png` | GameWorlds | Owner-provided source: `/Volumes/Crucible 9/MAC DESKTOP BACKUP/AR-Monsters Test/Assets/gameworlds logo.png` | Owner-authorized first-party brand use | None; SHA-256 `00d81f92a4a639aa158d9e08b1c80b9865d24e1f15456f3259aee71851e1c13b` |

## Remote third-party content

The Rabbit section embeds **Rabbit R1 | AI** by ItsKevin from Sketchfab, model
ID `603e8491e9494904827369f6408a265a`. The model is licensed under
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) and is attributed
visibly beside the viewer. The viewer is not copied into this repository; it
loads from Sketchfab with `dnt=1`. CC BY does not grant Rabbit or Teenage
Engineering trademark, trade-dress, design, partnership, or endorsement rights.

Recheck upstream branding, license terms, and removal requests before each major
public release. Keep Spark Plug and GameWorlds visually primary.
