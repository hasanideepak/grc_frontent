import crypto from 'crypto'
import cookieCutter  from 'cookie-cutter'

export const encryptData = (data = '') =>{
    if(data == ''){
        return data
    }
    console.log(process.env.REACT_APP_ENCRYPT_KEY)
    let iv = crypto.randomBytes(16).toString('hex').slice(0, 16);
    let mykey = crypto.createCipheriv('aes-128-cbc', process.env.REACT_APP_ENCRYPT_KEY,iv);
    let token = mykey.update((data).toString(), 'utf8', 'hex')
    token += mykey.final('hex');

    return token
}
export const decryptData = (token = '') =>{
    if(token == ''){
        return token
    }

    let iv = crypto.randomBytes(16).toString('hex').slice(0, 16);
    var mykey = crypto.createDecipheriv('aes-128-cbc', process.env.REACT_APP_ENCRYPT_KEY,iv);
	  var data = mykey.update((token).toString(), 'hex', 'utf8')
	  data += mykey.final('utf8');
    // console.log(data)
    return data
}

export const GetCookie = (cookieName = '') =>{
    if(!cookieName || cookieName == ''){
        return false;
    }

    // Get a cookie
    let getCookie = cookieCutter.get(cookieName)
    return getCookie ? getCookie : false
}
export const GetServerCookie = (req,cookieName = '') =>{
    if(!cookieName || cookieName == ''){
        return false;
    }

    // let  cookies = new Cookies(req)
    // // Get a cookie
    // let getCookie = cookies.get(cookieName);
    // getCookie = getCookie ? decodeURIComponent(`${getCookie}`) : null
    // return getCookie ? getCookie : false
}

export const SetCookie = (cookieName = '',value,options = null) =>{
    if(!cookieName || cookieName == '' || !value || value == ''){
        return false;
    }
    if(options == null){
        options = {}
        options.path = '/'
    }else{
        if(!options.path){
            options.path = '/'
        }
    }
    // Set a cookie
    let setCookie = cookieCutter.set(cookieName, value,options)
    return setCookie ? setCookie : false
}

export const DelCookie = (cookieName = '') =>{
    if(!cookieName || cookieName == ''){
        return false;
    }

    // Delete a cookie
    let setCookie = cookieCutter.set(cookieName, '', { expires: new Date(0),path:'/' })
    return setCookie ? setCookie : false

}

export const DetRandomColor = ()=>{
    var letters = "0123456789ABCDEF"; 
    // let colors = ['#bcc6cca6','#7d7d7d94','#ee7e01','#b1d8ec', '#00b8ff', '#309e7b','']
    let colors = ['#7d7d7d94','#e31e1e8c','#b1d8ec', '#00b8ff', '#309e7b','#ffc107']
    let selColor = colors[Math.floor(Math.random() * colors.length)]
    return selColor
}

export const DetInitials = (str = '')=>{
    if(str == ''){
      return 'HH'
    }
    let name = str.split(' ');
    let fInitial  = name[0] ? name[0].substr(0,1) : '#';
    let lInitial  = name[1] ? name[1].substr(0,1) : '';
    let result = `${fInitial} ${lInitial}`
    return result
}
  
export const DetShareUrl = (socialPlatform='',type='',data=null) =>{
    
    let url = '' 
    let publicUrl = process.env.siteUrl;
    if(socialPlatform == '' || type == '' || data == null || (data.user == {} && data.credential == {})){
      url = 'javascript:void(0)'
      return url
    }

    let title = 'HelioHire user and credential view'
    let summary = 'User and its credential view page'
    let source = 'HelioHire'

    switch(type){
      case 'profile':
        publicUrl += `profile/${data.user.slug}`;
        title = 'HelioHire User Profile'
        summary = 'User Page'
        source = 'HelioHire.COM'
      break;
      case 'credential':
        publicUrl += `profile/${data.user.slug}/credential/${data.credential.credential_slug}`;
        title = 'HelioHire Credential Page'
        summary = 'Credential Page'
        source = 'HelioHire.COM'
      break;
      case 'gen_credential':
        publicUrl += `profile/credential/${data.credential.credential_slug}`;
        title = 'HelioHire Credential General Detail Page'
        summary = 'Credential General Detail Page'
        source = 'HelioHire.COM'
      break;
      case 'user_credentials':
        publicUrl += `profile/credentials/${data.user.slug}`;
        title = 'HelioHire Users Credentials Page'
        summary = 'Users credential Page'
        source = 'HelioHire.COM'
      break;
      
      case 'job':
        // publicUrl += `jobs/referenceNumber/${encodeURIComponent('q='+data.job.referenceNumber)}`;
        publicUrl += `jobs/referenceNumber/${data.job.referencenumber ? data.job.referencenumber : data.job.referenceNumber}`;
        title = 'HelioHire Job Page'
        summary = 'Job Page'
        source = 'HelioHire.COM'
      break;
      case 'industry':
        publicUrl += `top-credentials/${data?.industry?.slug}`;
        title = 'HelioHire industry Page'
        summary = 'Industry Page'
        source = 'HelioHire.com'
      break;
      case 'custom_page':
        publicUrl += `top-credentials/${data?.industry?.page_url}`;
        title = 'HelioHire Custom Page'
        summary = 'Custom Page'
        source = 'HelioHire.com'
      break;
      case 'all':
        data.credential = !data.credential ? {name:'',credentialsId:0} : data.credential
        data.credential.name = data.credential.name.replace(/ /gi,'-')
        data.credential.name = data.credential.name.toLowerCase()
        // data.credential.name = data.credential.name.replace(/-/gi,'z_da')
        publicUrl += `profile/${data.user.slug}/credential/${data.credential.slug}`;
      break;
    }
    switch(socialPlatform){
      case 'linkedin':
        url = `https://www.linkedin.com/shareArticle?mini=true&url=${publicUrl}&title=${title}&summary=${summary}&source=${source}`;
      break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${publicUrl}&text=${title}&hashtags=css,html`;
      break;
      case 'facebook':
        url = `https://www.facebook.com/sharer.php?u=${publicUrl}&text=${title}&hashtags=css,html`;
      break;
    }
    return url
}

export const SanitizeHtml = (htmlStr = null,textMode = true,thirdPartyJob = false) =>{
    let result = '';
    if(htmlStr == null){
        return result
    }
    if(textMode){
        let div = document.createElement("DIV");
        div.innerHTML = htmlStr;
        result = div.innerText;
        return result.replace('<h3>','').replace('</h3>','').replace('<h1>','').replace('</h1>','');
    }else{
        result = htmlStr.split("↵↵").join('<br />');
        // result = htmlStr.replace(/↵/, '<br/>');
        // result = htmlStr.replace(/\u21B5/g, '<br/>');
        if(thirdPartyJob){
            result = result.split(".").join('.<br/> ');
        }
        return result
    }
    
}

export const ChangeDateFormat = (date, type = 1, dateStr = false,format = 0) => {
    /*
        type:
        1 = 'a day ago format'
        2 = 'Y-m-d fromat' 
        3 = 'return date Object {year:123,month:12,date:12,hour:1,min:1, sec:01}' 
     */
    let customFormat = ''
    if (type == 1) {
      let pDate = new Date();
      if (dateStr) {
        pDate = new Date(date);
      } else {
        pDate = new Date(date);
        // date = date.replace(/ /g,'T')
        // date = date.replace(/Z/g,'')
        // let dateArr = date.split('T');
        // let tempDtArr = dateArr[0].split('-')
        // let tempTimeArr = dateArr[1].split(':')
        // dateArr = [...tempDtArr, ...tempTimeArr]
        // let dateObj = { year: dateArr[0], mon: dateArr[1] - 1, date: dateArr[2], hour: dateArr[3], min: dateArr[4], sec: dateArr[5] }
        // pDate = new Date(Date.UTC(dateObj.year, dateObj.mon, dateObj.date, dateObj.hour, dateObj.min, dateObj.sec));
      }
      
      customFormat = pDate;
      var cDate = new Date();
      var timeDiff = (cDate.getTime() - pDate.getTime()) / 1000;
      var day = 24 * 60 * 60;
      var d = (timeDiff) / day;
      if (d > 1) {
        customFormat = ChangeDateFormat(date, 2,false,format)
      }
      else {
        customFormat = CalcTime(2, timeDiff)
      }
    }
    else {
      let pDate = new Date(date);
      customFormat = pDate;
      var Y = pDate.getFullYear();
      var m = pDate.getMonth();
      var monArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
      // m = ('00'+m).slice(-2);
      let d = pDate.getDate();
      d = ('00' + d).slice(-2);
      var H = pDate.getHours();
      H = ('00'+((H < 12) ? H : H - 12)).slice(-2);
      var amOrPm = (pDate.getHours() < 12) ? "AM" : "PM";
      var i = pDate.getMinutes();
      i = ('00'+ i).slice(-2);
      var s = pDate.getSeconds();
      s = ('00'+ s).slice(-2);
      /*
        format
        0 = Mar 01 2021
        1 = 07:00 PM Mar 4 2021
       */
      switch(format){
        case 0:
            customFormat = `${monArr[m]} ${d} ${Y}`;
        break;
        case 1:
            customFormat = `${H}:${i} ${amOrPm} ${monArr[m]} ${d} ${Y} `;
        break;
        default:
            customFormat = `${monArr[m]} ${d},${Y} ${H}:${i}`;
        break;
      }
      
    }
    return customFormat;
  }

  export const CalcTime = (type = 0, timeDiff = 0) => {
    let result = false;
    let time;
    let timeAlias;
    let tempTime;
    // type => 0 = seconds,1 = minutes,2 = hours
    switch (type) {
      case 0:
        time = 1;
        tempTime = timeDiff / time;
        timeAlias = 'sec'
        break;
      case 1:
        time = 60
        tempTime = timeDiff / time;
        timeAlias = 'min'
        break;
      case 2:
        time = 60 * 60
        tempTime = timeDiff / time;
        timeAlias = 'hr';
        break;
      default:
        timeAlias = 'Just Now'
    }

    if (tempTime < 1) {
      result = CalcTime(type - 1, timeDiff)
    }
    else {
      if (timeAlias == 'Just Now') {
        result = timeAlias
      }
      else {
        result = `${Math.floor(tempTime)} ${timeAlias} ago`;
      }
      // result = result > 1 ? result+'s':result;    
    }
    return result;
  }

  export const IsValidImgUrl = async (url,prefix = '') =>{
    return await new Promise((resolve,reject)=>{
        var img = new Image();
        let result = false
        img.onload = function() {resolve(true) };
        img.onerror= function() {resolve(false) };
        img.src = prefix+url;
    })
    
  }

  export const FetchUrlInfo = (url = '') =>{
    if(url == ''){
        return false
    }
    // url = 'http://www.youtube.com/watch?v=ClkQA2Lb_iE';
    let { hostname } = new URL(url);
    return hostname
  }
  
  export const FormatPhoneNumber = (e= null,number = '') => {
        let ele = e ? e.target : e
        var tempNum = ('' + number).replace(/\D/g, '');
        let matchPattern;
        if(tempNum.length >= 12){
            tempNum = tempNum.slice(0,12)
            matchPattern = new RegExp(/^(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})$/) 
        }else if(tempNum.length == 11){
            matchPattern = new RegExp(/^(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,4})$/) 
        }else{
            matchPattern = new RegExp(/^(\d{0,3})(\d{0,3})(\d{0,4})$/) 
        }
        var match = tempNum.match(matchPattern);
        if (match) {
            let intlCode = '';
            let newFormat = ''
            if(tempNum.length > 10){
                intlCode = (match[1] ? `+${match[1]} ` : '');
                newFormat = [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('')
            }else{
                if(match[1] && match[2] && match[3]){
                    newFormat = ['(', match[1], ') ', match[2], '-', match[3]].join('')
                }else if(match[1] && match[2]){
                    newFormat = ['(', match[1], ') ', match[2]].join('') 
                }else if(match[1]){
                    newFormat = ['(', match[1]].join('') 
                }
            }
            if(ele){
                ele.value = newFormat
            }else{
                return newFormat
            }
        }
        return null;
  }

  export const FormatDate = (e= null,number = '',formatType = 0) => {
        /*
            0 default mm/dd/yyyy format
            1 yyyy-mm-dd format 
        */
        switch(formatType){
            case 0 :
            break;
            case 1 :
                if(number && number.length > 0){
                    let tempDate = number;
                    tempDate = tempDate.split('T')
                    tempDate = tempDate[0].split('-')
                    number = [ tempDate[1], '/', tempDate[2], '/', tempDate[0]].join('')
                }
            break;
        }
        let ele = e ? e.target : e
        var tempNum = ('' + number).replace(/\D+/g, '');
        let matchPattern =  new RegExp(/^(\d{0,2})(\d{0,2})(\d{0,4})$/);
        if(tempNum.length >= 8){
            tempNum = tempNum.slice(0,8)
        }
        var match = tempNum.match(matchPattern);
        if (match) {
            let intlCode = '';
            let newFormat = '';
            if(match[1] && match[2] && match[3]){
                newFormat = [ match[1], '/', match[2], '/', match[3]].join('')
            }else if(match[1] && match[2]){
                newFormat = [ match[1], '/', match[2]].join('')
            }else if(match[1]){
                newFormat = [ match[1]].join('')
            }
            if(ele){
                ele.value = newFormat
            }else{
                return newFormat
            }
        }
        return null;
  }

  export const OnImgErr = (ev = null,type='institution') =>{
    if(ev == null){
        return false
    }
    switch(type){
        case 'institution':
            ev.target.onerror = null; 
            ev.target.src= `${process.env.s3ImgUrl}institutions/default-inst.png`
        break;
        case 'degree':
            ev.target.onerror = null; 
            ev.target.src= `${process.env.siteUrl}assets/img/deg_default_icon.png`
        break;
        default:
            ev.target.onerror = null;
            ev.target.src= `${process.env.s3ImgUrl}institutions/default-inst.png`
        break;
    }
    return
  }

  export const GenMD5Hash = (str = '') =>{
        let result = ''
        if(!str || str.length == 0){
            return false
        }

        let md5Hash = crypto.createHash('md5').update(str).digest("hex");
        result = md5Hash ? md5Hash : '';
        return result
  }
  
  

