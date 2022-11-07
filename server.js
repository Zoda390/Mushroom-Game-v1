import geckos from '@geckos.io/server'
import express from 'express'
import fs from 'fs'
import {find_in_array, ServerTile, ServerMap} from './server-classes.js'

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

//create the curent server map
var cs_map = new ServerMap('unUpdated', 0, 0);
cs_map.fromtxt("map.txt");
cs_map.save();

//dealing with messages that the server gets
io.onConnection(channel => {
    channel.onDisconnect(() => {
        //console.log(`${channel.id} got disconnected`);
    })
    
    channel.on('join', data => {
        map1.tile_map[data.y][data.x][data.z] = new ServerTile('entity', 'player');
        console.log(map1.tile_map[data.y][data.x][data.z]);
        io.room(channel.roomId).emit('give_world', {name: map1.name, str: map1.totxt()});
        io.room(channel.roomId).emit('update_id', data.id);
    })

    channel.on('change', data => {
        if(data.to != 0){
            let tempArr = data.to.split('.');
            for(let i = 0; i < tempArr.length; i++){
                tempArr[i] = parseInt(tempArr[i]);
            }
            map1.tile_map[data.y][data.x][data.z] = new ServerTile(tile_type_map[tempArr[0]], tile_name_map[tempArr[1]]);
        }
        else{
            map1.tile_map[data.y][data.x][data.z] = 0;
        }
        io.room(channel.roomId).emit('change', {x: data.x, y: data.y, z: data.z, to: data.to});
    })
})