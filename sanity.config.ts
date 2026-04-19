import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './src/sanity/schemas'
import { sanityEnv } from './src/sanity/env'

export default defineConfig({
  name: 'thegoldiraguide',
  title: 'The Gold IRA Guide',
  projectId: sanityEnv.projectId,
  dataset: sanityEnv.dataset,
  basePath: '/studio',
  plugins: [
    structureTool(),
    visionTool({ defaultApiVersion: sanityEnv.apiVersion }),
  ],
  schema: { types: schemaTypes },
})
