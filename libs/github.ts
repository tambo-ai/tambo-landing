const GITHUB_REPO = 'tambo-ai/tambo'
const FALLBACK_STARS = '2.8k'
const REVALIDATE_SECONDS = 3600 // 1 hour

interface GitHubRepoResponse {
  stargazers_count: number
}

export function formatStarCount(count: number): string {
  if (count >= 1000) {
    const formatted = (count / 1000).toFixed(1)
    return `${formatted}k`
  }
  return count.toString()
}

export async function getGitHubStars(): Promise<string> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
        next: { revalidate: REVALIDATE_SECONDS },
      }
    )

    if (!response.ok) {
      console.warn(`GitHub API returned ${response.status}`)
      return FALLBACK_STARS
    }

    const data: GitHubRepoResponse = await response.json()
    return formatStarCount(data.stargazers_count)
  } catch (error) {
    console.error('Failed to fetch GitHub stars:', error)
    return FALLBACK_STARS
  }
}
