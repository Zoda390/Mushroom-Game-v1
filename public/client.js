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
    //Stop contextmenu on right click
    for (let element of document.getElementsByClassName("p5Canvas")) {
        element.addEventListener("contextmenu", (e) => e.preventDefault());
    }

    channel = geckos({ port: 3000 }); //conect gecko server to port

    //dealing with messages that the client gets
    channel.onConnect(error => {
        if (error) {
            console.error(error.message)
            return
        }

        //when you connect send the server a join message
        channel.emit('join', {x: 0, y: 0, z: 5, id: channel.id});

        //when the server gives you the world data
        channel.on('give_world', data => {
            if(cc_map == undefined){ //only take the world if you don't already have it
                cc_map = new ClientMap("unUpdated", 0, 0);
                cc_map.name = data.name;
                cc_map.fromStr(data.str);
            }
            /*
            else{
                console.log(cc_map);
            }
            */
        })
        
        //change a block data = {x:int, y:int, z:int, to:str}
        channel.on('change', data => {
            if(data.to !== 0){
                //parse the str from data.to
                let tempArr = data.to.split('.');
                for(let i = 0; i < tempArr.length; i++){
                    if(parseInt(tempArr[i])+"" == tempArr[i]){
                        tempArr[i] = parseInt(tempArr[i]);
                    }
                }

                //use the type to create the right tile class
                if(tempArr[0] == 1){ //solid
                    cc_map.tile_map[data.y][data.x][data.z] = new ClientTile("solid", tile_name_map[tempArr[1]], data.x, data.y, data.z);
                }
                else if(tempArr[0] == 2){ //liquid
                    cc_map.tile_map[data.y][data.x][data.z] = new ClientTile("liquid", tile_name_map[tempArr[1]], data.x, data.y, data.z);
                }
                else if(tempArr[0] == 3){ //entity
                    cc_map.tile_map[data.y][data.x][data.z] = new ClientTilePlayer("entity", "player", data.x, data.y, data.z, tempArr[3], tempArr[4]);
                    cc_map.tile_map[data.y][data.x][data.z].move_counter = tempArr[5];
                    cc_map.tile_map[data.y][data.x][data.z].id = tempArr[2];
                }
                else if(tempArr[0] == 4){ //facing tile
                    cc_map.tile_map[data.y][data.x][data.z] = new ClientTile("facing", tile_name_map[tempArr[1]], data.x, data.y, data.z);
                }
                else{
                    console.log("tile type not found client side " + tempArr[0]);
                }
            }
            else{ //air tile
                cc_map.tile_map[data.y][data.x][data.z] = 0;
            }
        })
    })

    createCanvas(tileSize*30, tileSize*14);
}

function draw(){
    background(139, 176, 173);
    if(cc_map != undefined){ //only draw the map if the map exists
        cc_map.render();
        takeInput();
    }
}

//keyboard variables
var move_right_button = 68; //d
var move_left_button = 65; //a
var move_up_button = 87; //w
var move_down_button = 83; //s
var move_fly_up_button = 81; //q
var move_fly_down_button = 69; //e
var run_button = 16; //shift
var slot1_button = 49; //1
var slot2_button = 50; //2
var slot3_button = 51; //3
var slot4_button = 52; //4

//waiting stuffs
var lastbuildMilli = 0;
var build_wait = 100;

function takeInput(){
    if (keyIsDown(move_right_button) && player.x != cc_map.tile_map[0].length-1 && cc_map.tile_map[player.y][player.x+1][player.z] === 0 && cc_map.tile_map[player.y][player.x][player.z].type == "entity") {
        cc_map.tile_map[player.y][player.x][player.z].move(3, channel.id);
    }
    if (keyIsDown(move_left_button) && player.x != 0 && cc_map.tile_map[player.y][player.x-1][player.z] === 0 && cc_map.tile_map[player.y][player.x][player.z].type == "entity") {
        cc_map.tile_map[player.y][player.x][player.z].move(1, channel.id);
    }
    if (keyIsDown(move_up_button) && player.y != 0 && cc_map.tile_map[player.y-1][player.x][player.z] === 0 && cc_map.tile_map[player.y][player.x][player.z].type == "entity") {
        cc_map.tile_map[player.y][player.x][player.z].move(2, channel.id);
    }
    if (keyIsDown(move_down_button) && player.y != cc_map.tile_map.length-1 && cc_map.tile_map[player.y+1][player.x][player.z] === 0 && cc_map.tile_map[player.y][player.x][player.z].type == "entity") {
        cc_map.tile_map[player.y][player.x][player.z].move(0, channel.id);
    }
    if (keyIsDown(move_fly_up_button) && player.z != 1 && cc_map.tile_map[player.y][player.x][player.z-1] === 0 && cc_map.tile_map[player.y][player.x][player.z].type == "entity") {
        cc_map.tile_map[player.y][player.x][player.z].move(5, channel.id);
    }
    if (keyIsDown(move_fly_down_button) && player.z != cc_map.tile_map[0][0].length-1 && cc_map.tile_map[player.y][player.x][player.z+1] === 0 && cc_map.tile_map[player.y][player.x][player.z].type == "entity") {
        cc_map.tile_map[player.y][player.x][player.z].move(4, channel.id);
    }
    if (keyIsDown(slot1_button)){
        player.hand = 1;
    }
    if (keyIsDown(slot2_button)){
        player.hand = 2;
    }
    if (keyIsDown(slot3_button)){
        player.hand = 3;
    }
    if (keyIsDown(slot4_button)){
        player.hand = 5;
    }
}

function mouseReleased() {
    if(millis() - lastbuildMilli > build_wait){
        let y = player.y + floor((mouseY - ((player.z-((player.z%2 == 0)? 1:0)) * 32))/tileSize) - 7 + floor(player.z/2) - ((player.z%2 == 0)? 1:0);
        let x = player.x + floor(mouseX/tileSize) - 15;
        let z = player.z;

        if(mouseButton == LEFT){ //mine
            if(keyIsDown(run_button)){
                z = player.z + 1;
            }
            if(cc_map.tile_map[y][x][z] !== undefined){
                if(cc_map.tile_map[y][x][z] == 0){
                    z--;
                }
                if(cc_map.tile_map[y][x][z].name !== "player"){
                    channel.emit('change', {x: x, y: y, z: z, to: 0});
                    lastbuildMilli = millis();
                }
            }
        }
        else{  //build
            z = player.z-1;
            if(keyIsDown(run_button)){
                z = player.z;
            }
            if(cc_map.tile_map[y][x][z] !== undefined){
                if(cc_map.tile_map[y][x][z] != 0){
                    z++;
                }
                if(cc_map.tile_map[y][x][z].name !== "player"){
                    channel.emit('change', {x: x, y: y, z: z, to: "1." + player.hand});
                    lastbuildMilli = millis();
                }
            }
        }
    }
}