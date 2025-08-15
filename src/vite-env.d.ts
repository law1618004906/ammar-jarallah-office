/// <reference types="vite/client" />

// Declare EasySite runtime on window for TypeScript
declare global {
  interface Window {
    ezsite?: {
      apis?: {
        run: (args: { path: string; param: any[] }) => Promise<{ data: any; error?: string }>;
      };
    };
  }
}

export {};