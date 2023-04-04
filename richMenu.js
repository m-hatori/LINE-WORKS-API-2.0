//リッチメニューの登録
//コンテンツアップロードでアップロードURLを取得
const axios = require("axios");
const Crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const FormData = require('form-data')
const action_JSON = require("./module/LINE_Messaging_API/Action_JSON.js");

const SECRET = JSON.parse(fs.readFileSync("./functions/test/secrets.json", 'utf8'))
const CLIENTID = SECRET.CLIENTID
const SERVICEACCOUNT = SECRET.SERVICEACCOUNT
const BOTID = SECRET.BOTID

const getJWT = () => {
  const privateKeyPath = './functions/test/private_20230306135307.key'
  const header = { alg: 'RS256', typ: 'JWT' }
  const startTime = new Date()
  const endTime = new Date(startTime.getTime() + 1000 * 60 * 30)
  const payload = {
    iss: CLIENTID,
    sub: SERVICEACCOUNT,
    iat: Math.floor(startTime.getTime() / 1000),
    exp: Math.floor(endTime.getTime() / 1000)
  }
  const base64 = json => {
    const jsonStr = JSON.stringify(json)
    const jsonB64 = Buffer.from(jsonStr).toString('base64').replace(/={1,2}$/,"")
    return jsonB64
  }
  const createSignature = data => {
    const sign = Crypto.createSign('RSA-SHA256')
    sign.update(data)
    const privateKey = fs.readFileSync(path.resolve(privateKeyPath), "utf8");
    const signedData = sign.sign(privateKey, 'base64').replace(/={1,2}$/,"")
    return signedData
  }
  const unsignedToken = `${base64(header)}.${base64(payload)}`
  const signature = createSignature(unsignedToken)
  const jwt = `${unsignedToken}.${signature}`
  return jwt
}

const ACCESSTOKEN = (async () => {  
  const assertion = getJWT()
  const uri = "https://auth.worksmobile.com/oauth2/v2.0/token"
  let params = new URLSearchParams()
  params.append('assertion', assertion);
  params.append('grant_type', 'urn:ietf:params:oauth:grant-type:jwt-bearer');
  params.append('client_id', "LCsVO6IU3kh5kNuizhDN");
  params.append('client_secret', "pALJvyU2NI");
  params.append('scope', "bot");

  axios.defaults.headers.method = "POST"
  axios.defaults.headers.post['Content-Type'] = "application/x-www-form-urlencoded;";
  
  //https Post Request
  return await axios.post(uri, params)
    .then((response) => {
      return response.data.access_token
    })
    .catch((error) => {
      if(error.response){
        console.log(`res state: ${error.response.statusText} ${error.response.status}`);
        console.error(`res header: ${error.response.headers}`);
        console.error(`res data: ${JSON.stringify(error.response.data)}`);
      }
      else if (error.request) {
        console.error(error.request);
      } 
      else{
        console.error(error.message);
      }
      console.error(JSON.stringify(error.config));
      return error
    });
})()

const axios_post = async (URL, data) =>{
  axios.defaults.headers.method = "POST"
  axios.defaults.headers.post['Content-Type'] = "application/json; charset=UTF-8";
  axios.defaults.headers.common["Authorization"] = "Bearer " + await ACCESSTOKEN;

  //return await axios.post(URL, data)
  const textdata = JSON.stringify(data)
  //const textdata = data
  return await axios.post(URL, textdata)
    .then((response) => {
      return response
    })
    .catch((error) => {
      console.error(`errror message: ${error.message}`);
      if(error.response){
        //console.log(`res state: ${JSON.stringify(error)}`);        
        console.log(" ");
        console.error(`res header: ${error.response.headers}`);
        console.log(" ");
        console.error(`res data: ${JSON.stringify(error.response.data)}`);
        console.log(" ");
      }
      else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.error(error.request);
      }
      console.error(`Error config: ${JSON.stringify(error.config)}`);
      return error
    });
}
const axios_get = async (URL) =>{  
  axios.defaults.headers.method = "GET"
  axios.defaults.headers.common["Authorization"] = "Bearer " + await ACCESSTOKEN;

  //https Post Request
  return await axios.get(URL)
    .then((response) => {
      return response
    })
    .catch((error) => {
      console.error(`errror message: ${error.message}`);
      if(error.response){
        //console.log(`res state: ${JSON.stringify(error)}`);        
        console.log(" ");
        console.error(`res header: ${error.response.headers}`);
        console.log(" ");
        console.error(`res data: ${error.response.data}`);
        console.log(" ");
      }
      else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.error(error.request);
      }
      console.error(`Error config: JSON.stringify(error.config)`);
      return error
    });
}
const axios_delete = async (URL) =>{
  axios.defaults.headers.method = "GET"
  axios.defaults.headers.common["Authorization"] = "Bearer " + await ACCESSTOKEN;

  //https Post Request
  return await axios.delete(URL)
    .then((response) => {
      return response
    })
    .catch((error) => {
      console.error(`errror message: ${error.message}`);
      if(error.response){
        //console.log(`res state: ${JSON.stringify(error)}`);        
        console.log(" ");
        console.error(`res header: ${error.response.headers}`);
        console.log(" ");
        console.error(`res data: ${error.response.data}`);
        console.log(" ");
      }
      else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.error(error.request);
      }
      console.error(`Error config: JSON.stringify(error.config)`);
      return error
    });
}
const axios_put = async (URL, data) =>{
  axios.defaults.headers.post['Content-Type'] = "application/json; charset=UTF-8";
  axios.defaults.headers.common["Authorization"] = "Bearer " + await ACCESSTOKEN;

  return await axios.put(URL, data)
    .then((response) => {
      return response
    })
    .catch((error) => {
      console.error(`errror message: ${error.message}`);
      if(error.response){
        //console.log(`res state: ${JSON.stringify(error)}`);        
        console.log(" ");
        console.error(`res header: ${error.response.headers}`);
        console.log(" ");
        console.error(`res data: ${JSON.stringify(error.response.data)}`);
        console.log(" ");
      }
      else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.error(error.request);
      }
      console.error(`Error config: ${JSON.stringify(error.config)}`);
      return error
    });
}
const axios_patch = async (URL, data) =>{
  axios.defaults.headers.post['Content-Type'] = "application/json; charset=UTF-8";
  axios.defaults.headers.common["Authorization"] = "Bearer " + await ACCESSTOKEN;

  return await axios.patch(URL, data)
    .then((response) => {
      return response
    })
    .catch((error) => {
      console.error(`errror message: ${error.message}`);
      if(error.response){
        //console.log(`res state: ${JSON.stringify(error)}`);        
        console.log(" ");
        console.error(`res header: ${error.response.headers}`);
        console.log(" ");
        console.error(`res data: ${JSON.stringify(error.response.data)}`);
        console.log(" ");
      }
      else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.error(error.request);
      }
      console.error(`Error config: ${JSON.stringify(error.config)}`);
      return error
    });
}

//リッチメニュー作成
const makeRichMenu = async (data) =>{
  const URL = `https://www.worksapis.com/v1.0/bots/${BOTID}/richmenus`
  const response = await axios_post(URL, data)
  if(response.status !== undefined){
    console.log(`リッチメニュー作成成功: ${response.statusText} ${response.status}`);
    console.log(`リッチメニュー名: ${response.data.richmenuName}  ID: ${response.data.richmenuId}`);
    //console.log(JSON.stringify(response.data));
    return [response.data.richmenuName, response.data.richmenuId]
  }
}
//リッチメニューの構造
const mainMenuStructure = (richmenuName) => {
  return {
    "richmenuName": richmenuName,
    "areas": [
      {
        "action": action_JSON.getPostbackActionWithText(
          {
            "tag": "mainMenu",
            "command": "productsInfo"
          },
          "商品情報表示", //label 
          "商品情報表示", //displayText
          "Open info", //label_eng 最大文字数: 12字
          "Open products info" //displayText_eng 
        ),
        "bounds": {//左1
          "x": 0,
          "y": 0,
          "width": 625,
          "height": 843
        }
      },
      {
        "action": action_JSON.getPostbackActionWithText(
          {
            "tag": "mainMenu",
            "command": "notification"
          }, 
          "商品情報通知", //label
          "商品情報通知", //displayText
          "Notice info", //label_eng
          "Notice products info" //displayText_eng          
        ),
        "bounds": {//左2
          "x": 626,
          "y": 0,
          "width": 625,
          "height": 843
        }
      },
      {
        "action": action_JSON.getPostbackActionWithText(
          {
            "tag": "mainMenu",
            "command": "cart"
          }, 
          "買い物かご表示", //label
          "買い物かご表示", //displayText
          "Open cart", //label_eng
          "Open shopping cart" //displayText_eng            
        ),
        "bounds": {//左3
          "x": 1251,
          "y": 0,
          "width": 625,
          "height": 843
        }
      },
      {
        "action": action_JSON.getPostbackActionWithText(
          {
            "tag": "mainMenu",
            "command": "menu"
          },
          "メニュー", //label
          "メニュー", //displayText
          "Open menu", //label_eng
          "Open menu" //displayText_eng     
        ),
        "bounds": {//左4
          "x": 1876,
          "y": 0,
          "width": 625,
          "height": 843
        }
      }
    ],
    "size": {
      "width": 2500,
      "height": 843
    }
  }  
}
/*
(async () => {
  let p = []
  for(let i = 0 ; i < 11; i++){
    let richmenuName = "richMenuForEmployee"+ i
    let [name, Id] = await makeRichMenu(mainMenuStructure(richmenuName))
    p.push([name, Id])
  }
  console.log(JSON.stringify(p))
})()
*/
//コンテンツアップロード
const uploadContent = async (fileName) =>{
  const URL = `https://www.worksapis.com/v1.0/bots/${BOTID}/attachments`;
  const options = {
    "fileName": fileName
  }
  const response = await axios_post(URL, options)
  if(response.status !== undefined){
    //console.log(`fileId: ${response.data.fileId}`);
    console.log(`uploadUrl: ${response.data.uploadUrl}`);
    //console.log(JSON.stringify(response.data))
    return response.data.uploadUrl
  }
  else{
    return null
  }  
}
//アップロードURLにリッチメニュー画像をアップロード
const uploadImage = async (uploadUrl, filePath) => {  
  const file = fs.readFileSync(filePath);
  
  const form = new FormData()
  form.append('file', file, {filename: filePath})
  
  const config = {
    headers: {
      Authorization: "Bearer " + await ACCESSTOKEN,
      ...form.getHeaders(),
    }
  }

  return await axios.post(uploadUrl, form, config)
    .then((response) => {
      return response.data.fileId
    })
    .catch((error) => {
      if(error.response){
        console.log(`res state: ${error.statusText} ${error.status}`);
        console.error(`res header: ${error.response.headers}`);
        console.error(`res data: ${error.response.data}`);              
      }
      else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.error(error.request);
      } 
      else{
        console.error(error.message);
      }
      console.error(error.config);
      return null
    });    
}
//アップロードした画像のfileIdを指定してリッチメニュー画像を登録
const setRichMenuIm = async (fileId, richMenuId) => {
  const URL = `https://www.worksapis.com/v1.0/bots/${BOTID}/richmenus/${richMenuId}/image`;
  const data = {
    "fileId": fileId,
    "i18nFileIds": [
      {
        "language": "en_US",
        "fileId": fileId
      }
    ]
  }
  return await axios_post(URL, data);
}
/*
(async () => {
  const richmenuIds = [
    ["richMenuForEmployee1","1043569"],
    ["richMenuForEmployee2","1043570"],
    ["richMenuForEmployee3","1043571"],
    ["richMenuForEmployee4","1043572"],
    ["richMenuForEmployee5","1043573"],
    ["richMenuForEmployee6","1043574"],
    ["richMenuForEmployee7","1043575"],
    ["richMenuForEmployee8","1043576"],
    ["richMenuForEmployee9","1043577"],
    ["richMenuForEmployee10","1043578"]
  ]

  const filePaths = [
    "./functions/test/img/employee_1.png",
    "./functions/test/img/employee_2.png",
    "./functions/test/img/employee_3.png",
    "./functions/test/img/employee_4.png",
    "./functions/test/img/employee_5.png",
    "./functions/test/img/employee_6.png",
    "./functions/test/img/employee_7.png",
    "./functions/test/img/employee_8.png",
    "./functions/test/img/employee_9.png",
    "./functions/test/img/employee_10.png"
  ]
  for(let i in richmenuIds){
    let richmenuName = richmenuIds[i][0]
    let richmenuId = richmenuIds[i][1]
    console.log(richmenuName: ${richmenuName} richmenuId: ${richmenuId})

    // ファイルの存在を確認し、ファイルを読み込みます。
    let filePath = filePaths[i]
    if (!fs.existsSync(encodeURI(filePath))) {
      console.error(`File not found at path: ${filePath}`);
      process.exit(1);
    }
    const uploadUrl = await uploadContent(filePath)
    if(uploadUrl === null){
      console.error(`failure Content Upload Content: ${filePath}`);
      process.exit(1);
    }
    
    const fileId = await uploadImage(uploadUrl, filePath)
    if(fileId === null){
      console.error(`failure Content Upload Image: ${filePath}`);
      process.exit(1);
    }
    
    const res = await setRichMenuIm(fileId, richmenuId)
    console.log(`res status: ${response.status}`)
    if(response.status == 204){
      console.log(`Success registering Image: ${filePath}`);
    }
    else{
      console.error(`failure registering Image: ${filePath}`);
    }  
  }
})()
*/

//リッチメニューリストの取得
const getRichMenus = async()=>{
  const URL = `https://www.worksapis.com/v1.0/bots/${BOTID}/richmenus`;
  const response = await axios_get(URL)
  console.log(JSON.stringify(response.data.richmenus))
}
//(async () =>{getRichMenus()})()

//リッチメニューリストの取得
const deleteRichMenus = async(richmenuId)=>{
  const URL = `https://www.worksapis.com/v1.0/bots/${BOTID}/richmenus/${richmenuId}`;
  const response = await axios_delete(URL)
  console.log(JSON.stringify(response.status))
}
/*
(async () =>{
  const richmenuIds = [
  ]
  for(let richmenuId of richmenuIds){
    await deleteRichMenus(richmenuId)
  }  
})()
*/

// リッチメニュー画像の取得
const getRichMenusImg = async (richmenuId) =>{
  const URL = `https://www.worksapis.com/v1.0/bots/${BOTID}/richmenus/${richmenuId}/image`;
  const response = await axios_get(URL)
  console.log(JSON.stringify(response.data))
}
//(async () =>{getRichMenusImg(1043568)})()

//Bot取得
const getBot = async()=>{
  const URL = `https://www.worksapis.com/v1.0/bots/${BOTID}`;
  const response = await axios_get(URL)
  console.log(JSON.stringify(response.data))
}
//(async () =>{getBot()})()

//Bot更新 デフォルトリッチメニュー設定
const updatesBot = async()=>{
  const URL = `https://www.worksapis.com/v1.0/bots/${BOTID}`;
  const data = {
    "botName": "LINE受注通知",
    "photoUrl":"https://developers.worksmobile.com/gateway/image/view?path=/k/wauth/r/jp1.10056017/bot_profile/1661818020199/929838_090700.png",
    "description": "8、13、15時に、\n未入力の受注の件数を、\n特定のトークルームにのみ通知します。\n※現状OP課専用です。",
    "administrators": [
      "b7cc0068-4479-4160-1037-04d6b35b7f30",
      "6cb7f834-4916-473b-1a87-04a9be08110a"
    ],
    "subadministrators": [],
    "allowDomains": [0],
    "enableCallback": true,
    "callbackEvents": [
      "text",
      "location",
      "sticker",
      "image",
      "file"
    ],
    "callbackUrl": "https://script.google.com/macros/s/AKfycbyKTtMDssPzusVlkn4Fz4cnFqgYfT0X2bdfv2pQtYtdOaYjfgbzm9iZKGfeYxsC-GIx/exec",
    "enableGroupJoin": true,
    "defaultRichmenuId": "1043568",
    "i18nBotNames": [],
    "i18nDescriptions": [],
    "i18nPhotoUrls": []
  }
  const response = await axios_put(URL, data)
  console.log(`res status: ${response.status}`)
  //console.log(JSON.stringify(response.data))
}
//(async () =>{updatesBot()})()

//Bot部分更新 デフォルトリッチメニュー設定
const updateBot = async()=>{
  const URL = `https://www.worksapis.com/v1.0/bots/${BOTID}`;
  const data = {
    "defaultRichmenuId": "1043568"    
  }
  const response = await axios_patch(URL, data)
  console.log(JSON.stringify(response.data))
}
//(async () =>{updateBot()})()


//●●●固定メニュー●●●
//固定メニュー 登録
//https://developers.worksmobile.com/jp/reference/bot-persistentmenu-create?lang=ja
const action_PersistentMenu = () => {
  return {
    "action": [
      action_JSON.getMessageActionWithPostBack(
        {
          "tag": "mainMenu",
          "command": "productsInfo"
        },
        "商品情報表示", //label 
        "商品情報表示", //displayText
      ),
      action_JSON.getMessageActionWithPostBack(
        {
          "tag": "mainMenu",
          "command": "notification"
        }, 
        "商品情報通知", //label
        "商品情報通知", //displayText
      ),
      action_JSON.getMessageActionWithPostBack(
        {
          "tag": "mainMenu",
          "command": "cart"
        }, 
        "買い物かご表示", //label
        "買い物かご表示", //displayText
      ),
      action_JSON.getMessageActionWithPostBack(
        {
          "tag": "mainMenu",
          "command": "menu"
        },
        "メニュー", //label
        "メニュー", //displayText
      )
    ]
  }
}
const makePersistentMenu = async () =>{
  const URL = `https://www.worksapis.com/v1.0/bots/${BOTID}/persistentmenu`
  console.log(`URL: ${URL}`)
  /*
  const data = {
    "content": action_PersistentMenu()
  }
  */
  const data =  {
    "content": {
      "actions": [
        {
          "type": "message",
          "label": "Example label",
          "text": "Example text",
          "postback": "Examplepostback",
          "i18nLabels": [
            {
              "language": "en_US",
              "label": "Example label"
            }
          ],
          "i18nTexts": [
            {
              "language": "en_US",
              "text": "Example text"
            }
          ]
        }
      ]
    }
  }

  const response = await axios_post(URL, data)
  if(response.status !== undefined){
    console.log(`リッチメニュー作成成功: ${response.statusText} ${response.status}`);
    console.log(`response.data: ${JSON.stringify(response.data)}`);
    console.log(`リッチメニュー名: ${response.data.richmenuName}  ID: ${response.data.richmenuId}`);
  }
}
//(async () => makePersistentMenu())()

const deletePersistentMenu = async () =>{
  const URL = `https://www.worksapis.com/v1.0/bots/${BOTID}/persistentmenu`
  console.log(`URL: ${URL}`)
  /*
  const data = {
    "content": action_PersistentMenu()
  }
  */

  const response = await axios_delete(URL)
  if(response.status !== undefined){
    console.log(`固定メニュー削除 成功: ${response.statusText} ${response.status}`);
    console.log(`response.data: ${JSON.stringify(response.data)}`);
  }
}
//(async () => deletePersistentMenu())()