export type PlatformId = 'linkedin' | 'youtube' | 'instagram' | 'whatsapp' | 'facebook'

export interface SocialPlatform {
  id: PlatformId
  name: string
  color: string
  purpose: 'publishing' | 'messaging'
  accessNote: string
}

export interface PostAttachment {
  id: string
  name: string
  type: string
  size: number
  blob: Blob
}

export interface Post {
  id: string
  content: string
  youtubeTitle?: string
  platforms: PlatformId[]
  createdAt: Date
  scheduledAt?: Date
  attachments: PostAttachment[]
  status: 'draft' | 'scheduled' | 'queued'
}

export interface Comment {
  id: string
  postId: string
  platform: PlatformId
  author: string
  content: string
  createdAt: Date
  status: 'pending' | 'replied'
  reply?: string
}

export interface WhatsAppMessage {
  id: string
  direction: 'inbound' | 'outbound'
  body: string
  sentAt: Date
  kind: 'freeform' | 'template'
}

export interface WhatsAppConversation {
  id: string
  name: string
  phone: string
  optedIn: boolean
  optedOut: boolean
  consentCapturedAt?: Date
  optedOutAt?: Date
  lastInboundAt?: Date
  messages: WhatsAppMessage[]
  sample: boolean
}

export interface WorkspaceSettings {
  displayName: string
  website: string
  bio: string
  notifications: {
    email: boolean
    push: boolean
    comments: boolean
    mentions: boolean
  }
}

export interface WorkspaceData {
  posts: Post[]
  comments: Comment[]
  conversations: WhatsAppConversation[]
  settings: WorkspaceSettings
}

export function createBlankWorkspace(): WorkspaceData {
  return {
    posts: [],
    comments: [],
    conversations: [],
    settings: {
      displayName: 'Your Name',
      website: '',
      bio: '',
      notifications: { email: false, push: false, comments: true, mentions: true },
    },
  }
}

export const socialPlatforms: SocialPlatform[] = [
  { id: 'linkedin', name: 'LinkedIn', color: '#0A66C2', purpose: 'publishing', accessNote: 'Member or Page permissions and app access review' },
  { id: 'youtube', name: 'YouTube', color: '#FF0033', purpose: 'publishing', accessNote: 'Google OAuth, upload scope, and project audit' },
  { id: 'instagram', name: 'Instagram', color: '#C13584', purpose: 'publishing', accessNote: 'Professional account, Meta app review, and media hosting' },
  { id: 'whatsapp', name: 'WhatsApp', color: '#128C7E', purpose: 'messaging', accessNote: 'WhatsApp Business Platform, opt-in, and approved templates' },
  { id: 'facebook', name: 'Facebook', color: '#1877F2', purpose: 'publishing', accessNote: 'Facebook Page access, permissions, and app review' },
]

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60_000)

export function createInitialWorkspace(): WorkspaceData {
  return {
    posts: [],
    comments: [],
    settings: {
      displayName: 'Your Name',
      website: '',
      bio: '',
      notifications: { email: false, push: false, comments: true, mentions: true },
    },
    conversations: [
      {
        id: 'sample-maya',
        name: 'Maya Chen · sample',
        phone: '+1 202 555 0148',
        optedIn: true,
        optedOut: false,
        consentCapturedAt: minutesAgo(60 * 24 * 10),
        lastInboundAt: minutesAgo(95),
        sample: true,
        messages: [
          { id: 'sample-maya-1', direction: 'inbound', body: 'Hi, do you have the event details for next week?', sentAt: minutesAgo(110), kind: 'freeform' },
          { id: 'sample-maya-2', direction: 'outbound', body: 'Yes, doors open at 9:30 AM. I can send the full schedule here.', sentAt: minutesAgo(103), kind: 'freeform' },
          { id: 'sample-maya-3', direction: 'inbound', body: 'That would be great, thank you!', sentAt: minutesAgo(95), kind: 'freeform' },
        ],
      },
      {
        id: 'sample-alex',
        name: 'Alex Rivera · sample',
        phone: '+1 202 555 0149',
        optedIn: true,
        optedOut: false,
        consentCapturedAt: minutesAgo(60 * 24 * 30),
        lastInboundAt: minutesAgo(60 * 26),
        sample: true,
        messages: [
          { id: 'sample-alex-1', direction: 'inbound', body: 'Please let me know when registration opens.', sentAt: minutesAgo(60 * 26), kind: 'freeform' },
        ],
      },
      {
        id: 'sample-jordan',
        name: 'Jordan Lee · sample',
        phone: '+1 202 555 0150',
        optedIn: false,
        optedOut: true,
        optedOutAt: minutesAgo(60 * 2),
        lastInboundAt: minutesAgo(60 * 2),
        sample: true,
        messages: [
          { id: 'sample-jordan-1', direction: 'inbound', body: 'STOP', sentAt: minutesAgo(60 * 2), kind: 'freeform' },
        ],
      },
    ],
  }
}
