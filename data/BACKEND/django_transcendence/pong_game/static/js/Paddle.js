import { BoxGeometry, Mesh, MeshBasicMaterial } from "three"

import Ai from './Ai.js'

// const paddles = [];

export default class Paddle {
    constructor(scene, position, ballRadius, boundaries) {
        this.scene = scene
        this.boundaries = boundaries

        this.geometry = new BoxGeometry(5, 1, 1)
        this.material = new MeshBasicMaterial({ color: 0xf3a81c })
        this.mesh = new Mesh(this.geometry, this.material)

        this.collisionGeometry = new BoxGeometry(5 + (ballRadius * 2), .5, .5 + (ballRadius * 2))
        this.collisionMaterial = new MeshBasicMaterial({ visible: false })
        this.collisionMesh = new Mesh(this.collisionGeometry, this.collisionMaterial)

        this.mesh.add(this.collisionMesh)
        this.mesh.position.copy(position)
        this.scene.add(this.mesh)

        this.ai = new Ai(this.scene, 5, boundaries.x * 2, boundaries.y * 2);
    }

    setXPosition(x) {
        const limitPos = this.boundaries.x - (this.geometry.parameters.width / 2)

        if (x > limitPos) {
            x = limitPos
        }
        else if (x < -limitPos) {
            x = -limitPos
        }

        this.mesh.position.x = x
        // paddles.push(this);
    }
}

// export { paddles }
