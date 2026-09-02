# Spark Plug creator kit

Spark Plug creator packages are declarative data. They cannot execute commands,
carry credentials, change broker authority, silently download models, or start a
runtime. The local app always presents an import review before saving anything.

## Public formats

| Asset | Schema | Boilerplate |
| --- | --- | --- |
| Local AI profile | `schemas/setup-profile.v1.schema.json` | `public/templates/profile-boilerplate.sparkplug-profile` |
| Visual theme | `schemas/theme-package.v1.schema.json` | `public/templates/theme-boilerplate.sparkplug-theme` |
| Motion pack | `schemas/motion-pack.v1.schema.json` | `public/templates/motion-boilerplate.sparkplug-motion` |
| Store listing | `schemas/marketplace-listing.v1.schema.json` | Created during private marketplace submission |

The zero hashes and example identifiers in the profile boilerplate are obvious
placeholders. Replace them with the exact Hugging Face repository, immutable
40-character revision, selected files, file SHA-256 values, byte sizes, and the
license identifier. A placeholder or floating revision cannot be published.

## Model boundary

Profiles reference model files; they do not include or resell them. A user sees
the repository, revision, files, checksums, gating, license, engine, storage, and
memory plan before approving a separate download from the model source. Paid
profile publication fails closed until GameWorlds has reviewed that exact model
revision and its license for the proposed use.

## Theme boundary

Themes expose a fixed palette and presentation vocabulary. Arbitrary CSS, HTML,
JavaScript, remote fonts, network URLs, and executable hooks are not part of the
format. Artwork is a relative, checksummed file with its own license.

## Motion boundary

Motion packs use named UI slots and bounded numeric keyframes. They cannot add
scripts or selectors. Every pack declares a reduced-motion behavior, and the app
may disable any motion that obscures status, harms accessibility, or exceeds its
resource limits.

## Publishing

Anyone may create, fork, import, and share these open formats. An optional Pro
account is required only to submit a free or paid listing to the hosted Spark
Plug marketplace. The private marketplace service handles identity, review,
versioning, payment, support, moderation, and download grants. None of that is
required for local Spark Plug operation.
