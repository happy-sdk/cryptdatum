// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import { useRoute, type Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'

import SpecsNav from './components/SpecsNav.vue'
import VPNavBarMenu from './components/VPNavBarMenu.vue'

import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'sidebar-nav-before': () => {
        const route = useRoute()
        console.log(route.path)
        if (route.path.startsWith('/specs/v')) {
          return h(SpecsNav)
        }
      },
    })
  },
  enhanceApp({ app /* router, siteData */ }) {
    enhanceAppWithTabs(app)
    app.component('VPNavBarMenu', VPNavBarMenu)
  },
} satisfies Theme
