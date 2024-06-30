// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import './style.css'


import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'

import SpecsNav from '../../components/SpecsNav.vue'
import VPNavBarMenu from './components/VPNavBarMenu.vue'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    enhanceAppWithTabs(app)
    app.component('SpecsNav', SpecsNav)
    app.component('VPNavBarMenu', VPNavBarMenu)
  }
}
