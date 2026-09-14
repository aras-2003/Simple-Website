# Branch governance — required owner setting

Verified 2026-09-13 through repository API: `main`, `staging`, `production` each report `protected: false`; `/rulesets` returns `[]`. This is an enforcement gap, not a passing control. The connected GitHub integration does not expose administration writes. CI and our PR promotion procedure do not substitute for protected branches.

## Apply in GitHub

Open [repository branch settings](https://github.com/aras-2003/Simple-Website/settings/branches). Create one classic branch protection rule for each exact branch name: `main`, `staging`, `production`.

For all three rules:

- Enable **Require a pull request before merging**.
- Leave approving reviews optional (zero required), because this is a single-owner repository.
- Enable **Require status checks to pass before merging**. Select `quality` and `validate promotion path`, with GitHub Actions as the expected source.
- Enable **Do not allow bypassing the above settings**, including administrators.
- Leave **Allow force pushes** and **Allow deletions** disabled.
- Do not require linear history: the approved promotion path uses merge commits.

For `main`, require the branch to be up to date before merging. For `staging` and `production`, leave that option off: merging release branches back into their source would contradict the approved one-way promotion history. Instead require the PR's successful merge-result CI, verify the expected head SHA at merge, then check exact destination-branch CI. The `validate promotion path` workflow enforces only `main → staging` and `staging → production` once its check is mandatory.

Do not require the Cloudflare staging deployment check before merging: that check runs after the staging push. Publication is complete only after the exact staging commit's Workers Build succeeds. Production deployment remains guarded and manual.

Verify after saving: all three branch API results must report `protected: true`, and inspect each rule to confirm both required check names and the bypass/force-push/deletion settings. An empty rulesets list can be valid if classic branch protection is used. Record the verification date and evidence in the release ledger.

GitHub Free supports protection for **public** repositories; no plan upgrade is needed here. Source: [GitHub branch protection documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule), checked 2026-09-13.
