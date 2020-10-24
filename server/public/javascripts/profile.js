const ws_profile = new WebSocket("wss://localhost:3443/user/profile");
const add_ws = new WebSocket("wss://localhost:3443/user/add_film");
add_ws.onopen = ()=>{console.log("add_film aperto");};
ws_profile.onopen=()=>{
    ws_profile.send("get_info");
};
ws_profile.onmessage=(msg)=>{
    console.log(msg.data);
    var data = JSON.parse(msg.data);
    var array_valutati = [];
    for (var i = 0;i<data.film_valutati.length;i++){
      array_valutati[i]=data.film_valutati[i]._id;
    }
    document.getElementById("user_info").innerHTML=
    "<div class = 'row'>"+
    "<a class = 'col-12 col-sm-3'>Username: "+
    "<a class = 'col-12 col-sm-3'>"+ data.username+"</a></div>"+
    "<div class = 'row'>"+
    "<a class = 'col-12 col-sm-3'>E-mail: "+
    "<a class = 'col-12 col-sm-3'>"+ data.email+"</a></div>"+
    "<div class = 'row'>"+
    "<a class = 'col-12 col-sm-3'>Film preferiti: "+
    "<a class = 'col-12 col-sm-3'>"+ JSON.stringify(array_valutati)+"</a></div>"+
    "<div class = 'row'>"+
    "<a class = 'col-12 col-sm-3'>Generi preferiti: "+
    "<a class = 'col-12 col-sm-3'>"+ JSON.stringify(data.generi)+"</a></div>";
};
invia_preferenze_name="invia_preferenze";

function invia_preferenza(id,titolo){
add_ws.send("aggiungi/"+id+"/"+titolo+"/"+document.getElementById("text_"+id).value);
add_ws.onmessage=(msg)=>{
if(msg.data==="error"){
  location.reload();
}
else{
  location.reload();
}
};
};
function elimina_preferenza(id,titolo){
add_ws.send("elimina/"+id+"/"+titolo+"/");
add_ws.onmessage=(msg)=>{
if(msg.data==="error"){
  location.reload();
}
else{
  location.reload();
}
};
};