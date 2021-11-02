chrome.runtime.sendMessage({ message: "online.vfsglobal.dz-login" });

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse){
  if(request.message === 'captcha-result-login'){
    finishLoginAfterCaptchaResult();
  }
});

(async function initiateIIFE() {
  await loginPage();
})();

async function loginPage(){
  try{

    await waitForSelector('#recaptcha-anchor > div.recaptcha-checkbox-border');

    await waitFor(3000);

    //Show Hidden textarea
    document.querySelector("#g-recaptcha-response").style.display = "block";

    chrome.runtime.sendMessage({ message: "captcha-start" });

  }catch(error){
    console.log('Error in logincontentScript : ' + error + '. Retrying...')
    initiateIIFE();
  }
}


//============ content related ===============

async function finishLoginAfterCaptchaResult(){

  let captchaResult = await asyncStorageGet("captchaResult");

  //Insert the result in the g-recaptcha  
  document.querySelector("#g-recaptcha-response").innerHTML = captchaResult;

  await waitFor(3000);
  
  //click submit at the end
  document.querySelector("#ApplicantListForm > div.frm-button > input").click();
}

async function waitFor(delay) {
  console.log("delayed for : " + delay);
  return await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
}

async function waitForSelector(selector){
  return await new Promise((resolve, reject) => {
    let count = 1;
    let timer = setInterval(() => {
      let seconds = millisToMinutesAndSeconds(count * 100);

      if (document.querySelector(selector) !== null || seconds === "10") {
        clearInterval(timer);
        console.log("wairForSelector resolved");
        resolve();
      }

      count++;
    }, 100);

    function millisToMinutesAndSeconds(millis) {
      //var minutes = Math.floor(millis / 60000);
      var seconds = ((millis % 60000) / 1000).toFixed(0);
      return seconds;
    }
  });
}

function customxpath(path) {
  return document.evaluate(
    path,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
}

async function asyncStorageGet(item) {
  var getValue = new Promise(function (resolve, reject) {
    chrome.storage.local.get(item, (data) => {
      console.log(
        "%c StorageItem Retreived Sucessfully",
        "color: brown; font-style: italic"
      );
      resolve(data[item]);
    });
  });

  let gV = await getValue;
  return gV;
}

async function AsyncStorageSet(item) {
  new Promise(function (resolve, reject) {
    chrome.storage.local.set(item, () => {
      console.log(
        `%c StorageItem set ${{ item }} Sucessfully`,
        "color: brown; font-style: italic"
      );
      resolve();
    });
  });
}

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}


