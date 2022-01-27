const replaceTemplete=(temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);
    
    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
     return output;
  }

const http =require('http');
const url=require('url');
const fs=require('fs');



const data=fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dataObj=JSON.parse(data);


const tempOverview=fs.readFileSync(`${__dirname}/templetes/templete-overview.html`,'utf-8');
const tempCard=fs.readFileSync(`${__dirname}/templetes/templete-card.html`,'utf-8');
const tempProduct=fs.readFileSync(`${__dirname}/templetes/templete-product.html`,'utf-8');
const signUp=fs.readFileSync(`${__dirname}/templetes/sign-up-form.html`,'utf-8');

const server=http.createServer((req,res)=>{
   const {query,pathname }=url.parse(req.url,true);
//Overview page////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    if (pathname=='/' || pathname=='/overview'){
        res.writeHead(200,{'Content-type':'text/html'});
        const cardsHtml=dataObj.map(el => replaceTemplete(tempCard,el)).join('');
        const output=tempOverview.replace('{%PRODUCT_CARDS%}',cardsHtml);
        res.end(output);
    }
//Product page/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (pathname == '/product'){
        const product=dataObj[query.id];
        const output=replaceTemplete(tempProduct,product);
        res.end(output);
    } 
    else if (pathname == '/sign-up-form'){
        res.writeHead(200,{
            'Content-type':'text/html'
        })
        console.log(signUp);
        res.end(signUp);
    }
//API////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (pathname == '/api'){
        res.writeHead(200,{
        'Content-type':'application/json'
    })
        res.end(data);
    }


    //Not found//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    else{
        res.writeHead(404,{
            'Content-type':'text/html'
        })
        res.end('<h1>this is error</h1>');
    }
})

server.listen(8000,'127.0.0.1',()=>{
    console.log("Server is listining");
});