function display_results(content){
    for(var i = 0;i<content.results;i++){
        /*var registi = "";
        for(var j = 0;j<result[i].registi.length;j++){
            registi = registi + result[i].registi[j]+",";
        }
        var attori = "";
        for(var j = 0;j<result[i].registi.length;j++){
            attori = attori + result[i].registi[j]+",";
        }
        var sceneggiatori = "";
        for(var j = 0;j<result[i].registi.length;j++){
            sceneggiatori = sceneggiatori + result[i].registi[j]+",";
        }
        var autori = "";
        for(var j = 0;j<result[i].registi.length;j++){
            autori = autori + result[i].registi[j]+",";
        }*/
          document.getElementById("film_result").innerHTML=document.getElementById("film_result").innerHTML+
          "<br>"+
          "<img src='https://image.tmdb.org/t/p/w500/"+content.content[i].img+"?api_key=fdac8626cfc07400405316ea3cc0b001'></img>"+
          "<br>Titolo:"+content.content[i].titolo+
          "<br>Anno:"+content.content[i].anno+
          "<br>Produzione:"+content.content[i].produzione+
          "<br>Durata:"+content.content[i].durata+
          "<br>Generi:"+JSON.stringify(content.content[i].genere)+
          "<br>Registi:"+JSON.stringify(content.content[i].registi)+
          "<br>Attori:"+JSON.stringify(content.content[i].attori)+
          "<br>"+
          "<br>Voto:<input type='text' id='text_"+content.content[i].id.toString()+"'></input><button id = 'button_"+content.content[i].id.toString()+"' type='button' onclick=>Aggiungi</button><button type='button' id='elimina_"+content.content[i].id+"'>Elimina preferenza</button><br>";
          document.getElementById('button_'+content.content[i].id).setAttribute('onclick','invia_preferenza("'+content.content[i].id.toString()+'","'+content.content[i].titolo.toString()+'")');
          document.getElementById('elimina_'+content.content[i].id).setAttribute('onclick','elimina_preferenza("'+content.content[i].id.toString()+'","'+content.content[i].titolo.toString()+'")');
      }
}

const ws = new WebSocket("wss://localhost:3443/find/ws");
ws.onopen=()=>{
  console.log("Connessione stabilita");
};
function cercafilm(){
ws.send(document.getElementById("nome_film").value.toString());
console.log("Inviato "+document.getElementById("nome_film").value);
ws.onmessage=(msg)=>{
  console.log(msg.data);
  document.getElementById("film_result").innerHTML="";
    var content = JSON.parse(msg.data);
    console.log(content);
    display_results(content);
};
};
