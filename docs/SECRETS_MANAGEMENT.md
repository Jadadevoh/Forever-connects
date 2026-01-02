# Secrets Management Process

This project enforces strict security practices to prevent the exposure of sensitive information such as API keys, database credentials, and access tokens.

## 1. Environment Variables
- **Storage**: All secrets must be stored in `.env` files (e.g., `.env`, `.env.production`, `.env.local`).
- **Access**: Access these variables in your code using `process.env.VARIABLE_NAME` (Node.js) or `import.meta.env.VITE_VARIABLE_NAME` (Vite).
- **Format**: 
  ```env
  VITE_API_KEY=your_api_key_here
  FIREBASE_SERVICE_ACCOUNT={"your": "json"}
  ```

## 2. Version Control (Git)
- **Ignored Files**: The following files are **strictly ignored** via `.gitignore` and must NEVER be committed:
  - `.env`
  - `.env.production`
  - `.env.local`
  - `functions/.env`
  - `*.pem`, `*.key`
  - `service-account.json` or similar credential files.
- **Verification**: Before every commit, verify that no secret files are in the staging area (`git status`).

## 3. Pre-Commit Check (Manual)
Before pushing code, run the following to ensuring no secrets are tracked:
```bash
# List any tracked .env files (Should appear empty or error if none found)
git ls-files .env .env.production functions/.env

# Search for potential leaks (keys, tokens)
grep -r "API_KEY" . --exclude-dir=node_modules --exclude-dir=.git
```

## 4. Remediation
If a secret is accidentally committed:
1.  **Immediate Action**: Rotate (revoke and regenerate) the compromised key immediately.
2.  **Remove from History**: Remove the file from git history (using `git filter-branch` or `BFG Repo-Cleaner`) if the repo is public. For private, `git rm --cached` and a new commit is the minimum immediate step, but key rotation is still required.
