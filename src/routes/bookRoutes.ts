import { Router, Request, Response } from "express";
import { books } from "../data/books.js";
import { BookCreateType, BookType } from "../types/BookType.js";
import { compareBook, getBooksByTitle } from "../utils/showBooks.js";
import { BookResponseType } from "../types/BookResponseType.js";

const bookRouter = Router();

//отримання всіх книжок, або пошук по ?title=book_name
bookRouter.get(
  "/",
  (
    req: Request<{}, BookResponseType, null, { title: string }>,
    res: Response,
  ) => {
    const exist_book: boolean = books.length > 0;
    const title = String(req.query.title);
    let our_books: BookType[] | null = null;
    if (title !== undefined) {
      our_books = getBooksByTitle(title, books);
    }
    res.render("pages/books", { books, title: "Books" });
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

//отримання книжки за id
bookRouter.get("/:id", (req: Request<{ id: number }>, res) => {
  const id = +req.params.id;
  const book: BookType | undefined = books.find((book) => book.id === id);
  const exist_book: boolean = book !== undefined;
  const response: BookResponseType = {
    data: exist_book ? (book as BookType) : null,
    error: exist_book ? null : "The book not found",
    status: exist_book ? 200 : 404,
  };
  res.status(response.status).json(response);
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
