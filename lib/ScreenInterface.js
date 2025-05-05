import PGA2D from "./PGA2D.js";
//import SceneObject from "./SceneObject.js";
//import AspectSceneObject from "./AspectSceneObject.js";


export default class ScreenInterface {

    constructor(canvas) {
        this._canvas = canvas;
        this._interactables = [];
    }
    
    boundaryCheck(p, obj) {
        let pose = obj.pose;
        p[0] /= pose[4];
        p[1] /= pose[5];
        let sp = PGA2D.applyMotorToPoint(p, PGA2D.reverse([pose[0], pose[1], pose[2], pose[3]]));
        //console.log(sp);
        if (-1 <= sp[0] && sp[0] <= 1 && -1 <= sp[1] && sp[1] <= 1) {
            return true;
        }
        return false;
    }


    async init() {
        this._canvas.addEventListener('mousemove', (e) => {
            var mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            var mouseY = (-e.clientY / window.innerHeight) * 2 + 1;
            //mouseX /= camera._pose[4];
            //mouseY /= camera._pose[5];
            //let p = PGA2D.applyMotorToPoint([mouseX, mouseY], [camera._pose[0], camera._pose[1], camera._pose[2], camera._pose[3]]);
            //oldP = [...p];
            this._interactables.forEach(obj => {
                let isHovering = this.boundaryCheck([mouseX,mouseY], obj);

                //onHoverStart
                if ( isHovering && !obj.currentlyHovering) {
                    obj.currentlyHovering = 1;
                    obj.onHoverStart()
                }

                //onHoverEnd
                else if ( !isHovering && obj.currentlyHovering) {
                    obj.currentlyHovering = 0;
                    obj.onHoverEnd();
                }
            });
            
            
        });
    }

    appendSceneObject(obj) {
        try {
            if(obj?.pose != undefined) {
                this._interactables.push(obj);
            } 
            else {
                throw new Error("SceneObject did not have pose property.");
            }
        } catch (error) {
            console.log(error.message);

        }
    }

}