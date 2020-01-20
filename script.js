// tablice przechowujące square'y
const player_squares = [];
const computer_squares = [];

let playerCounter = 0;
let computerCounter = 0;
let ShipSum = 35; // suma wszystkich części statków
let firstRow = 0;
let firstColumn = 0;
let algCounter = 0; // iterator algorytmu komputera
let direction = 'right'; // defaultowy kierunek right
let computerShot = 0;
let isFirstHit = true;
let randElement;

function getPosition() {
	$('.square').each((index, element) => {
		$(element).on('click', () => {
		})
	})
}
function isHorizontal() {
	return Math.round(Math.random()) == 0;
}
function randPosition() {
	return Math.floor(Math.random() * 12);
}
function isEmptySqaure(shipPart, array, row, column, counter, direction) {
	if (direction) {
		if (column >= 0 && column <= array.length - shipPart) {
			return (array[row][column + counter].data('value') == 0);
		} else {
			return (array[row][column - counter].data('value') == 0);
		}
	} else {
		if (row >= 0 && row <= array.length - shipPart) {
			return (array[row + counter][column].data('value') == 0);
		} else {
			return (array[row - counter][column].data('value') == 0);
		}
	}
}
function createGameField(array, board, dimension) {
	for (let r = 0; r < dimension; r++) {
		array[r] = [];
		for (let c = 0; c < dimension; c++) {
			array[r][c] = $("<div>").addClass('square');
			array[r][c].data('r', r);
			array[r][c].data('c', c);
			array[r][c].data('value', 0); // 0 - puste pole, 1 - otoczenie statku, 2 - element statku
			$(board).append(array[r][c]);
		}
	}
}
function createShip(array, shipPart, shipNumber, hiddenShip) {
	let counter = 0;
	const tempArray = []; // tablica przetrzymująca elementy o data(value, 2) - statki
	const surroundingArray = []; // tablica przetrzymująca elementy o data(value, 1) - otoczenie statków
	let direction = isHorizontal();
	let row = randPosition();
	let column = randPosition();
	while (counter != shipPart) {
		// kierunek horyzontalny - po column'ach
		if (direction) {
			if (column >= 0 && column <= array.length - shipPart) { // przypadek I
				if (isEmptySqaure(shipPart, array, row, column, counter, direction)) {
					tempArray.push(array[row][column + counter]);
					for (let i = -1; i <= 1; i++) {
						if (row - i >= 0 && row - i < array.length && column - 1 >= 0 && column - 1 < array.length) {
							surroundingArray.push(array[row - i][column - 1]);
						}
						if (row - i >= 0 && row - i < array.length && column + shipPart > 0 && column + shipPart < array.length) {
							surroundingArray.push(array[row - i][column + shipPart]);
						}
					}
					if (row > 0) { // zwraca górne otoczenie statku
						surroundingArray.push(array[row - 1][column + counter])
					}
					if (row < array.length - 1) {  // zwraca dolne otoczenie statku
						surroundingArray.push(array[row + 1][column + counter])
					}
				} else {
					return createShip(array, shipPart, shipNumber, hiddenShip);
				}
			} else { // przypadek II
				if (isEmptySqaure(shipPart, array, row, column, counter, direction)) {
					tempArray.push(array[row][column - counter]);
					for (let i = -1; i <= 1; i++) {
						if (row - i >= 0 && row - i < array.length && column + 1 >= 0 && column + 1 < array.length) {
							surroundingArray.push(array[row - i][column + 1]);
						}
						if (row - i >= 0 && row - i < array.length && column - shipPart > 0 && column - shipPart < array.length) {
							surroundingArray.push(array[row - i][column - shipPart]);
						}
					}
					if (row > 0) {
						surroundingArray.push(array[row - 1][column - counter])
					}
					if (row < array.length - 1) {
						surroundingArray.push(array[row + 1][column - counter])
					}
				} else {
					return createShip(array, shipPart, shipNumber, hiddenShip);
				}
			}
		}
		// kierunek wertykalny - po row'ach
		else {
			if (row >= 0 && row <= array.length - shipPart) { // przypadek III
				if (isEmptySqaure(shipPart, array, row, column, counter, direction)) {
					tempArray.push(array[row + counter][column]);
					for (let i = -1; i <= 1; i++) {
						if (column - i >= 0 && column - i < array.length && row - 1 >= 0 && row - 1 < array.length) {
							surroundingArray.push(array[row - 1][column - i]);
						}
						if (column - i >= 0 && column - i < array.length && row + shipPart > 0 && row + shipPart < array.length) {
							surroundingArray.push(array[row + shipPart][column - i]);
						}
					}
					if (column > 0) {
						surroundingArray.push(array[row + counter][column - 1])
					}
					if (column < array.length - 1) {
						surroundingArray.push(array[row + counter][column + 1])
					}
				} else {
					return createShip(array, shipPart, shipNumber, hiddenShip);
				}
			} else { // przypadek IV
				if (isEmptySqaure(shipPart, array, row, column, counter, direction)) {
					tempArray.push(array[row - counter][column]);
					for (let i = -1; i <= 1; i++) {
						if (column - i >= 0 && column - i < array.length && row + 1 >= 0 && row + 1 < array.length) {
							surroundingArray.push(array[row + 1][column - i]);
						}
						if (column - i >= 0 && column - i < array.length && row - shipPart > 0 && row - shipPart < array.length) {
							surroundingArray.push(array[row - shipPart][column - i]);
						}
					}
					if (column > 0) {
						surroundingArray.push(array[row - counter][column - 1])
					}
					if (column < array.length - 1) {
						surroundingArray.push(array[row - counter][column + 1])
					}
				} else {
					return createShip(array, shipPart, shipNumber, hiddenShip);
				}
			}
		}
		counter++;
	}
	// ustawiam dla elementów tablic atrybuty oraz klasę
	tempArray.forEach((element) => {
		if (hiddenShip) {
			element.data('value', 2);
		} else {
			element.data('value', 2).addClass('shipSquare');
		}

	});

	surroundingArray.forEach((element) => {
		element.data('value', 1);
	});
}
function createAllShips(array, hiddenShip) {
	for (let i = 0; i < 5; i++) {
		for (let j = i; j >= 0; j--) {
			createShip(array, 5 - i, 5 - i, hiddenShip);
		}
	}
}
function updateAfters() {
	$('#computer-field').attr('data-computerAfter', playerCounter);
	$('#player-field').attr('data-playerAfter', computerCounter);
}
function battle() {
	$('#computer-field .square').each((index, element) => {
		$(element).on('click', () => {
			if ($(element).data('value') == 2) {
				$(element).data('value', 'sunken').addClass('red'); // sunken - zatopiony
				playerCounter++;
				hitPlayer(player_squares);
				gameOverAnimation("You win!")
			}
			else if ($(element).data('value') != 'sunken' && $(element).data('value') != 'miss') { // zabezpieczenie przed dwukrotnym kliknięciem w to samo
				$(element).data('value', 'miss').addClass('miss'); // miss - pudło
				hitPlayer(player_squares);
			}
			updateAfters();
		})
	})
}
function drawComputerSquare(array) {
	let row = randPosition();
	let column = randPosition();
	return array[row][column];
}
function gameOverAnimation(description) {
	if (isGameOver()) {
		$('#end-layer').fadeIn(1000).delay(2000).fadeOut(1000);
		clearMap();
		$('.text').text(description)
		$('#computer-field .square').off('click');
	}
}
function hitPlayer(array) {

	if (isFirstHit) {
		randElement = drawComputerSquare(array);
	}
	if ((randElement.data('value') == 'sunken' || randElement.data('value') == 'miss') && isFirstHit) {
		return hitPlayer(array);
	}
	if ((randElement.data('value') == 0 || randElement.data('value') == 1) && isFirstHit) {
		randElement.addClass('miss').data('value', 'miss');
		return;
	}
	if (randElement.data('value') == 2 && isFirstHit) {
		randElement.addClass('red').data('value', 'sunken');
		computerShot = 0; // zerowanie parametru trafów w jednej turze
		computerCounter++; // dodaje jedno trafienie
		computerShot++; // dodaje trafienie w daje turze
		gameOverAnimation("You lose!")
		firstRow = randElement.data('r');
		firstColumn = randElement.data('c');
		isFirstHit = false; // ustawiam zmienną na 1
		return;
	}
	if (!isFirstHit) {
		computerAlgorithm(array);
	}
}
function computerAlgorithm(array) {
	algCounter++;

	if (firstColumn + algCounter > array.length - 1 && direction == 'right') { // jeśli dojdzie do prawej krawędzi to leci w lewo
		algCounter = 0;
		direction = 'left';
		return computerAlgorithm(array);
	}
	if (firstColumn - algCounter < 0 && direction == 'left') { // jeśli dojdzie do lewej strony
		if (computerShot > 1) {
			direction = 'right';
			algCounter = 0;
			isFirstHit = true;
			return hitPlayer(array);
		} else if (computerShot == 1) {
			direction = 'up';
			algCounter = 0;
			return computerAlgorithm(array);
		}
	}
	if (firstRow - algCounter < 0 && direction == 'up') { // jesli dojdzie do góry
		algCounter = 0;
		direction = 'down';
		return computerAlgorithm(array);
	}
	if (firstRow + algCounter > array.length - 1 && direction == 'down') {
		direction = 'right';
		algCounter = 0;
		isFirstHit = true;
		return hitPlayer(array);
	}

	if (direction == 'right') { // w prawo
		let horizontalIncrement = array[firstRow][firstColumn + algCounter]; // w prawo
		if (horizontalIncrement.data('value') == 'miss') {
			direction = 'left';
			algCounter = 0;
			return computerAlgorithm(array);
		}
		if (horizontalIncrement.data('value') == 0 || horizontalIncrement.data('value') == 1) {
			horizontalIncrement.addClass('miss').data('value', 'miss');
			direction = 'left';
			algCounter = 0;
			return;
		}
		if (horizontalIncrement.data('value') == 2) {
			horizontalIncrement.addClass('red').data('value', 'sunken');
			computerCounter++; // dodaje jedno trafienie
			computerShot++; // dodaje trafienie w daje turze
			gameOverAnimation("You lose!")
			return;
		}
	}
	if (direction == 'left') { // w lewo
		let horizontalDecrement = array[firstRow][firstColumn - algCounter]; // w lewo
		if (horizontalDecrement.data('value') == 'miss') {
			if (computerShot > 1) {
				algCounter = 0;
				direction = 'right';
				isFirstHit = true;
				return hitPlayer(array);
			} else if (computerShot == 1) {
				algCounter = 0;
				direction = 'up';
				return computerAlgorithm(array);
			}
		}
		if (horizontalDecrement.data('value') == 0 || horizontalDecrement.data('value') == 1) {
			horizontalDecrement.addClass('miss').data('value', 'miss')
			if (computerShot > 1) {
				algCounter = 0;
				direction = 'right';
				isFirstHit = true;
				return;
			} else if (computerShot == 1) {
				algCounter = 0;
				direction = 'up';
				return;
			}
		}
		if (horizontalDecrement.data('value') == 2) {
			horizontalDecrement.addClass('red').data('value', 'sunken');
			computerCounter++; // dodaje jedno trafienie
			computerShot++; // dodaje trafienie w daje turze
			gameOverAnimation("You lose!")
			return;
		}
	}
	if (direction == "up") { // w górę
		let verticalIncrement = array[firstRow - algCounter][firstColumn]; // w górę
		if (verticalIncrement.data('value') == 'miss') {
			direction = 'down';
			algCounter = 0;
			return computerAlgorithm(array);
		}
		if (verticalIncrement.data('value') == 0 || verticalIncrement.data('value') == 1) {
			verticalIncrement.addClass('miss').data('value', 'miss');
			direction = 'down';
			algCounter = 0;
			return;
		}
		if (verticalIncrement.data('value') == 2) {
			verticalIncrement.addClass('red').data('value', 'sunken');
			computerCounter++; // dodaje jedno trafienie
			gameOverAnimation("You lose!")
			return;
		}
	}
	if (direction == 'down') { // w dół
		let verticalDecrement = array[firstRow + algCounter][firstColumn]; // w dół
		if (verticalDecrement.data('value') == 'miss') {
			algCounter = 0;
			direction = 'right';
			isFirstHit = true;
			return hitPlayer(array);
		}
		if (verticalDecrement.data('value') == 0 || verticalDecrement.data('value') == 1) {
			verticalDecrement.addClass('miss').data('value', 'miss')
			algCounter = 0;
			direction = 'right';
			isFirstHit = true;
			return;
		}
		if (verticalDecrement.data('value') == 2) {
			verticalDecrement.addClass('red').data('value', 'sunken');
			computerCounter++; // dodaje jedno trafienie
			gameOverAnimation("You lose!")
			return;
		}
	}
}
function drawMap() {
	$('#end-layer').fadeOut(0);
	$('.draw').on('click', () => {
		$('.square').each((index, element) => {
			$(element).data('value', 0).removeClass('shipSquare')
		})
		createAllShips(player_squares, false);
		createAllShips(computer_squares, true);
	})
	createAllShips(player_squares, false);
	createAllShips(computer_squares, true);
}
function setButtonState(state) {
	$('.button').prop('disabled', state);
}
function startGame() {
	$('.play').on('click', () => {
		setButtonState(true);
		battle();
	})
}
function isGameOver() {
	return playerCounter == ShipSum || computerCounter == ShipSum;
}
function clearMap() { // funkcja wywoływana jest w momencie przegranej, którejś ze strony
	$('.square').each((index, element) => {
		$(element).data('value', 0).removeClass('shipSquare')
		$(element).data('value', 0).removeClass('miss')
		$(element).data('value', 0).removeClass('red')
	})
	createAllShips(player_squares, false);
	createAllShips(computer_squares, true);
	setButtonState(false);
	playerCounter = 0;
	computerCounter = 0;
}

createGameField(computer_squares, '#computer-field', 12); // tworzenie mapy dla komputera
createGameField(player_squares, '#player-field', 12); // tworzenie mapy dla player'a
drawMap(); // losowanie mapek przyciskiem
updateAfters();
startGame(); // nasłuchiwanie na przycisk start
getPosition(); // funkcja sprawdzająca pola, tylko do debugowania

