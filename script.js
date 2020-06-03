/**
 * Author: Brendan Aucoin
 * Date created: June 1st 2020
 * Desc: the javascript for the pokedex page.
 * the purpose is it read from the pokeapi and display data taken from that api in numerous ways
 */
//the url for the api
const apiURL = "https://pokeapi.co/api/v2/pokemon/";
//the final index of pokemon allowed
const lastIndex = 807;
//all the id constants so where kanto and johto start for example
const ids = {
    startingKantoID:1,
    endingKantoID:151,
    startingJohtoID:152,
    endingJohtoID:251,
    startingHoennID:252,
    endingHoennID:386,
    startingSinnohID:387,
    endingSinnohID:493,
    startingUnovaID:494,
    endingUnovaID:649,
    startingKalosID:650,
    endingKalosID:721,
    startingAlolaID:722,
    endingAlolaID:809
};
let allPokemon = [];
let allRequests = [];

/*called when the document is ready*/
function main(){
    //a loop going through all pokemon indecies and adding the promise to fetch that pokemons data into an array
    for(let i =1; i < lastIndex+1; i++){
        allRequests.push(makeRequest(i));
    }
    //once you resolve all the promises requests you got then handle that data in some way
    Promise.all(allRequests).then(allData => {
        allPokemon = [...allData];
        handleData();
    }).catch(error=>{
        alert("could not load data please reload page");
    });
}


/*this will return a promise for whatever pokemon with the specified index.
the promise is to fetch the data for that pokemon and once turned into json data then resolve that promise*/
function makeRequest(index){
    return new Promise((resolve,reject)=>{
        fetch(`${apiURL}${index}`).then(data=>data.json()).then((data=>{
            resolve(data);
        })).catch(error=>reject("Error reading from api"))
    });
}

/*this will change the DOM in any way you want when all the pokemons data has been received from the api.
for example it will update the select boxes and enable all the inputs*/
function handleData(){
    removeLoader();
    enableInputs();
    updateSelectBoxes();
    $(".type-button").css("cursor","pointer");
}
/*removes the loading indecator from the DOM*/
function removeLoader(){
    //remove the loading screen
    const loader = document.querySelector(".loader");
    loader.parentNode.removeChild(loader);
}

/*sets all inputs to be enabled*/
function enableInputs(){
    //enable all buttons
    $(".input").attr("disabled",false);
}

/*adds all the pokemon to the select boxes*/
function updateSelectBoxes(){
    addPokemonToSelectBox("kanto-pokemon",{start:ids.startingKantoID,end:ids.endingKantoID});
    addPokemonToSelectBox("johto-pokemon",{start:ids.startingJohtoID,end:ids.endingJohtoID});
    addPokemonToSelectBox("hoenn-pokemon",{start:ids.startingHoennID,end:ids.endingHoennID});
    addPokemonToSelectBox("sinnoh-pokemon",{start:ids.startingSinnohID,end:ids.endingSinnohID});
    addPokemonToSelectBox("unova-pokemon",{start:ids.startingUnovaID,end:ids.endingUnovaID});
    addPokemonToSelectBox("kalos-pokemon",{start:ids.startingKalosID,end:ids.endingKalosID});
    addPokemonToSelectBox("alola-pokemon",{start:ids.startingAlolaID,end:ids.endingAlolaID});
}

/*adds a list of pokemon to the select box based on some starting and ending id
this is done by filtering the big list of all pokemon*/
function addPokemonToSelectBox(elemID,ids){
    allPokemon.filter((item)=>item.id>=ids.start && item.id <= ids.end).forEach((pokemon)=>{
        document.getElementById(elemID).innerHTML += `<option class = "select-pokemon" value = ${pokemon.name}> ${pokemon.name} </option>`
    });
}

/*this will filter all the pokemon by the type you input and add the appropriate elements to the DOM*/
function displayPokemonOfType(type = ""){
    //reset the display div 
    const display = document.getElementById("pokemon-display");
    display.innerHTML = getTableHeaders();
    //add all pokemon of a certain type to the display container
    allPokemon.filter(pokemon=>{
       [type1,type2] = pokemon.types;
        return (type1.type.name.toLowerCase() === type.toLowerCase() ||
        (type2 != null && type2.type.name.toLowerCase() === type.toLowerCase()))
    }).forEach(pokemon=>{
        addPokemonToDisplayListForm(pokemon);
    });
    display.innerHTML += "</table>"
}
/*adds a pokemons data to the table */
function addPokemonToDisplayListForm(pokemon){
    const displayTable = document.getElementById("display-pokemon-table");
    const img = pokemon.sprites.front_default;
    const imageColumn = img === null ? "<td> Unnavailable </td>" : `<td> <img src = "${pokemon.sprites.front_default}" /> </td>`;
    displayTable.innerHTML += `
        <tr>  
            <td style= "font-size:1.5em;"> #${pokemon.id} </td>
            <td style= "font-size:1.5em;"> ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} </td>
            ${imageColumn}
        </tr>
    `;
}
/*resets the table to just have the table headers*/
function getTableHeaders(){
    return `
    <table style="width:100%" id = "display-pokemon-table">
    <tr>
    <th>ID</th>
    <th>Name</th> 
    <th>Sprite</th>
  </tr>
`;
}

/*displays a pokemons data in a large format displaying much more data than the list form*/
function addPokemonToDisplaySingleForm(pokemonName =""){
    const display = document.getElementById("pokemon-display");
    display.innerHTML = "";
    const pokemon = getPokemon(pokemonName);
    //in case you couldnt find the pokemon based on name
    if(pokemon === null){return;}
    let types = "";
    let abilities = "";
    pokemon.types.forEach(item=>{
        types += `<li style="margin-left:1em;font-size:0.5em;">${item.type.name}</li>`;
    });
    pokemon.abilities.forEach(item=>{
        abilities += `<li style="margin-left:1em;font-size:0.5em;">${item.ability.name}</li>`;
    });
    //add the html code to the DOM
    display.innerHTML = getPokemonDisplaySingleForm(pokemon,types,abilities);
    
}
/*returns a pokemon object based on what name you pass in*/
function getPokemon(pokemonName = ""){
    let pokemon = null;
    for(let i =0; i < allPokemon.length; i++){
        if(allPokemon[i].name === pokemonName){
            pokemon = allPokemon[i];
            break;
        }
    }
    return pokemon;
}

/*returns the html elements you add to the DOM when you want to display a single pokemon*/
function getPokemonDisplaySingleForm(pokemon,types = "",abilities =""){
    return `
        <div>
            <div id = "generalPokemonInfo">
                <span style = "font-size:4em;"> #${pokemon.id}: ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} </span>
            </div>
            <div class = "singlePokemonImage" id = "pokemonImg">
                <img src = "https://pokeres.bastionbot.org/images/pokemon/${pokemon.id}.png" width = 400px; height =400px/>
            </div>
            <div class = "singlePokemonInfo">
                <span style = "margin-right:3em;"> Height:${pokemon.height} </span>
                <div style = "display:inline-block">
                <span> Types </span><br> ${types}
                </div>
                <br><br>
                <span style = "margin-right:2.5em"> Weight:${pokemon.weight} </span>
                <div style = "display:inline-block">
                <span> Abilities </span><br> ${abilities}
                </div>
            </div>
        </div>
    `;
}


//all input for buttons and other types of inputs handled through JQuery
$(document).ready(function(){
    main();
    $(".input").attr("disabled",true);//start off with all buttons being disabled

    //if you click on one of the type buttons
    $(".type-button").click(function(){
        displayPokemonOfType($(this).text());
    });

    //if you click on any option in the select boxes
    $(".select-box").change(function(){
        addPokemonToDisplaySingleForm($(this).val());
    });
});