# Publishing VeriWCAG Accessibility CI Check to GitHub Marketplace

1. Create a public GitHub repository (e.g., `veriwcag/accessibility-action`) and copy the files from `integrations/github-action/` into the repository root.
2. Run `npm install` once to generate `package-lock.json` and commit it alongside `action.yml`, `package.json`, and `index.mjs`.
3. Tag a release (e.g., `git tag -a v1.0.0 -m "Initial release" && git push origin v1.0.0`).
4. On GitHub, open **Releases → Draft a new release**, check **Publish this Action to the GitHub Marketplace**, choose category **Testing** / **Code quality**, and publish.
5. Developers can then drop `uses: veriwcag/accessibility-action@v1` into any workflow.
