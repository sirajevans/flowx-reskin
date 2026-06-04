import { TerminalDashboard } from './components/terminal-dashboard';
import { TerminalCommandMenu } from './components/terminal-command-menu';
import { StartupOverlay } from './components/startup-overlay';

export default function App() {
  return (
    <>
      <TerminalDashboard />
      <TerminalCommandMenu />
      <StartupOverlay />
    </>
  );
}
