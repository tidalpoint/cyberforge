/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').options} */

const config = {
  printWidth: 120,
  singleQuote: true,
  semi: false,
  plugins: ['prettier-plugin-tailwindcss', '@trivago/prettier-plugin-sort-imports'],
  importOrder: ['^react', '<THIRD_PARTY_MODULES>', '^@/(.*)$', '^[./]'],
}

export default config
