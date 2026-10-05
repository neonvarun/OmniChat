import type { PlatformId, Post } from '../data/mockData'

/**
 * Future server-side provider contract. The current browser app intentionally
 * has no implementation of this interface and no provider credentials.
 */
export interface SocialProviderAdapter {
  readonly platform: Exclude<PlatformId, 'whatsapp'>
  publish(post: Post, accountId: string): Promise<{ remotePostId: string; publishedAt: Date }>
  syncComments(accountId: string, cursor?: string): Promise<{ comments: unknown[]; nextCursor?: string }>
  readMetrics(accountId: string, postIds: string[]): Promise<Record<string, number>>
}

export interface WhatsAppProviderAdapter {
  readonly platform: 'whatsapp'
  sendFreeform(input: { phoneNumberId: string; recipient: string; body: string }): Promise<{ messageId: string }>
  sendApprovedTemplate(input: { phoneNumberId: string; recipient: string; templateName: string; locale: string; parameters?: string[] }): Promise<{ messageId: string }>
}
