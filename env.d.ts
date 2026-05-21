declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GOOGLE_DOC_URL?: string;
    }
  }
}