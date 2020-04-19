import requests
from bs4 import BeautifulSoup
import re
import json
import ftfy
from pymongo import MongoClient

generi_list=['Animazione', 'Arte', 'Avventura', 'Azione', 'Balletto', 'Biografico', 'Catastrofico', 'Cofanetto', 'Comico', 'Commedia', 'Commedia a episodi', 'Commedia drammatica', 'Commedia musicale', 'Commedia nera', 'Commedia rosa', 'Commedia sentimentale', 'Concerto', 'Cortometraggio', 'Docu-fiction', 'Documentario', 'Documentario drammatico', 'Documentario musicale', 'Drammatico', 'Epico', 'Episodi', 'Erotico', 'Eventi', 'Family', 'Fantascienza', 'Fantastico', 'Fantasy', 'Farsesco', 'Fiabesco', 'Film a episodi', 'Film di montaggio', 'Giallo', 'Giallo rosa', 'Grottesco', 'Guerra', 'Hard', 'Hard boiled', 'Horror', 'Medico', 'Mitologico', 'Musical', 'Musicale', 'Muto', 'Noir', 'Non definito', 'Opera drammatica', 'Opera lirica', 'Politico', 'Poliziesco', 'Psicologico', 'Ragazzi', 'Religioso', 'Satirico', 'Sentimentale', 'Sociologico', 'Sperimentale', 'Spionaggio', 'Sportivo', 'Storico', 'Storico biografico', 'Teatro', 'Telefilm', 'Thriller', 'Western']
film = {}
client = MongoClient("mongodb://localhost:27017/")
db = client.cercafilm
for h in range(1,10):
    if h == 1:
        html = requests.get("https://www.mymovies.it/database/ricerca/avanzata/?titolo=&titolo_orig=&regista=&attore=&id_genere=-1&nazione=&clausola1=%3E%3D&anno_prod=1990&clausola2=%3E%3D&stelle=2&id_manif=-1&anno_manif=&disponib=-1&ordinamento=0&submit=Inizia+ricerca+%C2%BB")
    else:
        html = requests.get("https://www.mymovies.it/database/ricerca/avanzata/?titolo=&titolo_orig=&regista=&attore=&id_genere=-1&nazione=&clausola1=%3E%3D&anno_prod=1990&clausola2=%3E%3D&stelle=2&id_manif=-1&anno_manif=&disponib=-1&ordinamento=0&submit=Inizia+ricerca+%C2%BB&page="+str(h))
    soup = BeautifulSoup(html.content,"html.parser")
    titoli = soup.find_all("h2")
    new_titoli=[]
    trame=[]
    dizionario_link_trame={}
    for titolo in titoli:
        new_titolo = titolo.a.text.encode("latin-1").decode("utf-8")
        new_titoli.append(new_titolo)
        dizionario_link_trame[new_titolo]=titolo.a.get("href")
    descrizioni = soup.find_all(attrs={"class": "linkblu2"})
    diz = {} 
    lista_registi=[]
    lista_attori=[]
    cont = 0
    for descrizione in descrizioni:
        durata = re.search("Durata ([0-9]*)",str(descrizione))
        for i in descrizione.b.find_all("a"):
            new_i = i.text.encode("latin-1").decode("utf-8")
            lista_registi.append(new_i)
        diz["registi"]=lista_registi
        for j in descrizione.find_all("a"):
            new_j=j.text.encode("latin-1").decode("utf-8")
            if new_j[0] in "1234567890":
                diz["anno"]=new_j
            elif new_j in generi_list:
                diz["genere"]=new_j
            elif new_j in lista_registi:
                pass
            else:
                lista_attori.append(new_j)
        diz["titolo"]=new_titoli[cont]
        diz["attori"]=lista_attori
        diz["durata"]=durata.group(1)
        diz["trama"]=dizionario_link_trame[new_titoli[cont]]
        db.films.insert_one(diz)
        cont+=1
        lista_registi=[]
        lista_attori=[]
        diz={}
    print(str(round((float(h)/10*100),2))+"%")
#json_film = json.dumps(film,ensure_ascii=False)
#with open("C:/users/leosa/desktop/code/backend/cercafilm/film1.json", 'a', encoding='utf8') as json_file:
 #   json_file.write(json_film)
#json_file.close()