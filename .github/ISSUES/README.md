# Issue creation files

This folder contains issue drafts used by `.github/create_issues.sh` to create GitHub issues via the `gh` CLI.

To create issues from these files, ensure you have the GitHub CLI (`gh`) installed and authenticated, then run the script in the repository root:

```bash
./.github/create_issues.sh
```

Each issue file begins with `Title: ...` on the first line and the remainder is used as the issue body.
