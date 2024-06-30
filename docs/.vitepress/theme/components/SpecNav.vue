<script setup>
import VPFlyout from 'vitepress/dist/client/theme-default/components/VPFlyout.vue'
import VPMenuLink from 'vitepress/dist/client/theme-default/components/VPMenuLink.vue'
import { isActive } from 'vitepress/dist/client/shared'
import { useData } from 'vitepress'
import { computed }from 'vue'


const { theme, page } = useData()


const currentSpec = computed(() => {
  console.log()
  const current = theme.value.specs?.items.find((spec) => isActive(page.value.relativePath, spec.activeMatch || spec.link, !!spec.activeMatch))
  return current ? current.text : theme.value.specs?.title
})

</script>

<template>
  <VPFlyout
    v-if="theme.specs.items.length"
    class="VPNavBarTranslations"
    :label="currentSpec"
    :button="currentSpec"
  >
    <div class="items">
      <VPMenuLink v-for="spec in theme.specs.items" :key="spec.link" :item="spec" />
    </div>
  </VPFlyout>
</template>

<style scoped>
.VPNavBarTranslations {
  display: none;
}

@media (min-width: 1280px) {
  .VPNavBarTranslations {
    display: flex;
    align-items: center;
  }
}

.title {
  padding: 0 24px 0 12px;
  line-height: 32px;
  font-size: 14px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}
</style>
