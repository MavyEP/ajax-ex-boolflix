$(document).ready(function () {
  var input_search = $('header .container_header input');
  var search_button = $('header .container_header button');

  var source   = $("#template").html();
  var template = Handlebars.compile(source);

  var result_api = {
    titolo : '',
    titolo_originale : '',
    lingua : '',
    voto : ''
  };

  search_button.click(function () {
    //se la mia ricerca é la seconda mi pulisce prima gli elementi prima cercati
    $(".container_main ul").remove();
    //prendo il testo che l'utente vuole cercare
    var text_user = input_search.val().toLowerCase();
    console.log(text_user);
      $.ajax({
        'url' : "https://api.themoviedb.org/3/search/movie",
        'method' : "GET" ,
        'data' : {
          'api_key' : "d541fec680af5c662fac780f597581ff",
          'query' : text_user,
        },
        'success' : function(data) {
          console.log(data);
          var film = data.results;
          //ciclo for per girare tutti i risultati trovati
          for (var i = 0; i < film.length; i++) {
            var film_corrente = film[i];
            //copio ogni risultato nel mio oggetto vuoto da stampare poi in pagina
            result_api.titolo = film_corrente.title;
            result_api.titolo_originale = film_corrente.original_title;
            result_api.lingua = film_corrente.original_language;
            result_api.voto = film_corrente.vote_average;
            //se titolo e titolo originale sono uguali mettere none
            if (result_api.titolo = result_api.titolo_originale) {
              result_api.titolo_originale = "none";
            };
            //stampo gli ul in pagine per quanti sono i film.lenght
            var html = template(result_api);
            $('.container_main').append(html)
          };
        },
        'error' : function () {
          console.log("error!");
        }
      });
      //pulisco l'input di ricerca
      input_search.val("");
  });














});
