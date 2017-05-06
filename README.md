# Raschietto
Raschietto è una web application che consente la visualizzazione ed annotazione di pagine web di carattere scientifico. L'annotazione semantica di documenti è realizzata con un uso sofisticato di tecniche moderne di progettazione di applicazioni web desktop e mobile, quali RDF e SPARQL Service, linguaggio di interrogazione per dati rappresentati utilizzando il framework RDF.

### Informazioni generali
Benvenuti! "Raschietto" è una web application realizzata dal gruppo Heisenberg (Antonio Faienza, Alessandro Pecorari, Riccardo Zandegiacomo) come progetto del corso di Tecnologie Web del corso di Laurea in Informatica per il Management dell'Università di Bologna. L'applicazione consente la visualizzazione e annotazione di pagine web di carattere scientifico; è inoltre possibile utilizzarla (con qualche limitazione) per qualsiasi altra pagina web.

### Guida rapida alle funzionalità principali
Le principali funzionalità dell'applicazione sono la visualizzazione di pagine web di carattere scientifico e l'annotazione delle stesse. Sono disponibili due modalità di utilizzo: "Reader" e "Annotator"; nella modalità "Reader" è possibile visualizzare pagine web, scegliendo tra quelle già presenti nell'applicazione (tramite il pannello laterale "Documenti") oppure aggiungendone di nuove inserendone l'url completo nella barra di ricerca. Al caricamento di una pagina, verranno mostrate automaticamente alcune annotazioni realizzate dall'applicazione stessa attraverso un meccanismo di scraping; è possibile visualizzarle cliccandovi sopra. Per poter inserire nuove annotazioni o modificare quelle presenti, è necessario passare alla modalità "Annotator"; per farlo è necessario cliccare sul pulsante "Switch to Annotator" e autenticarsi; a questo punto, tramite la barra degli strumenti che verrà mostrata, sarà possibile procedere con le modifiche desiderate ed eventualmente tornare alla modalità "Reader".

### Autenticazione
Il servizio non prevede un meccanismo di registrazione al servizio, ma è necessario autenticarsi fornendo alcune informazioni di base (nome, cognome e indirizzo e-mail) per poter rintracciare la provenance delle modifiche effettuate. L'inserimento di queste informazioni è effettuato tramite un pannello di "login" che viene mostrato quando si decide di passare alla modalità "Annotator" tramite l'apposito pulsante; il "logout" è automatico, e avviene alla chiusura della pagina o quando si decide di tornare alla modalità "Reader" con l'apposito pulsante.

### Funzionalità principali

#### 1. Visualizzazione di pagine web
E' possibile visualizzare pagine web già presenti nel database o esterne; per visualizzare le pagine già presenti, è necessario selezionarle tramite l'apposito pannello "Documenti". Ogni pagina presente in questo pannello è già stata caricata in passato da altri utenti, e pertanto possiederà già delle annotazioni (automatiche o manuali) che verranno caricate contestualmente.<br>Nel caso in cui si volesse visualizzare ed eventualmente annotare una pagina non presente nel database, è possibile inserirne l'url completo nell'apposita barra di ricerca presente nella barra principale dell'applicazione; le pagine così caricate verranno analizzate dall'applicazione per cercare di visualizzarle in modo ottimale; purtroppo, per ragioni di sicurezza e necessità grafiche e pratiche, è necessario effettuare una serie di operazioni di pulizia per quelle pagine che non presentano l'aspetto standard accettato dall'applicazione.<br>Questo comporta l'eliminazione degli script (javascript o altro), del CSS e di alcuni tag HTML dalla pagina stessa prima della visualizzazione, per poter garantire un utilizzo ottimale delle funzionalità di annotazione; in alcuni casi, le pagine mostrate potranno essere solo parziali o addirittura del tutto bianche, qualora fossero realizzate interamente tramite script oppure per motivi di sicurezza impedissero la visualizzazione su pagine esterne al loro dominio.<br>Non è in nostro potere interferire con questi meccanismi di creazione delle pagine web, pertanto ci scusiamo qualora si dovessero presentare situazioni del genere, che durante i nostri test si sono comunque limitate a poche pagine.

**NOTA! Caricare una nuova pagina, sia attraverso il pannello "Documenti" che inserendo un url, comporterà la cancellazione di tutte le annotazioni non salvate effettuate sul documento aperto precedentemente.**

#### 2. Visualizzazione delle annotazioni
E' possibile visualizzare le annotazioni presenti su una pagina o un documento caricati semplicemente cliccandovi sopra; graficamente la possibilità di cliccare su un'annotazione è mostrata tramite un meccanismo di "highlight" delle annotazioni stesse.<br>I dettagli delle annotazioni verranno mostrati in un'apposita finestra che si aprirà una volta cliccato su un'annotazione. In caso di annotazioni multiple presenti sullo stesso frammento di pagina, verranno mostrati i dettagli di tutte le annotazioni presenti, ordinate dalla più recente alla meno recente.

#### 3. Inserimento delle annotazioni
Per poter inserire annotazioni, è necessario passare alla modalità "Annotator".<br>E' possibile inserire due diversi tipi di annotazione.

#### 3.1 Annotazioni sul documento
Le annotazioni sul documento sono annotazioni di carattere generale relative al documento, e non sono legate ad alcun frammento del documento stesso. E' possibile inserirle tramite il pulsante "Inserisci una nuova annotazione sul documento" presente nella barra delle funzionalità del documento, il quale aprirà una finestra per l'inserimento rapido.<br>Il procedimento di inserimento delle annotazioni sul documento è molto semplice; è sufficiente scegliere il tipo di annotazione (sono disponibili 5 tipi: Autore, Anno di Pubblicazione, Titolo, DOI, URL), specificare il contenuto dell'annotazione stessa (ad esempio, nel caso dell'autore, "Mario Rossi") e premere "Inserisci annotazione".<br>Le annotazioni sul documento inserite verranno mostrate nel pannello "Annotazioni Documento".

#### 3.2 Annotazioni su frammento
Le annotazioni su frammento sono annotazioni specifiche, relative ad un particolare frammento della pagina web visualizzata. Per inserirle, è necessario selezionare un frammento della pagina (tramite il mouse) e cliccare sul pulsante "Inserisci una nuova annotazione su un frammento" presente nella barra delle funzionalità del documento.<br>Si aprirà una finestra di inserimento che consentirà di verificare che il frammento selezionato sia quello voluto; successivamente, analogamente alle annotazioni sul documento, sarà possibile scegliere il tipo di annotazione (oltre ai 5 precedenti, ora sono disponibili anche Commento, Funzione Retorica e Citazione), specificare il contenuto dell'annotazione stessa (ad esempio, nel caso dell'autore, "Mario Rossi") e premere "Inserisci annotazione".
Le annotazioni su frammento inserite verranno mostrate graficamente all'interno del documento stesso.

**NOTA! Le annotazioni inserite manualmente sono solo presenti in locale; sarà necessario salvarle (vedi punto 4.4) in modo definitivo perchè vengano inviate al server e siano accessibili ad altri utenti o al riavvio della pagina.**

#### 4. Modifica delle annotazioni e salvataggio delle stesse
Tramite il tasto "Gestisci le annotazioni inserite" presente nella barra delle funzionalità del documento, è possibile modificare le annotazioni (sia automatiche che manuali) ed eventualmente salvarle in modo definitivo.<br>Nella finestra che si aprirà, sarà possibile cancellare le singole annotazioni o modificarle tramite appositi pulsanti; in caso di modifica, in base al tipo di annotazione sarà possibile modificarne tipo, contenuto ed eventualmente target nella pagina web.<br>Il pulsante "Invio" salva in modo definitivo le annotazioni effettuate inviandole al server. 

### Funzionalità avanzate

#### 1. Filtri
E' possibile filtrare le annotazioni presenti sul documento utilizzando gli appositi pulsanti presenti nel pannello laterale "Filtri"; una volta cliccati, renderanno invisibili le annotazioni del tipo specificato dal pulsante stesso. E' possibile utilizzare più filtri contemporaneamente (anche tutti e 8 se necessario) senza alcun problema; è importante sottolineare che l'applicazione di un filtro NON cancella un'annotazione, e che pertanto un'annotazione filtrata verrà comunque rilevata dal pannello di modifica e invio, e sarà possibile interagire con la stessa.

#### 2. Force Scraping
E' possibile forzare il meccanismo di scraping di una pagina utilizzando il pulsante "Force Scraping" presente nella barra principale dell'applicazione. L'utilizzo di questo pulsante comporterà la cancellazione di tutte le annotazioni automatiche non modificate presenti sulla pagina, e la ripetizione dello scraping della stessa. L'utilizzo di questo pulsante NON comporta la cancellazione di tutte le annotazioni manuali effettuate sulla pagina, siano esse su frammenti o sull'intero documento.

#### 3. Temi
E' possibile modificare il tema del pannello di visualizzazione documenti tramite il pulsante "Modifica aspetto della pagina" presente nella barra principale dell'applicazione; esso consente di scegliere tra 3 differenti temi ("chiaro", "scuro" e "seppia"); il tema in uso di default è "chiaro". Ecco nel dettaglio i cambiamenti che ogni tema apporta:
  * Chiaro: il colore di background del pannello è il bianco; il colore del testo è quello di default della pagina visitata;
  * Scuro: il colore di background del pannello è il nero; il colore del testo è modificato: bianco quando di default sarebbe nero, e immutato per tutti gli altri colori;
  * Seppia: il colore di background del pannello è il seppia; il colore del testo è quello di default della pagina visitata.

#### 4. Ritorno alla schermata principale
Tramite il pulsante "Ritorna alla schermata principale" presente nella barra principale dell'applicazione, è possibile effettuare un "soft reset" della pagina, ovvero pulire il pannello di visualizzazione del documento e quello di visualizzazione delle Annotazioni sul Documento; inoltre, verranno eliminate tutte le annotazioni non salvate presenti.

> Progetto di TECNOLOGIE WEB<br>Riccardo Zandegiacomo De Lugan, Antonio Faienza e Alessandro Pecorari
<br>Università di Bologna, CdL in Informatica per il Management<br>A.S. 2015/2016, Ottobre 2015
