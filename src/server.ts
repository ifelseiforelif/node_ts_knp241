import express from "express"
import "dotenv/config"
import { BookType } from "./types/BookType.js"
import { books } from "./data/books.js"

const cl = console.log
const PORT = process.env.PORT || 3200
const HOST = process.env.HOST || "http://localhost"

const app = express()

app.get('/',(req,res)=>{
    res.writeHead(200,{
        "Content-Type":"text/html"
    })
    res.end("<h2>Hello from express</h2>")
})

app.get('/books',(req,res)=>{
    res.writeHead(200,{
        "Content-Type":"application/json"
    })
    res.end(JSON.stringify(books))
})



app.listen(PORT, ()=>{
    cl(`Server has been started ${HOST}:${PORT}`)
})