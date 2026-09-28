INDUCLEAN WEBSITE V8.1

Deze map bevat de statische demo-website voor Induclean.

Certificeringsclaims:
- De website bevat geen certificeringsclaims zonder controleerbaar bewijs.
- Voeg een claim pas toe nadat het actuele certificaat is gecontroleerd.

Inhoud:
- index.html
- bedankt.html
- privacy.html
- reiniging.html
- specialistische-reiniging.html
- ontruiming-hoarding.html
- industriele-reiniging.html
- over-induclean.html
- steigerbouw.html
- gevelonderhoud.html
- vve-onderhoud.html
- vastgoedonderhoud.html
- sitemap.xml
- robots.txt
- styles.css
- script.js
- consent.js
- contact.php
- CAMPAGNE-STARTCHECKLIST.md
- assets/ (logo en afbeeldingen)

Nieuw in v8:
- Lichte social-proofstrip op de homepage met links naar Instagram en Facebook.
- Instagram- en Facebooklinks in de footer van alle pagina's.
- Sociale profielen toegevoegd aan de bedrijfsgegevens voor zoekmachines.
- Geen automatische social-feed: sneller, privacyvriendelijker en niet afhankelijk
  van externe widgets.
- Sterkere positionering rond specialistische, industriële en urgente reiniging.
- Aparte campagnepagina's voor specialistische reiniging, ontruiming/hoarding
  en industriële reiniging.
- Een echte Over Induclean-pagina met Amine, Lindsay en het ontstaan van het bedrijf.
- Facilitaire schoonmaak is minder prominent gemaakt.
- Het formulier vraagt nu ook naar locatietype, gewenste termijn,
  contactvoorkeur en gewenste uitvoerdatum.
- Lead-ID, landingspagina, verwijzer, UTM-velden, GCLID, GBRAID en WBRAID
  worden bij een formulieraanvraag meegestuurd wanneer ze beschikbaar zijn.
- Open Graph- en social-sharingmetadata met een eigen deelafbeelding.

Productieaanvullingen in v8.1:
- Het formulier wordt op de STRATO-hosting verwerkt via contact.php.
- Aanvragen en bevestigingen worden verzonden via info@inducleanservices.nl.
- De bestaande cookietoestemming en Google Tag Manager-container GTM-NDWP36CN
  zijn behouden.
- Conversiemeting activeert pas na toestemming en een bevestigde aanvraag.

GitHub Pages bijwerken:
1. Pak de ZIP uit.
2. Open de bestaande repository inducleanservices-demo op GitHub.
3. Upload de inhoud van deze map naar de hoofdmap van de repository.
4. Upload alle HTML-bestanden, styles.css, script.js, sitemap.xml en robots.txt.
5. Klik op Commit changes.

CONTACTFORMULIER CONTROLEREN

Het formulier verzendt aanvragen via contact.php op de STRATO-hosting naar
info@inducleanservices.nl. Daarvoor is geen externe activatielink nodig.

1. Publiceer contact.php samen met index.html, script.js en bedankt.html op STRATO.
2. Verstuur daarna één herkenbare testaanvraag via het live formulier.
3. Controleer of de aanvraag op info@inducleanservices.nl binnenkomt.
4. Controleer ook de automatische bevestiging en de bedankpagina.

Op GitHub Pages kan PHP niet worden uitgevoerd. Gebruik daarom altijd het live
STRATO-domein voor de volledige formuliertest.

HUBSPOT

Het formulier blijft in deze versie via de eigen STRATO-verwerking werken. De velden zijn alvast
voorbereid voor een latere HubSpot-koppeling. Maak eerst de juiste eigenschappen,
pipeline, statussen, eigenaar en meldingen in HubSpot aan. Vervang daarna pas de
verwerking door het gekozen HubSpot-formulier of een gecontroleerde koppeling.

Zie CAMPAGNE-STARTCHECKLIST.md voor de openstaande stappen.

Het definitieve domein is inducleanservices.nl. De adressen in de metadata,
sitemap.xml en robots.txt verwijzen al naar dit domein.
