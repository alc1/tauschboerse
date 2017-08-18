# Tauschbörse

Online-Tauschbörse im Rahmen des CAS FEE 2017. Ziel des Projekts ist es, eine Web-Applikation zu entwickeln, die es Benutzern ermöglicht, beliebige Artikel untereinander zu tauschen. Dazu wählt man einen Artikel aus, den man von einem anderen Benutzer haben möchte und bietet dafür einen oder mehrere der eigenen Artikeln zum Tausch an. Der angefragte Benutzer kann dann das Tauschgeschäft bestätigen oder ablehnen.

## Module/Features

### Anforderungen

* Registrierung/Login
  * Ein Benutzer kann sich registrieren, um ein Konto zu eröffnen. Dies ist notwendig, um Zugang zu allen Funktionen der Applikation zu bekommen.
  * Sobald der Benutzer registriert ist, kann er sich mit seiner E-Mail-Adresse und seinem Passwort anmelden.

* Benutzerprofil
  * Ein registrierter Benutzer kann sein eigenes Benutzerprofil verwalten (ändern von Benutzerinformationen, wie z.B. Name, Passwort, etc.).
  * Wenn man nicht registriert ist, hat man keinen Zugriff auf dieses Modul.

* Artikelverwaltung
  * Ein registrierter Benutzer kann seine Artikel verwalten (CRUD).
  * Ein Artikel besteht dabei beispielsweise aus den folgenden Informationen:
    * Bezeichnung/Titel
    * Beschreibung
    * Kategorie
    * Foto
  * Wenn man nicht registriert ist, hat man keinen Zugriff auf dieses Modul.

* Marktplatz
  * Auf dem "Marktplatz" kann ein Benutzer nach Artikeln suchen.
  * Dies ist das einzige Modul, welches auch nicht registrierten Benutzern (Gast) zur Verfügung steht.
  * Ein Gast kann aber nur nach Artikeln suchen und diese anschauen.
  * Hingegen ein registrierter Benutzer hat hier die Möglichkeit, einen Artikel auszuwählen, den er haben möchte und für diesen ein Angebot zu machen.
  * Dieses Angebot besteht aus einem oder mehreren der eigenen Artikeln.

* Tauschgeschäfte
  * Nur registrierte Benutzer haben die Möglichkeit Tauschgeschäfte über den Marktplatz zu starten.
  * In einer Übersicht sieht ein registrierter Benutzer, welche Tauschgeschäfte er noch offen hat:
    * Eingehende/Ausgehende Tauschanfragen
    * Vollzogene Tauschgeschäfte
  * Offene Tauschanfragen können von beiden Seiten storniert werden.
  * Ist der Empfänger der Tauschanfrage einverstanden, wählt er die angebotenen Artikel aus, die er im Gegenzug haben möchte. Damit ist das Tauschgeschäft vollzogen.

### Optionale Ideen

Die folgenden Punkte gehören nicht in die Minimalanforderung. Es sind Ideen, die lediglich umgesetzt werden, wenn am Schluss noch genügend Zeit vorhanden ist.

Zusätzliche Module:
* Benutzerübersicht mit einigen Informationen über die Benutzer (z.B. Anzahl Artikel, Anzahl vollzogene Tauschgeschäfte, Konto eröffnet am TT.MM.JJJJ, etc.).
* Ranglisten: Die aktivsten Benutzer (Anzahl Tauschgeschäfte, Anzahl Artikel) werden in einer Rangliste geführt.
* Ranking-System: Nach vollzogenem Tauschgeschäft haben die beiden Benutzer die Möglichkeit, sich gegenseitig zu bewerten.
* Übersichts-/Startseite mit einigen Zufallsartikel, die mich vielleicht interessieren könnten, oder einfach die zuletzt hinzugefügten Artikel.
* Merkliste: In einer Merkliste kann man sich Artikel merken, damit man sie schneller wieder findet.
* Benutzer-Blacklist: Ein registrierter Benutzer kann eine Blacklist mit den Benutzern führen, von denen er keine Tauschanfrage mehr erhalten möchte.

Funktionserweiterungen:
* Gewisse Artikel können nur zusammen gehandelt werden.
* Der angefragte Benutzer kann direkt aus der Tauschanfrage heraus einen alternativen Tausch vorschlagen, wenn er beim anfragenden Benutzer einen Artikel findet, der in der ursprünglichen Anfrage nicht angeboten wurde. Das neue Tauschangebot ersetzt dabei das erste. Dadurch entwickelt sich der Marktplatz zu einem Handelsplatz.
* Login via externem Konto (z.B. Login via Facebook-Account).
* Paging-Mechanismus bei der Suche nach Artikeln (z.B. nächste 50 Artikel laden).
* Administratorrolle zu Supportzwecken.
