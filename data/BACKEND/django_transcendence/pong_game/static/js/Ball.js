import * as THREE from "./three/build/three.module.js";
import { EventDispatcher, Mesh, MeshBasicMaterial, Raycaster, SphereGeometry, Vector3 } from "three";


// const balls = [];

export default class Ball extends EventDispatcher {

    speed = 15
    baseSpeed = 15
    velocity = new Vector3(2, 0, 1)

    constructor(scene, ballRadius, paddles, boundaries) {
        super()

        this.scene = scene
        this.boundaries = boundaries
        this.paddles = paddles
        this.velocity.z = 1

        this.radious = ballRadius
        this.geometry = new SphereGeometry(this.radious)
        this.material = new MeshBasicMaterial({ color: 0xf3a81c })
        this.mesh = new Mesh(this.geometry, this.material)

        this.velocity.multiplyScalar(this.speed)

        //this.scene.add(this.mesh)

        this.raycaster = new Raycaster()
        this.raycaster.near = 0
        this.raycaster.far = this.boundaries * 2.5
    }

    addBall(startBallDirection) {
        this.speed = this.baseSpeed
        if ((startBallDirection > 0 && this.velocity.z < 0) || (startBallDirection < 0 && this.velocity.z > 0)) {
            this.velocity.z *= -1
        }
        //const startBallDirection = Math.random() < 0.5 ? -1 : 1;
        this.velocity.normalize().multiplyScalar(this.speed)
        this.mesh.position.set(0, 0, 0)
        this.scene.add(this.mesh)
    }

    removeBall() {
        //this.resetBall()
        this.mesh.position.set(0, 0, 0)
        this.scene.remove(this.mesh)
        // this.geometry.dispose();
        // this.material.dispose();
        // this.mesh.dispose()
    }

    resetBall() {
        this.speed = this.baseSpeed
        this.velocity.z *= -1
        this.velocity.normalize().multiplyScalar(this.speed)


        this.dispatchEvent({
            type: 'onCameraReset', message: {}
        })
        this.dispatchEvent({
            type: 'onCameraMove', message: {
                direction: this.velocity.z > 0 ? 1 : 2,
                speed: this.speed
            }
        })
    }

    setBallSpeed(speed) {
        this.speed = speed
        this.baseSpeed = speed
    }

    changeBallVelocity(sign) {
        if ((sign < 0 && this.velocity.x > 0) || (sign > 0 && this.velocity.x < 0)) {
            this.velocity.x *= -1
        }
    }

    update(dt) {
        const s = this.velocity.clone().multiplyScalar(dt);
        const tPos = this.mesh.position.clone().add(s);
    
        const dx = (this.boundaries.x - this.radious) - Math.abs(this.mesh.position.x);
        const dz = (this.boundaries.y - this.radious) - Math.abs(this.mesh.position.z);
    
    
        const dir = this.velocity.clone().normalize();
        this.raycaster.set(this.mesh.position, dir);
    
        if (dx <= 0) {
            tPos.x = (this.boundaries.x - this.radious + dx) * Math.sign(this.mesh.position.x);
            this.velocity.x *= -1;
        }
        if (dz <= 0) {
            const message = this.mesh.position.z > 0 ? 'player2' : 'player1';
            this.dispatchEvent({ type: 'onScore', message: message });
            tPos.set(0, 0, 0);
            this.resetBall();
        }
    
        const paddle = this.paddles.find((p) => Math.sign(p.mesh.position.z) === Math.sign(this.velocity.z));

        if (!paddle) return; // Evita errori se non viene trovato un paddle
        
        const intersections = this.raycaster.intersectObjects([paddle.mesh, ...paddle.mesh.children], true);
        const intersection = intersections.length > 0 ? intersections[0] : null;
    
        if (intersection) {
            if (intersection.distance < s.length()) {
                tPos.copy(intersection.point);
                const d = s.length() - intersection.distance;
                const normal = intersection.normal;
                normal.y = 0;
                normal.normalize();
    
                const randomAngleVariation = (Math.random() - 0.5) * 0.2;
                this.velocity.reflect(normal).applyAxisAngle(new THREE.Vector3(0, 0.5, 0), randomAngleVariation);

                // Evita attraversamenti laterali del paddle
                const paddleWidth = paddle.geometry.parameters.width;
                tPos.x = Math.max(
                    paddle.mesh.position.x - paddleWidth / 2 + this.radious,
                    Math.min(tPos.x, paddle.mesh.position.x + paddleWidth / 2 - this.radious)
                );


    
                const ds = this.velocity.clone().normalize().multiplyScalar(d);
                tPos.add(ds);
    
                this.velocity.normalize().multiplyScalar(this.speed);
    
                this.dispatchEvent({
                    type: 'onCameraMove', message: {
                        direction: this.velocity.z > 0 ? 1 : 2,
                        speed: this.speed
                    }
                });
            }
        }
    
        this.mesh.position.copy(tPos);
    }
}

// export { balls };