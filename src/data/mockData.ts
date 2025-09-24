export interface SocialPlatform {
  id: string;
  name: string;
  icon: string;
  color: string;
  connected: boolean;
  followers?: number;
}

export interface Post {
  id: string;
  content: string;
  platforms: string[];
  createdAt: Date;
  likes: number;
  comments: number;
  shares: number;
  status: 'published' | 'scheduled' | 'draft';
}

export interface Comment {
  id: string;
  postId: string;
  platform: string;
  author: string;
  content: string;
  createdAt: Date;
  likes: number;
  avatar?: string;
}

export const socialPlatforms: SocialPlatform[] = [
  {
    id: 'twitter',
    name: 'Twitter',
    icon: '🐦',
    color: '#1DA1F2',
    connected: true,
    followers: 15200,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: '📷',
    color: '#E4405F',
    connected: true,
    followers: 8500,
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: '👤',
    color: '#1877F2',
    connected: true,
    followers: 12800,
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: '📺',
    color: '#FF0000',
    connected: false,
    followers: 2100,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: '💼',
    color: '#0A66C2',
    connected: true,
    followers: 5600,
  },
  {
    id: 'threads',
    name: 'Threads',
    icon: '🧵',
    color: '#000000',
    connected: false,
    followers: 1200,
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: '🎵',
    color: '#000000',
    connected: false,
    followers: 3400,
  },
];

export const mockPosts: Post[] = [
  {
    id: '1',
    content: 'Just launched our new feature! 🚀 Users can now schedule posts across all platforms with a single click. What do you think?',
    platforms: ['twitter', 'instagram', 'linkedin'],
    createdAt: new Date('2024-09-24T10:30:00'),
    likes: 156,
    comments: 23,
    shares: 12,
    status: 'published',
  },
  {
    id: '2',
    content: 'Behind the scenes of our development process 💻 Building something amazing for content creators worldwide!',
    platforms: ['instagram', 'facebook'],
    createdAt: new Date('2024-09-23T15:45:00'),
    likes: 89,
    comments: 15,
    shares: 8,
    status: 'published',
  },
  {
    id: '3',
    content: 'Weekly tech tips: How to optimize your social media strategy for maximum engagement. Thread below 👇',
    platforms: ['twitter', 'threads'],
    createdAt: new Date('2024-09-22T09:15:00'),
    likes: 234,
    comments: 45,
    shares: 28,
    status: 'published',
  },
  {
    id: '4',
    content: 'Exciting announcement coming tomorrow! Stay tuned 😉 #ComingSoon #TechNews',
    platforms: ['twitter', 'instagram', 'facebook', 'linkedin'],
    createdAt: new Date('2024-09-25T14:00:00'),
    likes: 0,
    comments: 0,
    shares: 0,
    status: 'scheduled',
  },
];

export const mockComments: Comment[] = [
  {
    id: '1',
    postId: '1',
    platform: 'twitter',
    author: 'TechEnthusiast',
    content: 'This looks amazing! Can\'t wait to try it out 🔥',
    createdAt: new Date('2024-09-24T10:45:00'),
    likes: 12,
    avatar: '👨‍💻',
  },
  {
    id: '2',
    postId: '1',
    platform: 'instagram',
    author: 'CreativeDesigner',
    content: 'Finally! This is exactly what I needed for my content strategy',
    createdAt: new Date('2024-09-24T11:20:00'),
    likes: 8,
    avatar: '🎨',
  },
  {
    id: '3',
    postId: '1',
    platform: 'linkedin',
    author: 'BusinessPro',
    content: 'Great innovation! This will save so much time for marketers',
    createdAt: new Date('2024-09-24T12:15:00'),
    likes: 15,
    avatar: '📊',
  },
  {
    id: '4',
    postId: '2',
    platform: 'instagram',
    author: 'DevCommunity',
    content: 'Love seeing the development process! Keep up the great work 👏',
    createdAt: new Date('2024-09-23T16:30:00'),
    likes: 6,
    avatar: '💻',
  },
  {
    id: '5',
    postId: '2',
    platform: 'facebook',
    author: 'SocialMediaGuru',
    content: 'Transparency in development is so important. Looking forward to the final product!',
    createdAt: new Date('2024-09-23T17:45:00'),
    likes: 9,
    avatar: '📱',
  },
  {
    id: '6',
    postId: '3',
    platform: 'twitter',
    author: 'MarketingMaven',
    content: 'These tips are gold! Bookmarking this thread 💯',
    createdAt: new Date('2024-09-22T10:30:00'),
    likes: 18,
    avatar: '📈',
  },
];