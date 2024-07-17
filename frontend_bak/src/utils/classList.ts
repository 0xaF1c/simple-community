export function classList(classList: string[]) {
  return classList.toString().replaceAll(',', ' ');
}