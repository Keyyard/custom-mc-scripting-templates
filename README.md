# custom-mc-scripting-templates

[![Used by create-mc-bedrock](https://img.shields.io/npm/v/create-mc-bedrock?label=create-mc-bedrock&color=cb3837&logo=npm)](https://www.npmjs.com/package/create-mc-bedrock)
[![Discord](https://img.shields.io/badge/Discord-join-5865F2?logo=discord&logoColor=white)](https://discord.gg/EJ4swPKJNU)
[![License](https://img.shields.io/badge/license-MIT-orange.svg)](LICENSE)

Community-contributed workspace templates for Minecraft Bedrock add-on development. Surfaced as the **Community Templates** source in [`create-mc-bedrock`](https://www.npmjs.com/package/create-mc-bedrock).

> Not a standalone tool. The CLI fetches templates from this repo when a user selects the Community Templates source.

## Use a template

```bash
npx create-mc-bedrock
# → choose "Community Templates"
# → pick a category → pick a template
```

Manifest UUIDs are regenerated at scaffold time, so no two scaffolds collide.

## Structure

```text
custom-mc-scripting-templates/
  basic-starters/          # focused single-feature starters (custom items, blocks, entities…)
  manual-workspaces/       # hand-tweaked workspaces with no compiler
  marketplace-workspaces/  # templates targeting Minecraft Marketplace
  regolith-workspaces/     # Regolith-powered templates
```

Each category holds one or more template subfolders. Every template must contain everything a user needs to start developing (BP, RP, scripts where relevant, README inside the template).

## v2.0 context

The new **Custom Workspace** shipped with `create-mc-bedrock@2.0.0` is bundled inside the scaffolder itself (powered by [`@keyyard/bedrock-build`](https://www.npmjs.com/package/@keyyard/bedrock-build)) — it's now the recommended default for most users.

Community Templates remain the home for specialized starters that don't fit the default workspace shape: marketplace-targeted packs, Regolith pipelines, hand-tweaked manual workspaces, single-feature drops.

## Contributing

PRs welcome! See **[CONTRIBUTING.md](CONTRIBUTING.md)** for layout requirements and naming conventions.

Quick recipe:

1. Add your template under the appropriate category, with a `README.md` describing what it does.
2. Test that `npx create-mc-bedrock` → Community Templates → your category → your template scaffolds cleanly.
3. Open a PR.

## License

MIT
