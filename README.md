### Les Capsules est une application React-Redux-Express-MongoDB  
  
*Pour exposer, trouver et échanger des capsules de bières, il y a des blogs de collectionneurs mais pas de site dédié à la chose, d'où ce projet.*  
  
Visitez [les-capsules.com](https://les-capsules.herokuapp.com/)  

![sreenshot](./public/screenshot1.gif)
  
Pages :  
* page de chat. *Codée sans bibliothèque de chat, pour la beauté du geste ;)*  
* page de recherche de capsules multicritère
* page de gestion de favoris  
* page d'ajout de capsules avec photo  
* page de gestion de collection personnelle  
* page de paramètres  

#### Fonctionnalités et technologies utilisées :  
  
###### En Front :
Le Frontend a été bootstrappé avec Create React App  
Les formulaires, les boutons, partiellement la Navbar et le cropage d'image sont basés sur Ant Design  
Le state container est basé sur Redux  
La responsivité est faite en CSS  
Les multiples animations sont en CSS  
La navigation se fait avec React Router Dom  
  
###### En Back :
Node.js et Express constituent le serveur  
Chiffrement des données sensibles avec crypto-js  
Notification de nouveau message par Email avec nodemailer  

###### En base de données :
La base de données est sur MongoDB  
Les schémas ont été faits avec Mongoose  

###### Test-Driven Development :
TDD effectué avec Jest et Supertest