/// <reference types="astro/client" />

declare module '*.txt?raw' {
  const content: string;
  export default content;
}
