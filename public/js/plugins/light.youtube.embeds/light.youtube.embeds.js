
/* Light YouTube Embeds by @labnol */
/* Web: http://labnol.org/?p=27941 */

document.addEventListener("DOMContentLoaded",
    function () {
        var div, n,
            v = document.getElementsByClassName("youtube-player-autoload");
        for (n = 0; n < v.length; n++) {
            div = document.createElement("div");
            div.setAttribute("data-id", v[n].dataset.id);
            div.innerHTML = labnolThumb(v[n].dataset.id);
            div.onclick = labnolIframe;
            v[n].appendChild(div);
        }
    });



function youtube_parser(url) {
    if (typeof url !== 'undefined' && typeof url !== null) {
        // var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
        var match = url.match(regExp);
        return (match && match[1].length == 11) ? match[1] : false;
    } else {
        return false;
    }

}

function startEmbeder(elementID, videoId) {

    var cleanedVideoID = youtube_parser(videoId);
    console.log('cleanedVideoID: ', cleanedVideoID);
    
    var div, element = document.getElementById(elementID);
    if (cleanedVideoID !== false) {
        div = document.createElement("div");
        div.setAttribute("data-id", cleanedVideoID);
        div.innerHTML = labnolThumb(cleanedVideoID);
        div.onclick = labnolIframe;
        element.appendChild(div);
        return true;
    }else if (typeof element !== 'undefined') {
        element.style.display = 'none';
    }
    return false;
}
function labnolThumb(id) {
    var thumb = '<img src="https://i.ytimg.com/vi/ID/hqdefault.jpg">',
        play = '<div class="play"></div>';
    return thumb.replace("ID", id) + play;
}

function labnolIframe() {
    var iframe = document.createElement("iframe");
    var embed = "https://www.youtube.com/embed/ID?autoplay=1";
    iframe.setAttribute("src", embed.replace("ID", this.dataset.id));
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("allowfullscreen", "1");
    this.parentNode.replaceChild(iframe, this);
}