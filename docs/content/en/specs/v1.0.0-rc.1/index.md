---
title: Cryptdatum Data Format Specification
version: 1.0.0-rc.1
date: '2022-05-10'
updated: '2025-05-29'
layout: doc
authors:
  - name: Marko Kungla
    email: marko.kungla@gmail.com
    affiliation: ''
    github: mkungla
    twitter: markokungla
    linkedin: kungla
---

<script setup lang="ts">
import { useData } from 'vitepress'
import {
  VPTeamPageTitle,
  VPTeamMembers,
} from 'vitepress/theme'

const { frontmatter } = useData()

const authors = frontmatter.value.authors.map(
  (author) => ({
    ...author,
    avatar: `https://www.github.com/${author.github}.png`,
    title: author.affiliation,
    links: [
      { icon: 'github', link: `https://github.com/${author.github}` },
      {
        icon: 'twitter',
        link: `https://twitter.com/${author.twitter}`,
      },
      {
        icon: 'linkedin',
        link: `https://www.linkedin.com/in/${author.linkedin}`,
      },
    ],
  }),
)
</script>

# {{$frontmatter.title}}

**Version** <Badge type="tip" :text="$frontmatter.version" />

---

| Created | Updated |
| --------------------- | ------------ |
| *{{$frontmatter.date}}* | *{{$frontmatter.updated}}* |

## Authors

<VPTeamMembers size="small" :members="authors" />
