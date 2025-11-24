export default {
  // JavaScript/TypeScript files - run ESLint with auto-fix and Prettier
  '*.{js,jsx,ts,tsx,mjs}': ['eslint --fix', 'prettier --write'],

  // Other files - run Prettier only
  '*.{json,css,md,html}': ['prettier --write'],
};
