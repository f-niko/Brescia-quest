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
        "desc": "Illustre istituto scolastico.",
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
    },
    {
        // Oratorio San Giovanni Bosco 45.553679182640614, 10.072963362816175
        "id": 31,
        "nome": "Oratorio San Giovanni Bosco",
        "lat": 45.5536,
        "lng": 10.0729,
        "desc": "L'Oratorio San Giovanni Bosco è un luogo di aggregazione giovanile e spirituale, che offre attività educative, ricreative e culturali per bambini e adolescenti.",
        "categoria": "parco",
        "scoperto": false
    },
    {
        // Cimitero comunale di ospitaletto 45.55724089063377, 10.063628009651628
        "id": 32,
        "nome": "Cimitero comunale di Ospitaletto",
        "lat": 45.5572,
        "lng": 10.0636,
        "desc": "Il Cimitero comunale di Ospitaletto è un luogo di sepoltura e memoria, che ospita tombe e monumenti commemorativi della comunità locale.",
        "categoria": "monumento",
        "scoperto": false
    },
    {
        // castello oldofredi 45.58996696196111, 10.07672702918096
        "id": 33,
        "nome": "Castello Oldofredi",
        "lat": 45.5899,
        "lng": 10.0767,
        "desc": "Il Castello Oldofredi è una struttura fortificata storica situata a Brescia, che rappresenta un importante esempio di architettura medievale.",
        "categoria": "monumento",
        "scoperto": false
    },
    {
        // Abbazia Benedettina di Rodengo 45.589997500915814, 10.110246520660105
        "id": 34,
        "nome": "Abbazia Benedettina di Rodengo",
        "lat": 45.5899,
        "lng": 10.1102,
        "desc": "L'Abbazia Benedettina di Rodengo è un complesso monastico storico situato a Brescia, che offre un esempio significativo di architettura religiosa e spiritualità.",
        "categoria": "monumento",
        "scoperto": false
    },
    {
        // Santuario la santissima 45.59111752018351, 10.145327698666181
        "id": 35,
        "nome": "Santuario La Santissima",
        "lat": 45.5911,
        "lng": 10.1453,
        "desc": "Il Santuario La Santissima è un luogo di culto e devozione situato a Brescia, che rappresenta un importante punto di riferimento spirituale per la comunità locale.",
        "categoria": "monumento",
        "scoperto": false
    },
    {
        // Regesta beach village 45.57915800926663, 10.174600711215527
        "id": 36,
        "nome": "Regesta Beach Village",
        "lat": 45.5791,
        "lng": 10.1746,
        "desc": "Il Regesta Beach Village è un luogo di svago e divertimento.",
        "categoria": "parco",
        "scoperto": false
    },
    {
        // Forte Garibaldi 45.52298959035238, 10.279295938176238
        "id": 37,
        "nome": "Forte Garibaldi",
        "lat": 45.5229,
        "lng": 10.2792,
        "desc": "Il Forte Garibaldi è una struttura militare storica situata a Brescia, che rappresenta un importante esempio di architettura difensiva e offre una vista panoramica sulla città.",
        "categoria": "monumento",
        "scoperto": false
    },
    {
        // Auditorium Giorgio Gaber 45.5045556277794, 10.145623869473054
        "id": 38,
        "nome": "Auditorium Giorgio Gaber",
        "lat": 45.5045,
        "lng": 10.1456,
        "desc": "L'Auditorium Giorgio Gaber è una struttura culturale situata a Brescia, che ospita eventi musicali, teatrali e conferenze, offrendo uno spazio per la promozione delle arti e della cultura.",
        "categoria": "monumento",
        "scoperto": false
    
    },
    {
        // Parco san giovanni paolo II 45.50149369209063, 10.142676899143959
        "id": 39,
        "nome": "Parco San Giovanni Paolo II",
        "lat": 45.5014,
        "lng": 10.1426,
        "desc": "Il Parco San Giovanni Paolo II è un'area verde pubblica situata a Brescia, che offre spazi per passeggiate, attività ricreative e momenti di relax immersi nella natura.",
        "categoria": "parco",
        "scoperto": false
    },
    {
        // Cimitero vantiniano di torbole casaglia 45.51023260606191, 10.106572923259646
        "id": 40,
        "nome": "Cimitero Vantiniano di Torbole Casaglia",
        "lat": 45.5102,
        "lng": 10.1065,
        "desc": "Il Cimitero Vantiniano di Torbole Casaglia è un luogo di sepoltura e memoria, che ospita tombe e monumenti commemorativi della comunità locale.",
        "categoria": "monumento",
        "scoperto": false
    },
    {
        // ASD Dead City 45.50918315767279, 10.130344791791769
        "id": 41,
        "nome": "ASD Dead City",
        "lat": 45.5091,
        "lng": 10.1303,
        "desc": "ASD Dead City è un'associazione sportiva dilettantistica che organizza eventi e attività legate al mondo del paintball e del softair, offrendo un'esperienza di gioco immersiva e avvincente.",
        "categoria": "parco",
        "scoperto": false
    },
    {
        // Parco del Fontanone 45.48976126793887, 10.134005647941184
        "id": 42,
        "nome": "Parco del Fontanone",
        "lat": 45.4897,
        "lng": 10.1340,
        "desc": "Il Parco del Fontanone è un'area verde pubblica situata a Brescia, che offre spazi per passeggiate, attività ricreative e momenti di relax immersi nella natura.",
        "categoria": "parco",
        "scoperto": false
    },
    {
        // Gurdwara Singh Sabha Flero 45.49052196751272, 10.158439135228928
        "id": 43,
        "nome": "Gurdwara Singh Sabha Flero",
        "lat": 45.4905,
        "lng": 10.1584,
        "desc": "Il Gurdwara Singh Sabha Flero è un luogo di culto Sikh situato a Brescia, che offre uno spazio per la preghiera, la meditazione e la comunità Sikh locale.",
        "categoria": "monumento",
        "scoperto": false
    },
    {
        // Villa Labirinto 45.51294892571171, 10.181769526447457
        "id": 44,
        "nome": "Villa Labirinto",
        "lat": 45.5129,
        "lng": 10.1817,
        "desc": "Villa Labirinto è una villa storica situata a Brescia, che offre un esempio significativo di architettura residenziale e giardini ornamentali.",
        "categoria": "monumento",
        "scoperto": false
    },
    {
        // Parco via Aldo Moro 45.48662549280133, 10.172148968773529
        "id": 45,
        "nome": "Parco via Aldo Moro",
        "lat": 45.4866,
        "lng": 10.1721,
        "desc": "Il Parco via Aldo Moro è un'area verde pubblica situata a Brescia, che offre spazi per passeggiate, attività ricreative e momenti di relax immersi nella natura.",
        "categoria": "parco",
        "scoperto": false
    },
    {
        // ELNOS shopping 45.53404195535618, 10.164858903994258
        "id": 46,
        "nome": "ELNOS Shopping",
        "lat": 45.5340,
        "lng": 10.1648,
        "desc": "ELNOS Shopping è un centro commerciale situato a Brescia, che offre una vasta gamma di negozi e servizi per i residenti e i visitatori.",
        "categoria": "shopping",
        "scoperto": false
    },
    {
        // Rondinelle centro commerciale 45.53470325045572, 10.150809431310071
        "id": 47,
        "nome": "Rondinelle",
        "lat": 45.5347,
        "lng": 10.1508,
        "desc": "Rondinelle è un centro commerciale situato a Brescia, che offre una varietà di negozi, ristoranti e servizi per lo shopping e il tempo libero.",
        "categoria": "shopping",
        "scoperto": false
    },
    {
        // Paradiso disco 45.49622620488132, 10.257338624970915
        "id": 48,
        "nome": "Paradiso Disco",
        "lat": 45.4962,
        "lng": 10.2573,
        "desc": "Paradiso Disco è una discoteca situata a Brescia, che offre un ambiente per la musica, il ballo e l'intrattenimento notturno.",
        "categoria": "parco",
        "scoperto": false
    },
    {
        // Museo del marmo botticino 45.54630787879036, 10.319932257738623
        "id": 49,
        "nome": "Museo del Marmo Botticino",
        "lat": 45.5463,
        "lng": 10.3199,
        "desc": "Il Museo del Marmo Botticino è un museo situato a Brescia, che conserva e mostra opere d'arte in marmo provenienti dalla tradizione artistica locale.",
        "categoria": "monumento",
        "scoperto": false
    },
    {
        // Oratorio Paolo VI 45.58892010133465, 10.237604506719213
        "id": 50,
        "nome": "Oratorio Paolo VI",
        "lat": 45.5889,
        "lng": 10.2376,
        "desc": "L'Oratorio Paolo VI è un luogo di aggregazione giovanile e spirituale situato a Brescia, che offre attività educative, ricreative e culturali per bambini e adolescenti.",
        "categoria": "parco",
        "scoperto": false
    },
    {
        // Porta Romana 45.542496265933316, 10.23065835788893
        "id": 51,
        "nome": "Porta Romana",
        "lat": 45.5424,
        "lng": 10.2306,
        "desc": "Porta Romana è una storica porta cittadina situata a Brescia, che rappresenta un importante esempio di architettura difensiva e offre una vista panoramica sulla città.",
        "categoria": "monumento",
        "scoperto": false
    }
];
