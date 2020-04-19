# -*- coding: utf-8 -*-
import json
import requests
from pymongo import MongoClient
import re

esclusi = ["il","l","the","la","un","uno","una","gli","i","a","an","-","/","di","degli","dello","dei","delle","e","of",":","","le","lo",]
client = MongoClient("mongodb://localhost:27017/")
db = client.cercafilm
generi=requests.get("https://api.themoviedb.org/3/genre/movie/list?api_key=fdac8626cfc07400405316ea3cc0b001&language=it-IT")
generi=generi.json()
lista_generi=[]
for i in generi["genres"]:
    lista_generi.append(i["name"])
discover = requests.get("https://api.themoviedb.org/3/discover/movie?api_key=fdac8626cfc07400405316ea3cc0b001&language=it-IT&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&year=2020&vote_average.gte=6")
discover = discover.json()
page=1
fin = open("output.json","a")
while page<=discover["total_pages"]:
    for i in discover["results"]:
        if i["vote_count"]>=100:
            film_id = str(i["id"])
            film_name = i["title"]
            dizionario_film={}
            film_details = requests.get("https://api.themoviedb.org/3/movie/"+film_id+"?api_key=fdac8626cfc07400405316ea3cc0b001&language=it").json()
            dizionario_film["titolo"]=film_name
            dizionario_film["anno"]=film_details["release_date"]
            dizionario_film["durata"]=film_details["runtime"]
            dizionario_film["produzione"]=film_details["production_countries"]
            dizionario_film["genere"]=film_details["genres"]
            dizionario_film["img"]=film_details["backdrop_path"]
            dizionario_film["popolarita_esterna"]=film_details["popularity"]
            credit = requests.get("https://api.themoviedb.org/3/movie/"+film_id+"/credits?api_key=fdac8626cfc07400405316ea3cc0b001&language=it").json()
            crew=credit["crew"]
            cast=credit["cast"]
            dizionario_film["registi"]=[]
            dizionario_film["sceneggiatori"]=[]
            dizionario_film["autori"]=[]
            dizionario_film["attori"]=[]
            dizionario_film["trama"]=film_details["overview"]
            dizionario_film["titolo_query"]=""
            for h in crew:
                if h["job"]=="Director":
                    if h["profile_path"]:
                        direttore={
                            "nome":h["name"],
                            "img":h["profile_path"]
                        }
                    else:
                        direttore={
                            "nome":h["name"]
                        }
                    dizionario_film["registi"].append(direttore)
                if h["job"]=="Screenplay":
                    if h["profile_path"]:
                        sceneggiatore={
                            "nome":h["name"],
                            "img":h["profile_path"]
                        }
                    else:
                        sceneggiatore={
                            "nome":h["name"]
                        }
                    dizionario_film["sceneggiatori"].append(sceneggiatore)
                if h["job"]=="Writer":
                    if h["profile_path"]:
                        autore={
                            "nome":h["name"],
                            "img":h["profile_path"]
                        }
                    else:
                        autore={
                            "nome":h["name"]
                        }
                    dizionario_film["autori"].append(autore)
            for j in cast:
                if j["order"]<=5:
                    if j["profile_path"]:
                        attore = {
                            "nome":j["name"],
                            "img":j["profile_path"]
                        }
                    else:
                        attore = {
                            "nome":j["name"]
                        }
                    dizionario_film["attori"].append(attore)
            
            dizionario_film["rating_esterno"]={
                "rating":film_details["vote_average"],
                "votanti":film_details["vote_count"]
            }
            delimiters = " ","-",":","'","|","/",",",".","\n","*"
            regexPattern = '|'.join(map(re.escape, delimiters))
            splitted = re.split(regexPattern,dizionario_film["titolo"].lower())
            nuova=[]
            for i in range(0,len(splitted)):
                if splitted[i] not in esclusi:
                    if i!=len(splitted)-1:
                        dizionario_film["titolo_query"]+=splitted[i]+" "
                    else:
                        dizionario_film["titolo_query"]+=splitted[i]
            db.films.insert_one(dizionario_film)
    page+=1
    if page==3:
        break
    discover = requests.get("https://api.themoviedb.org/3/discover/movie?api_key=fdac8626cfc07400405316ea3cc0b001&language=it-IT&sort_by=popularity.desc&include_adult=false&include_video=false&page="+str(page)+"&year=2020&vote_average.gte=6").json()

    ##db.films.insert_one(dizionario_film)
