import { defineConfig } from 'vitepress'

import { shared } from './shared'
import { en } from './en'
// import { et } from './et'
// import { fi } from './fi'
// import { fr } from './fr'
// import { nl } from './nl'
// import { ru } from './ru'

export default defineConfig({
  ...shared,
  locales: {
    root: { label: 'English', ...en },
  },
})

