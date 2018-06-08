//liens du set solveur
//https://www.msoos.org/2013/09/minisat-in-your-browser/

function coloriage(couleur_region,tab1){
    
    var col = [0xE2F202,0xE20000,0x0000FF,0x22F202];
    tab1.forEach(function(element,index) {
        
        element.forEach(function(element1,index1) {  
            eval("button"+index+"_"+index1+".tint = "+col[couleur_region[element1]]+";");
        });   
    });

    
    
}

function recup_rep(){
    

    
    var elem = document.getElementById('rep').value;
    var a = elem.split(" ");
    var couleur_region = [];
    a.forEach(function(element) {
        if(element.substring(0,1) != "-"){couleur_region.push(parseInt(element-1)%4);}
    });
    
    // couleur_region contient un tableau de taille nb_region avec des valeurs comprisent entre 0 et 3
    
    coloriage(couleur_region,tab1);

} //recupere les informations placees dans le textarea

function recup_rep_3sat(){
    

    
    var elem = document.getElementById('rep').value;
    var a = elem.split(" ");
    var couleur_region = [];
    a.forEach(function(element) {
        if(element.substring(0,1) != "-"){
            
            
            
            if(parseInt(element-1)%6 == 0){couleur_region.push(0);}
            else if(parseInt(element-1)%6 == 1){couleur_region.push(1);}
            else if(parseInt(element-1)%6 == 3){couleur_region.push(2);}
            else if(parseInt(element-1)%6 == 5){couleur_region.push(3);}
            
        
        }
    });
    
    
    // couleur_region contient un tableau de taille nb_region avec des valeurs comprisent entre 0 et 3
    
    coloriage(couleur_region,tab1);

} //recupere les informations placees dans le textarea

function creation_clauses_cnf(r,v,c){
    
    var nb_variable = r.length * c.length;
    var nb_clause = 0;
    
    var txt = "";
    var txt1 = "";
    var txt2 = "";
    
     r.forEach(function(element,index){
         c.forEach(function(element1,index1){
         
           txt = txt + (1+(index)*4+index1 + " ");     
                   
         });
         
         txt = txt+ " 0\n";
         nb_clause++;
         
     });     //gestion des contions pour les couleurs
                                                    //1 2 3 4 </br>5 6 7 8 </br>9 10 11 12 </br>
                                                    //chaque variable est une region avec une couleur
    
    v.forEach(function(element,index){
        c.forEach(function(element1,index1){
        
            txt1 = "";
            txt1 = element[0]*4+index1+1;
            
            
            txt2 = "";
            txt2 = element[1]*4+index1+1;
            
            txt = txt + "-";
            txt = txt + txt1;
            txt = txt + " ";
            txt = txt + "-";
            txt = txt + txt2;
            txt = txt + " 0\n";
            nb_clause++;

        });          
    });             //genere les conditions pour les regions voisines
    
    
    
    txt = "p cnf " + nb_variable + " " + nb_clause +"\n"+ txt;
    
    return txt;
    
    
}   // array(region)    array(voisin)   array(couleur)

function creation_clauses_cnf_3sat(r,v,c){
    
    var nb_clause = 0;
    var nb_variable = 0;
    
    var txt = "";
    var txt1 = "";
    var txt2 = "";
    
    // (1+2+u1) . (3+!u1+u2) . (3+4+!u1)
    //  1 2 3      4  -3 5      4 6  -3
    
    var k = 0;

     r.forEach(function(element,index){
         txt = txt + (nb_variable+1 + " ");
         txt = txt + (nb_variable+2 + " ");
         txt = txt + (nb_variable+3 + " ");
         
         txt = txt+ "0\n";
         
         txt = txt + (nb_variable+4 + " ");
         txt = txt + ("-"+(nb_variable+3) + " ");
         txt = txt + (nb_variable+5 + " ");
         
         txt = txt+ "0\n";
         
         txt = txt + (nb_variable+4 + " ");
         txt = txt + (nb_variable+6 + " ");
         txt = txt + ("-"+(nb_variable+3) + " ");
         
         txt = txt+ "0\n";
         
        
         nb_clause = nb_clause+3;
         nb_variable = nb_variable+6;
         
     });     //gestion des contions pour les couleurs    
     v.forEach(function(element,index){
        c.forEach(function(element1,index1){
            
            if(index1 == 0){k=0;}
            else if(index1 == 1){k=1;}
            else if(index1 == 2){k=3;}
            else if(index1 == 3){k=5;}
        
            txt1 = "";
            txt1 = element[0]*6+k+1;
            
            
            txt2 = "";
            txt2 = element[1]*6+k+1;
            
            txt = txt + "-";
            txt = txt + txt1;
            txt = txt + " ";
            txt = txt + "-";
            txt = txt + txt2;
            txt = txt + " 0\n";
            nb_clause++;

        });          
    });             //genere les conditions pour les regions voisines

    
    
    
    
    txt = "p cnf " + nb_variable + " " + nb_clause +"\n"+ txt;
    
   return txt;
    
    
    
}

//var r = [1,2,3];
//var c = ["r","v","b","j"];
//var v = [[1,2],[2,3],[1,3]];

//creation_clauses_cnf(r,v,c);

function verifie_pas_deja_voisins(liste_voisin,r1,r2){
    // liste voisins sous se format [[1,2],[2,3],[1,3]]
    
    var k = true;
    
    liste_voisin.forEach(function(element) {
        if((element[0] == r1 && element[1] == r2) || (element[0] == r2 && element[1] == r1)){
            k = false;
        }
    });
    
    return k;
    
    
} //on verifie que r1 et r2 ne sont pas deja enregistres comme voisins si il ne sont pas enregistres retoutne vrai
//var c = [[1,2],[2,3],[1,3]];
//console.log(verifie_pas_deja_voisins(c,1,2));


function creation_clauses(nb_region,couleur,tab1){
    
    var r = [];
    for (var i = 0; i < nb_region; i++) { 
        r.push(i);
    }
    
    
    var v = [];
    
    //on part d enhaut gauche donc on verifie a droite et en bas (en verifiant qu'ils existe)
    //puis on verifie qu'ils ne sont pas deja voisins pour ne pas rajouter des clauses
    
        for (var i = 0; i < tab1.length; i++) { 
         for (var j = 0; j < tab1[0].length; j++) {
             if(j+1 < tab1[0].length){
                 if(tab1[i][j] != tab1[i][j+1]){
                    if(verifie_pas_deja_voisins(v,tab1[i][j],tab1[i][j+1])){
                        v.push([tab1[i][j],tab1[i][j+1]]);
                    }   
                 }
             }
             if(i+1 < tab1.length){
                if(tab1[i][j] != tab1[i+1][j]){
                    if(verifie_pas_deja_voisins(v,tab1[i][j],tab1[i+1][j])){
                        v.push([tab1[i][j],tab1[i+1][j]]);
                    }
                 }
             }
             
         }
    }
    
   pas3sat = creation_clauses_cnf(r,v,couleur);
    
   _3sat = creation_clauses_cnf_3sat(r,v,couleur);
    
    
    
}

var couleur = ["r","v","b","j"];
var nb_region = 40;

var longueur = 60;
var largeur = 60;

var x = 100;
var y = 100;
var taille_block = 5;
var espace_entre_block = 0;

var pas3sat = "";
var _3sat = "";

function creation_tab(longueur,largeur){
    
    
    var tab = [];
    
    for (var i = 0; i < longueur; i++) {
    
    tab[i] = [];
    
    for (var j = 0; j < largeur; j++) {
    
    tab[i][j] = i*largeur+j;
        
}
    
}   //creation de la map
    
    return tab;
    
}

var tab = creation_tab(longueur,largeur);

function get_case_a_cote(tab,num_case){
    
    var num_case_voisine = [];
    

    if(num_case > tab[0].length){
        
        num_case_voisine.push(num_case - tab[0].length);
        
    }   //ajoute la case au dessus si elle existe
    if(num_case < (tab.length-1)*tab[0].length){
       
       num_case_voisine.push(num_case + tab[0].length);
       
    }   //ajoute la case au dessous si elle existe
    if(num_case % tab[0].length != 0){
     
         num_case_voisine.push(num_case - 1);
        
    }   //ajoute la case a gauche si elle existe
    if((num_case+1) % tab[0].length != 0){
     
         num_case_voisine.push(num_case + 1);
        
    }   //ajoute la case a droite si elle existe
    
    return num_case_voisine;
    
}   //retourne les cases voisines a une case
                                                //console.log(get_case_a_cote(tab,30));

function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}   //returne un nobre entrele min et le max
                                    //console.log(random(10,20));

function get_region(case1,region){
    
    var i = null;
    
    region.forEach(function(element,index) {
       element.forEach(function(element1) {
            if(element1 == case1){ i = index}
       });
    });
    
    return i;
}     //retourne le numero d une region en fonction d une case qui est dans cette region

function copie_region(region,r1,r2){
    
    var svg = region[r1];
    
    region[r2].forEach(function(element) {    
       region[r1].push(element); 
    });
    
    region[r1] = svg;
    region.splice(r2,1);
    
    
}   //copie r2 dans r1 et supprime r2


//creation des region
//au debut chaque case est une region
//une region est un tableau de case voisine
var region = [];
tab.forEach(function(element) {
  element.forEach(function(element1) {
    region.push([element1]);
  });
});
//console.log(region);

//console.log(get_region(1,region));
//copie_region(region,0,1);



function creation_map(region,nb_region,tab){
    
        var r;
        var c;
        var case_a_cote;
        var case1;
    
        while(region.length > nb_region){
            r = random(0,region.length);    //prendre une region aleatoire
            c = random(0,region[r].length); //prendre une case d une region aleatoire
            case_a_cote = get_case_a_cote(tab,region[r][c]);
            case1 = case_a_cote[random(0,case_a_cote.length)];

            if(!region[r].includes(case1)){
                //si la case1 n'est pas dans la region r, alors on cherche la region dans laquelle elle est "r1" puis on ajoute toute le case de r1 dans r et l on supprimme r1

                copie_region(region,r,get_region(case1,region)); 
            }
        }
    
        
    
    
   
}   //creer une carte avec nb_region
creation_map(region,nb_region,tab);
//console.log(region);

function reorganisation_map(longueur,largeur,region){
    
    var nouveau_tab = [];
    
    for (var i = 0; i < longueur; i++) {
        nouveau_tab[i] = [];
        for (var j = 0; j < largeur; j++) {
            nouveau_tab[i][j] = get_region(i*largeur+j,region);
        }
    }
    
    return nouveau_tab;
    
    
}

tab1 = reorganisation_map(longueur,largeur,region);

function creation_sprite(x,y,taille_block){
    

    
        for( var i = 0; i < longueur; i++){
            for( var j = 0; j< largeur; j++){
    
    
                eval("button"+i+"_"+j+" = game.add.sprite(x+(taille_block+espace_entre_block)*j,y+(taille_block+espace_entre_block)*i,'choix_vide');");
                
                //eval("button"+i+"_"+j+".tint = "+matrice[i][j]+";");
               
                eval("button"+i+"_"+j+".scale.setTo(1/(button"+i+"_"+j+".width/taille_block),1/(button"+i+"_"+j+".height/taille_block));");

                //eval("button"+i+"_"+j+".inputEnabled = true;");
                
                //eval("button"+i+"_"+j+".events.onInputDown.add(on_click,{i: i, j:j});");
            }
        }
}//creer les sprites

function creation_ligne(x,y,x1,y1,game){
    
    //console.log(x,y,x1,y1,game);
    
    var line = new Phaser.Line(x,y,x1,y1);
    var graphics=game.add.graphics(0,0);
    //var graphics=game.add.graphics(line.start.x,line.start.y);//if you have a static line
    graphics.lineStyle(1, 0x000000, 1);
    graphics.moveTo(line.start.x,line.start.y);//moving position of graphic if you draw mulitple lines
    graphics.lineTo(line.end.x,line.end.y);
    graphics.endFill();
    
    
    
}   //dessine une ligne on fonction des 2 points donnes

function dessine_toutes_les_lignes(tab1,x,y,taille_block,game){
    
    //comme l on commence d enhaut a gauche, il faut juste pour chaque case verifier si elle a une case a coté d'elle et si sa valeur est differente
    // idem pour dessous
    
    for (var i = 0; i < tab1.length; i++) { //-1 pour pas faire la derniere ligne
         for (var j = 0; j < tab1[0].length; j++) {
             
             //console.log(tab1[i][j] +"   "+ tab1[i][j+1] +"\n");

             if(j+1 < tab1[0].length){
                 if(tab1[i][j] != tab1[i][j+1]){

                     creation_ligne(
                         y+taille_block*(j+1),
                         x+taille_block*i,
                         y+taille_block*(j+1),
                         x+taille_block*(i+1),
                         game);
                 }
             }
             if(i+1 < tab1.length){
                if(tab1[i][j] != tab1[i+1][j]){

                     creation_ligne(
                         y+taille_block*(j),
                         x+taille_block*(i+1),
                         y+taille_block*(j+1),
                         x+taille_block*(i+1),
                         game);
                 }
             }
             
         }
    }
    
    
    
    
}   //dessine les frontieres sur la carte




var game = new Phaser.Game(600, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create });

function preload() {

   
     this.game.load.image('choix_vide', 'choix_vide.png');
}

function create() {
        creation_sprite(x,y,taille_block);
        game.stage.backgroundColor = '#124184';
        dessine_toutes_les_lignes(tab1,x,y,taille_block,game);

    
    creation_clauses(nb_region,couleur,tab1);
    

    
    document.getElementById('3sat').value += _3sat;
    document.getElementById('pas3sat').value += pas3sat;
    
   
      

}
