import type { BoardTheme, DiceSkin, PieceSkin } from "../types/game"

export const diceSkins: DiceSkin[] = [
  {
    id: "classic",
    name: "Classic",
    image: "/parshichi_src/dice_skiin/classic/classic.png",
  },
  {
    id: "Vamp",
    name: "Vamp",
    image: "/parshichi_src/dice_skiin/Vamp/Vamp.png",
  },
  {
    id: "Knight",
    name: "Knight",
    image: "/parshichi_src/dice_skiin/Knight/Knight.png",
  },
  {
    id: "Skull",
    name: "Skull",
    image: "/parshichi_src/dice_skiin/Skull/Skull.png",
  },
  {
    id: "Clock",
    name: "Clock",
    image: "/parshichi_src/dice_skiin/Clock/Clock.png",
  },
  {
    id: "Hallo",
    name: "Hallo",
    image: "parshichi_src/dice_skiin/Hallo/Hallo.png",
  },
]

export const boardSkins: BoardTheme[] = [
  {
    id: "classic",
    name: "Classic",
    image: "/parshichi_src/board_skiin/classic.jpg",
  },
  {
    id: "pirates",
    name: "Pirates",
    image: "/parshichi_src/board_skiin/pirates.jpg",
  },
  {
    id: "desert",
    name: "Desert",
    image: "/parshichi_src/board_skiin/desert.jpg",
  },
  {
    id: "halloween",
    name: "Halloween",
    image: "/parshichi_src/board_skiin/halloween.jpeg",
  },
  {
    id: "mushroom",
    name: "Mushroom",
    image: "/parshichi_src/board_skiin/mushroom.jpg",
  },
  {
    id: "christmas",
    name: "Christmas",
    image: "/parshichi_src/board_skiin/christmas.jpeg",
  },
  {
    id: "freez",
    name: "Freez",
    image: "/parshichi_src/board_skiin/freez.jpg",
  },
  {
    id: "Forest",
    name: "Forest",
    image: "/parshichi_src/board_skiin/forest.jpeg",
  },
]

  export function getPieceSkins(color: string): PieceSkin[] {
  return [
    {
      id: "classic",
      name: "Classic",
      image: `/parshichi_src/piece_skiin/classic/${color}.png`,
    },
    {
      id: "fish",
      name: "Fish",
      image: `/parshichi_src/piece_skiin/fish/${color}.png`,
    },
    {
      id: "Camera",
      name: "Camera",
      image: `/parshichi_src/piece_skiin/Camera/${color}.png`,
    },
    {
      id: "Gnome",
      name: "Gnome",
      image: `/parshichi_src/piece_skiin/Gnome/${color}.png`,
    },
    {
      id: "Bear",
      name: "Bear",
      image: `/parshichi_src/piece_skiin/Bear/${color}.png`,
    },
    {
      id: "Cat",
      name: "Cat",
      image: `/parshichi_src/piece_skiin/Cat/${color}.png`,
    },
  ];
}