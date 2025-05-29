---
title: Cryptdatum Data Format Specification
layout: doc
---

<script setup>

const specs = [
  {
    version: '1.0.0-rc',
    status: 'Candidate Release',
    created: '2022-05-10',
    updated: '2025-05-29',
    link: '/specs/v1.0.0-rc'
  },
  // ...more specs
]
</script>

# {{$frontmatter.title}}

<table>
  <thead>
    <tr>
      <th>version</th>
      <th>status</th>
      <th>created</th>
      <th>updated</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr
      v-for="spec in specs"
      :key="spec.version"
      style="cursor:pointer"
      @click="$router.push(spec.link)"
    >
      <td><Badge type="tip" :text="spec.version" /></td>
      <td><code>{{ spec.status }}</code></td>
      <td>{{ spec.created }}</td>
      <td>{{ spec.updated }}</td>
      <td><a :href="spec.link">view</a></td>
    </tr>
  </tbody>
</table>
