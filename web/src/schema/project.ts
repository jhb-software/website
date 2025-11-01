import { SITE_URL } from 'astro:env/client'
import type { Project } from 'cms/src/payload-types'
import type { CreativeWork, WithContext } from 'schema-dts'
import { organizationSchema } from './organization'

export const projectSchema = (project: Project): WithContext<CreativeWork> => {
  // TODO: add workExample
  // for that first add the option to the cms to add a link and type of project to the project

  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.excerpt,
    image: typeof project.image === 'object' ? (project.image.url ?? undefined) : undefined,
    creator: organizationSchema(),
    dateCreated: project.startDate,
    dateModified: project.endDate || project.updatedAt,
    url: new URL(project.path, SITE_URL).toString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': new URL(project.path, SITE_URL).toString(),
    },
    keywords: project.tags?.join(', '),
  }
}
