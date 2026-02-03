const DISCORD_INVITE_CODE = process.env.DISCORD_INVITE_CODE ?? 'dJNvPEHth6'
const FALLBACK_MEMBERS = '1.6k'
const REVALIDATE_SECONDS = 3600 // 1 hour

export function formatMemberCount(count: number): string {
  if (count >= 1000) {
    const formatted = (count / 1000).toFixed(1)
    return `${formatted}k`
  }
  return count.toString()
}

function isValidDiscordResponse(
  data: unknown
): data is { approximate_member_count: number } {
  return (
    typeof data === 'object' &&
    data !== null &&
    'approximate_member_count' in data &&
    typeof (data as Record<string, unknown>).approximate_member_count ===
      'number'
  )
}

export async function getDiscordMembers(): Promise<string> {
  try {
    const response = await fetch(
      `https://discord.com/api/v9/invites/${DISCORD_INVITE_CODE}?with_counts=true`,
      {
        headers: {
          Accept: 'application/json',
        },
        next: { revalidate: REVALIDATE_SECONDS },
      }
    )

    if (!response.ok) {
      console.warn(`Discord API returned ${response.status}`)
      return FALLBACK_MEMBERS
    }

    const data: unknown = await response.json()

    if (!isValidDiscordResponse(data)) {
      console.warn('Invalid Discord API response shape')
      return FALLBACK_MEMBERS
    }

    return formatMemberCount(data.approximate_member_count)
  } catch (error) {
    console.error('Failed to fetch Discord members:', error)
    return FALLBACK_MEMBERS
  }
}
