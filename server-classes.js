import fs from 'fs'

//Mostly for searching the name and type maps
export function find_in_array(input, arr){
    for(let i = 0; i < arr.length; i++){
        if(input === arr[i]){
            return i;
        }
    }
}

//a solid tile for server end
export class ServerTile{
    constructor(type, name){
        this.type = type; //int
        this.name = name; //int
    }

    toStr(){
        return this.type + '.' + this.name;
    }
}

export class ServerTileEntity extends ServerTile{
    constructor(type, name, team, facing){
        super(type, name);
        this.team = team;
        this.facing = facing; //an int for which direction the entity is facing
        this.move_counter = 0;
        this.walk_wait = 10; //frames before you can walk again
        this.run_wait = 5; //frames before you can run again
        this.id = 0;
        this.inv = [];
    }

    toStr(){
        return this.type + '.' + this.name + '.' + this.id + '.' + this.team + '.' + this.facing + '.' + this.move_counter + '.[]';
    }
}

export class ServerMap{
    constructor(name, seed, ver){
        this.name = name; //name of map
        this.seed = seed; //seed used for map gen & random stuffs
        this.ver = ver; //version of game that map was made in
        this.tile_map = [];
        for(let y = 0; y < 20; y++){
            this.tile_map[y] = [];
            for(let x = 0; x < 40; x++){
                this.tile_map[y][x] = [];
                this.tile_map[y][x][0] = new ServerTile(1, 1); //stone
                this.tile_map[y][x][1] = new ServerTile(2, 3); //water
                this.tile_map[y][x][2] = new ServerTile(1, 1); //stone
                this.tile_map[y][x][3] = new ServerTile(1, 2); //grass
                this.tile_map[y][x][4] = new ServerTile(1, 2); //grass
                this.tile_map[y][x][5] = 0;
                this.tile_map[y][x][6] = 0;
                this.tile_map[y][x][7] = 0;
                this.tile_map[y][x][8] = 0;
                this.tile_map[y][x][9] = 0;
            }
        }
    }

    totxt(){ //convert the map to txt format
        //~ for the end of a tile
        //~~ for the end of a y section
        //~~~ for the end of a z section
        //≈ for the end of an item
        //. to seperate properties
        let temp = "";
        for(let z = this.tile_map[0][0].length-1; z >= 0; z--){
            for(let y = 0; y < this.tile_map.length; y++){
                for(let x = 0; x < this.tile_map[y].length; x++){
                    if(this.tile_map[y][x][z] !== 0){
                        /* second player map break test
                        if(this.tile_map[y][x][z].type == 3){
                            console.log(this.tile_map[y][x][z].toStr())
                        }
                        */
                        temp += this.tile_map[y][x][z].toStr() + "~";
                    }
                    else{
                        temp += "0~"; 
                    }
                }
                temp += " ~~\n";
            }
            temp += "~~~\n";
        }
        temp += "s:" + this.seed + " v:" + this.ver;
        return temp;
    }

    fromtxt(filepath){ //convert a txt file to a working map
        this.name = filepath.split('.')[0]; //get the name from the filepath given
        let temp_tile_map = [];
        let data = fs.readFileSync(filepath).toString(); //open the file
        let lastz = 0; //hold the index of the last ~~~ you found
        for(let z = 0; z < data.length; z++){
            if((data[z]+data[z+1]+data[z+2]) === "~~~"){
                let temp = ""
                for(let j = lastz; j < z-1; j++){
                    temp += data[j];
                }
                temp_tile_map.push(temp);
                lastz = z + 4;
            }
        }

        //get the seed and version
        let temp_sv = "";
        for(let i = lastz; i < data.length; i++){
            temp_sv += data[i];
        }
        temp_sv = temp_sv.split(" ");
        this.seed = parseInt(temp_sv[0].split(":")[1]);
        this.ver = parseFloat(temp_sv[1].split(":")[1]);

        //flip the map cause map.txt is from top to bottom, but tile_map is bottom to top
        temp_tile_map.reverse();

        let ycount = 0; //hold the index of the last ~~ you found
        for(let z = 0; z < temp_tile_map.length; z++){
            let data = temp_tile_map[z];
            temp_tile_map[z] = [];
            ycount = 0;
            let lasty = 0;
            for(let y = 0; y < data.length; y++){
                if((data[y]+data[y+1]) === "~~"){
                    let temp = ""
                    for(let j = lasty; j < y-1; j++){
                        temp += data[j];
                    }
                    temp_tile_map[z].push(temp);
                    lasty = y + 3;
                    ycount ++;
                }
            }
        }

        let xcount = 0; //hold the index of the last ~ you found
        for(let z = 0; z < temp_tile_map.length; z++){
            for(let y = 0; y < temp_tile_map[z].length; y++){
                let data = temp_tile_map[z][y];
                temp_tile_map[z][y] = [];
                xcount = 0;
                let lastx = 0;
                for(let x = 0; x < data.length; x++){
                    if(data[x] === "~"){
                        //.[1.1≈] for items in tiles
                        let temp = ""
                        for(let j = lastx; j < x; j++){
                            temp += data[j];
                        }
                        temp_tile_map[z][y].push(temp);
                        lastx = x + 1;
                        xcount ++;
                    }
                }
            }
        }

        //fill the current tile_map with the temp_tile_map
        this.tile_map = []; //empty the current tile_map
        for(let y = 0; y < ycount; y++){
            this.tile_map[y] = [];
            for(let x = 0; x < xcount; x++){
                this.tile_map[y][x] = [];
                for(let z = 0; z < temp_tile_map.length; z++){
                    if(temp_tile_map[z][y][x] !== "0"){
                        let tempArr = temp_tile_map[z][y][x].split('.');
                        for(let i = 0; i < tempArr.length; i++){
                            tempArr[i] = parseInt(tempArr[i]);
                        }
                        
                        //use the type to create the right tile class
                        if(tempArr[0] == 1){ //solid
                            this.tile_map[y][x][z] = new ServerTile(1, tempArr[1]);
                        }
                        else if(tempArr[0] == 2){ //liquid
                            this.tile_map[y][x][z] = new ServerTile(2, tempArr[1]);
                        }
                        else if(tempArr[0] == 3){ //entity
                            this.tile_map[data.y][data.x][data.z] = new ServerTileEntity(3, tempArr[1], tempArr[3], tempArr[4]);
                            this.tile_map[data.y][data.x][data.z].move_counter = tempArr[5];
                            this.tile_map[data.y][data.x][data.z].id = tempArr[2];
                        }
                        else if(tempArr[0] == 4){ //facing
                            this.tile_map[y][x][z] = new ServerTile(4, tempArr[1]);
                        }
                        else{
                            console.log("tile type not found server side " + tempArr[0]);
                        }
                    }
                    else{
                        this.tile_map[y][x][z] = 0;
                    }
                }
            }
        }
    }

    save(){ //actually put the txt into a file
        fs.writeFileSync((this.name + ".txt"), this.totxt());
    }
}