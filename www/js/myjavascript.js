var x=0;
var y=12;
function init(){

    getMoviesList();
}
function populateDB(tx) {
    
    var idx = x;
        //tx.executeSql('DROP TABLE IF EXISTS DEMO');
         tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id unique, data)');
         tx.executeSql('INSERT INTO DEMO (id, data) VALUES (?,?)',[idx, "Pelicula favoritos"]);


    }

    // Transaction error callback
    //
    function errorCB(tx, err) {
        alert("Error processing SQL: "+err);
    }

    // Transaction success callback
    //
    function successCB() {
        alert("success!");
        var db = window.openDatabase("MyDB", "1.0", "My Sample DB", 1000000);
        db.transaction(queryDB, errorCB);
    }

    function queryDB(tx) {
        tx.executeSql('SELECT * FROM DEMO', [], querySuccess, errorCB);
    }

    // Query the success callback
    //
    function querySuccess(tx, results) {
        var len = results.rows.length;
        alert("Tienes " + len +" Peliculas favoritas");
        console.log("DEMO table: " + len + " rows found.");
        for (var i=0; i<len; i++){
            alert("Pelicula favorita num " + results.rows.item(i).id + ".");

        }

        
    }
//...............................................................................


function getMoviesList(){
    var theList = $("#mylist");

    
     var request = $.ajax({
          url: "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=87ba7aefccf27e50e0c0775fc1d2d83b",
          method: "GET"
        });

        request.done(function( moviesList ) {
            
            
            
            for (i=0;i<moviesList.results.length;i++){
                theList.append("<div><li><a href=javascript:getDetail("+moviesList.results[i].id +")>"+moviesList.results[i].original_title+"</a>");
				theList.append("<img src=https://image.tmdb.org/t/p/w500"+moviesList.results[i].poster_path+" height='200'></li></div><br><br>");
				  
                }
            
            theList.listview("refresh");
            
            });
    
        
    
    

        request.fail(function( jqXHR, textStatus ) {
          alert( "Request failed: " + textStatus );
    });
}

function getDetail(id){
     var request = $.ajax({
         url: "https://api.themoviedb.org/3/movie/"+id+"?api_key=4da6b895870b2ff644982b6a5b10f5d8",
         method: "GET"
        });

        request.done(function( result ) {
            $.mobile.navigate( "#page2" );
            var listdetails = $("#mylistdetails");
            listdetails.empty();
            listdetails.append("<h2>"+result.original_title+"</h2><br>");
            listdetails.append("<img src=https://image.tmdb.org/t/p/w500"+result.poster_path+" height='300px'>");
            listdetails.append("<p>"+result.release_date+"</p>");
            listdetails.append("<p>"+result.overview+"</p>");
            listdetails.append("<h3>Note: "+result.vote_average+"</h3>");
            listdetails.append("<p><a href=javascript:addFavoriteList("+id+")>Añadir a Favoritos</a></p>");
            
            return result;
            
            
            listdetails.listview("refresh");
        });
    
    

        request.fail(function( jqXHR, textStatus ) {
          alert( "Request failed: " + textStatus );
    });
    
    
}


function addFavoriteList(id){

    x=id;
    var db = window.openDatabase('MyDB', '1.0', 'My Sample DB', 1000000);
    db.transaction(populateDB, errorCB, successCB);

                    

}

function goFavoritePage(){
    
    $.mobile.navigate( "#page3" );
    var db = window.openDatabase("MyDB", "1.0", "My Sample DB", 1000000);
    db.transaction(queryDB, errorCB);
}
