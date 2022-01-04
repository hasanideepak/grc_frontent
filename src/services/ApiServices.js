import { encryptData,getCookie, getServerCookie } from "../helpers/Helper"
class ApiService {

    static post = async (type, payload, Component,customHeader=false, handleSuccess, handleError) => {
        let isServer = false;
        if(Component && Component.apiObj){
          let {req} = Component.apiObj
          isServer = !!req
        }
        console.log(type)
        try {

            let token = encryptData(new Date().getTime());
            let config = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload),
              }
            if(customHeader){
              config['headers']['token'] = token
            }
            // if(customHeader || auth){
              if(!isServer){
                let userData = getCookie('currentUserValue')
                userData  = userData ? JSON.parse(userData) : false;
                if(userData){
                  let authToken = `Bearer ${userData.accessToken}`
                  config['headers']['Authorization'] = authToken
                }
              }else{
                let {req} = Component.apiObj
                let userData = getServerCookie(req,'currentUserValue')
                userData  = userData ? JSON.parse(userData) : false;
                if(userData){
                  let authToken = `Bearer ${userData.accessToken}`
                  config['headers']['Authorization'] = authToken
                }
              }
              
              
            // }
          const response = await fetch(`${process.env.REACT_APP_API_URL}auth/login`,config);
          let res = null
          if(payload.responseType && payload.responseType == 'file'){
            console.log("returning file")
            res = await response.arrayBuffer();
          }else{
            res = await response.json();
          }
          
          if(response.status != 200){
            let {serverRes = null} = Component.apiObj
            if (serverRes) {
              serverRes.writeHead(301, {
                Location: '/404'
              });
              serverRes.end();
            }
            return {}
          }
          if (type === 'login_form' || type == 'signup') { 
            if(res.message == 'Success'){
              let token = res.results.accessToken;
              let user = JSON.stringify(res.results);
              token ? handleSuccess({ res, token }) : handleError(res);
            }else{
              return res
            }
          }
          else {
            return res
          }
        }
        catch (err) {
          console.log(err)
          return err;
          
        }
    }

    
    static fetchData = async (url ='', method ='',data= {},customHeader= false,auth=false,formType = '') => {
        if(url == '' && method == ''){
          return false
        }
        try {
            let formData = new FormData();
            if(formType != 'form'){
              if(Object.keys(data).length > 0){
                for (let [key, value] of Object.entries(data)) {
                  formData.append(key,value)
                }
              }
            }else{
              formData = data
            }
            
            let config = {
                method: method,
                // body: formData,
              }
            if(method == 'POST' || method == 'PATCH'){
              config.body = formData
            }
            let userData = getCookie('currentUserValue')
            userData  = userData ? JSON.parse(userData) : false;
            if(userData){
              let authToken = `Bearer ${userData.accessToken}`
              if(!config['headers']){
                config['headers'] = {}
              }
              config['headers']['Authorization'] = authToken
            }
          const response = await fetch(`${url}`,config);
          let res = await response.json();
          return res
        }
        catch (err) {
          console.log(err);
        }
    }
}

export default ApiService