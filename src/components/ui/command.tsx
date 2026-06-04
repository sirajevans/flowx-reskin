import {
  CommandDialog as CommandDialogPrimitive,
  CommandEmpty as CommandEmptyPrimitive,
  CommandGroup as CommandGroupPrimitive,
  CommandInput as CommandInputPrimitive,
  CommandItem as CommandItemPrimitive,
  CommandList as CommandListPrimitive,
  Command as CommandPrimitive,
} from 'cmdk';
import { forwardRef, type ComponentProps } from 'react';
import { cn } from '../../lib/utils';
import { CommandInputDivider } from './CommandInputDivider';
import {
  commandDialogContentClass,
  commandDialogOverlayClass,
  commandEmptyClass,
  commandGroupClass,
  commandInputClass,
  commandInputWrapperClass,
  commandItemClass,
  commandListClass,
  commandRootClass,
  commandShortcutClass,
} from './commandClasses';

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
      className={cn(commandRootClass, className)}
      overlayClassName={cn(commandDialogOverlayClass, overlayClassName)}
      contentClassName={cn(commandDialogContentClass, contentClassName)}
      {...props}
    />
  );
}

const CommandInput = forwardRef<
  HTMLInputElement,
  ComponentProps<typeof CommandInputPrimitive>
>(function CommandInput({ className, ...props }, ref) {
  return (
    <div className={commandInputWrapperClass}>
      <CommandInputPrimitive ref={ref} className={cn(commandInputClass, className)} {...props} />
    </div>
  );
});

function CommandList({ className, ...props }: ComponentProps<typeof CommandListPrimitive>) {
  return <CommandListPrimitive className={cn(commandListClass, className)} {...props} />;
}

function CommandEmpty({ className, ...props }: ComponentProps<typeof CommandEmptyPrimitive>) {
  return <CommandEmptyPrimitive className={cn(commandEmptyClass, className)} {...props} />;
}

function CommandGroup({ className, ...props }: ComponentProps<typeof CommandGroupPrimitive>) {
  return <CommandGroupPrimitive className={cn(commandGroupClass, className)} {...props} />;
}

function CommandItem({ className, ...props }: ComponentProps<typeof CommandItemPrimitive>) {
  return <CommandItemPrimitive className={cn(commandItemClass, className)} {...props} />;
}

function CommandShortcut({ className, ...props }: ComponentProps<'span'>) {
  return <span className={cn(commandShortcutClass, className)} {...props} />;
}

export { CommandInputDivider };

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
};
