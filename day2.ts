import { readFileSync } from "fs"

const MAX_RED = 12;
const MAX_GREEN = 13;
const MAX_BLUE = 14;

type Game = Stage[]

type Stage = {
  red?: number
  blue?: number
  green?: number
}

type CountTracker = {
  red: number
  blue: number
  green: number
}

function getGameInfo(game: string): Game {
  const stages: string[] = game.split(";");
  const gameInfo: Game = stages.map((stage) => {
    return parseStage(stage)
  })
  return gameInfo;
}

function parseStage(stage: string): Stage {
  //6 red, 1 blue, 3 green
  let colorAndCount = {}
  stage.split(",").forEach((stageInfo) => {
    colorAndCount = { ...colorAndCount, ...parseColorAndCount(stageInfo) }
  })
  return colorAndCount;
}

function parseColorAndCount(colorAndCount: string) {
  const colorCountInfo = colorAndCount.split(" ")
  const count = parseInt(colorCountInfo[1])
  const color = colorCountInfo[2];
  return { [color]: count }
}

function isGamePossible(game: Game): boolean {
  let isPossible = true;
  game.forEach((stage) => {
    Object.keys(stage).forEach((color) => {
      if (color === "red") {
        if (stage.red !== undefined && stage.red > MAX_RED) {
          isPossible = false;
        }
      }
      if (color === "green") {
        if (stage.green !== undefined && stage.green > MAX_GREEN) {
          isPossible = false;
        }
      }
      if (color === "blue") {
        if (stage.blue !== undefined && stage.blue > MAX_BLUE) {
          isPossible = false;
        }
      }
    });
  });
  return isPossible;
}

function getMinimumCubesPerGame(game: Game): CountTracker {
  const minimumCubes: CountTracker = {
    red: 0,
    blue: 0,
    green: 0
  }
  for (let stage of game) {
    if (stage.red && stage.red > minimumCubes.red) {
      minimumCubes.red = stage.red;
    }
    if (stage.blue && stage.blue > minimumCubes.blue) {
      minimumCubes.blue = stage.blue;
    }
    if (stage.green && stage.green > minimumCubes.green) {
      minimumCubes.green = stage.green
    }
  }
  return minimumCubes
}

export function solveDay2() {
  const input: string = readFileSync("day2.txt", "utf-8");
  const gamesInput: string[] = input.split("\n");
  let gameId = 0;

  const games: Game[] = gamesInput.map(gameInput => {
    const prefixRemovedGameInput: string[] = gameInput.split(":");
    const gameRaw: string = prefixRemovedGameInput[1];
    const game: Game = getGameInfo(gameRaw)
    gameId = gameId + 1
    return game
  });
  let sumOfPossibleGames = 0;
  let sumOfProductOfMinimumCubes = 0;
  for (let i = 0; i < games.length; i++) {
    if (isGamePossible(games[i])) {
      sumOfPossibleGames = sumOfPossibleGames + i + 1;
    }

    const minimumCubes = getMinimumCubesPerGame(games[i]);
    sumOfProductOfMinimumCubes = (sumOfProductOfMinimumCubes) + (minimumCubes.red * minimumCubes.green * minimumCubes.blue)

  }

  console.log(sumOfPossibleGames, sumOfProductOfMinimumCubes)
  return sumOfPossibleGames;
}







