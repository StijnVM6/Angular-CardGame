export type Deck = { id: string; name: string; cards: string[] };
export type Card = { id: string; name: string; value: number };
export type Profile = {
  id: string;
  name: string;
  login: string;
  password: string;
  token: string;
};
