import { BookType } from "../types/BookType.js"
//BookType[]
const books: Array<BookType> = [
  {
    id: 1,
    title: "Кобзар",
    price: 250,
    is_active: true,
    image: "lake.webp"
  },
  {
    id: 2,
    title: "Тигролови",
    price: 320,
    is_active: true,
    image:"sun.webp"
  },
  {
    id: 3,
    title: "1984",
    price: 400,
    is_active: true
  },
  {
    id: 4,
    title: "Гаррі Поттер",
    price: 450,
    is_active: false
  },
  {
    id: 5,
    title: "Маленький принц",
    price: 280,
    is_active: true
  },
  {
    id: 6,
    title: "Test",
    price: 280,
    is_active: true
  },
  {
    id: 7,
    title: "test",
    price: 180,
    is_active: true
  }
];

export { books };