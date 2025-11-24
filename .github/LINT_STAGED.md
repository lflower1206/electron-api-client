# Lint-Staged Setup

## Configuration

Lint-staged has been successfully configured to run before each commit via Husky pre-commit hook.

### What Gets Checked

**JavaScript/TypeScript files** (`*.{js,jsx,ts,tsx,mjs}`):

- ESLint with auto-fix (`--fix` flag)
- Prettier formatting

**Other files** (`*.{json,css,md,html}`):

- Prettier formatting only

### Files Modified

- **package.json** - Added `lint-staged` configuration
- **.husky/pre-commit** - Updated to run `npx lint-staged`

### How It Works

1. When you run `git commit`, the pre-commit hook triggers
2. Lint-staged runs only on **staged files** (not the entire codebase)
3. ESLint fixes linting issues automatically where possible
4. Prettier formats all staged files
5. If there are unfixable errors, the commit is blocked
6. Fixed files are automatically added to the commit

### Testing

To test the setup without committing:

```bash
# Stage some files
git add .

# Run lint-staged manually
npx lint-staged
```

### Benefits

✅ **Fast** - Only checks staged files, not the entire project
✅ **Automatic** - Runs on every commit without manual intervention  
✅ **Consistent** - Ensures all committed code follows style guidelines
✅ **Auto-fix** - ESLint and Prettier fix issues automatically when possible
