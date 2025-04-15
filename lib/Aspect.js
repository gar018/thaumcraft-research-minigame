

export default class Aspect {
    // this class's purpose is to hold all the information 
    // that an Aspect needs for when it is being rendered as an AspectSceneObject.

    //TODO (potentially) I may need to have a hash map for referencing other aspects and their components as well

    constructor(name, association, color, texturePath, components = []) {
        //the name of the aspect
        this.aspectName = name;

        //additional keyword that signify the aspect's meaning/context
        //EX: Praecantatio -> Magic
        this.association = association; 

        //the main color of this aspect
        this.baseColor = color;

        //aspect texture path (resource location)
        this.texturePath = texturePath;

        // what two aspects make this aspect?
        // note: this should either be an empty list (primal aspect) or a list of two elements (compound aspect)
        // the components inside this list should be *strictly* Aspect objects
        this.components = components;

        this.isPrimal = this.isPrimal();
        
        
    }

    isPrimal() {
        if (this.components.length < 2) { //if a component list is 0 or 1, then it must be considered primal
            return true;
        } 
        return false;
    }

    

    
}