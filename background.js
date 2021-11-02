try {

  clearCookies();
  
  chrome.runtime.onMessage.addListener(async function (
    request,
    sender,
    sendResponse
  ) {
    if(request.message === 'clear-cookies'){
      clearCookies();
    }

    if(request.message === 'captcha-start'){
      initiateCaptchaSolver();
    }
  });

  chrome.action.onClicked.addListener(function (tab) {
    var popupUrl = chrome.runtime.getURL("/popup.html");
    chrome.tabs.query({ url: popupUrl }, async function (tabs) {
      if (tabs.length > 0) {
        //The popup exists
        // let winId = await asyncStorageGet("popupTabId");
        // chrome.tabs.update(winId);
      } else {
        chrome.tabs.create(
          {
            url: chrome.runtime.getURL("popup.html"),
          },
          async function (tab) {
            await asyncStorageSet({ popupTabId: tab.id });
          }
        );
      }
    });
  });
} catch (e) {
  //log error
  console.log("catchblock : " + e);
}

function clearCookies(){
  console.log('Clearing Cookies...');
  chrome.cookies.remove({url: "https://vfsglobal.com" , name:  '_ga'                 });
  chrome.cookies.remove({url: "https://vfsglobal.com" , name:  'OptanonConsent'      });
  chrome.cookies.remove({url: "https://vfsglobal.com" , name:  '_gat_UA-114055881-1' });
  chrome.cookies.remove({url: "https://vfsglobal.com" , name:  '_gid'                });
  
  chrome.cookies.remove({url: "https://online.vfsglobal.dz" , name:  'AWSALB'});
  chrome.cookies.remove({url: "https://online.vfsglobal.dz/Global-Appointment" , name:  'ASP.NET_SessionId'});
  chrome.cookies.remove({url: "https://online.vfsglobal.dz" , name:  '__RequestVerificationToken_L0dsb2JhbC1BcHBvaW50bWVudA2'});
  chrome.cookies.remove({url: "https://online.vfsglobal.dz/Global-Appointment" , name:  '_culture'});
  chrome.cookies.remove({url: "https://online.vfsglobal.dz" , name:  'sess_map'});
  chrome.cookies.remove({url: "https://online.vfsglobal.dz/Global-Appointment" , name:  '.ASPXFORMSAUTH'});
  chrome.cookies.remove({url: "https://online.vfsglobal.dz" , name:  'AWSALBCORS'});
  chrome.cookies.remove({url: "https://online.vfsglobal.dz/Global-Appointment" , name:  '_Role'});
  chrome.cookies.remove({url: "https://online.vfsglobal.dz" , name:  '.ASPXFORMSAUTH'});
  chrome.cookies.remove({url: "https://online.vfsglobal.dz" , name:  'sess_gui'});

  chrome.cookies.remove({url: "https://.vfsglobal.dz" , name:  '_ga'});
  chrome.cookies.remove({url: "https://.vfsglobal.dz" , name:  '_gid'});
  chrome.cookies.remove({url: "https://.vfsglobal.dz" , name:  'dtCookie'});
  chrome.cookies.remove({url: "https://.vfsglobal.dz" , name:  'dtLatC'});
  chrome.cookies.remove({url: "https://.vfsglobal.dz" , name:  'dtPC'});
  chrome.cookies.remove({url: "https://.vfsglobal.dz" , name:  'dtSa'});
  chrome.cookies.remove({url: "https://.vfsglobal.dz" , name:  'rxVisitor'});
  chrome.cookies.remove({url: "https://.vfsglobal.dz" , name:  'rxvt'});
  console.log('cookies cleared.');
}

async function asyncStorageGet(item) {
  var getValue = new Promise(function (resolve, reject) {
    chrome.storage.local.get(item, (data) => {
      resolve(data[item]);
    });
  });

  let gV = await getValue;
  return gV;
}

async function asyncStorageSet(item) {
  new Promise(function (resolve, reject) {
    chrome.storage.local.set(item, () => {
      resolve();
    });
  });
}

//============== azcaptcha =====================

async function initiateCaptchaSolver(){
  let captchaId = await createTask();
  let captchaResult = await pollTaskResult(captchaId);
  await sendResultToLogin(captchaResult);
}

async function createTask(){
  console.log('captcha task started..');
  // Optionally the request above could also be done as
  let _key = 'ss8vxpypchl0g4r6lgqxbdem3ifjwfjo';
  let _googlekey = '6Ld-Kg8UAAAAAK6U2Ur94LX8-Agew_jk1pQ3meJ1';
  let _method = 'userrecaptcha';
  let _pageurl = 'https://online.vfsglobal.dz/Global-Appointment/?q=shSA0YnE4pLF9Xzwon%2Fx%2FBGxVUxGuaZP3eMAtGHiEL2OHa0cghQbd9qtRdrxxlTqHtyTC50R3nNcergVei5DDQ%3D%3D';

  try{
    let res = await fetch("http://azcaptcha.com/in.php?key=ss8vxpypchl0g4r6lgqxbdem3ifjwfjo&method=userrecaptcha&googlekey=6Ld-Kg8UAAAAAK6U2Ur94LX8-Agew_jk1pQ3meJ1&pageurl=https://online.vfsglobal.dz/Global-Appointment/?q=shSA0YnE4pLF9Xzwon%2Fx%2FBGxVUxGuaZP3eMAtGHiEL2OHa0cghQbd9qtRdrxxlTqHtyTC50R3nNcergVei5DDQ%3D%3D&json=1");
    if(res.status  === 200){
      let data = await res.json();
      console.log({data});
      return data.request;
    }else{
      console.log('something went wrong in createTask');
    }

  }catch(e){
    console.log('error in create task fetch ' + e);
  }
}

async function pollTaskResult(id, delay = 10000, attempts = 25) {
  console.log('Polling for result...');
  try {
    await new Promise(r => setTimeout(r, delay))
    for (let i = 0; i <= attempts; i++) {
      const res = await getTaskResult(id);
      console.log("Attempt : " + i + ' , poll res: ' + res);
      if (res) return res;
      await new Promise(r => setTimeout(r, delay));
    }
  } catch (err) {
    throw new Error(err.message)
  }
  throw new Error(`Timed out getting result after ${(delay * attempts) / 1000}s.`);
}

async function getTaskResult(current_task_id){
  let res = await fetch(`http://azcaptcha.com/res.php?id=${current_task_id}&key=ss8vxpypchl0g4r6lgqxbdem3ifjwfjo&action=get`);
  let resultcap = await res.text();
  console.log({resultcap});

  if (res.status === 200) {
    if (resultcap === 'CAPCHA_NOT_READY') {
      return 0
    }
    console.log('Result Success');
    console.log(resultcap.substring(3));
    return resultcap.substring(3);
  }
}

async function sendResultToLogin(result){
  await asyncStorageSet({ captchaResult : result});
  chrome.tabs.query({active: true}, function (tabs) {
    for (let tab of tabs) {
      chrome.tabs.sendMessage(tab.id, { message: "captcha-result-login" });
    }
  });
}

//============== azcaptcha =====================