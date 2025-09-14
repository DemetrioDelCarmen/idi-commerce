'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...tool]]/page.jsx` route
 */
import { theme } from 'https://themer.sanity.build/api/hues?preset=tw-cyan'
import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { LogoSanityIDI } from './components/LogoSanityIDI'
import { apiVersion, dataset, projectId } from './env'
import { schema } from './schema'
import { structure } from './structure';
import { esESLocale } from '@sanity/locale-es-es'
export default defineConfig({
  basePath: '/studio',
  icon: LogoSanityIDI,
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({
      structure,
    }),
    esESLocale(),
    // Vision is a tool that lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion })
  ],
  theme: theme
})
