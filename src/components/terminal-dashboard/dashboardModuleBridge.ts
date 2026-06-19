type OpenModuleHandler = (moduleId: string) => void;

let openModuleHandler: OpenModuleHandler | null = null;

export function setDashboardOpenModuleHandler(handler: OpenModuleHandler | null) {
  openModuleHandler = handler;
}

export function openDashboardModule(moduleId: string) {
  openModuleHandler?.(moduleId);
}

export function isTerminalModuleCommand(value: string) {
  return value.startsWith('module-');
}

export function resolveTerminalModuleId(value: string) {
  return value.slice('module-'.length);
}
