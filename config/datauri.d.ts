declare module 'datauri' {
  export default class Datauri {
    content: string;
    format(path: string, buffer: Buffer): void;
  }
}
