$(document).ready(function () {
  var input_search = $('header .container_header input');
  var search_button = $('header .container_header button');
  var searched_result = $('#searched');

  var source   = $("#inforesults-template").html();
  var template = Handlebars.compile(source);

  var source_flag = $("#flags-template").html();
  var template_flag = Handlebars.compile(source_flag);

  var result_api = {
    titolo : '',
    titolo_originale : '',
    lingua : '',
    voto : ''
  };

  search_button.click(function () {
    //prendo il testo che l'utente vuole cercare
    var text_user = input_search.val().trim().toLowerCase();
    if (text_user !== ("")) {
    //se la mia ricerca é la seconda mi pulisce prima gli elementi prima cercati
    $(".container_film .results ul").remove();
    $(".container_film p").remove();
    searched_result.append('<p> Results  for : " ' + text_user + ' "</p>');
      $.ajax({
        'url' : "https://api.themoviedb.org/3/search/movie",
        'method' : "GET" ,
        'data' : {
          'api_key' : "d541fec680af5c662fac780f597581ff",
          'query' : text_user,
        },
        'success' : function(data) {
          var film = data.results;
          //ciclo for per girare tutti i risultati trovati
          for (var i = 0; i < film.length; i++) {
            var film_corrente = film[i];
            var stars_number = vote_transform(film_corrente.vote_average);
            //variabile contenente le stars per il voto
            var global_html_stars = "";
            //ciclo che genera il voto con le stars
            for (var e = 0; e < 5; e++) {
              if (e < stars_number) {
                global_html_stars += '<i class="fas fa-star fullstar"></i>';
              } else {
                global_html_stars += '<i class="far fa-star  emphtystar"></i>'
              };
            };
            //lavoro sulla bandiera della lingua
            var language_results = film_corrente.original_language;
            language_flag(language_results);
            //copio ogni risultato nel mio oggetto vuoto da stampare poi in pagina
            result_api.titolo = film_corrente.title;
            result_api.titolo_originale = film_corrente.original_title;
            result_api.lingua = flag_img;
            result_api.voto = global_html_stars;
            //se titolo e titolo originale sono uguali mettere none
            //stampo gli ul in pagine per quanti sono i film.lenght
            var html = template(result_api);
            $('.container_film .results').append(html)
          };
        },
        'error' : function () {
          console.log("error!");
        }
      });
      //pulisco l'input di ricerca
      input_search.val("");
    } else {
      console.log("digitare qualcosa da cercare");
    };
  });


//!!!!!!!!!!!!!!!!!!!!!!FUNZIONI GENERICHE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  //funzione che genera il numero di voto da 1 a 5
  function vote_transform(number) {
    var division = number/2;
    var inter = Math.round(division);
    return  inter;
  };

  function language_flag(language)  {
  var flags = ['en', 'it' , 'fr'];
  //if per creare l'immagine della lingua del film
  if (flags.includes(language)) {
    var flag_array_null = { lang : language };
    var flag_img = template_flag(flag_array_null);
    console.log("ok");
    return flag_img;
  } else {
    // se  non presente l'immagine lascia scritto il testo del nome della lingua
    return language;
  };
};
//!!!!!!!!!!!!!!!!!!!!!!FUNZIONI GENERICHE FINE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//!!!!!!!!!!!!!!!!!!!!!!INPUT CON KEYBOARD !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    //CON IL TASTO ENTER FACCIO ....
  input_search.on("keypress", function(e){
         if(e.which == 13){
             search_button.click()
         }
  });

//!!!!!!!!!!!!!!!!!!!!!!INPUT CON KEYBOARD FINE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

});
