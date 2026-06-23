// Database dei punti di interesse di Brescia (Zona Via Milano e limitrofi)
const monumenti = [
    {
        "id": 1,
        "nome": "Supermercato Esselunga di Via Milano",
        "lat": 45.5446,
        "lng": 10.2008,
        "desc": "Uno dei principali punti di rifornimento per il quartiere di Via Milano. Ottimo per fare scorta di pozioni e provviste prima di partire per l'esplorazione!",
        "categoria": "supermercato",
        "scoperto": false
    },
    {
        "id": 2,
        "nome": "Cimitero Monumentale di Brescia (Vantini)",
        "lat": 45.5408,
        "lng": 10.2021,
        "desc": "Il primo cimitero monumentale d'Italia, progettato dall'architetto Rodolfo Vantini. Un luogo ricco di sculture imponenti, architettura neoclassica e un'atmosfera solenne piena di storia.",
        "categoria": "monumento",
        "scoperto": false
    },
    {
        "id": 3,
        "nome": "Centro Commerciale Freccia Rossa",
        "lat": 45.5357,
        "lng": 10.2084,
        "desc": "Situato nelle immediate vicinanze della stazione e della fine di Via Milano, un hub urbano perfetto per sbloccare obiettivi di orientamento e incontrare altri giocatori.",
        "categoria": "monumento",
        "scoperto": false
    },
    {
        "id": 4,
        "nome": "Parco dell'Acqua",
        "lat": 45.5340,
        "lng": 10.2322,
        "desc": "Un'oasi verde urbana con laghetti e installazioni scientifiche dedicata alla risorsa più preziosa. Perfetto per una missione naturalistica.",
        "categoria": "parco",
        "scoperto": false
    },
    {
        "id": 5,
        "nome": "Parco Campo Marte",
        "lat": 45.5479,
        "lng": 10.2162,
        "desc": "Un grande spazio verde cittadino non lontano da Via Milano, ideale per lo sport all'aperto, il relax e per cercare badge nascosti tra i suoi sentieri alberati.",
        "categoria": "parco",
        "scoperto": false
    },
    {
        "id": 6,
        "nome": "Prix di Via Milano",
        "lat": 45.5481,
        "lng": 10.1898,
        "desc": "Uno dei principali punti di rifornimento per il quartiere di Via Milano. Ottimo per fare scorta di pozioni e provviste prima di partire per l'esplorazione!",
        "categoria": "supermercato",
        "scoperto": false
    },
    {
        // 45.54291548504585, 10.22517491702765
        "id": 7,
        "nome": "Castello di Brescia",
        "lat": 45.5429,
        "lng": 10.2251,
        "desc": "Arroccato sul colle Cidneo, il Castello costituisce uno dei più affascinanti complessi fortificati d’Europa, in cui si possono leggere ancora oggi i segni delle diverse dominazioni.",
        "categoria": "monumento",
        "scoperto": false
    },
    {
        // tempio capitolino 45.540073785348596, 10.225765156044563
        "id": 8,
        "nome": "Tempio Capitolino (Capitolium)",
        "lat": 45.5400,
        "lng": 10.2257,
        "desc": "Un percorso archeologico tra i più significativi e meglio conservati d’Italia, riconosciuto Patrimonio Mondiale dell’Umanità dall’UNESCO",
        "categoria": "monumento",
        "scoperto": false
    },
    {
        // museo diocesano 45.54118088236688, 10.22059547975315
        "id": 9,
        "nome": "Museo Diocesano di Brescia",
        "lat": 45.5411,
        "lng": 10.2205,
        "desc": "Punto di riferimento e coordinamento per la promozione, la valorizzazione e la gestione del patrimonio artistico e culturale \"sacro\" del centro storico di Brescia",
        "categoria": "monumento",
        "scoperto": false
    },
    {
        // palazzo della loggia 45.539936544698506, 10.219329974410597
        "id": 10,
        "nome": "Palazzo della Loggia",
        "lat": 45.5399,
        "lng": 10.2193,
        "desc": "Un capolavoro del Rinascimento italiano, ma soprattutto un luogo vivo, che da oltre un secolo ospita il governo cittadino.",
        "categoria": "monumento",
        "scoperto": false
    },
    {
        // duomo vecchio 45.5382675808956, 10.221598577357822
        "id": 11,
        "nome": "Duomo vecchio",
        "lat": 45.5382,
        "lng": 10.2215,
        "desc": "Il Duomo Vecchio è stato eretto su una precedente chiesa paleocristiana, chiamata Santa Maria Maggiore e fondata dal vescovo Filastrio tra IV e V secolo D.C.",
        "categoria": "monumento",
        "scoperto": false
    },
    {
        // cattedrale di santa maria assunta 45.53865247243331, 10.221875366191192
        "id": 12,
        "nome": "Cattedrale di Santa Maria Assunta",
        "lat": 45.5386,
        "lng": 10.2218,
        "desc": "Il Duomo Nuovo di Brescia, progettato dall’architetto Giovanbattista Lantana, sorge al centro di Piazza Paolo VI, sopra i resti dell’antica basilica paleocristiana di San Pietro de Dom.",
        "categoria": "monumento",
        "scoperto": false
    },
    {
        // ITIS CASTELLI 45.5560004354716, 10.216235249349113
        "id": 13,
        "nome": "ITIS Benedetto Castelli",
        "lat": 45.5560,
        "lng": 10.2162,
        "desc": "SCUOLA DI MERDA",
        "categoria": "monumento",
        "scoperto": false
    },
    {
        // piazza della vittoria 45.538183840195, 10.21929230783374
        "id": 14,
        "nome": "Piazza della Vittoria",
        "lat": 45.5381,
        "lng": 10.2192,
        "desc": "Progettata dal Piacentini, la centralissima Piazza Vittoria di Brescia fu inaugurata nel 1932 secondo il nuovo piano urbanistico fascista.",
        "categoria": "parco",
        "scoperto": false
    },
    {
        // piazza paolo sesto 45.53913435567406, 10.221269766912977
        "id": 15,
        "nome": "Piazza Paolo VI",
        "lat": 45.5391,
        "lng": 10.2212,
        "desc": "piazza Paolo VI è un magnifico esempio di architettura medievale e rappresenta il cuore della città per gli importanti edifici storici che vi si affacciano.",
        "categoria": "parco",
        "scoperto": false
    },
    {
        // museo delle armi luigi marzoli
        "id": 16,
        "nome": "Museo delle armi \"Luigi Marzoli\"",
        "lat": 45.5391,
        "lng": 10.2212,
        "desc": "Il Museo delle Armi Luigi Marzoli ospita una delle più pregiate raccolte europee di armature e armi antiche, che raccontano la lunghissima e prolifica tradizione armiera bresciana.",
        "categoria": "monumento",
        "scoperto": false
    },
    {
        // iveco 45.550877349712295, 10.20417190465072
        "id": 17,
        "nome" "Iveco",
        "lat": 45.5508,
        "lng": 10.2041,
        "desc": "Sede Iveco.",
        "categoria": "monumento",
        "scoperto": false
    },
    {
        // spedali civili di brescia 45.55644685314258, 10.231851948390482
        "id": 18,
        "nome": "Spedali civili di Brescia",
        "lat": 45.5564,
        "lng": 10.2318,
        "desc": "spedaliii",
        "categoria": "monumeto",
        "scoperto": false
    }
];
