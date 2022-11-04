import geckos from '@geckos.io/server'
import express from 'express'
import fs from 'fs'

const port = 3000;
const app = express()
const server = app.listen(port)
const io = geckos()

io.addServer(server)

app.use(express.static("public"));
console.log("My server is running on port " + port);

function find_in_array(input, arr){
    for(let i = 0; i < arr.length; i++){
        if(input === arr[i]){
            return i;
        }
    }
}

//open the json for tiles
var json_tiles = fs.readFileSync("tiles.json");
json_tiles = JSON.parse(json_tiles);
var tile_name_map = [0];
var tile_type_map = [0];

//add each tile in json to map arrays
for(let i = 0; i < json_tiles.length; i++){
    tile_name_map.push(json_tiles[i]['name'])
    tile_type_map.push(json_tiles[i]['type'])
}

//remove duplicates
tile_name_map = [...new Set(tile_name_map)];
tile_type_map = [...new Set(tile_type_map)];

/*
var tile_type_map = [0, 'solid', 'facing', 'entity', 'liquid'];
var tile_name_map = [0, 'stone', 'grass', 'water', 'player', 'wood'];
*/

class ServerTile{
    constructor(type, name){
        this.type = find_in_array(type, tile_type_map);
        this.name = find_in_array(name, tile_name_map);
    }

    totxt(){
        return this.type + '.' + this.name;
    }
}
class ServerMap{
    constructor(name, seed, ver){
        this.name = name; //name of map
        this.seed = seed; //seed used for map gen & random stuffs
        this.ver = ver; //version of game that map was made in
        this.tile_map = [];
        for(let y = 0; y < 20; y++){
            this.tile_map[y] = [];
            for(let x = 0; x < 40; x++){
                this.tile_map[y][x] = [];
                this.tile_map[y][x][0] = new ServerTile('solid', 'stone');
                this.tile_map[y][x][1] = new ServerTile('liquid', 'water');
                this.tile_map[y][x][2] = new ServerTile('solid', 'stone');
                this.tile_map[y][x][3] = new ServerTile('solid', 'grass');
                this.tile_map[y][x][4] = new ServerTile('solid', 'grass');
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

    fromtxt(filepath){
        this.name = filepath.split('.')[0];
        let temp_tile_map = [];
        let data = fs.readFileSync(filepath).toString();
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
        this.tile_map = [];
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
                        this.tile_map[y][x][z] = new ServerTile(tile_type_map[tempArr[0]], tile_name_map[tempArr[1]]);
                    }
                    else{
                        this.tile_map[y][x][z] = 0;
                    }
                }
            }
        }
    }

    save(){
        fs.writeFileSync((this.name + ".txt"), this.totxt());
    }
}

var map1 = new ServerMap('unUpdated', 0, 0);
map1.fromtxt("map.txt");
map1.save();

io.onConnection(channel => {
    channel.onDisconnect(() => {
        console.log(`${channel.id} got disconnected`);
    })
    
    channel.on('join', data => {
        map1.tile_map[data.y][data.x][data.z] = new ServerTile('entity', 'player');
        io.room(channel.roomId).emit('give_world', {name: map1.name, str: map1.totxt()});
        io.room(channel.roomId).emit('update_id', data.id);
    })

    channel.on('change', data => {
        if(data.to != 0){
            map1.tile_map[data.y][data.x][data.z] = new ServerTile(data.to.type, data.to.name);
        }
        else{
            map1.tile_map[data.y][data.x][data.z] = 0;
        }
        io.room(channel.roomId).emit('change', {x: data.x, y: data.y, z: data.z, to: data.to});
    })
})