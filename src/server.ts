import express, { Request, Response } from "express";
import "dotenv/config";
import router from "./routes/bookRoutes.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import expressEjsLayouts from "express-ejs-layouts";
import cookieParser from "cookie-parser";
import { authMiddleware } from "./middlewares/authMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cl = console.log;
const PORT = process.env.PORT || 3200;
const HOST = process.env.HOST || "http://localhost";

const app = express();
app.use(cookieParser());
app.use(authMiddleware);
app.set("views", path.join(__dirname, "..", "views"));
app.set("view engine", "ejs");
app.use(expressEjsLayouts);
app.set("layout", path.join(__dirname, "..", "views", "layouts", "main"));

app.use(express.static("public"));
app.use(express.json()); //body -> json

app.get("/cookie", (req: Request, res: Response) => {
  res.cookie("username", "Bob", {
    httpOnly: true,
    maxAge: 2 * 60 * 1000, //2хв
  });
  res.cookie("email", "bob@gmail.com");
  res.send("Cookie created");
});
app.get("/cookie-read", (req: Request, res: Response) => {
  if (req.cookies && req.cookies.username) {
    res.send(`Welcome, ${req.cookies.username}`);
  } else {
    res.send(`Welcome, guest`);
  }
});
app.get("/cookie-remove", (req: Request, res: Response) => {
  if (req.cookies && req.cookies.username) {
    res.clearCookie("username");
    res.send(`Removed cookie`);
  } else {
    res.send(`Cookie not found`);
  }
});

app.get("/", (req: Request<null, null, null, { title: string }>, res) => {
  // res.render("pages/home", {
  //   title: "Home Page",
  //   name: req.query.title,
  // });
  res.redirect("/books");
});
app.use("/books", router);

app.listen(PORT, () => {
  cl(`Server has been started ${HOST}:${PORT}`);
});
