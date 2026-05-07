# Beebeeb Site Content Map

## Graphify Runs

- `graphify update src` maps the site code surface. It produced `src/graphify-out/GRAPH_REPORT.md` with 23 nodes, 21 edges and 3 detected communities.
- `graphify update src/content/legal` does not map the legal corpus because Graphify indexes code files, not DOCX or plain legal prose.
- A separate one-file content graph was tested, but it produced one node and no edges. For content accuracy, the useful map is the explicit source-to-page mapping below.

## Public Plan Source Of Truth

The pricing page defines the public plan model:

| Plan | Public price | Included storage | Included users | SLA |
| --- | --- | --- | --- | --- |
| Free | EUR 0/mo | 5 GB | 1 | No SLA |
| Basic | EUR 10.99/mo | 1 TB | 1 | No SLA |
| Pro | EUR 54.95/mo | 5 TB base | 1 | No SLA |
| Business | EUR 109.90/mo | 10 TB base | 3 | 99.5% availability target |

The SLA must not introduce additional public plan tiers. Any enterprise-specific availability is a separate custom agreement, not a website plan.

## Legal Source Mapping

| Website page | Source file | Notes |
| --- | --- | --- |
| `/terms` | `~/Downloads/files(3)/01-Terms-of-Service-beebeeb.docx` | English source converted to HTML fragment. |
| `/privacy` | `~/Downloads/files(3)/02-Privacy-Policy-beebeeb.docx` | English source converted to HTML fragment. |
| `/dpa` | `~/Downloads/files(3)/03-Data-Processing-Agreement-beebeeb.docx` | English source converted to HTML fragment. |
| `/aup` and `/acceptable-use` | `~/Downloads/files(3)/mnt/user-data/outputs/beebeeb-legal-package/en/docx/public/04-Acceptable-Use-Policy-beebeeb.docx` | Nested English source used because the top-level file is Dutch. |
| `/cookies` | `~/Downloads/files(3)/05-Cookie-Statement.docx` | English source converted to HTML fragment. |
| `/sub-processors` and `/sub-verwerkers` | `~/Downloads/files(3)/06-Sub-processor-List.docx` | English source converted to HTML fragment; tables are preserved. |
| `/law-enforcement` | `~/Downloads/files(3)/mnt/user-data/outputs/beebeeb-legal-package/en/docx/public/07-Law-Enforcement-Guidelines.docx` | Nested English source used because the top-level file is Dutch. |
| `/transparency` | `~/Downloads/files(3)/08-Transparency-Report.docx` | English source converted to HTML fragment; tables are preserved. |
| `/complaints` and `/klacht` | `~/Downloads/files(3)/10-Complaints-Procedure-DSA.docx` | English source converted to HTML fragment. |
| `/sla` | `~/Downloads/files(3)/mnt/user-data/outputs/beebeeb-legal-package/en/docx/public/11-Service-Level-Agreement.docx` plus pricing-page alignment | Published SLA is adjusted to the current Free, Basic, Pro and Business plan model. |

## Formatting Rules

- Legal pages render the imported fragments through `LegalText.astro`.
- DOCX tables must remain tables in the website, not flattened paragraph runs.
- The first row of each table is treated as the table header.
- Operational placeholders such as `[Data centre name]` are highlighted by the renderer until the final operational values are confirmed.
- Legal links and email addresses are autolinked by the renderer; external links receive `target="_blank"` and `rel="noopener noreferrer"`.

## Open Operational Inputs

- Hosting and backup provider names for the sub-processor list.
- Transactional email provider and helpdesk tool names, if used.
- Accounting package and external accountant details, if used.
- Cookie preference and Matomo opt-out UI location, if the site offers one.
- PGP public key publication location for law-enforcement and complaints contacts.
- First reporting period and numeric values for the Transparency Report.
