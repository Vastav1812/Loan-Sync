# Instructions for Pushing Code to GitHub

Follow these steps to push your LoanSync code to GitHub:

## Prerequisites

1. Install Git if you haven't already:
   - For macOS: `brew install git`
   - For Windows: Download from [git-scm.com](https://git-scm.com/download/win)
   - For Linux: `sudo apt-get install git` (Ubuntu/Debian) or `sudo yum install git` (Fedora/CentOS)

2. Configure Git with your GitHub credentials:
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

## Pushing to GitHub

### Option 1: If your directory is not yet a Git repository

1. Navigate to your project directory in terminal:
   ```bash
   cd /path/to/loansync
   ```

2. Initialize a Git repository:
   ```bash
   git init
   ```

3. Add the GitHub repository as a remote:
   ```bash
   git remote add origin https://github.com/Vastav1812/Loan-Sync.git
   ```

4. Add all files to staging, excluding those in the .gitignore file:
   ```bash
   git add .
   ```

5. Commit the changes:
   ```bash
   git commit -m "Initial commit of LoanSync app"
   ```

6. Push to GitHub:
   ```bash
   git push -u origin main
   ```
   
   Note: If your default branch is named 'master' instead of 'main', use:
   ```bash
   git push -u origin master
   ```

### Option 2: If your directory is already a Git repository

1. Check if the repository already has a remote:
   ```bash
   git remote -v
   ```

2. If it doesn't have the correct remote, add it:
   ```bash
   git remote add origin https://github.com/Vastav1812/Loan-Sync.git
   ```

3. If it already has a remote with a different URL, update it:
   ```bash
   git remote set-url origin https://github.com/Vastav1812/Loan-Sync.git
   ```

4. Stage your changes:
   ```bash
   git add .
   ```

5. Commit your changes:
   ```bash
   git commit -m "Update LoanSync app with new features"
   ```

6. Push to GitHub:
   ```bash
   git push -u origin main
   ```

## Troubleshooting

### Authentication Issues

If you encounter authentication issues, you might need to:

1. Generate a personal access token on GitHub:
   - Go to GitHub > Settings > Developer settings > Personal access tokens
   - Generate a new token with the 'repo' scope
   - Use this token instead of your password when prompted

2. Use SSH instead of HTTPS:
   - Generate an SSH key if you haven't already: `ssh-keygen -t ed25519 -C "your.email@example.com"`
   - Add the key to your GitHub account
   - Change the remote URL to use SSH: `git remote set-url origin git@github.com:Vastav1812/Loan-Sync.git`

### Branch Issues

If your local branch name doesn't match the remote:

```bash
# First commit all your changes
git branch -m main # Rename your current branch to 'main'
git push -u origin main # Push to the 'main' branch on GitHub
```

## Additional Resources

- [GitHub Docs: Getting started with Git](https://docs.github.com/en/get-started/getting-started-with-git)
- [GitHub Docs: Authenticating with GitHub](https://docs.github.com/en/authentication)
- [Git Documentation](https://git-scm.com/doc) 