var hp = 0;
function r_all_ui(arr){
    for(let i = 0; i < arr.length; i++){
        if(arr[i] == "name_plate"){
            r_name_ui("Zoda390", cc_map.tile_map[player.y][player.x][player.z].team);
        }
        else if(arr[i] == "team_info"){
            r_team_ui(cc_map.tile_map[player.y][player.x][player.z].team, 70, 10);
        }
        else if(arr[i] == "player_info"){
            r_player_ui(hp);
            if(hp<100){hp+= 0.5};
        }
        else if(arr[i] == "chat_box"){
            r_chat_ui(chat_arr, cc_map.tile_map[player.y][player.x][player.z].team);
        }
        else{
            console.log("UI type not recognized, " + arr[i]);
        }
    }
}

function setup_ui(){
    //size stuff
    ui.s_size = 5;
    
    //text stuff
    ui.t_font = 0;
    ui.t_size = 25;
    ui.ts_size = 2;
    
    //colors
    ui.black = color(0);
    ui.gray1 = color(58);
    ui.white = color(237, 228, 218);
    ui.green = color(0, 255, 0);
    ui.yellow = color(255, 255, 0);
    ui.red = color(255, 0, 0);
    ui.team1 = color(232, 198, 91); //orange
    ui.team2 = color(87, 167, 214); //blue

    s_chat_ui();
}

function r_name_ui(name, team){
    let x = (ui.s_size) + (player.x*tileSize) - (tileSize*15);
    let y = (ui.s_size) + (player.y*tileSize) - (player.z*(tileSize/2)) - (tileSize*7);
    let w = 400;
    let h = 40;
    push();
    stroke(ui.black);
    strokeWeight(ui.s_size);
    fill(ui.gray1);
    rect(x, y, w, h);
    if(team == 0){fill(ui.team1);}
    else{fill(ui.team2);}
    rect(x+(w-h), y, h, h);
    textSize(ui.t_size);
    strokeWeight(ui.ts_size);
    fill(ui.white);
    textAlign(LEFT, TOP);
    text(name, x+(5), y+((h/2)-(ui.t_size/2)));
    pop();
}

function r_team_ui(team, b_health, m_count){
    let w = 400;
    let h = 60;
    let x = (player.x*tileSize) - (tileSize*15) + (width-w) - (ui.s_size);
    let y = (ui.s_size) + (player.y*tileSize) - (player.z*(tileSize/2)) - (tileSize*7);
    push();
    stroke(ui.black);
    strokeWeight(ui.s_size);
    fill(ui.gray1);
    rect(x, y, w, h); //base hp background
    rect(x+(w-h), y+h, h, h); //minion count background
    if(team == 0){fill(ui.team1);}
    else{fill(ui.team2);}
    strokeWeight(0);
    let m = map((100-b_health), 0, 100, 0, w);
    if(b_health > 1){
        rect(x+m+(ui.s_size/2), y+(ui.s_size/2), w-m-(ui.s_size), h-ui.s_size); //base hp filled part
    }
    strokeWeight(ui.ts_size);
    textSize(ui.t_size*1.5);
    textAlign(CENTER, CENTER);
    text(m_count, x+(w-h) +(h/2), y+h + (h/2));
    pop();
}

function r_player_ui(p_hp){
    let w = (2*(tileSize+15))+40;
    let h = (2*(tileSize+15))+40;
    let x = (player.x*tileSize) - (tileSize*15) + (width-w) - (ui.s_size);
    let y = (player.y*tileSize) - (player.z*(tileSize/2)) - (tileSize*7) + (height-h) - (ui.s_size);
    push();
    stroke(ui.black);
    strokeWeight(ui.s_size);
    fill(ui.gray1);
    rect(x, y, w, h); //hp background
    
    //inv stuff
    rect(x+40, y+40, (w-40)/2, (h-40)/2); //Left click inv background
    rect(x+40+((w-40)/2), y+40, (w-40)/2, (h-40)/2); //Right click inv background
    rect(x+40, y+40+((h-40)/2), (w-40)/2, (h-40)/2); //1 swap inv background
    rect(x+40+((w-40)/2), y+40+((h-40)/2), (w-40)/2, (h-40)/2); //2 swap inv background
    textSize(ui.t_size*0.75);
    strokeWeight(ui.ts_size);
    fill(ui.white);
    textAlign(LEFT, TOP);
    text("L", x+40+ui.s_size, y+40+ui.s_size); //Left click inv indicator
    text("R", x+40+((w-40)/2)+ui.s_size, y+40+ui.s_size); //Right click inv indicator
    text("1", x+40+ui.s_size, y+40+((h-40)/2)+ui.s_size); //1 swap inv indicator
    text("2", x+40+((w-40)/2)+ui.s_size, y+40+((h-40)/2)+ui.s_size); //2 swap inv indicator
    if(cc_map.tile_map[player.y][player.x][player.z] !== 0 && cc_map.tile_map[player.y][player.x][player.z].inv.length > 0){
        if(cc_map.tile_map[player.y][player.x][player.z].inv[0] != undefined){
            cc_map.tile_map[player.y][player.x][player.z].inv[0].render(x+40+ui.s_size+((tileSize+15)/2), y+40+ui.s_size+((tileSize+15)/2)); //Left click inv
        }
        if(cc_map.tile_map[player.y][player.x][player.z].inv[1] != undefined){
            cc_map.tile_map[player.y][player.x][player.z].inv[1].render(x+40+((w-40)/2)+ui.s_size+((tileSize+15)/2), y+40+ui.s_size+((tileSize+15)/2)); //Right click inv
        }
        if(cc_map.tile_map[player.y][player.x][player.z].inv[2] != undefined){
            cc_map.tile_map[player.y][player.x][player.z].inv[2].render(x+40+ui.s_size+((tileSize+15)/2), y+40+((h-40)/2)+ui.s_size+((tileSize+15)/2)); //1 swap inv
        }
        if(cc_map.tile_map[player.y][player.x][player.z].inv[3] != undefined){
            cc_map.tile_map[player.y][player.x][player.z].inv[3].render(x+40+((w-40)/2)+ui.s_size+((tileSize+15)/2), y+40+((h-40)/2)+ui.s_size+((tileSize+15)/2)); //2 swap inv
        }
    }

    //hp filler
    if(p_hp > 50){ //green and makes it around the turn
        strokeWeight(0);
        fill(ui.green);
        beginShape();
        vertex(x+(ui.s_size/2), y+(ui.s_size/2));
        vertex(x+(ui.s_size/2), y+h-(ui.s_size/2));
        vertex(x+40-(ui.s_size/2), y+h-(ui.s_size/2));
        vertex(x+40-(ui.s_size/2), y+40-(ui.s_size/2));
        endShape(CLOSE);
        if(p_hp <= 59){
            beginShape();
            vertex(x+(ui.s_size/2), y+(ui.s_size/2));
            vertex(x+(ui.s_size/2)+((p_hp-50)*(w/50)), y+(ui.s_size/2));
            vertex(x+40-(ui.s_size/2), y+40-(ui.s_size/2));
            vertex(x+(ui.s_size/2)+0.35, y+40-(ui.s_size/2));
            endShape(CLOSE);
        }
        else{
            rect(x+(ui.s_size/2),y+(ui.s_size/2),(9*(w/50))-ui.s_size+5, 40-ui.s_size)
            rect(x+(ui.s_size/2),y+(ui.s_size/2),((p_hp-50)*(w/50))-ui.s_size, 40-ui.s_size);
        }
    }
    else if(p_hp > 20){
        strokeWeight(0);
        fill(ui.yellow);
        if(p_hp >= 41){
            //rect(x+(ui.s_size/2),y+(ui.s_size/2)+((50-41)*(w/50)),40-ui.s_size, h-((50-41)*(w/50))-ui.s_size);
            beginShape();
            vertex(x+(ui.s_size/2), y+(ui.s_size/2)+((50-p_hp)*(w/50)));
            vertex(x+(ui.s_size/2), y-(ui.s_size/2)+h);
            vertex(x+40-(ui.s_size/2), y+h-(ui.s_size/2));
            vertex(x+40-(ui.s_size/2), y+40-(ui.s_size/2));
            endShape(CLOSE);
        }else{
            rect(x+(ui.s_size/2),y+(ui.s_size/2)+((50-p_hp)*(w/50)),40-ui.s_size, h-((50-p_hp)*(w/50))-ui.s_size);
        }
    }
    else if (p_hp > 1){
        strokeWeight(0);
        fill(ui.red);
        rect(x+(ui.s_size/2),y+(ui.s_size/2)+((50-p_hp)*(w/50)),40-ui.s_size, h-((50-p_hp)*(w/50))-ui.s_size);
    }
    pop();
}

var chat_input;
var chat_arr = [{team: 0, txt:"Zoda: Gay people!"}, {team: 0, txt:"Zoda: Gay people!"}, {team: 0, txt:"Zoda: Gay people!"}, {team: 0, txt:"Zoda: Gay people!"}, {team: 0, txt:"Zoda: Gay people!"}, {team: 0, txt:"Zoda: Gay people!"}, {team: 0, txt:"Zoda: Gay people!"}, {team: 0, txt:"Zoda: Gay people!"}, {team: 0, txt:"Zoda: Gay people!"}, {team: 0, txt:"Zoda: Gay people!"}, {team: 1, txt:"Zoda2: Gay people!"}, {team: 2, txt:"Server: Gay people!"}];
function s_chat_ui(){
    chat_input = createInput();
    chat_input.style('color', '#ffffff00');
    chat_input.style('background-color', '#ffffff00');
    chat_input.style('position', 'absolute');
    chat_input.style('left', '9px');
    chat_input.style('bottom', '30px');
    chat_input.style('width', '385px');
    chat_input.input(update_chat_input_txt);
}

function update_chat_input_txt(){
    chat_in_txt = this.value();
}

function send_chat_msg(){
    if(chat_in_txt.length > 0){
        channel.emit('msg', {team: cc_map.tile_map[player.y][player.x][player.z].team, txt: ("Zoda390: " + chat_in_txt)})
        chat_in_txt = "";
        chat_input.value('');
    }
}

var chat_in_txt = "hello";
function r_chat_ui(arr, team){
    let w = 400;
    let h = 300;
    let x = (player.x*tileSize) - (tileSize*15) + (ui.s_size);
    let y = (player.y*tileSize) - (player.z*(tileSize/2)) - (tileSize*7) + (height-h) - (ui.s_size);
    push();
    stroke(ui.black);
    strokeWeight(ui.s_size);
    fill(ui.gray1);
    rect(x, y, w-50, h-28)
    rect(x, y+(h-28), w, 28);
    if(chat_in_txt.length > 0){
        if(team == 0){fill(ui.team1);}
        else{fill(ui.team2);}
        if(chat_in_txt[0] == '/'){fill(ui.white);}
        textSize(ui.t_size*0.75);
        stroke(ui.black);
        strokeWeight(ui.ts_size);
        textAlign(LEFT, CENTER);
        text(chat_in_txt, x+(ui.s_size*1.5), y+(h-28)+(28/2));
    }
    for(let i = 0; i < arr.length; i++){
        if(arr[i].team == 0){fill(ui.team1);}
        else if(arr[i].team == 1){fill(ui.team2);}
        else{fill(ui.white);}
        textSize(ui.t_size*0.75);
        stroke(ui.black);
        strokeWeight(ui.ts_size);
        textAlign(LEFT, TOP);
        text(arr[i].txt, x+(ui.s_size*1.5), y+(ui.s_size*1.5)+(i*21));
    }
    pop();
}