const https = require('https')
const http = require('http')
const {promises: fsPromises} = require('fs')
const fs = require('fs')
const snap = require('red-snapper')
const express = require('express')
const path = require('path')

const app = express()

app.use(express.static(path.join(__dirname, 'public')))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

//---------------------------------

const banner = process.argv.indexOf('-nb')
let myBanner

if (banner > -1) {
    myBanner = process.argv[banner + 1]
}
const noBanner = (myBanner || 'yes')

if (noBanner != 'no'){

console.log(`

                                             █████                    
                                            ░░███                     
  ███████ ████████   ██████   ████████    ███████  ████████   ██████  
 ███░░███░░███░░███ ░░░░░███ ░░███░░███  ███░░███ ░░███░░███ ░░░░░███ 
░███ ░███ ░███ ░░░   ███████  ░███ ░███ ░███ ░███  ░███ ░███  ███████ 
░███ ░███ ░███      ███░░███  ░███ ░███ ░███ ░███  ░███ ░███ ███░░███ 
░░███████ █████    ░░████████ ████ █████░░████████ ░███████ ░░████████
 ░░░░░███░░░░░      ░░░░░░░░ ░░░░ ░░░░░  ░░░░░░░░  ░███░░░   ░░░░░░░░ 
 ███ ░███                                          ░███               
░░██████                                           █████              
 ░░░░░░                                           ░░░░░               

`)
}

//---------------------------------
if (process.argv[2] && process.argv[2] == '--help') {
  console.log(`
  Developer assume no liability and are not responsible for any misuse or damage.

  -u        Enter the url with this switch, example: -u mysite.com
  
  -s        Enter the status code with this switch, example: -s 200,301,403...
  
  -f        Enter the subdomain file list path, example: -f list.txt  (default list subdomains_brute.txt)

  -ns no    If you don't want to see the result on the web as a GUI, use this switch.

  -nsh no   If you don't want to take screenshots of subdomains, use this switch.

  -nb no    With this switch, the banner will not be displayed.

  -ds       Specify the delay in each screenshot with this switch, example: -ds 2000 (2000 means 2 seconds and is set to 1 seconds by default.)
 
  `)
  process.exit(1)
}

//------------------------------------------

const myStatus = process.argv.indexOf('-s')
let userStatus
if (myStatus > -1) {
  userStatus = process.argv[myStatus + 1]
}
const defaultStatus = (userStatus || '200')
const spl = defaultStatus.split(',')

//------------------------------------------

const brutePath = process.argv.indexOf('-f')
let myPath

if (brutePath > -1) {
  myPath = process.argv[brutePath + 1]
}
const userPath = (myPath || 'subdomains_brute.txt')

//------------------------------------------

const urlPath = process.argv.indexOf('-u')
let myUrl

if (urlPath > -1) {
    myUrl = process.argv[urlPath + 1]
}
const userUrl = myUrl

//------------------------------------------

const getServer = process.argv.indexOf('-ns')
let myServer

if (getServer > -1) {
    myServer = process.argv[getServer + 1]
}
const noServer = (myServer || 'runServer')

//------------------------------------------

const scshots = process.argv.indexOf('-nsh')
let myScShots

if (scshots > -1) {
    myScShots = process.argv[scshots + 1]
}
const noScshots = (myScShots || 'runScreen')
//------------------------------------------

const delay = process.argv.indexOf('-sd')
let myDelay

if (delay > -1) {
    myDelay = process.argv[delay + 1]
}
const setDelay = (myDelay || '1000')
//------------------------------------------

let allUrl = []
let httpsImageSrc = []
let httpImageSrc = []

async function asyncReadFile(filename) {
    const contents = await fsPromises.readFile(filename, 'utf-8')
    const subdomain = contents.split(/\r?\n/)

    // for create folder
    if(noScshots != 'no'){
        fs.mkdir(`public/${userUrl}/images`, { recursive: true }, (error) => {})
    }else{
        fs.mkdir(`public/${userUrl}`, { recursive: true }, (error) => {})
    }
    fs.writeFile(`public/${userUrl}/subdomains_enum.txt`, '', function (err) {})

    subdomain.forEach(sub => {
        
        // https request
        let httpsurl = `https://${sub}.${userUrl}/`
        let httpurl = `http://${sub}.${userUrl}/`
            https.get(httpsurl, (resp) => {
                let myResp = resp.statusCode.toString()
                let index = spl.indexOf(myResp)
                if(index != -1){
                     // for add url path to file
                     fs.appendFile(`public/${userUrl}/subdomains_enum.txt`, `${httpsurl}\n`, (err) => {
                        if (err) {
                          console.log(err)
                        }
                    })
                    console.log(httpsurl)
                    if(noScshots != 'no'){
                    snap({
                        url: httpsurl,
                        width: 1920,
                        height: 1080,
                        delay: setDelay,
                        format: 'png'
                    }).then((data) => {
                        fs.writeFileSync(`public/${userUrl}/images/https-${sub}.png`, Buffer.from(data, 'base64'))
                    }).catch((error) => {
                        console.error(error)
                    })
                    httpsImageSrc.push(`${userUrl}/images/https-${sub}.png`)
                    }
                    allUrl.push(httpsurl)
                }
            }).on('error', (err) => {})

            //http request
            http.get(httpurl, (resp) => {
                let myResp = resp.statusCode.toString()
                let index = spl.indexOf(myResp)
                if(index != -1){
                    // for add url path to file
                    fs.appendFile(`public/${userUrl}/subdomains_enum.txt`, `${httpurl}\n`, (err) => {
                        if (err) {
                          console.log(err)
                        }
                    })
                    console.log(httpurl)
                    if(noScshots != 'no'){
                    snap({
                        url: httpurl,
                        width: 1920,
                        height: 1080,
                        delay: setDelay,
                        format: 'png'
                    }).then((data) => {
                        fs.writeFileSync(`public/${userUrl}/images/http-${sub}.png`, Buffer.from(data, 'base64'))
                    }).catch((error) => {
                        console.error(error)
                    })
                    httpImageSrc.push(`${userUrl}/images/http-${sub}.png`)
                    }
                    allUrl.push(httpurl)
                }
            }).on('error', (err) => {})
})
    return subdomain
}
asyncReadFile(userPath)

if(noServer != 'no'){
    app.get('/', (req, res) => {
        res.render('index', {
            allUrl,
            httpsImageSrc,
            httpImageSrc,
        })
    })
    app.listen(3000, () => {})
}