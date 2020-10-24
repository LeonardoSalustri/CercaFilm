var crypto = require("crypto");
module.exports = {
    secret_key: "eskeremoviefinder",
    api_key:"fdac8626cfc07400405316ea3cc0b001",
    mongoUrl:"mongodb://localhost:27017/cercafilm",
    esclusi : ["'","*","\n","and","il","l","the","la","un","uno","una","gli","i","a","an","-","/","di","degli","dello","dei","delle","e","of",":",",",".","","le","lo"],
    esclusi_ex:"/('|*|\n|and|il|l|the|la|un|uno|una|gli|i|a|an|-|/|di|degli|dello|dei|delle|e|of||:|.|,|le|lo)/gi",
    delimiters :"([' ']|[-]|[:]|[']|[|]|[/]|[,]|[.]|\n|[*])"
}