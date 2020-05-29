$(document).ready(function () {
  //luogo dove utente scrivera l elemento da ricercare
  var input_search = $('header .container_header input');
  //tasto search collegato all input sopra
  var search_button = $('header .container_header button');
  var searched_result_film = $('#searched_film');
  var searched_result_tv = $('#searched_tv');
  //"pasword" per permessi del sito
  var api_key = "d541fec680af5c662fac780f597581ff" ;

// primo template
  var source   = $("#inforesults-template").html();
  var template = Handlebars.compile(source);

// secondo template per le bandiere della lingua
  var source_flag = $("#flags-template").html();
  var template_flag = Handlebars.compile(source_flag);

// terzo template per il poster di ogni elemento
  var source_poster = $("#poster-template").html();
  var template_poster = Handlebars.compile(source_poster);

//variabile per cio che mi restituisce la richiesta di ajax
  var result_api = {
    titolo : '',
    titolo_originale : '',
    lingua : '',
    voto : ''
  };

//funzione img background carousel
  setInterval(backimg_slider, 3000);

//funzione bottone search per avviare la ricerca
  search_button.click(function () {
    $('#logo_main').addClass("disable")
    //prendo il testo che l'utente vuole cercare
    var text_user = input_search.val().trim().toLowerCase();
      if (text_user !== ("")) {
      //se la mia ricerca é la seconda mi pulisce prima gli elementi prima cercati
      $(".container_film .results ul").remove();
      $(".container_film p").remove();
      searched_result_film.append('<p class="title"> Movies for &nbsp; <span class="info_title">"' + text_user + '"</span></p>');
        $.ajax({
          'url' : "https://api.themoviedb.org/3/search/movie",
          'method' : "GET" ,
          'data' : {
            'api_key' : api_key,
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
                  var flag_img = language_flag(language_results);
                  //copio ogni risultato nel mio oggetto vuoto da stampare poi in pagina
                  result_api.titolo = film_corrente.title;
                  result_api.titolo_originale = film_corrente.original_title;
                  result_api.lingua = flag_img;
                  result_api.voto = global_html_stars;
                  var poster_query_end = {img : ""};
                  poster_query_end.img = film_corrente.poster_path;
                  if (film_corrente.poster_path == null) {
                    result_api.poster = '<img class="poster_img" id="poster" src="img/not-found-img.jpg">'
                  } else {
                    var poster  = template_poster(poster_query_end);
                    result_api.poster = poster;
                  }
                  //se titolo e titolo originale sono uguali mettere none
                  //stampo gli ul in pagine per quanti sono i film.lenght
                  var html = template(result_api);
                  $('.container_film .results').append(html)
                };
          },
          'error' : function () {
            console.log("error! film");
          }
        });

        $(".container_tv .results ul").remove();
        $(".container_tv p").remove();
        searched_result_tv.append('<p class="title"> Series for &nbsp; <span class="info_title">"' + text_user + '"</span></p>');
          $.ajax({
            'url' : "https://api.themoviedb.org/3/search/tv",
            'method' : "GET" ,
            'data' : {
              'api_key' : api_key,
              'query' : text_user,
            },
            'success' : function(data) {
              var tv = data.results;
              for (var i = 0; i < tv.length; i++) {
                var tv_corrente = tv[i];
                var stars_number = vote_transform(tv_corrente.vote_average);
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
                var language_results = tv_corrente.original_language;
                var flag_img = language_flag(language_results);
                //copio ogni risultato nel mio oggetto vuoto da stampare poi in pagina
                result_api.titolo = tv_corrente.name;
                result_api.titolo_originale = tv_corrente.original_name;
                result_api.lingua = flag_img;
                result_api.voto = global_html_stars;
                var poster_query_end = {img : ""};
                poster_query_end.img = tv_corrente.poster_path;
                if (tv_corrente.poster_path == null) {
                  result_api.poster = '<img class="poster_img" id="poster" src="img/not-found-img.jpg">'
                } else {
                  var poster  = template_poster(poster_query_end);
                  result_api.poster = poster;
                }
                //se titolo e titolo originale sono uguali mettere none
                //stampo gli ul in pagine per quanti sono i film.lenght
                var html = template(result_api);
                $('.container_tv .results').append(html)
              };
            } ,
            'error' : function () {
              console.log("error! tv");
            }
          })
        //pulisco l'input di ricerca
        input_search.val("");
        $('.sect_film').addClass("padding-bottom");
      } else {
        console.log("digitare qualcosa da cercare");
    }
  });


//!!!!!!!!!!!!!!!!!!!!!!FUNZIONI GENERICHE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  //funzione che genera il numero di voto da 1 a 5
  function vote_transform(number) {
    var division = number/2;
    var inter = Math.round(division);
    return  inter;
  }
  //funzione che genera la bandiera per la lingua
  function language_flag(language)  {
  var flags = ['en', 'it' , 'fr'];
  var fun_result = "";
  //if per creare l'immagine della lingua del film
      if (flags.includes(language)) {
        var flag_array_null = { lang : language };
        var flag_img = template_flag(flag_array_null);
        fun_result = flag_img ;
      } else {
        // se  non presente l'immagine lascia scritto il testo del nome della lingua
        fun_result = language;
      }
  return fun_result;
}

//funzione che genera il background carousel
  function backimg_slider() {
    var img_visible = $('.background .active');
    var img_next = img_visible.next();
    img_visible.fadeOut("slow" , "swing" , function () {
      img_visible.removeClass("active");
    })
    if (img_next.length == 0) {
        img_next = $('.background img:first-child');
        img_next.fadeIn("slow" , "swing"  , function () {
          img_next.addClass('active');
        })
      } else {
        img_next.fadeIn("slow" , "swing" , function () {
          img_next.addClass('active');
        })
    }
  }
// !!!!!!!!!!!!!!!!!!!!!!FUNZIONI GENERICHE FINE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//!!!!!!!!!!!!!!!!!!!!!!INPUT CON KEYBOARD !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    //CON IL TASTO ENTER FACCIO ....
  input_search.on("keypress", function(e){
         if(e.which == 13){
             search_button.click()
         }
  })

//!!!!!!!!!!!!!!!!!!!!!!INPUT CON KEYBOARD FINE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

})
