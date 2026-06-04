import {
  CommandDialog as CommandDialogPrimitive,
  CommandEmpty as CommandEmptyPrimitive,
  CommandGroup as CommandGroupPrimitive,
  CommandInput as CommandInputPrimitive,
  CommandItem as CommandItemPrimitive,
  CommandList as CommandListPrimitive,
  CommandSeparator as CommandSeparatorPrimitive,
  Command as CommandPrimitive,
} from 'cmdk';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';
import {
  commandDialogContentClass,
  commandDialogOverlayClass,
  commandEmptyClass,
  commandGroupClass,
  commandInputClass,
  commandInputIconClass,
  commandInputWrapperClass,
  commandItemClass,
  commandListClass,
  commandRootClass,
  commandSeparatorClass,
  commandShortcutClass,
} from './commandClasses';

function CommandSearchIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M7.333 12.667A5.333 5.333 0 1 0 7.333 2a5.333 5.333 0 0 0 0 10.667ZM14 14l-2.9-2.9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Command({ className, ...props }: ComponentProps<typeof CommandPrimitive>) {
  return <CommandPrimitive className={cn(commandRootClass, className)} {...props} />;
}

function CommandDialog({
  className,
  overlayClassName,
  contentClassName,
  label = 'Command menu',
  ...props
}: ComponentProps<typeof CommandDialogPrimitive>) {
  return (
    <CommandDialogPrimitive
      label={label}
      overlayClassName={cn(commandDialogOverlayClass, overlayClassName)}
      contentClassName={cn(commandDialogContentClass, className, contentClassName)}
      {...props}
    />
  );
}

function CommandInput({ className, ...props }: ComponentProps<typeof CommandInputPrimitive>) {
  return (
    <div className={commandInputWrapperClass}>
      <CommandSearchIcon className={commandInputIconClass} />
      <CommandInputPrimitive className={cn(commandInputClass, className)} {...props} />
    </div>
  );
}

function CommandList({ className, ...props }: ComponentProps<typeof CommandListPrimitive>) {
  return <CommandListPrimitive className={cn(commandListClass, className)} {...props} />;
}

function CommandEmpty({ className, ...props }: ComponentProps<typeof CommandEmptyPrimitive>) {
  return <CommandEmptyPrimitive className={cn(commandEmptyClass, className)} {...props} />;
}

function CommandGroup({ className, ...props }: ComponentProps<typeof CommandGroupPrimitive>) {
  return <CommandGroupPrimitive className={cn(commandGroupClass, className)} {...props} />;
}

function CommandSeparator({
  className,
  ...props
}: ComponentProps<typeof CommandSeparatorPrimitive>) {
  return <CommandSeparatorPrimitive className={cn(commandSeparatorClass, className)} {...props} />;
}

function CommandItem({ className, ...props }: ComponentProps<typeof CommandItemPrimitive>) {
  return <CommandItemPrimitive className={cn(commandItemClass, className)} {...props} />;
}

function CommandShortcut({ className, ...props }: ComponentProps<'span'>) {
  return <span className={cn(commandShortcutClass, className)} {...props} />;
}

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
};
