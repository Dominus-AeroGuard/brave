export default function parseJson(value: string): Record<string, any> {
  try {
    return JSON.parse(value);
  } catch (error) {
    return {};
  }
}
