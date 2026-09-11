import { BookType } from "./BookType.js"

export type BookResponseType = {
    data:null|BookType|BookType[],
    error:null|string,
    status:number
}
