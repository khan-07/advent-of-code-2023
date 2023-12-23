import { readFileSync } from "fs"

type ScratchCardInfo = {
  WinningNumbers: number[]
  NumbersDrawn: number[]
}

export function solve() {
  const input = readFileSync("day4.txt", "utf-8");
  const lines = input.split("\n");

  const cards: ScratchCardInfo[] = lines.map(line => {
    const prefixRemoved = line.split(":")
    return getScratchCardInfo(prefixRemoved[1].trim())
  })
  solvePart1(cards)
  console.log(solvePart2(cards))

}

function solvePart2(cards: ScratchCardInfo[]): number {
  let sum = 0
  let i = 1
  const cardMap = initalizeMap(cards)
  // console.log("Initial cards, ", cardMap)
  for (let card of cards) {
    const WinningNumbers: number[] = findWinningNumbers(card)
    //for each copy of card at index in map
    for(let copies = 0; copies < cardMap.get(i).length; copies++) {
      handleCopies(i+1, WinningNumbers, cardMap, cards)
    }
    i++
  }
  // console.log("CardMap at end", cardMap, cardMap.keys())
  for (let card of cardMap.keys()) {
    sum += cardMap.get(card).length
  }
  return sum
}

function handleCopies(i: number, winningNumbers: number[], cardMap: Map<number, ScratchCardInfo[]>, cards: ScratchCardInfo[]) {
  for (let index = i; index < i + winningNumbers.length; index++) {
    const currentArray: ScratchCardInfo[] = cardMap.get(index) || []
    currentArray.push(cards[index - 1])
    cardMap.set(index, currentArray)
  }
}
function initalizeMap(cards: ScratchCardInfo[]): Map<number, ScratchCardInfo[]> {
  const cardMap = new Map()
  for (let i = 0; i < cards.length; i++) {
    cardMap.set(i+1, [cards[i]])
  }
  return cardMap
}
function solvePart1(cards: ScratchCardInfo[]): number {
  let sum = 0
  for (let card of cards) {
    const WinningNumbers = findWinningNumbers(card)
    if (WinningNumbers.length > 0) {
      sum = sum + (2 ** (WinningNumbers.length - 1))
    }
  }
  return sum
}

function processCards() { }
function findWinningNumbers(card: ScratchCardInfo): number[] {
  const winningMap = new Map();
  card.WinningNumbers.forEach(number => {
    winningMap.set(number, true)
  })

  return card.NumbersDrawn.filter(number => winningMap.has(number))

}
function getScratchCardInfo(line: string): ScratchCardInfo {
  const NumbersFound = line.split("|")
  const NumbersDrawn = NumbersFound[1].trim()
  const WinningNumbers = NumbersFound[0].trim()
  return {
    WinningNumbers: getNumbers(WinningNumbers),
    NumbersDrawn: getNumbers(NumbersDrawn)
  }
}

function getNumbers(line: string): number[] {
  const numbers = line.split(" ")

  return numbers.filter(n => n !== "").map((n) => {
    return parseInt(n)
  })
}
