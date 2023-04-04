const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


const userData = [{name : "Rahul", Email : "Rahul@gmail.com"  ,UserID : 1},
{name : "Jay", Email : "jay@gmail.com"  ,UserID : 2},
{name : "Raj", Email : "Raj@gmail.com"  ,UserID : 3}];

let AllpurchaseData = [];

const Admin = [{name : "Rk", Email : "Rk@gmail.com"},
{name : "Jk", Email : "jkl@gmail.com"}];


const Shoes = ["Shoes1","Shoes2"];

let currentUser = "";
let currentName = "";

let PurchaseProduct = [];
let render = {};

let AddToCart = [];

let RenderCartData = [];

let userProduct = [{Product : "Product-1.jpg" , Price : "$10" , ID : 1 , Detail : "Nice in cold"},
{Product : "Product-2.jpg" , Price : "$10" ,ID : 2, Detail : "Nice in cold"},
{Product : "Product-3.jpg" , Price : "$10", ID :3, Detail : "Nice in cold"}];

let cnt = 3;

const staticPath = path.join(__dirname,"./views");
app.use(express.static(staticPath));

app.set('view engine', 'ejs');

app.get('/', (req,res) => {
    res.render('login', { Path: '/UserLoginForm' })
})

app.get('/AdminLogin', (req,res) => {
    res.render('Login', { Path: '/AdminloginForm' })
});
app.get('/AddProduct', (req,res) => {
       res.render('AddProduct');
});

app.get('/UpdateRecord/:id', (req,res) => {

    let data = userProduct.filter((x) => x.ID == req.params.id);
    res.render('UpdateRecord' , {data : data[0]});
});

app.get('/DeleteRecord/:id', (req,res) => {

    let data = userProduct.filter((x) => x.ID != req.params.id);
    userProduct = data;
    res.redirect('/Admin');
});

app.get('/Admin', (req,res) => {
        res.render('AllData', {AllProduct :userProduct});
});

app.post("/UserLoginForm", (req,res) => {

    let obj = req.body;
    let data = userData &&  userData.filter((x) => x.name == obj.Name);
    let CheckOnceAgain = data && data.filter((x) => x.Email == obj.Email);
    let PassedArray = [];
    
    if(CheckOnceAgain && CheckOnceAgain.length > 0)
    {
             PassedArray.push(userProduct);
             PassedArray.push(CheckOnceAgain[0].UserID);
             PassedArray.push(AddToCart);
            currentUser = obj.Email;
            currentName = obj.Name;
             res.render('UserProduct',{AllProduct : PassedArray});
    }

});

app.post("/AdminLoginForm", (req,res) => {

    let obj = req.body;      
    let data = Admin &&  Admin.filter((x) => x.name == obj.Name);
    let CheckOnceAgain = data && data.filter((x) => x.Email == obj.Email)
    if(CheckOnceAgain && CheckOnceAgain.length > 0)
    {
             currentName = "";
             currentUser = "";
             res.render('/AllData',{userProduct : userProduct});
    }

});

app.post('/UpdateRecord/:id', (req,res) => {
    let data = userProduct;
    userProduct.forEach((x) => {
        if(x.ID == req.params.id)
        {
            x.Product = req.body.Product;
            x.Price = req.body.Cost;
            Detail = req.body.Detail;
        }
    });
    res.redirect('/Admin');
})

app.post('/AddRecord', (req,res) => {
    cnt = cnt +1;
    let x = {ID : cnt ,...req.body}
    userProduct.push(x);
    res.render('/AllData',{userProduct : userProduct});

});

app.post('/AddRecord', (req,res) => {
    cnt = cnt +1;
    let x = {ID : cnt ,...req.body}
    userProduct.push(x);
    res.render('/AllData',{userProduct : userProduct});

});

app.post('/MyProduct/:id', (req,res) => {
     let data = PurchaseProduct.filter((x) => x.ID == req.params.id)
})

app.get('/BuyProduct/:id/:productID', (req,res) => {

    let data = userProduct.filter((x) => x.ID == req.params.productID);
    let enter = true;
      PurchaseProduct.length > 0 && PurchaseProduct.forEach((x) => {
        if((x.ProductID == req.params.productID) && (x.UserID == req.params.id ))
        {
                  x.Quantity = x.Quantity + 1;
                  enter = false;
                  render = {Product : x.Product , Quantity : x.Quantity , Price : x.Price*Quantity ,AddTocart : x.AddTocart , RemoveToCart : 0 }
        }
    })
    if(enter)
    {
        PurchaseProduct.push({Product : data[0].Product , Quantity : 1,ProductID : req.params.productID , UserID : req.params.id , AddTocart : 0 , RemoveToCart : 0});
        render = { Quantity : 1, Product : data[0].Product , Price : data[0].Price }
    }
    res.redirect('/ProductYouBuy');
});

app.get('/ProductYouBuy', (req,res) => {
    res.render('ProductYouBuy', {data : render});
});

app.get('/AddToCart/:ProductID/:UserID', (req,res) => {

    req.params.productID;
    let data = userProduct.filter((x) => x.ID == req.params.ProductID);
      console.log(req.params);
    AddToCart.push({productID : req.params.ProductID , userID : req.params.UserID , Product : data[0].Product});
     res.redirect('/UserLoginForm');
});


app.get('/RemoveToCart/:ProductID/:UserID', (req,res) => {

    req.params.productID;
    //  PurchaseProduct.forEach((x) => {
           
    //        if(x.ProductID == req.params.productID && x.UserID == req.params.id)
    //        {
    //            x.RemoveToCart = 1;
    //            x.AddTocart = 0;
    //        }


    //  });
     let data = [];
     AddToCart.forEach((x) => {
         if(!(x.productID == req.params.productID && x.userID == req.params.UserID))
         {
             data.push(x);
         }
     })
     AddToCart = data ;
     res.redirect('/UserLoginForm');
});

app.get('/UserLoginForm' , (req,res) => {

    let PassedArray = [];
    console.log(currentName,currentUser)
    let data = userData &&  userData.filter((x) => x.name == currentName);
    let CheckOnceAgain = data && data.filter((x) => x.Email == currentUser);
    console.log("uuuuuuuuuuu")
    if(CheckOnceAgain && CheckOnceAgain.length > 0)
    {
             PassedArray.push(userProduct);
             PassedArray.push(CheckOnceAgain[0].UserID);
             PassedArray.push(AddToCart);
             res.render('UserProduct',{AllProduct : PassedArray});
    }

});

app.get('/ShowCart/:id' , (req,res) => {
         let data = AddToCart.filter((x) => x.userID == req.params.id);
          RenderCartData = [];
          console.log(data);
         data.forEach((x) => {

            userProduct.forEach((y) => {
                if(x.productID == y.ID)
                {
                    RenderCartData.push(y);
                }
            })
            
         })
         res.redirect('/ShowCart');
});

app.get('/ShowCart' , (req,res) => {
       
 console.log(RenderCartData);
  res.render('showCart' , {AllProduct : RenderCartData})

})
app.listen(5000)