/** True when the element accepts keyboard text entry (inputs, textareas, contenteditable). */
export function isEditableElement(element: Element | null): boolean {
  if (!element || !(element instanceof HTMLElement)) return false;
  if (element.isContentEditable) return true;

  const tag = element.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  if (element.getAttribute('role') === 'textbox' || element.getAttribute('role') === 'combobox') {
    return true;
  }

  return false;
}
