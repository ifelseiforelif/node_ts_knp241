type AuthorType = {
  id: number;
  name: string;
  surname: string;
};

type AuthorCreateType = Omit<AuthorType, "id">;
export { AuthorType, AuthorCreateType };
