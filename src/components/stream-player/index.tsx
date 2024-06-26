'use client'

import { LiveKitRoom } from '@livekit/components-react'

import { env } from '@/env'
import { useViewerToken } from '@/hooks/use-viewer-token'
import { cn } from '@/lib/utils'
import { userChatSidebar } from '@/store/user-chat-sidebar'

import { Chat, ChatSkeleton } from '../chat'
import { ChatToggle } from '../chat/chat-toggle'
import { AboutCard, AboutCardSkeleton } from './about-card'
import { Header, HeaderSkeleton } from './header'
import { InfoCard, InfoCardSkeleton } from './info-card'
import { Video, VideoSkeleton } from './video'

type CustomStream = {
  id: string
  isLive: boolean
  isChatDelayed: boolean
  isChatEnabled: boolean
  isChatFollowersOnly: boolean
  thumbnailUrl: string | null
  name: string
}

type CustomUser = {
  id: string
  username: string
  bio: string | null
  stream: CustomStream | null
  imageUrl: string
  _count: { followedBy: number }
}

type StreamPlayerProps = {
  user: CustomUser
  stream: CustomStream
  isFollowing: boolean
}

export function StreamPlayer({ isFollowing, stream, user }: StreamPlayerProps) {
  const { identity, name, token } = useViewerToken(user.id)
  const { collapsed } = userChatSidebar((state) => state)

  if (!token || !name || !identity) {
    return <StreamPlayerSkeleton />
  }

  return (
    <>
      {collapsed && (
        <div className="fixed right-2 top-[100px] z-50 hidden lg:block">
          <ChatToggle />
        </div>
      )}

      <LiveKitRoom
        token={token}
        serverUrl={env.NEXT_PUBLIC_LIVEKIT_API_URL}
        className={cn(
          'grid h-[calc(100vh_-_80px)] grid-cols-1 lg:grid-cols-3 lg:gap-y-0 xl:grid-cols-3 2xl:grid-cols-6',
          collapsed && 'lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2',
        )}
      >
        <div className="hidden-scrollbar col-span-1 space-y-4 pb-10 lg:col-span-2 lg:overflow-y-auto xl:col-span-2 2xl:col-span-5">
          <Video hostName={user.username} hostIdentity={user.id} />
          <Header
            hostName={user.username}
            hostIdentity={user.id}
            viewerIdentity={identity}
            imageUrl={user.imageUrl}
            isFollowing={isFollowing}
            name={stream.name}
          />
          <InfoCard
            hostIdentity={user.id}
            viewerIdentity={identity}
            name={stream.name}
            thumbnailUrl={stream.thumbnailUrl}
          />
          <AboutCard
            hostIdentity={user.id}
            hostName={user.username}
            bio={user.bio}
            followedByCount={user._count.followedBy}
            viewerIdentity={identity}
          />
        </div>

        <div className={cn('col-span-1', collapsed && 'hidden')}>
          <Chat
            viewerName={name}
            hostName={user.username}
            hostIdentity={user.id}
            isFollowing={isFollowing}
            isChatEnabled={stream.isChatEnabled}
            isChatDelayed={stream.isChatDelayed}
            isChatFollowersOnly={stream.isChatFollowersOnly}
          />
        </div>
      </LiveKitRoom>
    </>
  )
}

export function StreamPlayerSkeleton() {
  return (
    <div className="grid h-[calc(100vh_-_80px)] grid-cols-1 lg:grid-cols-3 lg:gap-y-0 xl:grid-cols-3 2xl:grid-cols-6">
      <div className="hidden-scrollbar col-span-1 space-y-4 pb-10 lg:col-span-2 lg:overflow-y-auto xl:col-span-2 2xl:col-span-5">
        <VideoSkeleton />
        <HeaderSkeleton />
        <InfoCardSkeleton />
        <AboutCardSkeleton />
      </div>

      <div className="col-span-1">
        <ChatSkeleton />
      </div>
    </div>
  )
}
