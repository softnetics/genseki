export function toCamelCase(input: string): string {
  return input
    .replace(/[_-](\w)/g, (_, c) => c.toUpperCase()) // handle snake_case and kebab-case
    .replace(/^([A-Z])/, (_, c) => c.toLowerCase()) // handle PascalCase start
}
