type JsonLd = Record<string, unknown>

export function getRootStructuredData({
  baseUrl,
  description,
  sameAs,
}: {
  baseUrl: string
  description: string
  sameAs: string[]
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: 'Tambo',
        url: baseUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/icon.png`,
        },
        sameAs,
        description,
      },
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: baseUrl,
        name: 'Tambo',
        publisher: {
          '@id': `${baseUrl}/#organization`,
        },
        description,
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${baseUrl}/#software`,
        name: 'Tambo',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Any',
        description,
      },
    ],
  }
}
