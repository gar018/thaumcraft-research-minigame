
//TODO - acknowledge the contribution by thaumcraft and the thaumcraft API
// github link to where I got the aspect definitions
// https://github.com/Azanor/thaumcraft-api/blob/1.7.10/aspects/Aspect.java
export default class Aspect {
    // this class's purpose is to hold all the information 
    // that an Aspect needs for when it is being rendered as an AspectSceneObject.

    //TODO (potentially) I may need to have a hash map for referencing other aspects and their components as well

    constructor(name, hexColor, components = []) {
        //the name of the aspect
        this.aspectName = name;

        //the main color of this aspect (AS HEX CODE, gets translated to the rgba format needed for WebGPU)
        this.baseColor = this.#hexToRGB(hexColor);

        // what two aspects make this aspect?
        // note: this should either be an empty list (primal aspect) or a list of two elements (compound aspect)
        // the components inside this list should be *strictly* Aspect objects
        this.components = components;
        //reads the list once and determines if it is primal or compound
        this.isPrimal = this.#isPrimal();


        //aspect texture path (resource location)
        this.texturePath = `/assets/aspects/${name}.png`;


        //additional keyword that signify the aspect's meaning/context
        //EX: Praecantatio -> Magic
        //TODO add association names
        
        
    }

    #isPrimal() {
        if (this.components.length < 2) { //if a component list is 0 or 1, then it must be considered primal
            return true;
        } 
        return false;
    }

    #hexToRGB(color) {
        let r = color / 0x010000;
        let g = (color / 0x000100) % 0x0100;
        let b = color % 0x000100;
        return [r/255.0, g/255.0, b/255.0, 1.0]; //4th value is for alpha, which should always be 1 for the base color
    }

    // ALL ASPECT DEFINITIONS UNDER HERE -------------------------------------------

    //PRIMAL ASPECTS

    static AIR = new Aspect("aer", 0xffff7e);
    static EARTH = new Aspect("terra", 0x56c000);
    static FIRE = new Aspect("ignis", 0xff5a01);
    static WATER = new Aspect("aqua", 0x3cd4fc);
    static ORDER = new Aspect("ordo", 0xd5d4ec);
    static ENTROPY = new Aspect("perditio", 0x404040);

    //SECONDARY ASPECTS

    static VOID = new Aspect("vacuos", 0x888888, [Aspect.AIR, Aspect.ENTROPY]);
    static LIGHT = new Aspect("lux", 0xfff663, [Aspect.AIR, Aspect.FIRE]);
    static WEATHER = new Aspect("tempestas", 0xffffff, [Aspect.AIR, Aspect.WATER]);
    static MOTION = new Aspect("motus", 0xcdccf4, [Aspect.AIR, Aspect.ORDER]);
    static COLD = new Aspect("gelum", 0xe1ffff, [Aspect.FIRE, Aspect.ENTROPY]);
    static CRYSTAL = new Aspect("vitreus", 0x80ffff, [Aspect.EARTH, Aspect.ORDER]);
    static LIFE = new Aspect("victus", 0xde0005, [Aspect.WATER, Aspect.EARTH]);
    static POISON = new Aspect("venenum", 0x89f000, [Aspect.WATER, Aspect.ENTROPY]);
    static ENERGY = new Aspect("potentia", 0xc0ffff, [Aspect.ORDER, Aspect.FIRE]);
    static EXCHANGE = new Aspect("permutatio", 0x578357, [Aspect.ENTROPY, Aspect.ORDER]);

    //TERTIARY

    static METAL = new Aspect("metallum", 0xb5b5cd, [Aspect.EARTH, Aspect.CRYSTAL]);
    static DEATH = new Aspect("mortuus", 0x887788, [Aspect.LIFE, Aspect.ENTROPY]);
    static FLIGHT = new Aspect("volatus", 0xe7e7d7, [Aspect.AIR, Aspect.MOTION]);
    static DARKNESS = new Aspect("tenebrae", 0x222222, [Aspect.VOID, Aspect.LIGHT]);
    static SOUL = new Aspect("spiritus", 0xebebfb, [Aspect.LIFE, Aspect.DEATH]);
    static HEAL = new Aspect("sano", 0xff2f34, [Aspect.LIFE, Aspect.ORDER]);
    static TRAVEL = new Aspect("iter", 0xe0585b, [Aspect.MOTION, Aspect.EARTH]);
    static ELDRITCH = new Aspect("alienis", 0x805080, [Aspect.VOID, Aspect.DARKNESS]);
    static MAGIC = new Aspect("praecantatio", 0x9700c0, [Aspect.VOID, Aspect.ENERGY]);
    static AURA = new Aspect("aurum", 0xffc0ff, [Aspect.MAGIC, Aspect.AIR]);
    static TAINT = new Aspect("vitium", 0x800080, [Aspect.MAGIC, Aspect.ENTROPY]);
    static SLIME = new Aspect("limus", 0x01f800, [Aspect.LIFE, Aspect.WATER]);
    static PLANT = new Aspect("herba", 0x01ac00, [Aspect.LIFE, Aspect.EARTH]);
    static TREE = new Aspect("arbor", 0x876531, [Aspect.AIR, Aspect.PLANT]);
    static BEAST = new Aspect("beastia", 0x9f6409, [Aspect.MOTION, Aspect.LIFE]);
    static FLESH = new Aspect("corpus", 0xee478d, [Aspect.DEATH, Aspect.BEAST]);
    static UNDEAD = new Aspect("exanimis", 0x3a4000, [Aspect.MOTION, Aspect.DEATH]);
    static MIND = new Aspect("cognitio", 0xffc2b3, [Aspect.FIRE, Aspect.SOUL]);
    static SENSES = new Aspect("sensus", 0x0fd9ff, [Aspect.AIR, Aspect.SOUL]);
    static MAN = new Aspect("humanus", 0xffd7c0, [Aspect.BEAST, Aspect.MIND]);
    static CROP = new Aspect("messis", 0xe1b371, [Aspect.PLANT, Aspect.MAN]);
    static MINE = new Aspect("perfodio", 0xdcd2d8, [Aspect.MAN, Aspect.EARTH]);
    static TOOL = new Aspect("instrumentum", 0x4040ee, [Aspect.MAN, Aspect.ORDER]);
    static HARVEST = new Aspect("meto", 0xeead82, [Aspect.CROP, Aspect.TOOL]);
    static WEAPON = new Aspect("telum", 0xc05050, [Aspect.TOOL, Aspect.FIRE]);
    static ARMOR = new Aspect("tutamen", 0x00c0c0, [Aspect.TOOL, Aspect.EARTH]);
    static HUNGER = new Aspect("fames", 0x9a0305, [Aspect.LIFE, Aspect.VOID]);
    static GREED = new Aspect("lucrum", 0xe6be44, [Aspect.MAN, Aspect.HUNGER]);
    static CRAFT = new Aspect("fabrico", 0x809d80, [Aspect.MAN, Aspect.TOOL]);
    static CLOTH = new Aspect("pannus", 0xeaeac2, [Aspect.TOOL, Aspect.BEAST]);
    static MECHANISM = new Aspect("machina", 0x8080a0, [Aspect.MOTION, Aspect.TOOL]);
    static TRAP = new Aspect("vinculum", 0x9a8080, [Aspect.MOTION, Aspect.ENTROPY]);
    
}

