import { Router, Request, Response } from "express";
import { books } from "../data/books.js";
import { BookCreateType, BookType } from "../types/BookType.js";
import { compareBook, getBooksByTitle } from "../utils/showBooks.js";
import { BookResponseType } from "../types/BookResponseType.js";
import { pool } from "../db/db_connection.js";
import upload from "../middlewares/multer.js";
import "dotenv/config";

const bookRouter = Router();

//отримання всіх книжок, або пошук по ?title=book_name
bookRouter.get(
  "/",
  async (
    req: Request<{}, BookResponseType, null, { title: string }>,
    res: Response,
  ) => {
    // const data = await fetch(`${process.env.PATH_TO_JSON_SERVER}/books`)
    // const json = await data.json()
    // res.render("pages/books", { books: json, title: "Books" });
    const data = await pool.query("SELECT * FROM books");

    res.render("pages/books", { books: data.rows, title: "Books" });

    // const response: BookResponseType = {
    //   data: exist_book ? (our_books !== null ? our_books : books) : null,
    //   error: exist_book ? null : "Books list is empty",
    //   status: exist_book ? 200 : 404,
    // };
    // res.writeHead(response.status, {
    //   "Content-Type": "application/json",
    // });
    // res.end(JSON.stringify(response));
  },
);

bookRouter.get("/add-book", (req, res) => {
  res.render("pages/addBook", { title: "Add Book" });
});

bookRouter.post(
  "/add-book",
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      const { title, price, is_active, publication_year } = req.body;

      // Ім'я збереженого файлу
      const image = req.file?.filename ?? null;

      const result = await pool.query(
        `
                INSERT INTO books
                (
                    title,
                    price,
                    is_active,
                    image,
                    publication_year
                )
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *
                `,
        [
          title,
          Number(price),
          is_active === "true",
          image,
          publication_year ? Number(publication_year) : null,
        ],
      );

      console.log("Created book:", result.rows[0]);

      res.redirect("/books");
    } catch (error) {
      console.error(error);

      res.status(500).send("Помилка при додаванні книги");
    }
  },
);

//отримання книжки за id
bookRouter.get("/:id", async (req: Request<{ id: number }>, res) => {
  const id = +req.params.id;
  const data = await pool.query("SELECT * FROM books WHERE id=$1 ", [id]);
  console.log(data.rows[0]);
  res.render("pages/books", { books: data.rows, title: "Books" });
});

//створення книжки
bookRouter.post(
  "/",
  (req: Request<{}, BookResponseType, BookCreateType>, res) => {
    const body = req.body;
    const response: BookResponseType = {
      data: null,
      error: null,
      status: 500,
    };
    if (body !== undefined) {
      const id: number =
        books.length > 0 ? books.sort(compareBook)[0].id + 1 : 1;
      const book: BookType = {
        id,
        title: body.title,
        price: body.price,
        is_active: body.is_active,
      };
      books.push(book);
      response.data = book;
      response.status = 201;
    }

    res.status(response.status).json(response);
  },
);

// удаление книжки по id (DELETE)
bookRouter.delete(
  "/:id",
  (req: Request<{ id: string }, BookResponseType>, res: Response) => {
    const id = Number(req.params.id);
    const bookIndex = books.findIndex((book) => book.id === id);

    if (bookIndex === -1) {
      return res.status(404).json({
        data: null,
        error: "book not found",
        status: 404,
      });
    }

    const [deletedBook] = books.splice(bookIndex, 1);
    return res.status(200).json({
      data: deletedBook,
      error: null,
      status: 200,
    });
  },
);

// полное обновление книжки (PUT)
bookRouter.put(
  "/:id",
  (
    req: Request<{ id: string }, BookResponseType, BookCreateType>,
    res: Response,
  ) => {
    const id = Number(req.params.id);
    const bookIndex = books.findIndex((book) => book.id === id);

    if (bookIndex === -1) {
      return res.status(404).json({
        data: null,
        error: "The book not found",
        status: 404,
      });
    }

    const updatedBook: BookType = {
      id,
      title: req.body.title,
      price: req.body.price,
      is_active: req.body.is_active,
    };
    books[bookIndex] = updatedBook;

    return res.status(200).json({
      data: updatedBook,
      error: null,
      status: 200,
    });
  },
);

export default bookRouter;
