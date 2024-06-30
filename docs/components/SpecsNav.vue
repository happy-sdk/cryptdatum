<template>
  <div>
    <router-link v-if="currentVersion" :to="`/specs/${currentVersion}/`">
      {{ currentVersionLabel }}
    </router-link>
    <router-link v-else to="/specs/v1.0/">
      Specifications
    </router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      versions: [
        { version: 'v1.0', label: 'v1.0 (latest)' },
        { version: 'v1.1', label: 'v1.1 (draft)' }
      ],
      currentVersion: null
    }
  },
  computed: {
    currentVersionLabel() {
      const current = this.versions.find(v => v.version === this.currentVersion)
      return current ? current.label : 'Specifications'
    }
  },
  watch: {
    '$route'() {
      this.setCurrentVersion()
    }
  },
  mounted() {
    this.setCurrentVersion()
  },
  methods: {
    setCurrentVersion() {
      const path = this.$route.path
      const versionMatch = path.match(/\/specs\/(v\d+\.\d+)\//)
      if (versionMatch) {
        this.currentVersion = versionMatch[1]
      }
    }
  }
}
</script>

<style scoped>
/* Add any necessary styling here */
</style>
