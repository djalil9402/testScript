let startButton = document.querySelector("#start-btn");
let nextButton = document.querySelector("#next-btn");
let inputUrl = document.querySelector("#url-input");
let warningEl = document.querySelector("#warning");
let injectedEl = document.querySelector("#injected");
let currentpageindicatorEl = document.querySelector("#current-page-indicator");
let clearcookiesbtnEl = document.querySelector("#clear-cookies-btn");
let cerEl = document.querySelector("#cer");
let permission = Notification.permission;

if (permission === "granted") {
  //showNotification();
} else if (permission === "default") {
  requestAndShowPermission();
}

// function initiateProcess() {
//   console.log("process initialted...");
//   chrome.tabs.query({}, function (tabs) {
//     // var activeTab = tabs[0];
//     for (let tab of tabs) {
//       chrome.tabs.sendMessage(tab.id, { message: "start" });
//     }
//   });
// }

document.addEventListener("DOMContentLoaded", async function () {

  chrome.browsingData.remove({
    "origins": ["https://visa.vfsglobal.com", "https://online.vfsglobal.dz"]
  }, {
    "cacheStorage": true,
    "cookies": true,
    "fileSystems": true,
    "indexedDB": true,
    "localStorage": true,
    "serviceWorkers": true,
    "webSQL": true
  }, ()=>{console.log('browsing data cleared for specified hosts')});
    
  inputUrl.addEventListener("input", () => {
    if (inputUrl.value !== "") {
      chrome.storage.local.set({ targetUrl: inputUrl.value }, function () {
        console.log("Website url has been stored");
      });
    }
  });

  nextButton.addEventListener("click", () => {
   createTargetTab();
  });

  clearcookiesbtnEl.addEventListener('click',()=>{
    chrome.runtime.sendMessage({ message: "clear-cookies" });
  })

  cerEl.addEventListener('click',()=>{
    chrome.runtime.sendMessage({ message: "cer" }, async function (response) {
       let fileHandle = await getNewFileHandle();
        await writeFile(fileHandle, "switchip");
    });
  })

  // startButton.addEventListener("click", async () => {
  //   let tabId = await asyncStorageGet("targetTab");
  //   chrome.tabs.update(tabId, { active: true });

  //   startButton.disabled = true;
  //   initiateProcess();
  // });

  chrome.storage.onChanged.addListener(async function (changes, namespace) {
    for (key in changes) {
      if (key === "relatedUserBioArr") {
        let lastIndex = changes.relatedUserBioArr.newValue.length - 1;
        table.addData(changes.relatedUserBioArr.newValue[lastIndex], true);
      }
    }
  });

  chrome.runtime.onMessage.addListener(async function (
    request,
    sender,
    sendResponse
  ) {

    if (request.message === "completed") {
      showNotification();
      currentpageindicatorEl.innerText = "completed"
      chrome.runtime.sendMessage({ message: "clear-cookies" });

      return true;
    }

    if (request.message === "visa.vfsglobal.com-verification") {
      //startButton.style.visibility = "visible";
      console.log("%c received message from 'visa.vfsglobal.com-verification'.","color: teal; font-size:0.7rem; font-style: italic");
      currentpageindicatorEl.innerText = "visa.vfsglobal.com";
      return true;
    }

    if (request.message === "online.vfsglobal.dz-login") {
      //startButton.style.visibility = "visible";
      console.log("%c RM:'online.vfsglobal.dz-login'.","color: teal; font-size:0.7rem; font-style: italic");
      currentpageindicatorEl.innerText = "online.vfsglobal.dz-login";
      return true;
    }

    if (request.message === "online.vfsglobal.dz-purpose") {
      //startButton.style.visibility = "visible";
      console.log("%c RM:'online.vfsglobal.dz-purpose'.","color: teal; font-size:0.7rem; font-style: italic");
      currentpageindicatorEl.innerText = "online.vfsglobal.dz-purpose";
      return true;
    }

    if (request.message === "online.vfsglobal.dz-home") {
      //startButton.style.visibility = "visible";
      console.log("%c RM:'online.vfsglobal.dz-home'.","color: teal; font-size:0.7rem; font-style: italic");
      currentpageindicatorEl.innerText = "online.vfsglobal.dz-home";
      return true;
    }

    if (request.message === "online.vfsglobal.dz-addapplicantbutton") {
      //startButton.style.visibility = "visible";
      console.log("%c RM:'online.vfsglobal.dz-addapplicantbutton'.","color: teal; font-size:0.7rem; font-style: italic");
      currentpageindicatorEl.innerText = "online.vfsglobal.dz-addapplicantbutton";
      return true;
    }

    if (request.message === "online.vfsglobal.dz-fillform") {
      //startButton.style.visibility = "visible";
      console.log("%c RM:'online.vfsglobal.dz-fillform'.","color: teal; font-size:0.7rem; font-style: italic");
      currentpageindicatorEl.innerText = "online.vfsglobal.dz-fillform";
      return true;
    }

  }); 

  // This is where you Inject scripts when page load completes for each link
  chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
    if (changeInfo.status == "complete"){
      if (tab.url.indexOf("visa.vfsglobal.com") != -1 && tabId === (await asyncStorageGet("targetTab"))){
        console.log("%c -> injected script to 'visa.vfsglobal.com-verification'.","color: purple; font-size:0.7rem; font-style: bold");
        injectScript("visa.vfsglobal.com");
      }
      if (tab.url === "https://online.vfsglobal.dz/Global-Appointment/?q=shSA0YnE4pLF9Xzwon%2Fx%2FBGxVUxGuaZP3eMAtGHiEL2OHa0cghQbd9qtRdrxxlTqHtyTC50R3nNcergVei5DDQ%3D%3D" && tabId === (await asyncStorageGet("targetTab"))){
        console.log("%c -> injected script to 'online.vfsglobal.dz-login'.","color: purple; font-size:0.7rem; font-style: bold");
        injectScript("online.vfsglobal.dz-login");
      }
      if (tab.url === "https://online.vfsglobal.dz/Global-Appointment/Home/Index" && tabId === (await asyncStorageGet("targetTab"))){
        console.log("%c -> injected script to 'online.vfsglobal.dz-home'.","color: purple; font-size:0.7rem; font-style: bold");
        injectScript("online.vfsglobal.dz-home");
      }
      if(tab.url === "https://online.vfsglobal.dz/Global-Appointment/Home/SelectVAC?q=dePiaPfL2MJ7yDPEmQRU6fRZbx3aIpSal6PdG3Bxqq7rSNU6HabciCVot9dEwkhd"  && tabId === (await asyncStorageGet("targetTab"))){
        console.log("%c -> injected script to 'online.vfsglobal.dz-purpose'.","color: purple; font-size:0.7rem; font-style: bold");
        injectScript("online.vfsglobal.dz-purpose");
      }
      if(tab.url === "https://online.vfsglobal.dz/Global-Appointment/Applicant/ApplicantList"  && tabId === (await asyncStorageGet("targetTab"))){
        console.log("%c -> injected script to 'online.vfsglobal.dz-addapplicantbutton'.","color: purple; font-size:0.7rem; font-style: bold");
        injectScript("online.vfsglobal.dz-addapplicantbutton");
      }
      if(tab.url === "https://online.vfsglobal.dz/Global-Appointment/Applicant/AddApplicant?q=UANIVQx7R/c71/YfLmm98mEb5JF0icA6V6Yas3MZt754GcCZXhhoxQx/RcJ+XJN/t01RbcEBR4ExFCPAdpUortvAknqNHwZNH9/ai8aeLOqkOHfaIUeWDh3oLhFk9nvGx3l4/3O+W/GEm0C+R8ctNZaSECrVmIbpn/c56syPEtEPCktE8SdQ7ebk1zr6CP1Kq9hUhgI4kB20KVgTWK8YXMIrj9U0Rstwk2/BCih/VJKjqufXov0C8bP8KT1Dv5Md"  && tabId === (await asyncStorageGet("targetTab"))){
        console.log("%c -> injected script to 'online.vfsglobal.dz-fillform'.","color: purple; font-size:0.7rem; font-style: bold");
        injectScript("online.vfsglobal.dz-fillform");
      }
    }
  });

  //Confirm closing of tab with unsaved changes
  window.addEventListener("beforeunload", function (e) {
    closePinnedTab();
    e.preventDefault();
    e.returnValue = "";
  });
});

//opens a new link in the stored target tab
async function updateTargetTab(newurl){
  chrome.tabs.update(await asyncStorageGet("targetTab"), {
    url: newurl,
  });
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


async function closePinnedTab() {
  let tTab = await asyncStorageGet("targetTab");
  chrome.tabs.remove(tTab, () => {});
}

function requestAndShowPermission() {
  Notification.requestPermission(function (permission) {
    if (permission === "granted") {
      showNotification();
    }
  });
}

function showNotification() {
  if (document.visibilityState === "visible") {
    return;
  }
  var title = "infoScraper";
  icon = "icons/48.png";
  var body = "Process completed.";
  var notification = new Notification("Title", { body, icon });
  notification.onclick = () => {
    notification.close();
    window.parent.focus();
  };
}

async function createTargetTab() {
  console.log("::::::: Creating Target Tab :::::::");
  chrome.tabs.create({ url: "https://visa.vfsglobal.com/dza/fr/fra/interim-page" }, async function (newTab) {
    await asyncStorageSet({targetTab: newTab.id});
    chrome.tabs.update(await asyncStorageGet("popupTabId"), { active: true });
  });
}

async function injectScript(domain) {
  let tarTab = await asyncStorageGet("targetTab");
  // chrome.scripting.executeScript({
  //   target: { tabId: tarTab },
  //   files: ["dependencies/async.min.js"], //Injecting dependencies for the conten scripts
  // });

  if(domain === "visa.vfsglobal.com"){
    chrome.scripting.executeScript({
      target: { tabId: tarTab },
      files: ["./contentscripts/verificationcontent.js"],
    });
  }

  if(domain === "online.vfsglobal.dz-login"){
    chrome.scripting.executeScript({
      target: { tabId: tarTab },
      files: ["./contentscripts/logincontentscript.js"],
    });
  }

  if(domain === "online.vfsglobal.dz-home"){
    chrome.scripting.executeScript({
      target: { tabId: tarTab },
      files: ["./contentscripts/homecontent.js"],
    });
  }

  if(domain === "online.vfsglobal.dz-purpose"){
    chrome.scripting.executeScript({
      target: { tabId: tarTab },
      files: ["./contentscripts/purposecontent.js"],
    });
  }

  if(domain === "online.vfsglobal.dz-addapplicantbutton"){
    chrome.scripting.executeScript({
      target: { tabId: tarTab },
      files: ["./contentscripts/addapplicantbuttoncontent.js"],
    });
  }

  if(domain === "online.vfsglobal.dz-fillform"){
    chrome.scripting.executeScript({
      target: { tabId: tarTab },
      files: ["./contentscripts/applicantformcontent.js"],
    });
  }
}

function changeImageContentSetting(pattern, setting) {
  chrome.contentSettings.images.set({
    primaryPattern: pattern,
    setting: setting,
  });
}

async function getNewFileHandle() {
  const options = {
    suggestedName: 'CER.txt',
    types: [
      {
        description: 'Text Files',
        accept: {
          'text/plain': ['.txt'],
        },
      },
    ],
  };
  const handle = await window.showSaveFilePicker(options);
  return handle;
}

async function writeFile(fileHandle, contents) {
  // Create a FileSystemWritableFileStream to write to.
  const writable = await fileHandle.createWritable();
  // Write the contents of the file to the stream.
  await writable.write(contents);
  // Close the file and write the contents to disk.
  await writable.close();
}