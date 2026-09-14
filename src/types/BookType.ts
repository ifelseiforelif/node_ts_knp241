type BookType = {
    id:number,
    title:string,
    price:number,
    is_active:boolean,
    image?:string
}

type BookCreateType = Omit<BookType, "id">;
export {BookType, BookCreateType}