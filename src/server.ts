import express, { Request } from "express"
import "dotenv/config"
import { BookCreateType, BookType } from "./types/BookType.js"
import { books } from "./data/books.js"
import { BookResponseType } from "./types/BookResponseType.js"
import { getBooksByTitle } from "./utils/showBooks.js"

const cl = console.log
const PORT = process.env.PORT || 3200
const HOST = process.env.HOST || "http://localhost"

const app = express()
app.use(express.json()) //body -> json
//middleware - попередній обробник
function compareBook(b1:BookType, b2:BookType):number{
    return b2.id-b1.id
}

app.get('/',(req,res)=>{
    res.writeHead(200,{
        "Content-Type":"text/html"
    })
    res.end("<h2>Hello from express</h2>")
})

app.post('/books',(req:Request<{},BookResponseType,BookCreateType>,res)=>{
    const body = req.body
    const response:BookResponseType = {
        data:null,
        error:null,
        status:500
    }
    if(body!==undefined)
    {
        const id:number = books.length>0?books.sort(compareBook)[0].id+1:1
        const book:BookType = {
            id,
            title:body.title,
            price:body.price,
            is_active:body.is_active
        }
        books.push(book)
        response.data = book
        response.status = 201
    }
    
    res.status(response.status).json(response)
})

//Отримати книжку за id
app.get('/books/:id', (req,res)=>{
    const id:number = +req.params.id
    const book:BookType|undefined = books.find((book)=>book.id===id);
    const exist_book:boolean = (book!==undefined)
    const response:BookResponseType = {
        data:exist_book?book as BookType:null,
        error:exist_book?null:"The book not found",
        status:exist_book?200:404
    };
    res.status(response.status).json(response)
})


//book/?title=

//Отримати всі книжки
app.get('/books',(req,res)=>{
    const exist_book:boolean = books.length>0
    const title = String(req.query.title)
    let our_books:BookType[]|null = null;
    if(title!==undefined)
    {
        our_books = getBooksByTitle(title, books)
    }
  
    const response:BookResponseType = {
        data:exist_book?(our_books!==null?our_books:books):null,
        error:exist_book?null:"Books list is empty",
        status:exist_book?200:404
    };
    res.writeHead(response.status,{
        "Content-Type":"application/json"
    })
    res.end(JSON.stringify(response))
})



app.listen(PORT, ()=>{
    cl(`Server has been started ${HOST}:${PORT}`)
})