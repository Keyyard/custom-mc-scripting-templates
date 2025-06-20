# Contributing to Custom MC Scripting Templates

Thank you for your interest in contributing! This repository provides categorized templates for Minecraft Bedrock Edition scripting and add-on development. To keep things organized and high quality, please follow these guidelines.

## 📁 Repository Structure

```
custom-mc-scripting-templates/
  default-workspaces/
    ts-starter/
    js-starter/
    ...
  regolith-workspaces/
    ...
  basic-starters/
    new-item/
    new-block/
    ...
  manual-workspaces/
    RP-BP-Basic/
    ...
  marketplace-workspaces/
    ...
```
- **Each category is a folder at the root.**
- **Each template is a subfolder inside its category.**
- **Each template contains all files needed for a working workspace.**

## 📝 Template Requirements
- Must include all files needed for a user to start developing (e.g., manifest, scripts, resource/behavior packs as needed).
- Include a `README.md` in your template folder describing what it does.
- Use clear, descriptive folder names (kebab-case recommended).
- Avoid unnecessary files (e.g., .DS_Store, node_modules, etc.).

## 🏷️ Naming & Categories
- Use existing categories if possible. If your template doesn't fit, propose a new category in your PR.
- Folder names should be descriptive and concise.
- If you think a template worth the community's attention, contact the maintainers to discuss adding a star next to the template.

## 🚦 Pull Request Rules
- One template per PR is preferred.
- Clearly describe your template and its purpose in the PR description.
- Test your template to ensure it works as expected before submitting.
- If adding a new category, update the root README with a short description.

## 💡 Example Template Structure
```
default-workspaces/
  ts-starter/
    README.md
    manifest.json
    ...
```

## 🙏 Thanks
Your contributions help the Minecraft Bedrock community grow! If you have questions, open an issue or ask in your PR.
