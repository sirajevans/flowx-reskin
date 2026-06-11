import * as Dialog from '@radix-ui/react-dialog';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { commandDialogContentClass, commandDialogOverlayClass } from '../ui/commandClasses';

type ChatDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  label?: string;
  overlayClassName?: string;
  contentClassName?: string;
  children: ReactNode;
} & Pick<ComponentProps<typeof Dialog.Content>, 'onOpenAutoFocus'>;

export function ChatDialog({
  open,
  onOpenChange,
  label = 'Chat',
  overlayClassName,
  contentClassName,
  onOpenAutoFocus,
  children,
}: ChatDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={cn(commandDialogOverlayClass, overlayClassName)} />
        <Dialog.Content
          className={cn(commandDialogContentClass, contentClassName)}
          aria-label={label}
          onOpenAutoFocus={onOpenAutoFocus}
        >
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
