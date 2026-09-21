type BookType = {
    id:number,
    title:string,
    price:number,
    is_active?:boolean,
    image?:string,
    publication_year?: number
}

type BookCreateType = Omit<BookType, "id">;
export {BookType, BookCreateType}