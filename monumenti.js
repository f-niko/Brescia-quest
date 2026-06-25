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
        "nome": "Iveco",
        "lat": 45.5508,
        "lng": 10.2041,
        "desc": "Sede Iveco.",
        "categoria": "monumento",
        "scoperto": false
    },
    {
        // spedali civili di brescia 45.55644685314258, 10.231851948390482 pp
        "id": 18,
        "nome": "Spedali civili di Brescia",
        "lat": 45.5564,
        "lng": 10.2318,
        "desc": "spedaliii",
        "categoria": "monumeto",
        "scoperto": false
    },
    {
        // outlet franciacorta 45.576883489528264, 10.119136738495644
        "id": 19,
        "nome": "Franciacorta designer village",
        "lat": 45.5768,
        "lng": 10.1191,
        "desc": "Oltre 190 brand esclusivi, con prezzi ridotti dal 30% fino al 70%, tutto l'anno.",
        "categoria": "parco",
        "scoperto": false
    },
    {
        // santuario della madonna del patrocinio 45.53800956136786, 10.252017525561836
        "id": 20,
        "nome": "Santuario della Madonna del Patrocinio",
        "lat": 45.5380,
        "lng": 10.2520,
        "desc": "Il Santuario della Madonna del Patrocinio è un piccolo santuario cattolico sorto nel 1720 come piccolo oratorio privato, nell'alta Val Tavareda.",
        "categoria": "monumento",
        "scoperto": false
    },
    {
        // museo auto storiche brescia 45.52432999162205, 10.267033879032244
        "id": 21,
        "nome": "Museo Auto Storiche Brescia",
        "lat": 45.5243,
        "lng": 10.2670,
        "desc": "Il Museo delle Auto Storiche di Brescia è un museo automobilistico immersivo che racconta la storia della Mille Miglia e delle auto d’epoca dal 1927 al 1957, ospitato nell’ex monastero benedettino di Sant’Eufemia.",
        "categoria": "monumento",
        "scoperto": false
    },
    {
        // Parco Baden Powell 45.52554961245499, 10.265180008208628
        "id": 22,
        "nome": "Parco Baden Powell",
        "lat": 45.5255,
        "lng": 10.2651,
        "desc": "Il Parco Baden Powell è un parco pubblico situato a Brescia, dedicato al fondatore del movimento scout, Robert Baden-Powell. Offre ampi spazi verdi e aree ricreative per famiglie e bambini.",
        "categoria": "parco",
        "scoperto": false
    },
    {
        // Unieco Park 45.525051161183704, 10.24809517560076
        "id": 23,
        "nome": "Unieco Park",
        "lat": 45.5250,
        "lng": 10.2480,
        "desc": "Unieco Park è un parco urbano situato a Brescia, che offre spazi verdi, aree giochi e percorsi pedonali per il relax e il tempo libero dei cittadini.",
        "categoria": "parco",
        "scoperto": false
    },
    {
        // Stadio Mario Rigamonti 45.57062413713271, 10.237002241882873
        "id": 24,
        "nome": "Stadio Mario Rigamonti",
        "lat": 45.5706,
        "lng": 10.2370,
        "desc": "Lo Stadio Mario Rigamonti è uno stadio di calcio situato a Brescia, sede delle partite casalinghe della squadra di calcio locale. È un luogo di grande importanza per gli appassionati di sport e tifosi.",
        "categoria": "monumento",
        "scoperto": false
    },
    {
        // Esselunga di via Trumplina 45.566365389062184, 10.22812711051505
        "id": 25,
        "nome": "Esselunga di via Trumplina",
        "lat": 45.5663,
        "lng": 10.2281,
        "desc": "Uno dei principali punti di rifornimento per il quartiere di Via Trumplina. Ottimo per fare scorta di pozioni e provviste prima di partire per l'esplorazione!",
        "categoria": "supermercato",
        "scoperto": false
    },
    {
        // Conad di via S. Bartolomeo 45.55826191017568, 10.212593644029276
        "id": 26,
        "nome": "Conad di via S. Bartolomeo",
        "lat": 45.5582,
        "lng": 10.2125,
        "desc": "Uno dei principali punti di rifornimento per il quartiere di Via S. Bartolomeo. Ottimo per fare scorta di pozioni e provviste prima di partire per l'esplorazione!",
        "categoria": "supermercato",
        "scoperto": false
    },
    {
        // parco Benedetto Castelli 45.57238484761131, 10.237884264435927
        "id": 27,
        "nome": "Parco Benedetto Castelli",
        "lat": 45.5723,
        "lng": 10.2378,
        "desc": "Il Parco Benedetto Castelli è un'area verde all'interno della città di Brescia, ideale per passeggiate e momenti di relax in mezzo alla natura.",
        "categoria": "parco",
        "scoperto": false
    },
    {
        // MUSIL museo del ferro 45.57649321873042, 10.221751048213829
        "id": 28,
        "nome": "MUSIL - Museo del Ferro e della Ghisa",
        "lat": 45.5764,
        "lng": 10.2217,
        "desc": "Il MUSIL è un museo dedicato alla storia della lavorazione del ferro e della ghisa, con esposizioni di macchinari, strumenti e manufatti che raccontano l'evoluzione industriale della città.",
        "categoria": "monumento",
        "scoperto": false
    },
    {
        // Vecchio Fortino 45.57304317293489, 10.194831194833865
        "id": 29,
        "nome": "Vecchio Fortino",
        "lat": 45.5730,
        "lng": 10.1948,
        "desc": "Il Vecchio Fortino è una struttura militare storica situata a Brescia, che offre una vista panoramica sulla città e rappresenta un importante esempio di architettura difensiva.",
        "categoria": "monumento",
        "scoperto": false
    },
    {
        // centro sportivo Sanpolino 45.51411211603848, 10.2675621358728
        "id": 30,
        "nome": "Centro Sportivo Sanpolino",
        "lat": 45.5141,
        "lng": 10.2675,
        "desc": "Il Centro Sportivo Sanpolino è una struttura dedicata alla pratica di diverse discipline sportive, aree per attività ricreative.",
        "categoria": "parco",
        "scoperto": false
    }
];
