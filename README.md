# Tauschbörse

Online-Tauschbörse im Rahmen des CAS FEE 2017. Ziel des Projekts ist es, eine Web-Applikation zu entwickeln, die es Benutzern ermöglicht, beliebige Artikel untereinander zu tauschen. Dazu wählt man einen Artikel aus, den man von einem anderen Benutzer haben möchte und bietet dafür einen oder mehrere der eigenen Artikeln zum Tausch an. Der angefragte Benutzer kann dann das Tauschgeschäft bestätigen oder ablehnen.

## Module/Features

### Anforderungen

* Login
  * Ein Benutzer kann sich registrieren, um ein Konto zu eröffnen. Dies ist notwendig, um die Applikation benutzen zu können.
  * Für den Login braucht der Benutzer einen Username und ein Passwort.

* Artikel
  * Ein Benutzer kann seine Artikel verwalten (CRUD).
  * Ein Artikel besteht dabei aus den folgenden Informationen:
    * Bezeichnung/Titel
    * Beschreibung
    * Kategorie
    * Foto

* Marktplatz
  * Auf dem "Marktplatz" kann ein Benutzer nach den Artikeln von den anderen Benutzern suchen.
  * Hier kann man die Artikel auswählen, die man haben möchte.
  * Wird ein Artikel ausgewählt, kann man für diesen Artikel ein Angebot machen.
  * Dieses Angebot besteht aus einem oder mehreren der eigenen Artikeln.

* Tauschgeschäfte
  * In einer Übersicht sieht ein Benutzer, welche Tauschgeschäfte er noch offen hat:
    * Eingehende/Ausgehende Tauschanfragen
    * Vollzogene Tauschgeschäfte
  * Offene Tauschanfragen können von beiden Seiten storniert werden.
  * Ist der Empfänger der Tauschanfrage einverstanden, wählt er die angebotenen Artikel aus, die er im Gegenzug haben möchte.
  * Damit ist das Tauschgeschäft vollzogen.

### Optionale Anforderungen

* Nach vollzogenem Tauschgeschäft haben die beiden Benutzer die Möglichkeit, sich gegenseitig zu bewerten.
* Ranking-System: Die aktivsten Benutzer (Anzahl Tauschgeschäfte, Anzahl Artikel) werden in einer Rangliste geführt.
* Gewisse Artikel können nur zusammen gehandelt werden.
* Login via externem Konto (z.B. Login via Facebook-Account).
