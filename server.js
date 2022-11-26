import geckos from '@geckos.io/server'
import express from 'express'
import fs from 'fs'
import {find_in_array, ServerTile, ServerMap, ServerTileEntity, ServerItem} from './server-classes.js'

//server stuff
const port = 3000;
const app = express()
const server = app.listen(port)
const io = geckos()

io.addServer(server)

app.use(express.static("public"));
console.log("My server is running on port " + port);

//open a json file and make map for names and types
var json_tiles = fs.readFileSync("tiles.json");
json_tiles = JSON.parse(json_tiles);
var tile_name_map = [0]; //a map for all tile names
var tile_type_map = [0]; //a map for all tile types
var item_name_map = [0]; //a map for all item names
var item_type_map = [0]; //a map for all item types

//add each tile in json to map arrays
for(let i = 0; i < json_tiles.length; i++){
    tile_name_map.push(json_tiles[i]['name'])
    tile_type_map.push(json_tiles[i]['type'])
}

//remove duplicates
tile_name_map = [...new Set(tile_name_map)];
tile_type_map = [...new Set(tile_type_map)];

//create the curent server map
var cs_map = new ServerMap('unUpdated', 0, 0); //curent server map
cs_map.fromtxt("map.txt");
cs_map.save();


var player_count = 0;
var chat_arr = [{team: 0, txt:"Zoda: Gay people!"}, {team: 0, txt:"Zoda: Gay people!"}, {team: 0, txt:"Zoda: Gay people!"}, {team: 0, txt:"Zoda: Gay people!"}, {team: 0, txt:"Zoda: Gay people!"}, {team: 0, txt:"Zoda: Gay people!"}, {team: 0, txt:"Zoda: Gay people!"}, {team: 0, txt:"Zoda: Gay people!"}, {team: 0, txt:"Zoda: Gay people!"}, {team: 0, txt:"Zoda: Gay people!"}, {team: 1, txt:"Zoda2: Gay people!"}, {team: 2, txt:"Server: Gay people!"}];
//dealing with messages that the server gets
io.onConnection(channel => {
    channel.onDisconnect(() => { //client disconnect message
        //console.log(`${channel.id} got disconnected`);
    })
    
    channel.on('join', data => { //client join message
        //convert the map to a string and send it to the player
        io.room(channel.roomId).emit('give_world', {str: cs_map.totxt(), name: cs_map.name});
        
        //add a player to the map
        cs_map.tile_map[data.y][data.x][data.z] = new ServerTileEntity(find_in_array("entity", tile_type_map), find_in_array("player", tile_name_map), (player_count%2), 0);
        cs_map.tile_map[data.y][data.x][data.z].id = data.id;
        io.room(channel.roomId).emit('change', {x: data.x, y: data.y, z: data.z, to: cs_map.tile_map[data.y][data.x][data.z].toStr()});
        player_count++;
    })

    channel.on('change', data => { //change a block data = {x:int, y:int, z:int, to:str}
        if(data.to != 0){
            //parse the str from data.to
            let tempArr = data.to.split('.');
            for(let i = 0; i < tempArr.length; i++){
                if(tempArr[i] == parseInt(tempArr[i]) + ''){
                    tempArr[i] = parseInt(tempArr[i]);
                }
            }

            //use the type to create the right tile class
            if(tempArr[0] == 1){ //solid
                cs_map.tile_map[data.y][data.x][data.z] = new ServerTile(1, tempArr[1]);
            }
            else if(tempArr[0] == 2){ //liquid
                cs_map.tile_map[data.y][data.x][data.z] = new ServerTile(2, tempArr[1]);
            }
            else if(tempArr[0] == 3){ //entity
                cs_map.tile_map[data.y][data.x][data.z] = new ServerTileEntity(3, tempArr[1], tempArr[3], tempArr[4]);
                cs_map.tile_map[data.y][data.x][data.z].move_counter = tempArr[5];
                cs_map.tile_map[data.y][data.x][data.z].id = tempArr[2];
                if(tempArr[tempArr.length-1] != '[]'){
                    let tempArr2 = [];
                    for(let i = tempArr.length - 1; i >= 0; i--){
                        tempArr2.push(tempArr[i]);
                        if(tempArr[i][0] == '['){
                            break;
                        }
                    }
                    tempArr2 = tempArr2.reverse();
                    tempArr2[0] = tempArr2[0].replace('[', '');
                    tempArr2[0] = parseInt(tempArr2[0]);
                    tempArr2[tempArr2.length-1] = parseInt(tempArr2[tempArr2.length-1]);
                    console.log(tempArr2);
                    cs_map.tile_map[data.y][data.x][data.z].inv = new ServerItem(tempArr2[0], tempArr2[1], tempArr2[2], '');
                }
            }
            else if(tempArr[0] == 4){ //facing
                cs_map.tile_map[data.y][data.x][data.z] = new ServerTile(4, tempArr[1]);
            }
            else{
                console.log("tile type not found server side " + tempArr[0]);
            }
        }
        else{
            //add a 0 to the server map
            cs_map.tile_map[data.y][data.x][data.z] = 0;
        }

        //send the change out to all clients
        io.room(channel.roomId).emit('change', {x: data.x, y: data.y, z: data.z, to: data.to});
    })

    channel.on('msg', data => {
        chat_arr.push(data);
        io.room(channel.roomId).emit('msg', data);
    })
})