let express = require('express')
let app = express()
let path = require('path')
let mongoose = require('mongoose')
let bodyparser = require('body-parser')
let session = require('express-session')
let ObjectId = require('mongodb').ObjectId

app.use(bodyparser.urlencoded( { extended: true } ))
app.use(express.static(path.join(__dirname,'public')))
app.use(session({
    "secret": "2323kfkhsdfksdfsdfl",
    saveUninitialized: true,
    resave: true
}))

app.set(path.join(__dirname,'views'))
app.set('view engine','ejs')

let Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/cart',{
  useNewUrlParser: true,
  useUnifiedTopology: true
});

let User = new Schema({
    name: String,
    email: String,
    password: String
});

let Admin = new Schema({
    name: String,
    email: String,
    password: String
});

let AdminProduct = new Schema({
  name: String,
  desc: String,
  qty: Number,
  price: Number
});

let AdminCart = new Schema({
  userId : String,
  productId : String,
  name : String,
  qty: Number,
  price: Number
})

function isLoggedMiddleware(req,res,next){
  if(req.session.userData != null){
    res.redirect("/user");
  }
  else next();
}

let user = mongoose.model('user',User);
let admin = mongoose.model('admin',Admin);
let adminProduct = mongoose.model('adminproduct',AdminProduct);
let adminCart = mongoose.model('admincart',AdminCart);

app.get('/home',isLoggedMiddleware,(req,res) => {
  res.render('home');
});

app.get('/login',isLoggedMiddleware,(req,res) => {
  res.render('login',{errors: null,success: null});
});

app.get('/register',isLoggedMiddleware,(req,res) => {
  let obj = {
    errors: [],
    name: "",
    email: "",
    password: "",
    ConPassword: "",
  }
  res.render('register',obj);
});



app.post('/login',(req,res) => {
  ({ email, password} = req.body);         //object destructuring
  user.findOne(({email: email, password: password}),(err,data) => {
    if(data != null){
      req.session.userData = data;
      res.redirect("/user");
    }
    else{
      admin.findOne(({email: email, password: password}),(err,data) => {
        if(data != null){
          req.session.userData = data;
          res.redirect("/admin");
        }
        else res.render('login',{errors: "Email/Password is Incorrect",success: null});
      })
    }
  })
})

app.get('/update',(req,res) => {
  let obj = req.session.updateProd;
  req.session.updateProd = null;
  res.render('update',obj);
});

app.post('/admin/update',(req,res) => {
  let obj = {
    id: req.body.id,
    name: req.body.name,
    desc: req.body.desc,
    qty: req.body.qty,
    price: req.body.price,
  }
  req.session.updateProd = obj;
  res.send(obj);
});

app.post('/updateQuery',async (req,res) => {
  let id = new ObjectId(req.body.id);
  let filter = {
    _id: id,
  }
  await adminProduct.collection.updateOne(
    filter,
    {
      $set: {
        "name": req.body.name, "desc": req.body.desc, "qty": Number(req.body.qty), "price": Number(req.body.price)
      }
    }
  ).catch((err) => {
    if(err) {
      console.log(err);
    }
  });
  res.send('yolo');
});

app.post('/register',(req,res) => {
  let errors = [];

  if(req.body.name.length === 0) {
    errors.push({ text: 'Enter your name' });
  }

  if (req.body.email.length === 0) {
    errors.push({ text: 'Enter your email' });
  }

  if (req.body.password != req.body.ConPassword) {
    errors.push({ text: 'Passwords do not match' });
  }

  if (req.body.password.length < 4) {
    errors.push({ text: 'Password must be at least 4 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      ConPassword: req.body.ConPassword
    });
  } else {
    let user_data = new user();
    user_data.name = req.body.name;
    user_data.email = req.body.email;
    user_data.password = req.body.password;
    user_data.save((err) => {
      if (err !== null) {
        res.send('error occured');
      }
      else {
        res.render('login',{errors: null,success: "Your account registered successfully"});
      }
    });
  }
});

app.get('/admin',(req,res) => {
  // ({limit,skip} = req.query);
  // let obj = {};
  adminProduct.find({},(err,data) => {
    let obj = {
      name: req.session.userData,
      data: data,
    }
    res.render('admin',obj);
  });
  // res.render('admin',obj);
})

app.get('/cart',async (req,res) => {
    let products = await adminProduct.find({});
    adminCart.find({userId: req.session.userData._id},(err,cartData) => {
      let obj = {
        cartData: cartData,
        userData: req.session.userData,
        products: products,
      }
      res.render('cart',obj);
    });
});

app.post('/user/deleteCartItem',async (req,res) => {
    const filter = {
        "userId": req.body.userId,
        "productId": req.body.productId,
    }
    await adminCart.deleteOne(filter).catch(err => {
        if(err)
            console.log("error occured");
    });
    res.redirect('/cart');
});


app.post("/admin/delete",(req,res) => {
  let id = new ObjectId(req.body.id);
  try{
    adminProduct.collection.deleteOne({"_id":id})
    res.redirect('/admin');
  }
  catch(err){
    console.log(err);
  }
})

app.get('/user',(req,res) => {
  adminProduct.find({},(err,data) => {
    let obj = {
      name: req.session.userData,
      data: data,
    }
      res.render('user',obj);
  })
})

app.post('/admin/addProduct',(req,res) => {
    let product = new adminProduct();
    product.name = req.body.pName;
    product.desc = req.body.pDesc;
    product.qty = req.body.pQty;
    product.price = req.body.pPrice;

    product.save((err) => {
        if(err !== null) {
            res.send('error occured');
        } else {
            res.redirect('/admin');
        }
    })
})

app.post("/user/addProduct",async (req,res) => {
  let docProduct = await adminCart.findOne({userId: req.body.userId,productId: req.body.productId});
  if(docProduct == null) {
    let addProd = new adminCart();
    addProd.userId = req.body.userId;
    addProd.productId = req.body.productId;
    addProd.name = req.body.pName;
    addProd.qty = parseInt(req.body.pQty);
    addProd.price = parseInt(req.body.pPrice);

    addProd.save((err) => {
      if(err !== null) {
        console.log("error occured");
      }
    });
  } else {
    let qty = Number(docProduct.qty) + Number(req.body.pQty);
    await adminCart.collection.updateOne(
      { userId: req.body.userId, productId: req.body.productId },
        {
          $set: { "userId": req.body.userId, "productId": req.body.productId, "name": req.body.pName, "qty": qty, "price": req.body.pPrice}
        },
    ).catch((err) => {
      if(err) {
        console.log("updateOne failed");
      }
    });
    res.redirect('/user');
  }
})

app.post("/checkout",async (req,res) => {
    let isFailed = false;
    let cartProd = await adminCart.find({userId: req.body.userId});
    let adminProd = await adminProduct.find({});
    // console.log(cartProd);
    // console.log(adminProd);
    // console.log(cartProd[0].productId.toString()==adminProd[1]._id.toString());
    // console.log(isFailed);
    for(let i=0;i<cartProd.length;i++) {
        for(let j=0;j<adminProd.length;j++) {
            if (cartProd[i].productId.toString()==adminProd[j]._id.toString()) {
                if (Number(cartProd[i].qty) > Number(adminProd[j].qty)) {
                    isFailed = true;
                    res.send({ err: 'One or more products may be out of stock' });
                }
            }
        }
    }
    if(isFailed == false) {
        for (let i = 0; i < cartProd.length; i++) {
            for (let j = 0; j < adminProd.length; j++) {
                if (cartProd[i].productId.toString()==adminProd[j]._id.toString()) {
                    // console.log(Number(cartProd[i].qty));
                    // console.log(Number(adminProd[j].qty));
                    // console.log(Number(cartProd[i].qty)-Number(adminProd[j].qty));
                    // console.log(Number(cartProd[i].qty) <= Number(adminProd[j].qty));
                    if (Number(cartProd[i].qty) <= Number(adminProd[j].qty)) {
                        let updatedQty = Number(adminProd[j].qty) - Number(cartProd[i].qty);
                        console.log(updatedQty);
                        await adminProduct.updateOne({ _id: cartProd[i].productId },
                            {
                                $set: {"name": adminProd[j].name, "desc": adminProd[j].desc, "qty": updatedQty, "price": adminProd[j].price }
                            }
                        ).catch((err) => {
                            console.log("updateOne failed");
                        })
                    }
                }
            }
        }
        await adminCart.deleteMany({userId: req.body.userId});
        res.send({ err: null });
    }
});

app.get('/thanks',(req,res) => {
  res.render('thanks');
});

app.get("/logout", (req,res) => {
  req.session.destroy();
  res.redirect("/home");
});



app.listen(3000,() => {
  console.log("listening");
});
