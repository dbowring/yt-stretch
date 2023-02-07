const PREFIX = "/shorts/";
const PREFIX_LENGTH = PREFIX.length;

const getVideoUrl = (videoId) => `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;

const extractShortVideoId = (url) => {
    const { pathname } = new URL(url);
    if (!pathname.startsWith(PREFIX)) {
        return null;
    }
    return pathname.slice(PREFIX_LENGTH);
};

const getRedirectConfigForYoutubeUrl = (url) => {
    const videoId = extractShortVideoId(url);
    if (videoId === null) {
        return {};
    }
    const redirectUrl = getVideoUrl(videoId);
    return { redirectUrl };
}


const handleBeforeRequest = (requestDetails) => {
    return getRedirectConfigForYoutubeUrl(requestDetails.url);
}

const handleHistoryStateUpdated = (requestDetails) => {
    const { redirectUrl: url } = getRedirectConfigForYoutubeUrl(requestDetails.url);
    if (url) {
        browser.tabs.update(undefined, { url });
    }
}

browser.webRequest.onBeforeRequest.addListener(
    handleBeforeRequest,
    {urls: ["https://www.youtube.com/shorts/*"], types: ["main_frame"]},
    ["blocking"]
);

browser.webNavigation.onHistoryStateUpdated.addListener(handleHistoryStateUpdated)