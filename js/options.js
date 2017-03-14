function save_options() {
    chrome.storage.sync.set({
          robots      : document.getElementById('robots').checked
        , Canonical   : document.getElementById('Canonical').checked
        , Noindex     : document.getElementById('Noindex').checked
        , Nofollow    : document.getElementById('Nofollow').checked
        , None        : document.getElementById('None').checked
        , NoArchive   : document.getElementById('NoArchive').checked
        , NoSnippet   : document.getElementById('NoSnippet').checked
        , NoImageIndex: document.getElementById('NoImageIndex').checked
    }, function() {
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });
}
function restore_options() {
    chrome.storage.sync.get({
          robots      : true
        , Canonical   : true
        , Noindex     : true
        , Nofollow    : true
        , None        : true
        , NoArchive   : true
        , NoSnippet   : true
        , NoImageIndex: true
    }, function(items) {
        document.getElementById('robots').checked       = items.robots;
        document.getElementById('Canonical').checked    = items.Canonical;
        document.getElementById('Noindex').checked      = items.Noindex;
        document.getElementById('Nofollow').checked     = items.Nofollow;
        document.getElementById('None').checked         = items.None;
        document.getElementById('NoArchive').checked    = items.NoArchive;
        document.getElementById('NoSnippet').checked    = items.NoSnippet;
        document.getElementById('NoImageIndex').checked = items.NoImageIndex;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);