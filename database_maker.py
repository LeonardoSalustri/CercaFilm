# -*- coding: utf-8 -*-
import json
import requests
from pymongo import MongoClient
import re

esclusi = ["'","*","\n","and","il","l","the","la","un","uno","una","gli","i","a","an","-","/","di","degli","dello","dei","delle","e","of",":",",",".","","le","lo",]
client = MongoClient("mongodb://localhost:27017/")
db = client.cercafilm
generi = requests.get("https://api.themoviedb.org/3/genre/movie/list?api_key=fdac8626cfc07400405316ea3cc0b001&language=it-IT").json()["genres"]
genere = {}
for each in generi:
    genere={}
    genere["_id"]=each["id"]
    genere["nome"]=each["name"]
    db.generis.insert_one(genere)

discover = requests.get("https://api.themoviedb.org/3/discover/movie?api_key=fdac8626cfc07400405316ea3cc0b001&language=it-IT&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&year=2020&vote_average.gte=6")
discover = discover.json()
page=1
fin = open("output.json","a")
while page<=discover["total_pages"]:
    for i in discover["results"]:
        film_id = int(i["id"])
        film_name = i["title"]
        dizionario_film={}
        film_details = requests.get("https://api.themoviedb.org/3/movie/"+str(film_id)+"?api_key=fdac8626cfc07400405316ea3cc0b001&language=it").json()
        dizionario_film["_id"]=film_id
        dizionario_film["titolo"]=film_name
        dizionario_film["anno"]=film_details["release_date"]
        dizionario_film["durata"]=film_details["runtime"]
        produzioni=[]
        for cane in film_details["production_countries"]:
            produzioni.append(cane["name"])
        dizionario_film["produzione"]=produzioni
        dizionario_film["genere"]=i["genre_ids"]
        dizionario_film["img"]=film_details["backdrop_path"]
        dizionario_film["popolarita_esterna"]=film_details["popularity"]
        dizionario_film["popolarità_interna"]=0
        credit = requests.get("https://api.themoviedb.org/3/movie/"+str(film_id)+"/credits?api_key=fdac8626cfc07400405316ea3cc0b001&language=it").json()
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
                        "_id":h["id"],
                        "nome":h["name"],
                        "img":h["profile_path"]
                    }
                else:
                    direttore={
                        "_id":h["id"],
                        "nome":h["name"],
                        "img":""
                    }
                db.registis.find_one_and_update({"_id":direttore["_id"],"nome":direttore["nome"],"img":direttore["img"]},{"$push":{"film":dizionario_film["_id"]}},upsert=True)
                dizionario_film["registi"].append(direttore["_id"])
            if h["job"]=="Screenplay":
                if h["profile_path"]:
                    sceneggiatore={
                        "_id":h["id"],
                        "nome":h["name"],
                        "img":h["profile_path"]
                    }
                else:
                    sceneggiatore={
                        "_id":h["id"],
                        "nome":h["name"],
                        "img":""
                    }
                db.sceneggiatoris.find_one_and_update({"_id":sceneggiatore["_id"],"nome":sceneggiatore["nome"],"img":sceneggiatore["img"]},{"$push":{"film":dizionario_film["_id"]}},upsert=True)
                dizionario_film["sceneggiatori"].append(sceneggiatore["_id"])
            if h["job"]=="Writer":
                if h["profile_path"]:
                    autore={
                        "_id":h["id"],
                        "nome":h["name"],
                        "img":h["profile_path"]
                    }
                else:
                    autore={
                        "_id":h["id"],
                        "nome":h["name"],
                        "img":""
                    }
                db.autoris.find_one_and_update({"_id":autore["_id"],"nome":autore["nome"],"img":autore["img"]},{"$push":{"film":dizionario_film["_id"]}},upsert=True)
                dizionario_film["autori"].append(autore["_id"])
        for j in cast:
            if j["order"]<=5:
                if j["profile_path"]:
                    attore = {
                        "_id":j["id"],
                        "nome":j["name"],
                        "img":j["profile_path"]
                    }
                else:
                    attore = {
                        "_id":j["id"],
                        "nome":j["name"],
                        "img":""
                    }
                db.attoris.find_one_and_update({"_id":attore["_id"],"nome":attore["nome"],"img":attore["img"]},{"$push":{"film":dizionario_film["_id"]}},upsert=True)
                dizionario_film["attori"].append(attore["_id"])
        keywords = requests.get("https://api.themoviedb.org/3/movie/"+str(film_id)+"/keywords?api_key=fdac8626cfc07400405316ea3cc0b001&language=it").json()["keywords"]
        array_id_key=[]
        for every in keywords:
            array_id_key.append(every["id"])
        dizionario_film["keywords"]=array_id_key
        dizionario_film["rating_esterno"]={
            "rating":film_details["vote_average"],
            "votanti":film_details["vote_count"]
        }
        dizionario_film["rating_interno"]={
            "rating":0,
            "votanti":0
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
        keyword = {}
        print("Inserisco le chiavi di "+dizionario_film["titolo"])
        for each in keywords:
            keyword["_id"]=each["id"]
            keyword["name"]=each["name"]
            db.keywords.find_one_and_update({"_id":keyword["_id"],"name":keyword["name"]},{"$push":{"film":dizionario_film["_id"]}},upsert=True)

    page+=1
    if page==7:
        break
    discover = requests.get("https://api.themoviedb.org/3/discover/movie?api_key=fdac8626cfc07400405316ea3cc0b001&language=it-IT&sort_by=popularity.desc&include_adult=false&include_video=false&page="+str(page)+"&year=2020&vote_average.gte=6").json()
