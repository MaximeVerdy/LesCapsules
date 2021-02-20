// importation à partir de libraries
import React from 'react'

//composants
import Topnavbar from './navbar.js'

function MentionsLegales() {

  return (

    <div>

      <Topnavbar />

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%'
        }}
      >

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '30px',
            width: '700px',
          }}
        >

          <h1 style={{ fontWeight: 500, paddingBottom: '20px' }}>
            DÉCLARATION DE CONFIDENTIALITÉ
          </h1>


          <p>ARTICLE 1 – RENSEIGNEMENTS PERSONNELS RECUEILLIS</p>
          <p>Lorsque vous venez sur notre site, nous recueillons les renseignements personnels que vous nous fournissez, tels que votre adresse e-mail.</p>

          <p>Marketing par e-mail (le cas échéant): Avec votre permission, nous pourrions vous envoyer des e-mails au sujet de notre site, de nouveaux produits et d’autres mises à jour.</p>

          <p>ARTICLE 2 - CONSENTEMENT</p>

          <p>Comment obtenez-vous mon consentement ?</p>

          <p>Lorsque vous nous fournissez vos renseignements personnels, nous présumons que vous consentez à ce que nous recueillions vos renseignements et à ce que nous les utilisions à cette fin uniquement.</p>

          <p>Si nous vous demandons de nous fournir vos renseignements personnels pour une autre raison, à des fins de marketing par exemple, nous vous demanderons directement votre consentement explicite, ou nous vous donnerons la possibilité de refuser.</p>

          <p>Comment puis-je retirer mon consentement?</p>

          <p>Si après nous avoir donné votre consentement, vous changez d’avis et ne consentez plus à ce que nous puissions vous contacter, recueillir vos renseignements ou les divulguer, vous pouvez nous en aviser en nous contactant à les.capsules@gmail.com ou par courrier à: Les Capsules, 56 boulevard Pereire , Paris, J, 75017, France </p>

          <p>ARTICLE 3 – DIVULGATION</p>

          <p>Nous pouvons divulguer vos renseignements personnels si la loi nous oblige à le faire ou si vous violez nos Conditions Générales de Vente et d’Utilisation.</p>

          <p>ARTICLE 4 – APPLICATION</p>

          <p>Notre site est hébergée sur Heroku. Ils nous fournissent la plate-forme en ligne qui nous permet de vous fournir nos services et produits.</p>

          <p>Vos données sont stockées dans la base de données de MongoDB, et dans l’application. Vos données sont conservées sur un serveur sécurisé protégé par un pare-feu.</p>

          <p>ARTICLE 5 – SERVICES FOURNIS PAR DES TIERS</p>

          <p>De manière générale, les fournisseurs tiers que nous utilisons vont uniquement recueillir, utiliser et divulguer vos renseignements dans la mesure du nécessaire pour pouvoir réaliser les services qu’ils nous fournissent.</p>

          <p>En ce qui concerne ces fournisseurs, nous vous recommandons de lire attentivement leurs politiques de confidentialité pour que vous puissiez comprendre la manière dont ils traiteront vos renseignements personnels.</p>

          <p>Il ne faut pas oublier que certains fournisseurs peuvent être situés ou avoir des installations situées dans une juridiction différente de la vôtre ou de la nôtre. Donc si vous décidez de poursuivre une transaction qui requiert les services d’un fournisseur tiers, vos renseignements pourraient alors être régis par les lois de la juridiction dans laquelle ce fournisseur se situe ou celles de la juridiction dans laquelle ses installations sont situées.</p>

          <p>Une fois que vous quittez notre site ou que vous êtes redirigé vers le site web ou l’application d’un tiers, vous n’êtes plus régi par la présente Politique de Confidentialité ni par les Conditions Générales de Vente et d’Utilisation de notre site web.</p>


          <p>ARTICLE 6 – SÉCURITÉ</p>

          <p>Pour protéger vos données personnelles, nous prenons des précautions raisonnables et suivons les meilleures pratiques de l’industrie pour nous assurer qu’elles ne soient pas perdues, détournées, consultées, divulguées, modifiées ou détruites de manière inappropriée.</p>

          <p>ARTICLE 7 – ÂGE DE CONSENTEMENT</p>

          <p>En utilisant ce site, vous déclarez que vous avez au moins l’âge de la majorité dans votre État ou province de résidence, et que vous nous avez donné votre consentement pour permettre à toute personne d’âge mineur à votre charge d’utiliser ce site web.</p>

          <p>ARTICLE 8 – MODIFICATIONS APPORTÉES À LA PRÉSENTE POLITIQUE DE CONFIDENTIALITÉ</p>

          <p>Nous nous réservons le droit de modifier la présente politique de confidentialité à tout moment, donc veuillez s’il vous plait la consulter fréquemment. Les changements et les clarifications prendront effet immédiatement après leur publication sur le site web. Si nous apportons des changements au contenu de cette politique, nous vous aviserons ici qu’elle a été mise à jour, pour que vous sachiez quels renseignements nous recueillons, la manière dont nous les utilisons, et dans quelles circonstances nous les divulguons, s’il y a lieu de le faire.</p>

          <p>Si notre site fait l’objet d’une acquisition par ou d’une fusion avec une autre entreprise, vos renseignements pourraient être transférés aux nouveaux propriétaires pour que nous puissions continuer à vous vendre des produits.</p>

          <p>QUESTIONS ET COORDONNÉES</p>

          <p>Si vous souhaitez: accéder à, corriger, modifier ou supprimer toute information personnelle que nous avons à votre sujet, déposer une plainte, ou si vous souhaitez simplement avoir plus d’informations, contactez notre agent responsable des normes de confidentialité à les.capsules@gmail.com ou par courrier à Les Capsules, 56 boulevard Pereire, 75017 Paris, France.</p>
        </div>

      </div>

    </div>


  )
}

export default MentionsLegales