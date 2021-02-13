// Handle runtime.lastError
function handleError() {
  if (chrome.runtime.lastError != null) {
    console.log(chrome.runtime.lastError);
  }
}

// Create context menus
function createContextMenus() {
  // Create twitter context menus
  const TWITTER_IMAGE_URL = "*://pbs.twimg.com/media/*";
  let parentId = chrome.contextMenus.create({
    contexts: ["image"],
    id: "twitterImages",
    targetUrlPatterns: [TWITTER_IMAGE_URL],
    title: "Twitter Image",
    visible: true
  }, handleError);
  let childId = chrome.contextMenus.create({
    contexts: ["image"],
    id: "twitterSaveImage",
    parentId: parentId,
    targetUrlPatterns: [TWITTER_IMAGE_URL],
    title: "Save Image",
    visible: true
  }, handleError);
  childId = chrome.contextMenus.create({
    contexts: ["image"],
    id: "twitterSaveAllImages",
    parentId: parentId,
    targetUrlPatterns: [TWITTER_IMAGE_URL],
    title: "Save All Images",
    visible: true
  }, handleError);
}

// Handle context menus
function contextMenusHandler(info, tab) {
  // Twitter images
  if (info.parentMenuItemId === "twitterImages") {
    // Save twitter image
    if (info.menuItemId === "twitterSaveImage") {
      const imageUrl = new URL(info.srcUrl);
      const searchParameters = imageUrl.searchParams;
      // https://pbs.twimg.com/media/Et37m_lVoAAwXkb?format=jpg&name=240x240
      if (searchParameters.has("format") && searchParameters.has("name")) {
        searchParameters.set("name", "orig");
        imageUrl.search = searchParameters.toString();
        let fileName = imageUrl.path.split("/").pop() + "." + searchParameters.get("format");
        chrome.downloads.download({
          conflictAction: "prompt",
          filename: fileName,
          url: imageUrl
        }, (downloadId) => {
          if (downloadId === undefined) {
            handleError();
          }
        });
      }
      // https://pbs.twimg.com/media/Et37m_lVoAAwXkb.jpg:orig
      else if (true) {
        
      }
    }
  }
}


chrome.contextMenus.onClicked.addListener(contextMenusHandler);