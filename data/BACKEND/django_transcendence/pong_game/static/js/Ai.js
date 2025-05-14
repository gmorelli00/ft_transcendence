// import Ball from './Ball'

class PongAIPlayer {
    constructor(scene, paddleWidth, gameWidth, gameHeight) {
        this.scene = scene;
        this.paddleWidth = paddleWidth;
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        
        this.lastUpdateTime = 0;
        this.updateInterval = 1000; // 1 second update frequency
        
        // AI strategy parameters
        this.difficulty = 0.9; // Adjustable AI skill level (0-1)
        this.predictionAccuracy = 1;
        this.randomnessFactor = 0;
    }



    predictBallTrajectory(ball) {
        // Simulate ball trajectory with some uncertainty
        const predictedX = ball.mesh.position.x + 
            (ball.velocity.x * this.predictionAccuracy);
        
        return predictedX;
    }
    decideMovement(ball, aiPaddle) {
        const predictedBallX = this.predictBallTrajectory(ball);
        const currentPaddleX = aiPaddle.mesh.position.x;
        
        // Calculate target position with difficulty-based precision
        const targetX = Math.min(
            Math.max(
                predictedBallX, 
                -this.gameWidth/2 + this.paddleWidth/2
            ), 
            this.gameWidth/2 - this.paddleWidth/2
        );

        // Introduce strategic imperfection based on difficulty
        const movementPrecision = this.difficulty + 
            (Math.random() * this.randomnessFactor * (1 - this.difficulty));
        
        // Gradual movement to simulate human-like response
        const moveStep = (targetX - currentPaddleX) * movementPrecision;
        
        return moveStep;
    }

    update(ball, aiPaddle, currentTime) {
        let position;

        position = aiPaddle.mesh.position.x;
        // Respect 1-second refresh constraint
        if (currentTime - this.lastUpdateTime >= this.updateInterval) {
            const movementDelta = this.decideMovement(ball, aiPaddle);
            
            // Apply movement
            position += movementDelta;

            this.lastUpdateTime = currentTime;
            
            // Boundary checks
            return Math.min(
                Math.max(
                    position, 
                    -this.gameWidth/2 + this.paddleWidth/2
                ), 
                this.gameWidth/2 - this.paddleWidth/2
            );
        }
        return null;
    }

    adjustDifficulty(playerScore, aiScore) {
        // Dynamic difficulty adjustment
        const scoreDifference = playerScore - aiScore;
        
        // Increase difficulty if losing, decrease if winning too easily
        if (scoreDifference > 2) {
            this.difficulty = Math.min(0.9, this.difficulty + 0.1);
        } else if (scoreDifference < -2) {
            this.difficulty = Math.max(0.5, this.difficulty - 0.1);
        }
    }
}

export default PongAIPlayer;