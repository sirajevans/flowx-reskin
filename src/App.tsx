import { TerminalChatDialog } from './components/chat';
import { TerminalDashboard } from './components/terminal-dashboard';
import {
  CommandMenuProvider,
  TerminalCommandMenu,
} from './components/terminal-command-menu';
import { StartupOverlay } from './components/startup-overlay';

export default function App() {
  return (
    <CommandMenuProvider>
      <TerminalDashboard />
      <TerminalCommandMenu />
      <TerminalChatDialog />
      <StartupOverlay />
    </CommandMenuProvider>
  );
}
