// this will display on a widget the TIDES from SHOM data

// variables

let todayDate 
let todayH 
let todayHt  
let todayCoef 
let todayH1 
let todayHt1 
let todayCoef1 
let todayH2 
let todayHt2 
let todayCoef2
let todayH3 
let todayHt3 
let todayCoef3 

let LoadImg


// Import Data json from SHOM

let json = await new Request("your SHOM data").loadJSON()

// set todays Date

let today = new Date()

let df = new DateFormatter()

df.dateFormat = "dd/MM/yyyy"

let dataT = df.string(today)

//  loop to search data that match the date and collect it then apply GMT function to hour then replace extra "" and convert to string

for (let i = 0; i < 365; i++){  
  
  if (json[i].date == dataT)
  { 
    
 todayDate =JSON.stringify(json[i].date).replace(/"/g,"")
 todayH = GMT(JSON.stringify(json[i].Heure).replace(/"/g,"")) 
 todayHt = JSON.stringify(json[i].hauteur).replace(/"/g,"")
 todayCoef = JSON.stringify(json[i].coef).replace(/"/g,"")
 todayH1 = GMT(JSON.stringify(json[i].Heure1).replace(/"/g,""))
 todayHt1 = JSON.stringify(json[i].hauteur1).replace(/"/g,"")
 todayCoef1 = JSON.stringify(json[i].coef1).replace(/"/g,"")
 todayH2 = GMT(JSON.stringify(json[i].Heure2).replace(/"/g,""))
 todayHt2 = JSON.stringify(json[i].hauteur2).replace(/"/g,"")
 todayCoef2 = JSON.stringify(json[i].coef2).replace(/"/g,"")
 todayH3 = GMT(JSON.stringify(json[i].Heure3).replace(/"/g,""))
 todayHt3 = JSON.stringify(json[i].hauteur3).replace(/"/g,"")
 todayCoef3 = JSON.stringify(json[i].coef3).replace(/"/g,"")
  break;}
}

//  apply function to define PM or BM

PBM = WPBM(todayHt)
PBM1 = WPBM(todayHt1)
PBM2 = WPBM(todayHt2)
PBM3 = WPBM(todayHt3)

// check if img has been already created today so no need to request API to create new one

let datecheck = dataT.replace(/\//g, "_") + ".png"

let fm1 = FileManager.iCloud()
let path1 = fm1.documentsDirectory() + "/" + datecheck

if (fm1.fileExists(path1) == 0){
// if img doesnt exist, start creating a new one

// set the html of table
    let html = `
    <body>
    <table>
      <tr>
        <th>TD</th>
        <th>Hour</th>
        <th>Ht</th>
        <th>Coef</th>
      </tr>
      <tr>
        <td>${PBM}</td>
        <td>${todayH}</td>
        <td>${todayHt}</td>
        <td>${todayCoef}</td>
      </tr>
      <tr>
        <td>${PBM1}</td>
        <td>${todayH1}</td>
        <td>${todayHt1}</td>
        <td>${todayCoef1}</td>
      </tr>
      <tr>
        <td>${PBM2}</td>
        <td>${todayH2}</td>
        <td>${todayHt2}</td>
        <td>${todayCoef2}</td>
      </tr>
      <tr>
        <td>${PBM3}</td>
        <td>${todayH3}</td>
        <td>${todayHt3}</td>
        <td>${todayCoef3}</td>
      </tr>
      </table>
      </body>  
    `
   // set css of table 
    
    let css = `
    
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;800&display=swap');
    
    body { 
      background-color: transparent;
    }
    
    table {
      border-collapse: collapse;
      background-color: transparent;
      overflow: hidden;
      width: 500px;
      border-radius: 0px;
    }
    
    th, td {
      font-family:'Montserrat', 'sans-serif';
      text-align: center;
      font-size: 50px;
      padding: 3px;
    }
    
    th {
      background-color: transparent;
      color: white;
    }
    
    td {
      color: white;
    }
    `  
    // generate IMG from html table with API HCTI
    
    let BetterRequest = importModule("BetterRequest");
        
    let B64 = "" // base64 encoded string of ID +":"+ PSWD
    
    let req = new BetterRequest("https://hcti.io/v1/image?");
    
    req.method = "post";
    
    req.headers = { 
    "Authorization" : "Basic " + B64
    }
     
    req.body = {
        "html": html,
         "css": css 
    }
    
    let img = await req.loadJSON();
    
    let Imgurl = img.url+ ".png"
    
    log(Imgurl)
    
    LoadImg = await new Request(Imgurl).loadImage() // get img from URL
    
    // SAVE IMG
    
    let fm = FileManager.iCloud()
    var nameImg = dataT.replace(/\//g, "_") + ".png"
    let path =fm.documentsDirectory()
    path = `${path}/${nameImg}`
    fm.writeImage(path, LoadImg)
    }else if (fm1.fileExists(path1) == 1){  // if IMG exists load it from Cloud
      
     LoadImg = fm1.readImage(path1)  
      }

//  create widget

let w = new ListWidget()

w.backgroundColor = new Color("22212c")
 
w.addText(todayDate)

let stack = w.addStack()// 
stack.layoutVertically()// 
stack.addImage(LoadImg)

Script.setWidget(w)// 
Script.complete()// 
w.presentSmall()

// Functions

// all hour are GMT 0, function to add 1h or 2h during summer

function GMT(DateToFormat){ 
   
   if (DateToFormat == "--:--") {   
    DateToFormat = "--:--"
    return DateToFormat
  }
  
  else {
  
   let df1 = new DateFormatter()
   let now = new Date()
   let year = now.getFullYear()
   let GMT1 = new Date(year + "-10-30")
   let GMT2 = new Date(year + "-03-28")
  
   df1.dateFormat = "HH:mm"
  
   dateh1 = df1.date(DateToFormat)
  
   if (now > GMT2 && now < GMT1)
   {
    let hour = dateh1.getHours()  
    dateh1.setHours(hour + 2)
    dateh2 = df1.string(dateh1)
   }
   else { 
    let hour = dateh1.getHours()
    dateh1.setHours(hour + 1)
    dateh2 = df1.string(dateh1)
   }  
    return dateh2    
  }  
}

// define is the TIDE is lowest (BM = Basse Mer) or highest (PM = Pleine Mer)

function WPBM(ht){ 
let PBM
if (ht == "---"){ 
  PBM = "---"  
  return PBM
}
else { 
  if (ht < 3){  
    PBM = "BM"    
  }  
  else if (ht > 3){  
    PBM = "PM"    
 }return PBM
}
}

