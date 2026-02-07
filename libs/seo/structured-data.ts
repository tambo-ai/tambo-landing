type JsonLd = Record<string, unknown>

type MaybeUrl = string | null | undefined

function isNonEmptyString(value: MaybeUrl): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

export function serializeJsonLd(data: JsonLd | readonly JsonLd[]): string {
  return JSON.stringify(data)
    .replace(/<\//g, '<\\/')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

export function getRootStructuredData({
  baseUrl,
  description,
  sameAs,
}: {
  baseUrl: string
  description: string
  sameAs: readonly MaybeUrl[]
}): JsonLd {
  const filteredSameAs = sameAs.filter(isNonEmptyString)

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
        sameAs: filteredSameAs,
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
