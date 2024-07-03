import capitalize from "capitalize";

export const formatterCapitalize = (text) => {
  return capitalize.words(text.toLowerCase());
};
