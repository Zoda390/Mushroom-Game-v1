/*
MushScript is a very simplistic language that is meant to be formated as 1 string.
MushScript was made as a simple way to pass flexable functions to tile and item classes.
The syntax used for any function can be found towards the bottom of this file right above the javascript function that will be ran.
if statement syntax looks like "if x==y{func x,y;}"
*/

//reading the code
var syntaxError = 1000;
var lookT = 0;

function checkToken(s, sc){ //used for easy tokens, s is the troken, sc is the script
  let arr = [];
  if(sc[lookT] + sc[lookT+1] === s){
    lookT += 3;
    arr.push(s);
    let lookA = lookT;
    let temp = ""
    while(sc[lookA] !== ";"){
      temp += sc[lookA];
      lookA++;
    }
    arr = arr.concat(temp.split(","));
    arr.push(";");
    lookT = lookA + 1;
  }
  
  return arr;
}

function tokenize(sc){ //turn the string script into an array of tokens
  syntaxError--;
  lookT = 0;
  let arr = []; //this will become the new sc
  //arr = arr.concat(checkToken("sq", sc, lookT));
  //arr = arr.concat(checkToken("cr", sc, lookT));
  if(sc[lookT] + sc[lookT+1] === "if"){ //finds an if token
    lookT += 3; //move the look to after the "if "
    arr.push("if");
    let lookA = lookT; //lookA is look ahead
    let temp = ""; //this will find anything between the " " and the logic statement
    let w = ""; //this will store the logic statement
    while(w == ""){
      temp += sc[lookA];
      lookA++;
      if(sc[lookA]+sc[lookA+1] == "!="){
        w = "!=";
      }
      else if(sc[lookA]+sc[lookA+1] == "=="){
        w = "==";
      }
    }
    arr.push(temp);
    arr.push(w);
    lookA += 2; //move over the logic statement
    temp = ""; //this will find anything between the logic statement and the "{"
    while(sc[lookA] !== "{"){
      temp += sc[lookA];
      lookA++;
    }
    arr.push(temp);
    arr.push("{");
    lookT = lookA + 1; //move the look to after the "{"
    lookA = lookT;
    temp = ""; //this grabs everything between "{" and "}"
    while(sc[lookA] !== "}"){
      temp += sc[lookA];
      lookA++;
    }
    arr = arr.concat(tokenize(temp)); //tokenize everything you found and put it in the new script
    arr.push("}");
    lookT = lookA + 1; //move the look to after the "}"
  }
  if(sc[lookT] === " "){ //skip spaces
    lookT ++;
  }
  if(lookT < sc.length){
    if(syntaxError == 0){
      console.log("syntaxError at " + (txtinput.length - sc.length));
    }
    else{ //if you arent at the end of the string cut the string and tokenize again
      arr = arr.concat(tokenize(sc.substring(lookT, sc.length)));
    }
  }
  return arr;
}

function parse(sc){
    let val = [];
    let params;
    let con;
    if(sc[0] === "if"){
      sc = sc.slice(1);
      con = parse(sc);
      sc = sc.slice(4);
      let want = true;
      if(con[1] === "!="){
        want = false;
      }
      if((con[0]===con[2])===want){
        parse(sc);
      }
      while(sc[0] != "}"){
        sc = sc.slice(1);
      }
      sc = sc.slice(1);
    }
    /*
    else if(sc[0] === "sq"){
      sc = sc.slice(1);
      params = parse(sc);
      if(params.length == 1){
        sq_(params[0]);
      }
      else if(params.length == 3){
        sq_(params[0], params[1], params[2]);
      }
      else{
        console.log("sq requires 1 or 3 params, not " + params.length);
      }
      sc = sc.slice(params.length+1)
    }
    else if(sc[0] === "cr"){
      sc = sc.slice(1);
      params = parse(sc);
      if(params.length == 1){
        cr(params[0]);
      }
      else if(params.length == 3){
        cr(params[0], params[1], params[2]);
      }
      else{
        console.log("cr requires 1 or 3 params, not " + params.length);
      }
      sc = sc.slice(params.length + 1);
    }
    */
    else if(sc[0] === ";"){
      sc = sc.slice(1);
      return;
    }
    else if(sc[0] === "{"){
      sc = sc.slice(1);
      return;
    }
    else if(sc[0] === "}"){
      sc = sc.slice(1);
      return;
    }
    /*
    else if(sc[0] === "mx"){
      val.push(mouseX);
      sc = sc.slice(1);
      return val.concat(parse(sc)).filter(function( element ) {return element !== undefined;});
    }
    else if(sc[0] === "my"){
      val.push(mouseY);
      sc = sc.slice(1);
      return val.concat(parse(sc)).filter(function( element ) {return element !== undefined;});
    }
    */
    else if(sc[0] === "=="){
      val.push("==");
      sc = sc.slice(1);
      return val.concat(parse(sc)).filter(function( element ) {return element !== undefined;});
    }
    else if(sc[0] === "!="){
      val.push("!=");
      sc = sc.slice(1);
      return val.concat(parse(sc)).filter(function( element ) {return element !== undefined;});
    }
    else if(sc[0] === (""+parseInt(sc[0]))){
      val.push(parseInt(sc[0]));
      sc = sc.slice(1);
      return val.concat(parse(sc)).filter(function( element ) {return element !== undefined;});
    }
    else if(sc[0] === (""+parseFloat(sc[0]))){
      val.push(parseFloat(sc[0]));
      sc = sc.slice(1);
      return val.concat(parse(sc)).filter(function( element ) {return element !== undefined;});
    }
    
    if(sc.length > 0){
        parse(sc);
    }
  }

//Behind the scene functions

//place a block "place tileID,x,y,z;" or "place tileID;"
function place(params){
    let mode = "L"; //s for survival, L for level-editing

    let tileID = params[0];
    let x=player.x + floor(mouseX/tileSize) - 15 
    let y=player.y + floor((mouseY - ((player.z-((player.z%2 == 0)? 1:0)) * 32))/tileSize) - 7 + floor(player.z/2) - ((player.z%2 == 0)? 1:0)
    let z=player.z - 1;

    if(params.length == 4){
        x = params[1];
        y = params[2];
        z = params[3];
    }
    else if(params.length == 3){
        x = params[1];
        y = params[2];
    }
    else if(params.length == 2){
        console.log("If you give place an x, you need to give it a y.");
    }
    
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

//place an air block and add that block to the players inventory "mine x,y,z;" or "mine;"
function mine(params){
    let mode = "L"; //s for survival, L for level-editing

    let x=player.x + floor(mouseX/tileSize) - 15 
    let y=player.y + floor((mouseY - ((player.z-((player.z%2 == 0)? 1:0)) * 32))/tileSize) - 7 + floor(player.z/2) - ((player.z%2 == 0)? 1:0)
    let z=player.z - 1;

    if(params.length == 3){
        x = params[0];
        y = params[1];
        z = params[2];
    }
    else if(params.length == 2){
        x = params[0];
        y = params[1];
    }
    else if(params.length == 1){
        console.log("If you give mine an x, you need to give it a y.");
    }

    if(mode == "s"){
        channel.emit('change', {x: x, y: y, z: z, to: 0});
        //add item to inv
    }
    else{
        console.log("mine is for survival only\nPlease use place 0");
    }
}

//change the property of a block "c_prop prop,to,x,y,z;" or "c_prop prop,to;"
function c_prop(params){
    let prop = params[0];
    let to = params[1];
    
    let x = player.x + floor(mouseX/tileSize) - 15;
    let y = player.y + floor((mouseY - ((player.z-((player.z%2 == 0)? 1:0)) * 32))/tileSize) - 7 + floor(player.z/2) - ((player.z%2 == 0)? 1:0); 
    let z = player.z - 1;

    if(params.length == 5){
        x = params[2];
        y = params[3];
        z = params[4];
    }
    else if(params.length == 4){
        x = params[2];
        y = params[3];
    }
    else if(params.length == 3){
        console.log("If you give c_prop an x, you need to give it a y.");
    }

    let props = Object.keys(cc_map.tile_map[y][x][z]);
    let i = find_in_array(prop, props);
    if(i != undefined){
        cc_map.tile_map[y][x][z][prop] = to;
    }
}

//fill an area with 1 tile "fill tileID,keep,x1,y1,z1,x2,y2,z2;"
function fillTiles(params){
    if(params.length < 8){
        console.log("fill requries 8 properties.");
    }

    let tileID = params[0];
    let keep = params[1];
    let x1 = params[2];
    let y1 = params[3];
    let z1 = params[4];
    let x2 = params[5];
    let y2 = params[6];
    let z2 = params[7];

    let map = cc_map;
    
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