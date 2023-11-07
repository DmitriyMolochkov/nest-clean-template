import { ProcessEnv as CurrentProcessEnv } from './ProcessEnv';

declare global {
  namespace NodeJS {
    interface ProcessEnv extends CurrentProcessEnv {}
  }
}

export {};
