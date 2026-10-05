import { createBlankWorkspace, createInitialWorkspace, type Comment, type Post, type PostAttachment, type WhatsAppConversation, type WhatsAppMessage, type WorkspaceData } from '../data/mockData'

const databaseName = 'omnichat-local-workspace'
const databaseVersion = 1
const storeName = 'workspace'
const workspaceKey = 'primary'

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('This browser does not support IndexedDB.'))
      return
    }
    const request = window.indexedDB.open(databaseName, databaseVersion)
    request.onupgradeneeded = () => {
      const database = request.result
      if (!database.objectStoreNames.contains(storeName)) database.createObjectStore(storeName)
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('Could not open local workspace storage.'))
    request.onblocked = () => reject(new Error('Local workspace storage is busy in another tab.'))
  })
}

async function readWorkspace(): Promise<WorkspaceData | undefined> {
  const database = await openDatabase()
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, 'readonly')
    const request = transaction.objectStore(storeName).get(workspaceKey)
    request.onsuccess = () => resolve(request.result as WorkspaceData | undefined)
    request.onerror = () => reject(request.error ?? new Error('Could not read the local workspace.'))
    transaction.oncomplete = () => database.close()
    transaction.onerror = () => database.close()
  })
}

export async function loadWorkspace(): Promise<WorkspaceData> {
  const stored = await readWorkspace()
  if (stored) return normalizeWorkspace(stored)
  const initial = createInitialWorkspace()
  await saveWorkspace(initial)
  return initial
}

export async function saveWorkspace(workspace: WorkspaceData): Promise<void> {
  const database = await openDatabase()
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, 'readwrite')
    transaction.objectStore(storeName).put(workspace, workspaceKey)
    transaction.oncomplete = () => { database.close(); resolve() }
    transaction.onerror = () => { database.close(); reject(transaction.error ?? new Error('Could not save the local workspace.')) }
    transaction.onabort = () => { database.close(); reject(transaction.error ?? new Error('Saving the local workspace was interrupted.')) }
  })
}

export async function resetWorkspace(): Promise<WorkspaceData> {
  const initial = createBlankWorkspace()
  await saveWorkspace(initial)
  return initial
}

function normalizeWorkspace(value: WorkspaceData): WorkspaceData {
  return {
    ...value,
    posts: (value.posts ?? []).map(post => ({
      ...post,
      createdAt: new Date(post.createdAt),
      scheduledAt: post.scheduledAt ? new Date(post.scheduledAt) : undefined,
      attachments: (post.attachments ?? []).map(attachment => ({ ...attachment, blob: attachment.blob instanceof Blob ? attachment.blob : new Blob() })),
    })),
    comments: (value.comments ?? []).map(comment => ({ ...comment, createdAt: new Date(comment.createdAt) })),
    conversations: (value.conversations ?? []).map(conversation => ({
      ...conversation,
      consentCapturedAt: conversation.consentCapturedAt ? new Date(conversation.consentCapturedAt) : undefined,
      optedOutAt: conversation.optedOutAt ? new Date(conversation.optedOutAt) : undefined,
      lastInboundAt: conversation.lastInboundAt ? new Date(conversation.lastInboundAt) : undefined,
      messages: (conversation.messages ?? []).map(message => ({ ...message, sentAt: new Date(message.sentAt) })),
    })),
  }
}

interface BackupAttachment {
  id: string
  name: string
  type: string
  size: number
  base64: string
}

interface BackupWorkspace extends Omit<WorkspaceData, 'posts' | 'comments' | 'conversations'> {
  posts: Array<Omit<Post, 'createdAt' | 'scheduledAt' | 'attachments'> & { createdAt: string; scheduledAt?: string; attachments: BackupAttachment[] }>
  comments: Array<Omit<Comment, 'createdAt'> & { createdAt: string }>
  conversations: Array<Omit<WhatsAppConversation, 'consentCapturedAt' | 'optedOutAt' | 'lastInboundAt' | 'messages'> & {
    consentCapturedAt?: string
    optedOutAt?: string
    lastInboundAt?: string
    messages: Array<Omit<WhatsAppMessage, 'sentAt'> & { sentAt: string }>
  }>
}

interface WorkspaceBackup {
  format: 'omnichat-local-backup'
  version: 1
  exportedAt: string
  workspace: BackupWorkspace
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = ''
  const chunkSize = 0x8000
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize))
  }
  return window.btoa(binary)
}

function base64ToBytes(value: string): Uint8Array {
  const binary = window.atob(value)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index)
  return bytes
}

export async function createWorkspaceBackup(workspace: WorkspaceData): Promise<string> {
  const posts = await Promise.all(workspace.posts.map(async post => ({
    ...post,
    createdAt: post.createdAt.toISOString(),
    scheduledAt: post.scheduledAt?.toISOString(),
    attachments: await Promise.all(post.attachments.map(async attachment => ({
      id: attachment.id,
      name: attachment.name,
      type: attachment.type,
      size: attachment.size,
      base64: bytesToBase64(new Uint8Array(await attachment.blob.arrayBuffer())),
    }))),
  })))
  const backup: WorkspaceBackup = {
    format: 'omnichat-local-backup',
    version: 1,
    exportedAt: new Date().toISOString(),
    workspace: {
      ...workspace,
      posts,
      comments: workspace.comments.map(comment => ({ ...comment, createdAt: comment.createdAt.toISOString() })),
      conversations: workspace.conversations.map(conversation => ({
        ...conversation,
        consentCapturedAt: conversation.consentCapturedAt?.toISOString(),
        optedOutAt: conversation.optedOutAt?.toISOString(),
        lastInboundAt: conversation.lastInboundAt?.toISOString(),
        messages: conversation.messages.map(message => ({ ...message, sentAt: message.sentAt.toISOString() })),
      })),
    },
  }
  return JSON.stringify(backup, null, 2)
}

export async function parseWorkspaceBackup(file: File): Promise<WorkspaceData> {
  const parsed = JSON.parse(await file.text()) as WorkspaceBackup
  if (parsed.format !== 'omnichat-local-backup' || parsed.version !== 1 || !parsed.workspace) {
    throw new Error('This file is not a supported OmniChat workspace backup.')
  }
  const workspace: WorkspaceData = {
    ...parsed.workspace,
    posts: parsed.workspace.posts.map(post => ({
      ...post,
      createdAt: new Date(post.createdAt),
      scheduledAt: post.scheduledAt ? new Date(post.scheduledAt) : undefined,
      attachments: post.attachments.map((attachment): PostAttachment => ({
        id: attachment.id,
        name: attachment.name,
        type: attachment.type,
        size: attachment.size,
        blob: new Blob([base64ToBytes(attachment.base64)], { type: attachment.type }),
      })),
    })),
    comments: parsed.workspace.comments.map(comment => ({ ...comment, createdAt: new Date(comment.createdAt) })),
    conversations: parsed.workspace.conversations.map(conversation => ({
      ...conversation,
      consentCapturedAt: conversation.consentCapturedAt ? new Date(conversation.consentCapturedAt) : undefined,
      optedOutAt: conversation.optedOutAt ? new Date(conversation.optedOutAt) : undefined,
      lastInboundAt: conversation.lastInboundAt ? new Date(conversation.lastInboundAt) : undefined,
      messages: conversation.messages.map(message => ({ ...message, sentAt: new Date(message.sentAt) })),
    })),
  }
  return normalizeWorkspace(workspace)
}
