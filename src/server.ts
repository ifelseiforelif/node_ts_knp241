import http from "node:http"
import fs from "node:fs"
import path from "node:path"
const PORT:number = 4200 

/*
https://shop.com/product?name=phone&price=1000
params
query params
body
*/
const server = http.createServer((req,res)=>{
    const PATH_TO_PAGES = path.join("src","pages") 
    console.log(req.url, path.extname(req.url as string))
    if(req.method==="GET" && path.extname(req.url as string)==='.css')
    {
        const PATH_TO_CSS = path.join("src","styles",req.url as string)
        const content = fs.readFileSync(PATH_TO_CSS)
        res.setHeader("Content-Type", "text/css; charset=utf-8")
        
        res.write(content)
    }
    if(req.method==="GET" && req.url==='/')
    {
        const PATH_TO_INDEX_PAGE = path.join(PATH_TO_PAGES,"index.html")
        const content = fs.readFileSync(PATH_TO_INDEX_PAGE)
        res.setHeader("Content-Type", "text/html; charset=utf-8")
        
        res.write(content)
    }
    else if(req.method==="GET" && req.url==='/about')
    {
        const PATH_TO_ABOUT_PAGE = path.join(PATH_TO_PAGES,"about.html")
        const content = fs.readFileSync(PATH_TO_ABOUT_PAGE)
        res.setHeader("Content-Type", "text/html; charset=utf-8")

        res.write(content)
    }
    else if(req.method === "POST"){
        res.setHeader("Content-Type", "application/json; charset=utf-8")
        const user = {
            name:"Alex",
            age:20
        }
        res.write(JSON.stringify(user))
    }
     else if(req.method === "PUT"){
        res.write(`Ти хочеш оновити дані. Request: ${req.method}`)
    }
    
    res.end()
})
server.listen(PORT,()=>{
    console.log(`Server http://localhost:${PORT} has been started...`)
})