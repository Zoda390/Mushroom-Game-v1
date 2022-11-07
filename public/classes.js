function find_in_array(input, arr){
    for(let i = 0; i < arr.length; i++){
        if(input === arr[i]){
            return i;
        }
    }
}

var tile_type_map = [0, 'solid', 'liquid', 'entity', 'facing'];
var tile_name_map = [0, 'stone', 'grass', 'water', 'player', 'wood'];
class ClientTile{
    constructor(type, name, x, y, z){
        this.type = type;
        this.name = name;
        this.img_num = find_in_array(this.name, tile_name_map);
        this.pos = {x: x, y: y, z: z};
    }

    totxt(){
        return find_in_array(this.type, tile_type_map) + '.' + find_in_array(this.name, tile_name_map);
    }

    render(){
        image(img_map[this.img_num][0], (this.pos.x*tileSize), (this.pos.y*tileSize) - (this.pos.z * tileSize/2), tileSize, tileSize + (tileSize/2));
    }
}

class ClientTilePlayer extends ClientTile{
    constructor(type, name, x, y, z, team, facing){
        super(type, name, x, y, z);
        this.team = team;
        this.facing = facing;
        this.lastmoveMilli = 0;
        this.runing = false;
        this.walk_wait = 120;
        this.run_wait = 40;
        this.id = 0;
        this.inv = [];
    }

    totxt(){
        return find_in_array(this.type, tile_type_map) + '.' + find_in_array(this.name, tile_name_map) + '.' + this.team + '.' + this.facing + '.[]';
    }

    render(){
        image(img_map[this.img_num][this.facing], (this.pos.x*tileSize), (this.pos.y*tileSize) - (this.pos.z * tileSize/2), tileSize, tileSize + (tileSize/2));
    }

    move(d, id){
        if (millis() - this.lastmoveMilli > this.walk_wait && id == this.id) {
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
            this.lastmoveMilli = millis();
            console.log(this.type + " " + this.name);
            channel.emit('change', {x: this.pos.x, y: this.pos.y, z: this.pos.z, to: {type: this.type, name: this.name, facing: this.facing, lastmoveMilli: this.lastmoveMilli, id: this.id}});
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

    totxt(){
        let temp = "";
        for(let z = this.tile_map[0][0].length-1; z >= 0; z--){
            for(let y = 0; y < this.tile_map.length; y++){
                for(let x = 0; x < this.tile_map[y].length; x++){
                    if(this.tile_map[y][x][z] !== 0){
                        temp += this.tile_map[y][x][z].totxt() + "~";
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

    fromStr(data){
        let temp_tile_map = [];
        let lastz = 0;
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
        let temp_sv = "";
        for(let i = lastz; i < data.length; i++){
            temp_sv += data[i];
        }
        temp_sv = temp_sv.split(" ");
        this.seed = parseInt(temp_sv[0].split(":")[1]);
        this.ver = parseFloat(temp_sv[1].split(":")[1]);
        temp_tile_map.reverse();
        let ycount = 0;
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
        let xcount = 0;
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
        this.tile_map = [];
        for(let y = 0; y < ycount; y++){
            this.tile_map[y] = [];
            for(let x = 0; x < xcount; x++){
                this.tile_map[y][x] = [];
                for(let z = 0; z < temp_tile_map.length; z++){
                    if(temp_tile_map[z][y][x] !== "0"){
                        console.log(temp_tile_map[z][y][x]);
                        let tempArr = temp_tile_map[z][y][x].split('.');
                        for(let i = 0; i < tempArr.length; i++){
                            tempArr[i] = parseInt(tempArr[i]);
                        }
                        if(tempArr[0] == 1){
                            this.tile_map[y][x][z] = new ClientTile(tile_type_map[tempArr[0]], tile_name_map[tempArr[1]], x, y, z);
                        }
                        else if(tempArr[0] == 2){
                            this.tile_map[y][x][z] = new ClientTile(tile_type_map[tempArr[0]], tile_name_map[tempArr[1]], x, y, z);
                        }
                        else if(tempArr[0] == 3){
                            this.tile_map[y][x][z] = new ClientTilePlayer("entity", tile_name_map[tempArr[1]], x, y, z, 0, 0);
                        }
                        else if(tempArr[0] == 4){
                            this.tile_map[y][x][z] = new ClientTile(tile_type_map[tempArr[0]], tile_name_map[tempArr[1]], x, y, z);
                        }
                        else{
                            console.log("tile type not found server side " + tile_type_map[tempArr[0]]);
                        }
                    }
                    else{
                        this.tile_map[y][x][z] = 0;
                    }
                }
            }
        }
    }

    save(){
        //fs.writeFileSync((this.name + ".txt"), this.totxt());
    }

    render(){
        translate((-player.x*tileSize)+(tileSize*15), (-player.y*tileSize)+(player.z*(tileSize/2))+(tileSize*7));
        let outlineList = [];
        push();
        for(let y = 0; y < this.tile_map.length; y++){
            for(let x = 0; x < this.tile_map[y].length; x++){
                for(let z = 0; z < this.tile_map[y][x].length; z++){
                    imageMode(CORNER);
                    if(this.tile_map[y][x][z] != 0){
                        this.tile_map[y][x][z].render();
                    }
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

function place(mode, tileID, x=player.x + floor(mouseX/tileSize) - 15, y=player.y + floor((mouseY - ((player.z-((player.z%2 == 0)? 1:0)) * 32))/tileSize) - 7 + floor(player.z/2) - ((player.z%2 == 0)? 1:0), z=player.z - 1){
    if(mode == "s"){
        //take item from inv
    }

    if(tileID == 0 && mode != "s"){
        channel.emit('change', {x: x, y: y, z: z, to: 0});
    }
    else{
        if(tileID == 0){
            console.log("place 0, doesnt work in survival\nPlease use mine");
        }
        else{
            channel.emit('change', {x: x, y: y, z: z, to: {type: 1, name: tileID}});
        }
    }
}

function mine(mode, x=player.x + floor(mouseX/tileSize) - 15, y=player.y + floor((mouseY - ((player.z-((player.z%2 == 0)? 1:0)) * 32))/tileSize) - 7 + floor(player.z/2) - ((player.z%2 == 0)? 1:0), z=player.z - 1){
    if(mode == "s"){
        channel.emit('change', {x: x, y: y, z: z, to: 0});
        //add item to inv
    }
    else{
        console.log("mine is for survival only\nPlease use place 0");
    }
}

function change_prop(prop, to, map, x=player.x + floor(mouseX/tileSize) - 15, y=player.y + floor((mouseY - ((player.z-((player.z%2 == 0)? 1:0)) * 32))/tileSize) - 7 + floor(player.z/2) - ((player.z%2 == 0)? 1:0), z=player.z - 1){
    let props = Object.keys(map.tile_map[y][x][z]);
    let i = find_in_array(prop, props);
    if(i != undefined){
        map.tile_map[y][x][z][prop] = to;
    }
}

function fillTiles(tileID, keep, map, x1, y1, z1, x2, y2, z2){
    for(let y = y1; y < y2; y++){
        for(let x = x1; x < x2; x++){
            for(let z = z1; z < z2; z++){
                if(keep){
                    if(map.tile_map[y][x][z] != 0){
                        place("L", tileID, x, y, z);
                    }
                }
                else{
                    place("L", tileID, x, y, z);
                }
            }
        }
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