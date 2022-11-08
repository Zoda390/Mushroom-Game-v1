function find_in_array(input, arr){
    for(let i = 0; i < arr.length; i++){
        if(input === arr[i]){
            return i;
        }
    }
}

var tile_type_map = [0, 'solid', 'liquid', 'entity', 'facing'];
var tile_name_map = [0, 'stone', 'grass', 'water', 'player', 'wood'];

class ClientTile{ //a solid tile
    constructor(type, name, x, y, z){
        this.type = type;
        this.name = name;
        this.img_num = find_in_array(this.name, tile_name_map); //img found in img_map
        this.pos = {x: x, y: y, z: z};
    }

    toStr(){
        return find_in_array(this.type, tile_type_map) + '.' + find_in_array(this.name, tile_name_map);
    }

    render(){
        image(img_map[this.img_num][0], (this.pos.x*tileSize), (this.pos.y*tileSize) - (this.pos.z * tileSize/2), tileSize, tileSize + (tileSize/2));
    }
}

class ClientTilePlayer extends ClientTile{ //an entity tile
    constructor(type, name, x, y, z, team, facing){
        super(type, name, x, y, z);
        this.team = team;
        this.facing = facing; //an int for which direction the entity is facing
        this.move_counter = 0;
        this.walk_wait = 10; //frames before you can walk again
        this.run_wait = 5; //frames before you can run again
        this.id = 0;
        this.inv = [];
    }

    toStr(){
        return find_in_array(this.type, tile_type_map) + '.' + find_in_array(this.name, tile_name_map) + '.' + this.id + '.' + this.team + '.' + this.facing + '.' + this.move_counter + '.[]';
    }

    render(){
        image(img_map[this.img_num][this.facing], (this.pos.x*tileSize), (this.pos.y*tileSize) - (this.pos.z * tileSize/2), tileSize, tileSize + (tileSize/2));
        //incriment move_counter
        if(this.move_counter <= this.walk_wait){
            this.move_counter++;
        }
    }

    move(d, id){ //move the entity by sending 2 change messages
        if ((this.move_counter >= ((keyIsDown(run_button))? this.run_wait:this.walk_wait)) && id == this.id) {
            channel.emit('change', {x: this.pos.x, y: this.pos.y, z: this.pos.z, to: 0});
            if(d == 0){
                this.facing = 0;
                this.pos.y ++;
                player.y++;
            }
            else if(d == 1){
                this.facing = 1;
                this.pos.x --;
                player.x--;
            }
            else if(d == 2){
                this.facing = 2;
                this.pos.y --;
                player.y--;
            }
            else if(d == 3){
                this.facing = 3;
                this.pos.x ++;
                player.x++;
            }
            else if(d == 4){
                this.z --;
                player.z++;
            }
            else if(d == 5){
                this.z ++;
                player.z--;
            }
            this.move_counter = 0;
            channel.emit('change', {x: this.pos.x, y: this.pos.y, z: this.pos.z, to: this.toStr()});
        }
    }
}

class ClientMap{
    constructor(name, seed, ver){
        this.name = name; //name of map
        this.seed = seed; //seed used for map gen & random stuffs
        this.ver = ver; //version of game that map was made in
        this.tile_map = [];
        for(let y = 0; y < 20; y++){
            this.tile_map[y] = [];
            for(let x = 0; x < 40; x++){
                this.tile_map[y][x] = [];
                this.tile_map[y][x][0] = new ClientTile('solid', 'stone');
                this.tile_map[y][x][1] = new ClientTile('liquid', 'water');
                this.tile_map[y][x][2] = new ClientTile('solid', 'stone');
                this.tile_map[y][x][3] = new ClientTile('solid', 'grass');
                this.tile_map[y][x][4] = new ClientTile('solid', 'grass');
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

    fromStr(data){ //convert a str to a working map
        let temp_tile_map = [];
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

        //flip the map cause str is from top to bottom, but tile_map is bottom to top
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
                            if(parseInt(tempArr[i])+"" == tempArr[i]){
                                tempArr[i] = parseInt(tempArr[i]);
                            }
                        }

                        //use the type to create the right tile class
                        if(tempArr[0] == 1){ //solid
                            this.tile_map[y][x][z] = new ClientTile("solid", tile_name_map[tempArr[1]], x, y, z);
                        }
                        else if(tempArr[0] == 2){ //liquid
                            this.tile_map[y][x][z] = new ClientTile("liquid", tile_name_map[tempArr[1]], x, y, z);
                        }
                        else if(tempArr[0] == 3){ //entity
                            this.tile_map[y][x][z] = new ClientTilePlayer("entity", "player", x, y, z, tempArr[3], tempArr[4]);
                            this.tile_map[y][x][z].move_counter = tempArr[5];
                            this.tile_map[y][x][z].id = tempArr[2];
                        }
                        else if(tempArr[0] == 4){ //facing
                            this.tile_map[y][x][z] = new ClientTile("facing", tile_name_map[tempArr[1]], x, y, z);
                        }
                        else{
                            console.log("tile type not found client side " + tile_type_map[tempArr[0]]);
                        }
                    }
                    else{
                        this.tile_map[y][x][z] = 0;
                    }
                }
            }
        }
    }

    save(){ //save the map to a file
        //fs.writeFileSync((this.name + ".txt"), this.totxt());
    }

    render(){
        translate((-player.x*tileSize)+(tileSize*15), (-player.y*tileSize)+(player.z*(tileSize/2))+(tileSize*7)); //move the camera
        let outlineList = [];
        push();
        for(let y = 0; y < this.tile_map.length; y++){
            for(let x = 0; x < this.tile_map[y].length; x++){
                for(let z = 0; z < this.tile_map[y][x].length; z++){
                    imageMode(CORNER);
                    if(this.tile_map[y][x][z] != 0){
                        this.tile_map[y][x][z].render();
                    }

                    //selected tile, transparent white square
                    if(x == (player.x + floor(mouseX/tileSize) - 15) && y == (player.y + floor((mouseY - ((player.z-((player.z%2 == 0)? 1:0)) * 32))/tileSize) - 7 + floor(player.z/2) - ((player.z%2 == 0)? 1:0)) && z == player.z-1){
                        fill(255, 10);
                        stroke(255, 200);
                        rect((player.x + floor(mouseX/tileSize) - 15)*tileSize, (player.y + floor((mouseY - ((player.z-((player.z%2 == 0)? 1:0)) * 32))/tileSize) - 7 + floor(player.z/2) - ((player.z%2 == 0)? 1:0) - (player.z-1)/2)*tileSize, tileSize, tileSize);
                    }
                }
            }
        }
        for(let i = 0; i < outlineList.length; i++){
            image(img_map[outlineList[i].img_num], (outlineList[i].x*tileSize), (outlineList[i].y*tileSize) - (outlineList[i].z * tileSize/2), tileSize, tileSize + (tileSize/2));
        }
        pop();
    }
}

/* Player rendering
if(tile_map[y][x][z] === 4){
    fill(0, 70);
    stroke(0);
    let shadowZ = 0;
    for(let z2 = 0; z2 < tile_map[y][x].length; z2++){
        if(tile_map[y][x][z2] != 0 && tile_map[y][x][z2] != 4){
            shadowZ = z2;
        }
    }
    circle((x*tileSize) + (tileSize/2), (y*tileSize) - (shadowZ * tileSize/2) + (tileSize/2), (10-(z-shadowZ)) * (tileSize/20));
    if(player.x === x && player.y === y && player.z === z){
        image(img_map[(tile_map[y][x][z])], (x*tileSize), (y*tileSize) - (z * tileSize/2), tileSize, tileSize + (tileSize/2));
    }
    else{
        image(img_map[(tile_map[y][x][z])+1], (x*tileSize), (y*tileSize) - (z * tileSize/2), tileSize, tileSize + (tileSize/2));
    }
    let OutlineBool = false;
    for(let i = z+1; i < tile_map[y][x].length; i++){
        if(tile_map[y][x][i] !== 0){
            OutlineBool = true;
        }
    }
    if(OutlineBool){
        outlineList.push({x: x, y: y, z: z, img_num: (player.x === x && player.y === y && player.z === z)? 8:7});
    }
}*/