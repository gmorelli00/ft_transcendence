import { getCookie } from "./pong_menu.js"

// const mainMenuContainer = document.getElementById("main-menu")
// const startGameButton = document.getElementById("startGame")
const ballSpeed = document.getElementById("ballSpeed")
const rangeSpeedValue = document.getElementById("rangeSpeedValue")
// const rangeInput = document.getElementById("playersNumber")
// const rangeValue = document.getElementById("rangeValue")


ballSpeed.value = 1
rangeSpeedValue.textContent = ballSpeed.value

ballSpeed.addEventListener("input", () => {
	rangeSpeedValue.textContent = ballSpeed.value
})

// rangeInput.value = 2
// rangeValue.textContent = rangeInput.value

// rangeInput.addEventListener("input", () => {
// 	rangeValue.textContent = rangeInput.value
// })

const playerInputs = document.getElementById("player-inputs")
const playerInputsContainer = document.querySelector(".input-container")
const addFieldButton = document.getElementById("add-field")
const removeFieldButton = document.getElementById("remove-field")
const generateTournamentButton = document.getElementById("generate-tournament")
const resetTournamentButton = document.getElementById("reset-tournament")
const tournamentDiv = document.getElementById("tournament")
const matchesDiv = document.getElementById("matches")
const modal = new bootstrap.Modal(document.getElementById('matchModal'))
const modalBodyGamePlayers = document.querySelector('#matchModal .modal-body .players-name')
const tournamentOffcanvas = new bootstrap.Offcanvas('#offcanvasTournament')
const tournamentFinishContainer = document.getElementById("tournament-finish")
const tournamentWinner = document.getElementById("tournament-winner")


const barPlayer1Name = document.getElementById("player1-name-field")
const barPlayer2Name = document.getElementById("player2-name-field")
// const barPlayer1Info = document.getElementById("namePlayer3")
// const barPlayer2Info = document.getElementById("namePlayer4")

let players = []
let rounds = {}
let currentMatchIndex = 0
let roundWinners = []


function nextMatchModal(playersName) {

	modalBodyGamePlayers.textContent = `${playersName[0]} VS ${playersName[1]}`
	modal.show()
	barPlayer1Name.textContent = `${playersName[0]}`
	barPlayer2Name.textContent = `${playersName[1]}`
}

addFieldButton.addEventListener("click", () => {
	const playerNumber = playerInputsContainer.children.length + 1

	const newFieldContainer = document.createElement("div")
	newFieldContainer.className = "form-floating mb-3"

	const newInput = document.createElement("input")
	newInput.type = "text"
	newInput.className = "form-control"
	newInput.id = `player${playerNumber}Input`
	newInput.placeholder = "Player"

	const newLabel = document.createElement("label")
	newLabel.htmlFor = `player${playerNumber}Input`
	newLabel.textContent = `Player ${playerNumber} name`

	newFieldContainer.appendChild(newInput)
	newFieldContainer.appendChild(newLabel)

	playerInputsContainer.appendChild(newFieldContainer)
})

removeFieldButton.addEventListener("click", () => {
	if (playerInputsContainer.children.length > 2) {
		playerInputsContainer.lastChild.remove()
	}
})

resetTournamentButton.addEventListener("click", () => {
	tournamentFinishContainer.classList.add("d-none")
	tournamentDiv.classList.add("d-none")
	playerInputs.classList.remove("d-none")
	barPlayer1Name.textContent = getCookie("username")
    barPlayer2Name.textContent = "Player 2"
    // barPlayer1Info.classList.add("d-none")
    // barPlayer2Info.classList.add("d-none")
})

generateTournamentButton.addEventListener("click", () => {
	players = Array.from(playerInputsContainer.querySelectorAll("input"))
		.map(input => input.value.trim())
		.filter(name => name !== "")

	playerInputsContainer.querySelectorAll("input").forEach(input => input.value = "")

	if (players.length < 2) {
		alert("To start a tournament you must enter at least 2 players")
		return
	}

	startTournament()
})

function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		const temp = array[i]
		array[i] = array[j]
		array[j] = temp
	}
	return array
}

function startTournament() {
	matchesDiv.innerHTML = ""
	rounds = {}
	// roundWinners = []
	// currentMatchIndex = 0

	generateMatches()
	displayMatches()

	playerInputs.classList.add("d-none")
	tournamentDiv.classList.remove("d-none")
}

function generateMatches() {
	const currentRound = Object.keys(rounds).length
	let roundPlayers

	if (currentRound == 0) {
		roundPlayers = shuffleArray([...players])
	}
	else {
		roundPlayers = shuffleArray([...roundWinners])
	}
	rounds[currentRound + 1] = []
	roundWinners = []
	currentMatchIndex = 0

	for (let i = 0; i < roundPlayers.length; i += 2) {
		if (i + 1 < roundPlayers.length) {
			rounds[currentRound + 1].push([roundPlayers[i], roundPlayers[i + 1]])
		} else {
			rounds[currentRound + 1].push([roundPlayers[i], null])
		}
	}
	//return rounds[currentRound + 1]
}

function displayMatches() {
	console.log("Display matches");
	
	const matches = rounds[Object.keys(rounds).length]

	const matchTitle = document.createElement("h2")
	matchTitle.textContent = `${Object.keys(rounds).length} Round`
	if (matches.length == 2) {
		matchTitle.textContent += " (Semifinal)"
	}
	else if (matches.length == 1) {
		matchTitle.textContent += " (Final)"
	}
	matchesDiv.appendChild(matchTitle)

	matches.forEach((match, index) => {
		const matchDiv = document.createElement("div")
		matchDiv.className = `match${Object.keys(rounds).length} mb-5 d-flex flex-column align-items-center`
		matchDiv.dataset.index = index

		const gameTitle = document.createElement("span")
		gameTitle.className = "mb-1 fw-bold"
		gameTitle.textContent = `Game ${index + 1}`

		const player1Div = document.createElement("div")
		player1Div.className = "player d-inline-flex text-bg-secondary py-1 px-2 border rounded-2"
		player1Div.textContent = match[0]

		const vsSpan = document.createElement("span")
		vsSpan.textContent = "VS"

		const player2Div = document.createElement("div")
		player2Div.className = "player d-inline-flex text-bg-secondary py-1 px-2 border rounded-2"
		player2Div.textContent = match[1] || "Bye"


		matchDiv.appendChild(gameTitle)
		matchDiv.appendChild(player1Div)
		matchDiv.appendChild(vsSpan)
		matchDiv.appendChild(player2Div)

		matchesDiv.appendChild(matchDiv)
	})

	highlightCurrentMatch()
}


function highlightCurrentMatch() {
	
	const round = Object.keys(rounds).length;
	const allMatches = document.querySelectorAll(`.match${round}`);
	console.log("allMatches", allMatches);
	let currentPlayersName = [];

	console.log(`currentPlayersName: ${currentPlayersName}`);

	for (let index = 0; index < allMatches.length; index++) {
		const match = allMatches[index];
		const players = match.querySelectorAll(".player");

		if (index === currentMatchIndex) {
			console.log(`Index trovato nel for con index ${index} nel round ${round}`);
			players.forEach(player => {
				player.classList.remove("text-bg-secondary");
				player.classList.add("text-bg-warning");
				currentPlayersName.push(player.textContent);
			});
			console.log("currentPlayersName:", currentPlayersName);

			if (currentPlayersName[1].trim() === "Bye") {
				console.log("IS BYE");
				advanceMatch(0);
				return;
			}
		}
	}
	console.log(`Round attuale ${round}`);
	console.log(`next match con ${currentPlayersName[0]} a ${currentPlayersName[1]}`);
	nextMatchModal(currentPlayersName);
}

function advanceMatch(winnerIndex) {
	const round = Object.keys(rounds).length
	const currentMatch = document.querySelector(`.match${round}[data-index="${currentMatchIndex}"]`)
	const players = currentMatch.querySelectorAll(".player")

	roundWinners.push(rounds[Object.keys(rounds).length][currentMatchIndex][winnerIndex])
	console.log(`Vincitori girone: ${roundWinners}`)
	if (winnerIndex === 0) {
		players[0].classList.remove("text-bg-warning")
		players[0].classList.add("text-bg-success")
		players[1].classList.remove("text-bg-warning")
		players[1].classList.add("text-bg-danger")
	} else {
		players[1].classList.remove("text-bg-warning")
		players[1].classList.add("text-bg-success")
		players[0].classList.remove("text-bg-warning")
		players[0].classList.add("text-bg-danger")
	}

	tournamentOffcanvas.show()
	currentMatchIndex++
	console.log(`Incrementato match index a ${currentMatchIndex}`)
	// console.log(currentMatchIndex)
	// console.log(rounds[Object.keys(rounds).length].length)
	if (currentMatchIndex < rounds[Object.keys(rounds).length].length) {
		console.log(`Altri match disponibili nel girone`)
		highlightCurrentMatch()
	} else {
		console.log(`Girone completato`)
		if (roundWinners.length > 1) {
			generateMatches()
			displayMatches()
		}
		else {
			// alert(`${roundWinners[0]} win the tournament!`)
			tournamentWinner.textContent = `${roundWinners[0]}`
			tournamentFinishContainer.classList.remove("d-none")
		}
	}
}

window.addEventListener("gameResultEvent", (event) => {
	const winnerIndex = event.detail
	advanceMatch(winnerIndex)
})

// Test
// document.addEventListener("keydown", (e) => {
// 	if (e.key === "1") {
// 		advanceMatch(0)
// 	} else if (e.key === "2") {
// 		advanceMatch(1)
// 	}
// })
