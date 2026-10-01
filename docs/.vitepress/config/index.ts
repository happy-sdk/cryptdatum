import { defineConfig } from 'vitepress'
import { shared } from './shared.ts'
import { en } from './en.ts'
export default defineConfig({
  ...shared,

  locales: {
    root: { label: 'English', ...en },
  },
})
