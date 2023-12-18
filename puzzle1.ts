import fs from "fs"

export function solvePuzzle() {
  const puzzleInput = fs.readFileSync("./puzzle1.txt", "utf-8")

  const yy: string[] = puzzleInput.split("\n")

  const numbersSpelledOut: Record<string, string> = {
    "one": '1',
    "two": '2',
    "three": '3',
    "four": '4',
    "five": '5',
    "six": '6',
    "seven": '7',
    "eight": '8',
    "nine": '9'
  }
  function isNumeric(s: string): boolean {
    return !isNaN(s - parseFloat(s));
  }
  function calculateCalibrationValue(line: string): number {
    let first, last;
    for (let i = 0; i < line.length; i++) {
      if (isNumeric(line[i])) {
        if (!first) {
          first = line[i]
        } else {
          last = line[i]
        }
      } else {
        for (const key in numbersSpelledOut) {
          if (key === line.substring(i, i + key.length)) {
            if (!first) {
              first = numbersSpelledOut[key]
              i = i + key.length - 1
            } else {
              last = numbersSpelledOut[key]
            }
          }
        }
      }
    }

    if (first && last) {
      return parseInt(first + last)
    }
    if (first && !last) {
      return parseInt(first + first)
    }

  }

  let calibrationValue = 0
  for (let i = 0; i < yy.length; i++) {
    const lineValue = calculateCalibrationValue(yy[i])
    console.log("Line value", lineValue, "at index ", i, yy[i])
    calibrationValue = calibrationValue + lineValue
  }

  console.log("Final calibration value", calibrationValue)
}

// 29, 83, 13, 24, 42, 14, and 76
