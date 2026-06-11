import type { RefObject } from 'react';

export type ChatMessage = {
  id: string;
  username: string;
  body: string;
  avatarUrl: string;
  align: 'left' | 'right';
};

export type ChatPanelProps = {
  className?: string;
  onClose?: () => void;
  roomName?: string;
  messages?: ChatMessage[];
  inputRef?: RefObject<HTMLInputElement | null>;
};
