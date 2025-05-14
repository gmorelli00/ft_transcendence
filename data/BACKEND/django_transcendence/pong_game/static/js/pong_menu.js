import * as THREE from "./three/build/three.module.js";
import { TextGeometry } from "./three/examples/jsm/geometries/TextGeometry.js";
import Ball from "./Ball.js";
import Paddle from "./Paddle.js";
// import { paddles } from "./Paddle.js";
// import { balls } from "./Ball.js";
import { FontLoader } from "./three/examples/jsm/loaders/FontLoader.js";

const srcFont = "/static/fonts/helvetiker_bold.typeface.json";
const loader = new FontLoader();


const mainMenuContainer = document.getElementById("main-menu")

const ballRadius = .7
const player1KeyState = {
    left: false,
    right: false
}
const player2KeyState = {
    left: false,
    right: false
}
let lastUpdate = Date.now();
const reactionTime = 1000;

let ball, paddleSpeed, player1Paddle, player2Paddle, player1Mesh, player2Mesh, loadedFont, isTournament
let playersNumber
let gameStarted = false
let gameReady = false
// let startBallDirection = Math.random() < 0.5 ? -1 : 1;
const score = {
    player1: 0,
    player2: 0
}
const TEXT_PARAMS = {
    size: 4,
    depth: 1,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0,
    bevelOffset: 0,
    bevelSegments: 0
}

const clock = new THREE.Clock()
clock.stop()

// Scene
// const scene = new THREE.Scene()
// scene.background = new THREE.Color(0x1f1f29)
//Renderer
const renderer = new THREE.WebGLRenderer({
    antialias: window.devicePixelRatio < 2,
    logarithmicDepthBuffer: true,
    alpha: true
})

const gameContainer = document.getElementById('game-container')
renderer.setSize(gameContainer.clientWidth * 0.7, gameContainer.clientHeight * 0.7);


renderer.setClearColor(0x000000, 0); // Imposta il colore nero con alpha 0 (trasparente)
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = null;



function updateScoreGeometry(score) {
    const geometry = new TextGeometry(`${score}`, {
        font: loadedFont,
        ...TEXT_PARAMS
    })
    geometry.center()

    return geometry
}



const sizes = {
    width: gameContainer.clientWidth,
    height: gameContainer.clientHeight,
}

renderer.setSize(gameContainer.clientWidth, gameContainer.clientHeight)
gameContainer.appendChild(renderer.domElement)


// Camera
const fov = 70
const camera = new THREE.PerspectiveCamera(fov, sizes.width / sizes.height, 0.1)
camera.position.set(-40, 20, 0)
camera.lookAt(new THREE.Vector3(0, 0, 0))

handleResize()

let isAnimating = false

function moveCamera(direction, speed) {
    //console.log(`Chiamata direction: ${direction}`)
    const targetPosition = {
        1: new THREE.Vector3(-40, 20, 5),
        2: new THREE.Vector3(-40, 20, -5),
        3: new THREE.Vector3(-40, 20, 0)
    }

    const destination = targetPosition[direction]
    if (!destination || isAnimating) {
        //console.log(`In attesa ${isAnimating}`)
        return
    }

    isAnimating = true
    const baseSpeed = .1
    const proportionalSpeed = (speed / 10) * baseSpeed

    function animate() {
        camera.position.lerp(destination, proportionalSpeed)
        camera.lookAt(new THREE.Vector3(0, 0, 0))

        if (isAnimating && camera.position.distanceTo(destination) > 0.01) {
            requestAnimationFrame(animate)
        } else {
            isAnimating = false
            camera.position.copy(destination)
        }
    }

    animate()
}

const orbitRadius = 40
const orbitSpeed = 0.002
let angle = Math.PI

function orbitCamera() {
    angle += orbitSpeed

    const x = Math.cos(angle) * orbitRadius
    const z = Math.sin(angle) * orbitRadius

    camera.position.set(x, camera.position.y, z)

    camera.lookAt(new THREE.Vector3(0, 0, 0))
}

// Lights
// const ambientLight = new AmbientLight(0xffffff, 1.5)
// const directionalLight = new DirectionalLight(0xffffff, 4.5)
// directionalLight.position.set(3, 10, 7)
// scene.add(ambientLight, directionalLight)

const boundaries = new THREE.Vector2(20, 20)
// const planeGeometry = new THREE.PlaneGeometry(boundaries.x * 2, boundaries.y * 2)
// const planeMaterial = new THREE.MeshBasicMaterial( { wireframe: true } )
// const plane = new THREE.Mesh(planeGeometry, planeMaterial)

// planeGeometry.rotateX(Math.PI * .5)

// scene.add( plane )

const boundGeometry = new THREE.BoxGeometry(.5, 1, boundaries.x * 2)
const boundMaterial = new THREE.MeshBasicMaterial({ color: 0xf3a81c })

const leftBound = new THREE.Mesh(boundGeometry, boundMaterial)
leftBound.position.x = -boundaries.x - .25

const rightBound = new THREE.Mesh(boundGeometry, boundMaterial)
rightBound.position.x = boundaries.x + .25

scene.add(leftBound, rightBound)

player1Paddle = new Paddle(scene, new THREE.Vector3(0, 0, -17), ballRadius, boundaries)
player2Paddle = new Paddle(scene, new THREE.Vector3(0, 0, 17), ballRadius, boundaries)
ball = new Ball(scene, ballRadius, [player1Paddle, player2Paddle], boundaries)

function gameFinish(winnerIndex) {
    const resultEvent = new CustomEvent("gameResultEvent", { detail: winnerIndex });
    window.dispatchEvent(resultEvent);

    // Rimuovi gli event listener della telecamera
    ball.removeEventListener('onCameraMove', moveCamera);
    ball.removeEventListener('onCameraReset', resetCamera);

    // Resetta la telecamera
    resetCamera();
}

ball.addEventListener('onScore', (event) => {
    score[event.message] += 1

    const geometry = updateScoreGeometry(score[event.message])
    const mesh = event.message === 'player1' ? player1Mesh : player2Mesh
    let index = 1

    //mesh.geometry.dispose()
    mesh.geometry = geometry
    mesh.geometry.getAttribute('position').needsUpdate = true

    for (const player in score) {
        if (score[player] >= 3) {
            clock.stop()
            ball.removeBall()
            angle = Math.atan2(camera.position.z, camera.position.x)
            gameReady = false
            gameStarted = false
            mainMenuContainer.classList.add("d-flex")
            mainMenuContainer.classList.remove("d-none")
            if (isTournament)
                gameFinish(index)
            // player2Paddle.geometry.dispose();
            // player2Paddle.material.dispose();
            // player2Paddle.mesh.dispose()
            // scene.remove(player2Paddle)
            // renderer.render(scene, camera)
        }
        index--
    }
})

ball.addEventListener('onCameraMove', (event) => {
    moveCamera(event.message.direction, event.message.speed)
});

loader.load(
    srcFont, 
    (font) => {
        console.log("✅ Font caricato con successo!", font);
        loadedFont = font;

        const geometry = new TextGeometry("0", {
            font: loadedFont,
            ...TEXT_PARAMS,
        });

        geometry.center();
        
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xf3a81c });

        player1Mesh = new THREE.Mesh(geometry, textMaterial);
        player2Mesh = player1Mesh.clone();

        player1Mesh.position.set(boundaries.x - boundGeometry.parameters.height, 4, 4);
        player1Mesh.rotateY(-Math.PI * 0.5);
        player2Mesh.position.set(boundaries.x - boundGeometry.parameters.height, 4, -4);
        player2Mesh.rotateY(-Math.PI * 0.5);

        scene.add(player1Mesh, player2Mesh);
    },
    undefined,
    (error) => {
        console.error("❌ Errore nel caricamento del font:", error);
    }
);

requestAnimationFrame(tic)

function setGame(ballSpeed) {
    resetCamera();
    isAnimating = false;
    gameStarted = false;  // Assicurati di resettare gameStarted
    gameReady = false;    // Resetta gameReady per abilitare orbitCamera()

    moveCamera(3, 10)

    for (const player in score) {
        score[player] = 0
    }
    const geometry = updateScoreGeometry(0)
    //mesh.geometry.dispose()
    player1Mesh.geometry = geometry
    player1Mesh.geometry.getAttribute('position').needsUpdate = true
    player2Mesh.geometry = geometry
    player2Mesh.geometry.getAttribute('position').needsUpdate = true

    const startBallDirection = Math.random() < 0.5 ? -1 : 1;
    console.log(startBallDirection)
    ball.setBallSpeed(ballSpeed)
    //ball.resetBall()

    player1Paddle.setXPosition(0)
    player2Paddle.setXPosition(0)

    ball.addBall(startBallDirection)
    
    gameReady = true

    setTimeout(() => {
        moveCamera(startBallDirection === 1 ? 1 : 2, ballSpeed)
        gameStarted = true;
        clock.start()
    }, 2500);
}

// Frame loop
let targetPosition = 0;
const lerpFactor = 1;
function tic() {
    if (gameStarted) {
        // Tempo trascorso dal frame precedente
        const deltaTime = clock.getDelta()

        if (player1KeyState.left) {
            player1Paddle.setXPosition(player1Paddle.mesh.position.x - paddleSpeed)
        }
        if (player1KeyState.right) {
            player1Paddle.setXPosition(player1Paddle.mesh.position.x + paddleSpeed)
        }

        if (player2KeyState.left) {
            player2Paddle.setXPosition(player2Paddle.mesh.position.x - paddleSpeed)
        }
        if (player2KeyState.right) {
            player2Paddle.setXPosition(player2Paddle.mesh.position.x + paddleSpeed)
        }

        if (playersNumber == 1) {
            let temp = player2Paddle.ai.update(ball, player2Paddle, performance.now());
            if (temp) {
                targetPosition = temp;
            }

            // Definisci una tolleranza per evitare il movimento oscillatorio
            const tolerance = 0.5; // Puoi regolare questo valore in base alle tue esigenze

            // Calcola la differenza tra la posizione corrente e il target
            const delta = player2Paddle.mesh.position.x - targetPosition;

            // Muovi il paddle gradualmente verso la posizione target solo se la differenza è maggiore della tolleranza
            if (delta > tolerance) {
                player2Paddle.setXPosition(player2Paddle.mesh.position.x - paddleSpeed);
            } else if (delta < -tolerance) {
                player2Paddle.setXPosition(player2Paddle.mesh.position.x + paddleSpeed);
            }
            // if (ball.velocity.z < 0) {
            // player2Paddle.setXPosition(ball.mesh.position.x)
            // }
            // Movimento graduale del paddle AI
            // player2Paddle.setXPosition(
            //     player2Paddle.mesh.position.x + (targetPosition - player2Paddle.mesh.position.x) * lerpFactor 
            // );
        }

        ball.update(deltaTime)
    }
    else if (!gameReady) {
        orbitCamera()
    }

    //controls.update()

    renderer.render(scene, camera)

    requestAnimationFrame(tic)
}

// function startGameAI() {
//     let temp = player2Paddle.ai.update(ball, player2Paddle, performance.now());
//     if (temp) {
//         targetPosition = temp;
//     }
//     if (player2Paddle.mesh.position.x > targetPosition)
//         player2Paddle.setXPosition(player2Paddle.mesh.position.x - paddleSpeed)
//     else if (player2Paddle.mesh.position.x < targetPosition)
//         player2Paddle.setXPosition(player2Paddle.mesh.position.x + paddleSpeed)

//     if (ball.velocity.z < 0) {
//     player2Paddle.setXPosition(ball.mesh.position.x)
//     }
// }



const wPlayerButton = document.getElementById("w-button")
const sPlayerButton = document.getElementById("s-button")
const upPlayerButton = document.getElementById("up-button")
const downPlayerButton = document.getElementById("down-button")
const onePlayerButton = document.getElementById("1-button")
const twoPlayerButton = document.getElementById("2-button")

document.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'ArrowDown':
            downPlayerButton.classList.add("text-bg-light", "pressed")
            player2KeyState.left = true
            break
        case 'KeyS':
            sPlayerButton.classList.add("text-bg-light", "pressed")
            player1KeyState.left = true
            break
        case 'ArrowUp':
            upPlayerButton.classList.add("text-bg-light", "pressed")
            player2KeyState.right = true
            break
        case 'KeyW':
            wPlayerButton.classList.add("text-bg-light", "pressed")
            player1KeyState.right = true
            break
        case 'Digit2':
            onePlayerButton.classList.add("text-bg-light", "pressed")
            break
        case 'Digit5':
            twoPlayerButton.classList.add("text-bg-light", "pressed")
            break
    }
})

document.addEventListener('keyup', (event) => {
    switch (event.code) {
        case 'ArrowDown':
            downPlayerButton.classList.remove("text-bg-light", "pressed")
            player2KeyState.left = false
            break
        case 'KeyS':
            sPlayerButton.classList.remove("text-bg-light", "pressed")
            player1KeyState.left = false
            break
        case 'ArrowUp':
            upPlayerButton.classList.remove("text-bg-light", "pressed")
            player2KeyState.right = false
            break
        case 'KeyW':
            wPlayerButton.classList.remove("text-bg-light", "pressed")
            player1KeyState.right = false
            break
        case 'Digit2':
            onePlayerButton.classList.remove("text-bg-light", "pressed")
            if (playersNumber == 3) {
                ball.changeBallVelocity(1)
            }
            break
        case 'Digit5':
            twoPlayerButton.classList.remove("text-bg-light", "pressed")
            if (playersNumber == 3) {
                ball.changeBallVelocity(-1)
            }
            break
    }
})

window.addEventListener('resize', handleResize)

function handleResize() {
    sizes.width = gameContainer.clientWidth;
    sizes.height = gameContainer.clientHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);

    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(pixelRatio);

    // Adatta anche la posizione della telecamera
    camera.position.set(-40, 20 * (sizes.height / sizes.width), 0);
}


const offcanvasElements = document.querySelectorAll('.offcanvas');
const playerBallContainer = document.getElementById("playerBall-box")

function startGame() {
    let ballSpeed = document.getElementById("ballSpeed").value;
    paddleSpeed = 0.2

    // Converti il valore in numero intero
    ballSpeed = parseInt(ballSpeed, 10);
    
    // Imposta i limiti della velocità
    const minSpeed = 15; // valore per 1
    const maxSpeed = 30; // valore per 100
    
    // Calcola la velocità proporzionale e arrotonda a intero
    ballSpeed = Math.round(minSpeed + (ballSpeed - 1) * (maxSpeed - minSpeed) / (100 - 1));
    paddleSpeed = paddleSpeed + (ballSpeed / 100)

    // const playersN = document.getElementById("playersOption1").checked
    // console.log(playersN)
    const playersOption1 = document.getElementById("playersOption1");
    const playersOption2 = document.getElementById("playersOption2");
    const playersOption3 = document.getElementById("playersOption3");

    mainMenuContainer.classList.remove("d-flex")
    mainMenuContainer.classList.add("d-none")

    if (ballSpeed <= 0) {
        alert("Please, insert a number > 0!")
        return
    }

    // if (playersN)
    //     playersNumber = 2
    // else
    //     playersNumber = 3

    if (playersOption1.checked) {
        playersNumber = 1;
    } else if (playersOption2.checked) {
        playersNumber = 2;
    } else if (playersOption3.checked) {
        playersNumber = 3;
    }

    if (playersNumber == 3) {
	    playerBallContainer.classList.remove("d-none")
    }
    else {
        playerBallContainer.classList.add("d-none")
    }

    offcanvasElements.forEach((offcanvasEl) => {
        const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasEl)

        if (!offcanvasInstance) {
            bootstrap.Offcanvas.getOrCreateInstance(offcanvasEl).hide()
        } else {
            offcanvasInstance.hide()
        }
    })

    setGame(ballSpeed)
}

const barPlayer1Name = document.getElementById("player1-name-field")
const barPlayer2Name = document.getElementById("player2-name-field")
// const barPlayer1Info = document.getElementById("player1-info-field")
// const barPlayer2Info = document.getElementById("player2-info-field")

document.getElementById("startGame").addEventListener("click", () => {
    isTournament = false
    barPlayer1Name.textContent = "Player 1"
    barPlayer2Name.textContent = "Player 2"
    // barPlayer1Info.classList.add("d-none")
    // barPlayer2Info.classList.add("d-none")
    startGame()
})

const startMatchButton = document.getElementById('startMatch')

startMatchButton.addEventListener("click", () => {
    
    isTournament = true
    document.getElementById("playersOption2").checked = true

    // barPlayer1Info.classList.remove("d-none")
    // barPlayer2Info.classList.remove("d-none")
    startGame()
})

function resetCamera() {
    const initialPosition = new THREE.Vector3(-40, 20, 0); // Posizione iniziale della telecamera
    camera.position.copy(initialPosition);
    camera.lookAt(new THREE.Vector3(0, 0, 0)); // Punto di vista iniziale
    isAnimating = false; // Assicurati che l'animazione sia ferma
}

// ... (il resto del codice rimane invariato)

const isTouchDevice = 'ontouchstart' in window;

if (isTouchDevice) {
    // Abilita i pulsanti per il Player 1
    document.getElementById('w-button').removeAttribute('disabled');
    document.getElementById('s-button').removeAttribute('disabled');

    // Abilita i pulsanti per il Player 2
    document.getElementById('up-button').removeAttribute('disabled');
    document.getElementById('down-button').removeAttribute('disabled');

    document.getElementById('playersOption3').setAttribute('disabled', true);
}
// Aggiungi gli event listener per il touch
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (event) => {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
});

document.addEventListener('touchmove', (event) => {
    touchEndX = event.touches[0].clientX;
    touchEndY = event.touches[0].clientY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
            player1KeyState.right = true;
            player1KeyState.left = false;
        } else {
            player1KeyState.left = true;
            player1KeyState.right = false;
        }
    }
});

document.addEventListener('touchend', () => {
    player1KeyState.left = false;
    player1KeyState.right = false;
});


document.getElementById('w-button').addEventListener('touchstart', () => {
    player1KeyState.right = true;
});
document.getElementById('w-button').addEventListener('touchend', () => {
    player1KeyState.right = false;
});

document.getElementById('s-button').addEventListener('touchstart', () => {
    player1KeyState.left = true;
});
document.getElementById('s-button').addEventListener('touchend', () => {
    player1KeyState.left = false;
});

// Player 2 (⬆ e ⬇)
document.getElementById('up-button').addEventListener('touchstart', () => {
    player2KeyState.right = true;
});
document.getElementById('up-button').addEventListener('touchend', () => {
    player2KeyState.right = false;
});

document.getElementById('down-button').addEventListener('touchstart', () => {
    player2KeyState.left = true;
});
document.getElementById('down-button').addEventListener('touchend', () => {
    player2KeyState.left = false;
});


export function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        const [key, value] = cookie.split('=');
        if (key === name) return decodeURIComponent(value);
    }
    return null;
}


    const username = getCookie("username") || "Player 1"; // Default se non esiste
    const playerNameField = document.getElementById("player1-name-field");
    if (playerNameField) {
        playerNameField.textContent = username;
    }
