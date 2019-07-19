export interface Config {
  include?: string[];
  exclude?: string[];
  files?: {
    [path: string]: string;
  };
}
