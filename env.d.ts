declare namespace NodeJS {
  interface ProcessEnv {
    PORT:number,
    HOST:string,
    DB_HOST:string,
    DB_PORT:number,
    DB_USER:string,
    DB_PASSWORD:string,
    DB_NAME:string
  }
}