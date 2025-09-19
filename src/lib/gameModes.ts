import { City, Crown, Flag, Polygon } from "@phosphor-icons/react";

export type GameMode = "flag" | "capital" | "shape" | "ultimate";

export interface IGameMode {
  key: GameMode;
  url: string;
  icon: React.ElementType;
}

export const gameModes: IGameMode[] = [
  {
    key: "flag",
    url: "/quiz/flag",
    icon: Flag,
  },
  {
    key: "capital",
    url: "/quiz/capital",
    icon: City,
  },
  {
    key: "shape",
    url: "/quiz/shape",
    icon: Polygon,
  },
  {
    key: "ultimate",
    url: "/quiz/ultimate",
    icon: Crown,
  },
];
