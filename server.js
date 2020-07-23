const express = require('express');
const bodyParser = require('body-parser');
const expressEjsLayouts = require('express-ejs-layouts');
const port = 3000;
const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(expressEjsLayouts);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended : true}));

app.get('/', (req,res) => {
  res.render('index');
})
app.post('/submit', async (req,res) => {

  var mat = new Array(10);
  var done = new Array(10);
  var vp = new Array();
 
  for(var i = 1;i<10;i++) {
    mat[i] = [];
    done[i] = [];
    for(var j = 1;j<10;j++) {
      var element = req.body['mat' + i + j];
      if(element) {
        mat[i][j] = parseInt(element);
        done[i][j] = 1;
      } else {
        vp.push([i,j]);
        mat[i][j] = 0;
        done[i][j] = 0;
      }
    }
  }
  
  function check(pr , val) {
    var row=pr[0];
    var col=pr[1];
    for(var i=1;i<10;i++) {
      if(mat[row][i]==val) {
        return 0;
      }
      if(mat[i][col]==val) {
        return 0;
      }
    }
    // check the internal box of suduku
    var box_r=Math.floor((row-1)/3);
    var box_c=Math.floor((col-1)/3);
    var str=box_r*3+1;
    var stc=box_c*3+1;
    for(var i=str;i<str+3;i++) {
      for(var j=stc;j<stc+3;j++) {
        if(mat[i][j]==val) {
          return 0;				
        }
      }
    }
    return 1;
  }

  function rec(pos) {
    if(pos==vp.length){
      return 1;
    }
    for(var i=1;i<10;i++) {
      if(check(vp[pos],i) > 0) {
        var r=vp[pos][0];
        var c=vp[pos][1];
        mat[r][c]=i;
        if(rec(pos+1) > 0) {
          return 1;
        }
        mat[r][c]=0;
      }
    }
    return 0;
  }

  var ok = await rec(0);
  if(ok>0) {
    console.log(mat);
    res.render('solution', {mat : mat , done : done});

  } else {
    console.log('No solution');
    res.render('noSolution');
  }  
})


app.listen(port, () => {
  console.log(`listening to the port ${port}`);
})  



