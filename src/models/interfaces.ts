export interface GenerateChatTextOptions {
  context: string | string[];
  prompt: string;
  history?: string;
  temperature?: number;
}
