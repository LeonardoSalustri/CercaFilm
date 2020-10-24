var array = document.cookie.split("token");
      if(array.length!==1){
        document.getElementById("login").innerHTML="";
        document.getElementById("logout").innerHTML="Logout";
        document.getElementById("profilo").innerHTML="Profilo";
      }
      else{
        document.getElementById("logout").innerHTML="";
        document.getElementById("login").innerHTML="Login";
        document.getElementById("profilo").innerHTML="";
      }