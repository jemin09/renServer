
let express=require("express");
let app=express();
app.use(express.json());
app.use(function(req,res,next){
  res.header("Access-Control-Allow-Origin","*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST,OPTIONS,PUT,PATCH,DELETE,HEAD"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept"
  );
  next();
});
var port=process.env.PORT||2410;
app.listen(port,()=>console.log(`Node app Listening on port ${port}`));
let {getConnection}=require("./mobileDatabase.js");

  app.get("/svr/mobiles",function(req,res){
    let Brand=req.query.Brand;
    let RAM=req.query.RAM;
    let ROM=req.query.ROM;
    let connection=getConnection();
    let options="";
    let optionsArr=[];
    console.log("brand=",Brand,"Ram=",RAM);
    if(Brand){
      console.log("in brand");
      let brandArr=Brand.split(","); 
      options=options?`${options} AND Brand IN (?)` : "Brand IN (?)";
      optionsArr.push(brandArr ); 
    }
    if(RAM){
      let RAMArr=RAM.split(",");
      options=options?`${options} AND RAM IN (?)` : "RAM IN (?)";
      optionsArr.push(RAMArr );
    }
    if(ROM){  
      let ROMArr=ROM.split(","); 
      options=options?`${options} AND ROM IN (?)` : "ROM IN (?)";
      optionsArr.push(ROMArr );
    }

    let sql=`SELECT * FROM mobile ${options?"WHERE":""} ${options}`;
    console.log("sql=",sql);
    connection.query(sql,optionsArr,function(err,result){
      if(err) {
        console.log(err);
        res.status(404).send("Error in fetchig data");
      }
      else{
        res.send(result);
      }
    })
  });


  app.get("/svr/mobiles/brand/:brand",function(req,res){
    let brand=req.params.brand;
    console.log("brand=",brand);
    let connection=getConnection();
    let sql="SELECT * FROM mobile WHERE brand=?";
    connection.query(sql,brand,function(err,result){
      if(err){
        console.log(err);
        res.status(404).send("Error in fetching data")
      }
      else res.send(result);
    })
  });
  app.get("/svr/mobiles/RAM/:RAM",function(req,res){
    let RAM=req.params.RAM;
    console.log("RAM=",RAM);
    let connection=getConnection();
    let sql="SELECT * FROM mobile WHERE RAM=?";
    connection.query(sql,RAM,function(err,result){
      if(err){
        console.log(err);
        res.status(404).send("Error in fetching data")
      }
      else res.send(result);
    })
  });
  app.get("/svr/mobiles/ROM/:ROM",function(req,res){
    let ROM=req.params.ROM;
    console.log("ROM=",ROM);
    let connection=getConnection();
    let sql="SELECT * FROM mobile WHERE ROM=?";
    connection.query(sql,ROM,function(err,result){
      if(err){
        console.log(err);
        res.status(404).send("Error in fetching data")
      }
      else res.send(result);
    })
  });
  app.get("/svr/mobiles/OS/:OS",function(req,res){
    let OS=req.params.OS;
    console.log("OS=",OS);
    let connection=getConnection();
    let sql="SELECT * FROM mobile WHERE OS=?";
    connection.query(sql,OS,function(err,result){
      if(err){
        console.log(err);
        res.status(404).send("Error in fetching data")
      }
      else res.send(result);
    })
  });
  app.get("/svr/mobiles/ModelName/:name",function(req,res){
    let name=req.params.name;
    console.log("name=",name);
    let connection=getConnection();
    let sql="SELECT * FROM mobile WHERE name=?";
    connection.query(sql,name,function(err,result){
      if(err){
        console.log(err);
        res.status(404).send("Error in fetching data")
      }
      else res.send(result);
    })
  });

  app.delete("/svr/mobiles/:name",function(req,res){
  let name=req.params.name;
  console.log("name",name)
  let connection=getConnection();
  let sql="DELETE FROM mobile WHERE name=?";
  connection.query(sql,name,function(err,result){
    if(err){
      console.log(err);
      res.status(404).send("Error in deleting data");
    }
    else if(result.affectedRows===0){
      res.status(404).send("No delete happened");
    }
    else res.send("delete success");
  })
  });  
  app.put("/svr/mobiles/:name",function(req,res){
  let name=req.params.name;
  console.log("name=",name);
  let body=req.body;
  let connection=getConnection();
  let sql="UPDATE mobile SET price=?,brand=?,RAM=?,ROM=?,OS=? WHERE name=?";
  let params=[body.price,body.brand,body.RAM,body.ROM,body.OS,name];
  connection.query(sql,params,function(err,result){
    if(err){
      console.log(err);
      res.status(404).send("Error in Updating data");
    }
    else if(result.affectedRows===0){
      res.status(404).send("No update happened");
    }
    else res.send("Update success");
  })
  });
  app.post("/svr/mobiles",function(req,res){
  let body=req.body;
  let connection=getConnection();
  let sql1=`SELECT * FROM mobile WHERE  name=?`;
  connection.query(sql1,body.name,function(err,result){
    if(err){
      console.log(err);
      res.status(404).send("Error in fetching data")
    }
    else if(result.length>0) res.status(404).send(`Name already exists : ${body.name}`);
    else {
      let sql=`INSERT INTO mobile(name,price,brand,RAM,ROM,OS) 
                VALUE (?,?,?,?,?,?)`;
      connection.query(sql,[
        body.name,body.price,body.brand,body.RAM,body.ROM,body.OS],
        function(err,result){
        console.log("result=",result);
        if(err){
          console.log(err);
          res.status(404).send("Error in fetching data")
        }
        else res.send(`Post sucess. name of new Mobile name is ${body.name}`);
      })
    }
  }) 
  });
  app.get("/svr/resetData",function(req,res){
  let connection=getConnection();
  let sql="TRUNCATE TABLE mobile";
  connection.query(sql,function(err,result){
    if(err){
      console.log(err);
      res.status(404).send("Error in delete data");
    }
    else{
      console.log(`Deletion Success.Deleted ${result.affectedRows} rows`);
      let {mobileDataJson}=require("../mobData.js");
      let arr=mobileDataJson.map(st=>[
        st.name,
        st.price,
        st.brand,
        st.RAM,
        st.ROM,
        st.OS
      ]);
      let sql1="INSERT INTO mobile (name,price,brand,RAM,ROM,OS) VALUES ?";
      connection.query(sql1,[arr],function(err,result){
        if(err){
          console.log(err);
          res.status(404).send("Error in inserting data");
        }
        else res.send(`Reset Success.Inserted ${result.affectedRows} rows`);
      })
    }
  })
  })

