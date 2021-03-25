var app = require("../app") // Lien vers le serveur
var request = require("supertest"); //  import du module supertest
var ObjectId = require('mongodb').ObjectID; // nécessaire pour tester ce type de données spécifique à MongoDB

describe('tests sur l ensemble des routes', () => { // groupe de test

     test("enregistrement et connexion d'un nouvel utilisateur en BDD : ok", async (done) => { // test 1
          const res = await request(app) // asynchronie de la requête
               .post("/sign-up") // méthode et route
               .send({
                    "emailFromFront": "alaintanos@gmail.com",
                    "passwordFromFront": "qQ1#qqqqq",
               })
               .expect(200)
               expect(res.body.result).toEqual(true)
               expect(res.body.error).toEqual([])
               expect(res.body.newMessage).toEqual(false)
               expect(typeof res.body.token).toBe('string')
          done()
     });

     test("vérification du format d'email", async (done) => { // test 2
          const res = await request(app) // asynchronie de la requête
               .post("/sign-up") // méthode et route
               .send({
                    "emailFromFront": "alaintanos@gmailcom",
                    "passwordFromFront": "qQ1#qqqqq",
               })
               .expect(200)
               expect(res.body.error).toEqual(["Email dans un mauvais format"])
          done()
     });

     test("vérification de la complexité du mot de passe", async (done) => { // test 3
          const res = await request(app) // asynchronie de la requête
               .post("/sign-up") // méthode et route
               .send({
                    "emailFromFront": "alaintanot@gmail.com",
                    "passwordFromFront": "qQ1#q",
               })
               .expect(200)
               expect(res.body.error).toEqual(["Mot de passe avec minuscule, majuscule, chiffre et caractère spécial requis"])
          done()
     });

     test("vérification si le compte existe déjà", async (done) => { // test 4
          const res = await request(app) // asynchronie de la requête
               .post("/sign-up") // méthode et route
               .send({
                    "emailFromFront": "alaintanos@gmail.com",
                    "passwordFromFront": "qQ1#qqqqq",
               })
               .expect(200)
               expect(res.body.error).toEqual(["Ce compte existe déjà"])
          done()
     });


     test("connexion d'un utilisateur en BDD : ok", async (done) => { // test 5
          const res = await request(app) // asynchronie de la requête
               .post("/sign-in") // méthode et route
               .send({
                    "emailFromFront": "maximedyver@gmail.com",
                    "passwordFromFront": "aA1#xxxx",
               })
               .expect(200)
               expect(res.body.result).toEqual(true)
               expect(res.body.error).toEqual([])
               expect(res.body.newMessage).toEqual(false)
               expect(typeof res.body.token).toBe('string')
               expect(res.body.notifications).toEqual(false)
          done()
     });

     test("enregistrement de capsule en BDD : ok", async (done) => { // test 6
          const res = await request(app) // asynchronie de la requête
               .post("/save-capsule") // méthode et route
               .send({
                    "tokenFromFront": "GCfW9f3ODTpoIZpaMG4UQwsUb6tCiVTR",
                    "brandFromFront": "Kro",
                    "yearFromFront": 2020,
                    "countryFromFront": "France",
                    "photoFromFront": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAgAElEQVR4Xuy9Z5R",
               })
               .expect(200)
               expect(res.body.result).toEqual(true)
               expect(res.body.error).toEqual([])
          done()
     });

     test("enregistrement de capsule en BDD ne fonctionnant pas", async (done) => { // test 7
          const res = await request(app) // asynchronie de la requête
               .post("/save-capsule") // méthode et route
               .send({
                    "tokenFromFront": "GCff3ODTpoIZpaMGsdfdf4UQwsUb6tCiVTR",
                    "brandFromFront": "Kro",
                    "yearFromFront": 2020,
                    "countryFromFront": "France",
                    "photoFromFront": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAgAElEQVR4Xuy9Z5R",
               })
               .expect(200)
               expect(res.body.result).toEqual(false)
               expect(res.body.error).toEqual(["Utilisateur inconnu"])
          done()
     });


     test("les requêtes de recherche de capsule renvoient le bon type d'information", async (done) => { // test 8
          const res = await request(app)
               .get("/research") // asynchronie de la requête
               .query({
                    "token": "GCff3ODTpoIZpaMGsdfdf4UQwsUb6tCiVTR",
                    "brand": "",
                    "year": "",
                    "country": "tous",
                    "stepOfCapsule": 1

               })
               .expect(200) // attendu : succès de la requête
          expect(res.body.error).toEqual([])
          expect(Array.isArray([res.body.capsules])).toBe(true)
          expect(res.body.capsules.length).toBe(10)
          expect(Array.isArray([res.body.favorites])).toBe(true)
          expect(typeof res.body.numberOfDocuments).toBe('number')
          done()
     });

     test("les requêtes d'accès une collection fonctionnent renvoient le bon type d'information", async (done) => { // test 9
          const res = await request(app)
               .get("/my-collection") // asynchronie de la requête
               .query({
                    "token": "GCfW9f3ODTpoIZpaMG4UQwsUb6tCiVTR",
                    "stepOfCapsule": 0
               })
               .expect(200) // attendu : succès de la requête
          expect(res.body.result).toEqual(true)
          expect(res.body.error).toEqual([])
          expect(Array.isArray([res.body.capsules])).toBe(true)
          expect(Array.isArray([res.body.favorites])).toBe(true)
          expect(typeof res.body.numberOfDocuments).toBe('number')
          done()
     });


     test("les requêtes de suppression de capsule renvoient le bon type d'information", async (done) => { // test 10
          const res = await request(app)
               .delete("/my-collection") // asynchronie de la requête
               .send({
                    "token": "GCfW9f3ODTpoIZpaMG4UQwsUb6tCiVTR",
                    "capsuleRef": ObjectId("6058d1faa161fc3d08669b73") ,
               })
               .expect(200) // attendu : succès de la requête
          expect(res.body.result).toEqual(true)
          expect(res.body.error).toEqual([])
          done()
     });


     test("succès d'ajout en favori et renvoi le bon type d'informations", async (done) => { // test 11
          const res = await request(app)
               .post("/add-favorite") // asynchronie de la requête
               .send({
                    "token": "GCfW9f3ODTpoIZpaMG4UQwsUb6tCiVTR",
                    "capsuleRef": ObjectId("6058cfbeee78bf0015230c93"),
               })

               .expect(200) // attendu : succès de la requête
          expect(res.body.result).toEqual(true)
          expect(res.body.error).toEqual([])
          expect(Array.isArray([res.body.favorites])).toBe(true)
          done()
     });

     test("succès de suppression en favori et renvoi le bon type d'informations", async (done) => { // test 12
          const res = await request(app)
               .put("/supp-favorite") // asynchronie de la requête
               .send({
                    "token": "GCfW9f3ODTpoIZpaMG4UQwsUb6tCiVTR",
                    "capsuleRef": ObjectId("6058cfbeee78bf0015230c93"),
               })

               .expect(200) // attendu : succès de la requête
          expect(res.body.result).toEqual(true)
          expect(res.body.error).toEqual([])
          expect(Array.isArray([res.body.favorites])).toBe(true)
          done()
     });


     test("les requêtes d'accès aux favoris fonctionnent renvoient le bon type d'information", async (done) => { // test 13
          const res = await request(app)
               .get("/all-my-favorites") // asynchronie de la requête
               .query({
                    "token": "GCfW9f3ODTpoIZpaMG4UQwsUb6tCiVTR",
                    "stepOfCapsule": 0
               })
               .expect(200) // attendu : succès de la requête
          expect(res.body.result).toEqual(true)
          expect(res.body.error).toEqual([])
          expect(Array.isArray([res.body.capsulesSorted])).toBe(true)
          expect(typeof res.body.numberOfDocuments).toBe('number')
          done()
     });

     test("succès d'écriture de 1er message en BDD et envoi des bonnes infos", async (done) => { // test 14
          const res = await request(app)
               .post("/first-message") // asynchronie de la requête
               .send({
                    "token": "GCfW9f3ODTpoIZpaMG4UQwsUb6tCiVTR",
                    "capsuleRef": ObjectId("60577d58af135e35dc4f5107"),
               })
               .expect(200) // attendu : succès de la requête
          expect(res.body.updated).toEqual(true)
          expect(res.body.userIsOwner).toEqual(false)
          expect(res.body.error).toEqual([])
          done()
     });

          test("les requêtes d'accès aux messages fonctionnent renvoient le bon type d'information", async (done) => { // test 15
          const res = await request(app)
               .get("/discussions") // asynchronie de la requête
               .query({
                    "token": "GCfW9f3ODTpoIZpaMG4UQwsUb6tCiVTR",
               })
               .expect(200) // attendu : succès de la requête
          expect(res.body.result).toEqual(true)
          expect(res.body.isDiscussionsExist).toEqual(true)
          expect(res.body.error).toEqual([])
          expect(Array.isArray([res.body.sortedDiscussions])).toBe(true)
          done()
     });


     test("succès d'écriture de nouveau message en BDD et envoi des bonnes infos", async (done) => { // test 16
          const res = await request(app)
               .post("/new-message") // asynchronie de la requête
               .send({
                    "token": "GCfW9f3ODTpoIZpaMG4UQwsUb6tCiVTR",
                    "newMessage" : "J'aime beaucoup cette capsule :)",
                    "discussionRef" :  ObjectId("6058dcf4c4c4b53c30bf77bf"), 
               })
               .expect(200) // attendu : succès de la requête
          expect(res.body.updated).toEqual(true)
          expect(res.body.error).toEqual([])
          done()
     });


     test("succès d'accès aux notifications et envoi des bonnes infos", async (done) => { // test 17
          const res = await request(app)
               .get("/notification-message") // asynchronie de la requête
               .query({
                    "token": "GCfW9f3ODTpoIZpaMG4UQwsUb6tCiVTR",
               })
               .expect(200) // attendu : succès de la requête
               expect(typeof res.body.notification).toBe('boolean')
          done()
     });

     test("succès de la requête sur la bonne route", async (done) => { // test 18
          await request(app).delete("/erase-account") // asynchronie de la requête
               .expect(200) // attendu : succès de la requête
          done()
     });

     test("succès de changement de statut de notifications et envoi des bonnes infos", async (done) => { // test 19
          const res = await request(app).put("/notif-status") // asynchronie de la requête
          .send({
               "token": "GCfW9f3ODTpoIZpaMG4UQwsUb6tCiVTR",
               "notifications": false,

          })
               .expect(200) // attendu : succès de la requête
               expect(res.body.result).toEqual(true)
               expect(res.body.error).toEqual([])
          done()
     });

     test("échec de changement de statut de notifications et envoi des bonnes infos", async (done) => { // test 20
          const res = await request(app).put("/notif-status") // asynchronie de la requête
          .send({
               "token": "GCfW9f3ODTpoIZpaMUQwsUb6tCiVTR",
               "notifications": false,

          })
               .expect(200) // attendu : succès de la requête
               expect(res.body.result).toEqual(false)
               expect(res.body.error).toEqual(['Changement impossible'])
          done()
     });

})
