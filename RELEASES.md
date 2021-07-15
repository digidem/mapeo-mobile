## Proposed Release Workflow

Inspired by ["A successful Git branching model"](https://nvie.com/posts/a-successful-git-branching-model/). This article is 10 years old, and now recommends:

> If your team is doing continuous delivery of software, I would suggest to adopt a much simpler workflow (like [GitHub flow](https://guides.github.com/introduction/flow/))

However, we do not have enough automated testing in place to do continuous delivery (CD). Deploying a broken release can have a big impact on partners who are in remote locations, therefore we need a manual QA process for the foreseeable future, in particular for testing offline sync which is [hard to test](https://github.com/digidem/mapeo-mobile/issues/326). We do need the benefits of a more complex workflow with clear release cycles.

### Rules / principles

(avoiding having a `master` branch because of naming issues)

**1. `deploy` branch is always deployable/deployed**

No code should reach the `deploy` branch unless it has passed all automated and manual QA checks. Once code is pushed to master we should be able to automatically publish a release.

**2. All development happens against the `develop` branch**

The `develop` branch is where all active development takes place. A contributor should create a new branch from `develop` and create a PR against `develop` when they are ready to merge changes.

**3. No pushes to the `deploy` or `develop` branches, only PRs**

This is to ensure checks have passed:

- PRs to `develop` branch must pass CI testing
- PRs to `deploy` branch must be reviewed with manual QA testing

**4. Only branches called `release/vX.Y.Z` can be merged into `deploy`**

We can add a check to enforce naming, and ensure that `vX.Y.Z` increments the currently deployed tag.

### Release process

**1. Create a new Issue for discussing the next release**

This is where we discuss which features and fixes will be included in the next release. When a feature or fix has its own Issue or PR then this issue should link to it. The team discusses when to cut-off new features and start the release.

**2. Create a branch off the `develop` branch called `release/vX.Y` and open a PR against `deploy`**

No new features should be added to this branch now. Each commit pushed to the release branch will build a new Beta release for testing, and attach it to the PR. Manual QA testers are assigned as "reviewers" on the PR, and when they have tested the build then they can sign-off on the PR. We can add a script to automatically name and create the branch, and automatically create the PR.

The name does not include a `minor` number, since this release cycle is always for new features (for hotfixes/patches see below).

**3. Fast-forward merge `release/vX.Y` PR into `deploy`**

A CI task will run on merge and increment the version number (based on the release branch name), update the changelog (based on conventional commit naming) and tag the release.

A CI task will then run to deploy to the Play Store, F-Droid, and upload release APKs to Github Releases and Amazon S3.

### Contributing process

**1. Create a branch off `develop`, add commits, open PR against `develop`**

Only one feature / fix per PR. Each PR should have a title that follows [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) spec (the title becomes the commit message) - we can enforce this using a CI check. PRs can only be "squashed and merged" into a single commit.

**2. Pass tests and review for next release**

Once the PR has passed automated testing, then it can be considered by the team for inclusion in the next release. Question: Can we automate this, e.g. have a check that will only pass if the PR is mentioned in the release discussion?

**3a. Merge PR into `develop` branch**

If it passes tests and is approved for release, merge into `develop`.

**3b. Rebase on `develop`**

If the PR is not ready for merging, it should be regularly re-based on `develop` so we can check it still passes.

### Hotfixes

Sometimes fixes will need to be quickly released, instead of waiting for the next release cycle.

**1. Create a new branch `release/vX.Y.Z` from `deploy` and PR against `deploy`**

The `develop` branch might already be several commits ahead. The patch should be based on what has been released. `vX.Y` should match the currently deployed release, `Z` should increment for each hotfix.

**2. Cherry-pick from `develop`, or write fix**

If the fix is already in the `develop` branch, cherry-pick fix, or just fix it. One commit per fix.

**3. Same checks as normal release**

CI automated testing should pass, and reviewers are added to PR and approve when manual QA checks pass.

**4. Fast-forward merge `release/vX.Y.Z` PR into `deploy`**

Release will be automatically deployed on merge, same as release process.

**5. Cherry-pick fix into `develop`**

If the fix was not already in `develop`, or changes were made during manual QA, then the fix should be cherry-picked into `develop`.
