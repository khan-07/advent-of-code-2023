import { readFileSync } from "fs"

type MatrixCoordinate = {
  row: number;
  col: number
}

export function solve() {
  const input = readFileSync("day3.txt", "utf-8");
  const lines = input.split("\n");

  const matrix: string[][] = lines.map((line) => {
    //iterate over the line character by character
    return line.split('')
  })

  //iterate over the matrix 
  //for each item , findAdjacentNumber .
  //skip if symbol is a dot
  console.log(solvePart1(matrix))
  console.log(solvePart2(matrix))
}

function solvePart2(matrix: string[][]): number {
  const allNumbersFound = []

  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[0].length; col++) {
      const item = matrix[row][col];
      if (item === '.') {
        continue;
      } else if (item === '*') {
        const adjacentNumbers = findAdjacentNumbers(matrix, row, col)
        allNumbersFound.push(adjacentNumbers)
      }
    }
  }

  const validGearPartNumbers: string[][] = allNumbersFound.filter((partNumbers) => {
    if (partNumbers.length >= 2) {
      return true
    }
    return false
  })
  const sumOfAllRatios = validGearPartNumbers.reduce((acc: number, curr: string[]) => {
    return acc + curr.reduce((a: number, c: string) => {
      return a * parseInt(c)
    }, 1)
  }, 0)

  return sumOfAllRatios
}
function solvePart1(matrix: string[][]): number {
  const allNumbersFound = []

  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[0].length; col++) {
      const item = matrix[row][col];
      if (item === '.') {
        continue;
      } else if (!isNumeric(matrix[row][col])) {
        const adjacentNumbers = findAdjacentNumbers(matrix, row, col)
        allNumbersFound.push(adjacentNumbers)
      }
    }
  }

  const sumOfAllParts = allNumbersFound.reduce((acc: number, curr: string[]) => {
    return acc + curr.reduce((a: number, c: string) => {
      return a + parseInt(c)
    }, 0)
  }, 0)

  return sumOfAllParts
}
function isValidPoint(coordinate: MatrixCoordinate, matrix: string[][]) {
  return coordinate.row >= 0 && coordinate.row < matrix.length && coordinate.col >= 0 && coordinate.col < matrix[0].length
}
function findCompleteNumber(matrix: string[][], row: number, col: number, direction = 0) {
  // Base case: if the current point is invalid or not numeric, return an empty string
  if (!isValidPoint({ row, col }, matrix) || !isNumeric(matrix[row][col])) {
    return '';
  }

  // Process the current point
  let number = matrix[row][col];

  // Recursive calls: explore left and right if direction is 0 (initial call)
  if (direction === 0 || direction === -1) {
    number = findCompleteNumber(matrix, row, col - 1, -1) + number;
  }
  if (direction === 0 || direction === 1) {
    number = number + findCompleteNumber(matrix, row, col + 1, 1);
  }

  return number;
}

function isNumeric(s: string): boolean {
  return !isNaN(s - parseFloat(s));
}

function findAdjacentNumbers(matrix: string[][], row: number, col: number) {
  const adjacentNumbers: string[] = []
  const colLength = matrix[0].length
  const rowLength = matrix.length

  const adjacentCordinates: MatrixCoordinate[] = [
    { row: row - 1, col: col - 1 }, //left  top
    { row: row + 1, col: col - 1 }, //left  bottom
    { row: row - 1, col: col + 1 },  //right  top
    { row: row + 1, col: col + 1 },  //right  bottom
    { row: row, col: col - 1 }, //left
    { row: row, col: col + 1 },  //right
    { row: row - 1, col: col },  //top
    { row: row + 1, col: col },  //bottom
  ]

  const adjacentCoordinates: Record<string, MatrixCoordinate> = {
    "lt": { row: row - 1, col: col - 1 }, //left  top
    "lb": { row: row + 1, col: col - 1 }, //left  bottom
    "rt": { row: row - 1, col: col + 1 },  //right  top
    "rb": { row: row + 1, col: col + 1 },  //right  bottom
    "l": { row: row, col: col - 1 }, //left
    "r": { row: row, col: col + 1 },  //right
    "t": { row: row - 1, col: col },  //top
    "b": { row: row + 1, col: col },  //bottom
  }

  const validAdjacentPoints: MatrixCoordinate[] = [];
  for (let position in adjacentCoordinates as { [key: string]: MatrixCoordinate }) {
    const coordinate = adjacentCoordinates[position]
    //check if both left top and top are numeric
    //if yes return false
    if (isValidPoint(coordinate, matrix)) {
      if (position === "lt") {
        if (isNumeric(matrix[adjacentCoordinates['lt'].row][adjacentCoordinates['lt'].col]) && isNumeric(matrix[adjacentCoordinates['t'].row][adjacentCoordinates['t'].col])) {
          continue;
        }
      }

      if (position === "rt") {
        if (isNumeric(matrix[adjacentCoordinates['rt'].row][adjacentCoordinates['rt'].col]) && isNumeric(matrix[adjacentCoordinates['t'].row][adjacentCoordinates['t'].col])) {
          continue;
        }
      }
      if (position === "lb") {
        if (isNumeric(matrix[adjacentCoordinates['lb'].row][adjacentCoordinates['lb'].col]) && isNumeric(matrix[adjacentCoordinates['b'].row][adjacentCoordinates['b'].col])) {
          continue;
        }
      }
      if (position === "rb") {
        if (isNumeric(matrix[adjacentCoordinates['rb'].row][adjacentCoordinates['rb'].col]) && isNumeric(matrix[adjacentCoordinates['b'].row][adjacentCoordinates['b'].col])) {
          continue;
        }
      }
    }
    validAdjacentPoints.push(adjacentCoordinates[position])
  }

  validAdjacentPoints.forEach((cordinate) => {
    if (isNumeric(matrix[cordinate.row][cordinate.col])) {
      const completeNumber = findCompleteNumber(matrix, cordinate.row, cordinate.col);
      adjacentNumbers.push(completeNumber)
    }

  })

  return adjacentNumbers
  //check if any of the valid adjacent points are valid numbers
}
