import { faker } from "@faker-js/faker";

const fillings = [
  "nopales",
  "carnitas",
  "carne asada",
  "pollo",
  "al pastor",
  "barbacoa",
  "lengua",
  "rajas",
  "calabacitas",
  "hongos",
  "pescado",
];

const toppings = [
  "cilantro",
  "onion",
  "lime",
  "salsa verde",
  "salsa roja",
  "pico de gallo",
  "guacamole",
  "crema",
  "queso fresco",
  "radish",
  "cabbage",
  "pickled onions",
];

function generateTaco() {
  const numToppings = faker.number.int({ max: 5, min: 2 });
  const selectedToppings = faker.helpers.arrayElements(toppings, numToppings);

  return {
    filling: faker.helpers.arrayElement(fillings),
    name: `${faker.word.adjective()} ${faker.helpers.arrayElement(fillings)} taco`,
    notes: faker.helpers.maybe(() => faker.lorem.sentence(), {
      probability: 0.6,
    }),
    toppings: selectedToppings,
  };
}

export function generateTacos(count = 50) {
  return Array.from({ length: count }, generateTaco);
}
