import { CloseModuleIcon } from '../icons';
import {
  orderPanelFieldClass,
  orderPanelFieldShellLimitClass,
} from '../order/orderPanelClasses';
import { cn } from '../../lib/utils';
import { ChatSendIcon } from './ChatSendIcon';
import {
  chatPanelAvatarClass,
  chatPanelBodyClass,
  chatPanelBubbleClass,
  chatPanelBubbleOwnClass,
  chatPanelCloseBtnClass,
  chatPanelComposerClass,
  chatPanelHeaderClass,
  chatPanelMessageRowClass,
  chatPanelMessageRowRightClass,
  chatPanelMessagesClass,
  chatPanelRootClass,
  chatPanelSendBtnClass,
  chatPanelTitleClass,
  chatPanelUsernameClass,
} from './chatPanelClasses';
import { DEFAULT_CHAT_MESSAGES, DEFAULT_CHAT_ROOM_NAME } from './mockData';
import type { ChatMessage, ChatPanelProps } from './types';

function ChatMessageRow({ message }: { message: ChatMessage }) {
  const isOwn = message.align === 'right';
  const avatar = (
    <div
      className={chatPanelAvatarClass}
      style={{ backgroundImage: `url(${message.avatarUrl})` }}
      aria-hidden
    />
  );

  const bubble = (
    <div className={cn(chatPanelBubbleClass, isOwn && chatPanelBubbleOwnClass)}>
      <div className={chatPanelUsernameClass}>{message.username}</div>
      <div className={chatPanelBodyClass}>{message.body}</div>
    </div>
  );

  return (
    <div
      className={cn(
        chatPanelMessageRowClass,
        isOwn && chatPanelMessageRowRightClass,
      )}
    >
      {isOwn ? (
        <>
          {bubble}
          {avatar}
        </>
      ) : (
        <>
          {avatar}
          {bubble}
        </>
      )}
    </div>
  );
}

export function ChatPanel({
  className = '',
  onClose,
  roomName = DEFAULT_CHAT_ROOM_NAME,
  messages = DEFAULT_CHAT_MESSAGES,
  inputRef,
}: ChatPanelProps) {
  return (
    <div className={cn(chatPanelRootClass, className)}>
      <header className={chatPanelHeaderClass}>
        <h2 className={chatPanelTitleClass}>{roomName}</h2>
        {onClose ? (
          <button
            type="button"
            className={chatPanelCloseBtnClass}
            aria-label="Close chat"
            onClick={onClose}
          >
            <CloseModuleIcon />
          </button>
        ) : null}
      </header>

      <div className={chatPanelMessagesClass}>
        {messages.map((message) => (
          <ChatMessageRow key={message.id} message={message} />
        ))}
      </div>

      <div className={chatPanelComposerClass}>
        <div className={cn(orderPanelFieldShellLimitClass, 'min-w-0 flex-1')}>
          <input
            ref={inputRef}
            type="text"
            className={orderPanelFieldClass}
            placeholder="Message"
            aria-label="Message"
          />
        </div>
        <button type="button" className={chatPanelSendBtnClass} aria-label="Send message">
          <ChatSendIcon />
        </button>
      </div>
    </div>
  );
}
