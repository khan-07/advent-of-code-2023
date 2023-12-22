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

  let sum = 0 
  let i = 1
  for(let card of cards) {
    const WinningNumbers = findWinningNumbers(card)
    if(WinningNumbers.length > 0) {
      sum = sum + (2 ** (WinningNumbers.length - 1))
    } 
    i++
  }
}

function findWinningNumbers(card: ScratchCardInfo): number[]{
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
