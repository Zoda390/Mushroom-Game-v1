var channel; //gecko server
var cc_map; //curent client map
var tileSize = 64; //rendered size of tiles
var player = {x: 0, y: 0, z: 5, hand: 1, id: 0}; //a quickhand for player info

//create the img_map
var img_map = [];
function preload(){
    img_map.push(0);
    img_map.push([loadImage("imgs/stone-v1.png")]);
    img_map.push([loadImage("imgs/grass-v1.png")]);
    img_map.push([loadImage("imgs/water-v1.png")]);
    img_map.push([loadImage("imgs/player-v1.png"), loadImage("imgs/player(left)-v1.png"), loadImage("imgs/player(back)-v1.png"), loadImage("imgs/player(right)-v1.png"), loadImage("imgs/playerOutline-v1.png"), loadImage("imgs/playerOutline(left)-v1.png"), loadImage("imgs/playerOutline(back)-v1.png"), loadImage("imgs/playerOutline(right)-v1.png"), loadImage("imgs/player2-v1.png"), loadImage("imgs/player2(left)-v1.png"), loadImage("imgs/player2(back)-v1.png"), loadImage("imgs/player2(right)-v1.png"), loadImage("imgs/player2Outline-v1.png"), loadImage("imgs/player2Outline(left)-v1.png"), loadImage("imgs/player2Outline(back)-v1.png"), loadImage("imgs/player2Outline(right)-v1.png")]);
    img_map.push([loadImage("imgs/wood-v1.png")]);
}

function setup(){
    for (let element of document.getElementsByClassName("p5Canvas")) {
        element.addEventListener("contextmenu", (e) => e.preventDefault());
    }

    channel = geckos({ port: 3000 });

    channel.onConnect(error => {
        if (error) {
            console.error(error.message)
            return
        }

        channel.emit('join', {x: 0, y: 0, z: 5, id: channel.id});

        channel.on('give_world', data => {
            if(map1 == undefined){
                map1 = new ClientMap(data.name, 0, 0);
                map1.fromStr(data.str);
            }
            else{
                console.log(map1);
            }
        })

        channel.on('update_id', data => {
            if(player.id === 0){
                player.id = data;
                map1.tile_map[player.y][player.x][player.z].id = data;
            }
        })

        channel.on('change', data => {
            if(data.to !== 0){
                if(data.to.type == 1){
                    map1.tile_map[data.y][data.x][data.z] = new ClientTile(tile_type_map[data.to.type], tile_name_map[data.to.name], data.x, data.y, data.z);
                }
                else if(data.to.type == 2){
                    map1.tile_map[data.y][data.x][data.z] = new ClientTile(tile_type_map[data.to.type], tile_name_map[data.to.name], data.x, data.y, data.z);
                }
                else if(data.to.type == 3){
                    map1.tile_map[data.y][data.x][data.z] = new ClientTilePlayer("entity", "player", data.x, data.y, data.z, 0, data.to.facing);
                    map1.tile_map[data.y][data.x][data.z].lastmoveMilli = data.to.lastmoveMilli;
                    map1.tile_map[data.y][data.x][data.z].id = data.to.id;
                }
                else if(data.to.type == 4){
                    map1.tile_map[data.y][data.x][data.z] = new ClientTile(tile_type_map[data.to.type], tile_name_map[data.to.name], data.x, data.y, data.z);
                }
                else{
                    console.log("tile type not found server side " + data.to.type);
                }
            }
            else{
                map1.tile_map[data.y][data.x][data.z] = 0;
            }
        })
    })

    createCanvas(tileSize*30, tileSize*14);
}