$(function() {
    var disallow = 'none';
    var disp_flg = 0;

    chrome.storage.sync.get({
          robots       : true
        , Canonical    : true
        , Noindex      : true
        , Nofollow     : true
        , None         : true
        , NoArchive    : true
        , NoSnippet    : true
        , NoImageIndex : true
        , AMP : true
        , TagViewerDisp: true
    }, function(items) {

        var showRobots       = items.robots;
        var showCanonical    = items.Canonical;
        var showNoindex      = items.Noindex;
        var showNofollow     = items.Nofollow;
        var showNone         = items.None;
        var showNoArchive    = items.NoArchive;
        var showNoSnippet    = items.NoSnippet;
        var showNoImageIndex = items.NoImageIndex;
        var showAMP = items.AMP;
        var flgTagViewer     = items.TagViewerDisp;

        if ( showRobots ) {
            $.ajax({ url: '/robots.txt', type: 'get', dataType: 'json' })
            .fail(function () {
                if ( errorHandler(arguments).match(/Disallow/i) ) {
                    disallow = '<a href="/robots.txt" target="_blank">robots.txt</a>';
                    disp_flg = 1;
                }
            })
            .always(function () {
                chkItems();
            });
        } else {
            chkItems();
        }

        function chkItems() {
            if ( showCanonical ) {
                var canonical = $("link[rel=canonical]").attr("href");
                var href = window.location.href;
                var canoEx = "" ;
                if( canonical === undefined ) {
                    canoEx = "false";
                    canoHtml = "false";
                } else if( ( canonical.toLowerCase() == href.toLowerCase() ) || ( canonical == decodeURI(href) ) )  {
                    canoEx = "same";
                    canoHtml = "same";
                } else {
                    canoEx = "exsist";
                    canoHtml ="<a href='"+ canonical + "' target='_blank'>" + canonical + "</a>";
                    disp_flg = 1;
                }
            }
            if ( showAMP ) {
                var amp = $("link[rel=amphtml]").attr("href");
                var href = window.location.href;
                var ampEx = "" ;
                if( amp === undefined ) {
                    ampEx = "false";
                    ampHtml = "false";
                } else {
                    ampEx = "exsist";
                    ampHtml ="<a href='"+ amp + "' target='_blank'>" + amp + "</a>";
                    disp_flg = 1;
                }
            }
            var noindex = noarchive = nosnippet = noimageindex = none = nofollow = "false";
            if ( showNoindex || showNoArchive || showNoSnippet || showNoImageIndex || showNone || showNofollow ) {
                $("meta[name=robots]").each(function(){
                    var robots_content = $(this).attr('content');
                    if ( showNoindex && robots_content.match(/noindex/i) ) {
                        noindex = "true";
                        disp_flg = 1;
                    }
                    if ( showNoArchive && robots_content.match(/noarchive/i) ) {
                        noarchive = "true";
                        disp_flg = 1;
                    }
                    if ( showNoSnippet && robots_content.match(/nosnippet/i) ) {
                        nosnippet = "true";
                        disp_flg = 1;
                    }
                    if ( showNoImageIndex && robots_content.match(/noimageindex/i) ) {
                        noimageindex = "true";
                        disp_flg = 1;
                    }
                    if ( showNone && robots_content.match(/none/i) ) {
                        none = "true";
                        disp_flg = 1;
                    }
                    if ( showNofollow && robots_content.match(/nofollow/i) ) {
                        nofollow = "true";
                        disp_flg = 1;
                    }
                });
            }

            if ( disp_flg ) {
                var res = '';
                if ( showRobots ) {
                    res += 'Disallow: <span class="chrome-nofollow-text-false">' + disallow + '</span><br>';
                }
                if ( showCanonical ) {
                    res += 'Canonical: <span class="chrome-canonical-' + canoEx + '">' + canoHtml + '</span><br>';
                }
                if ( showNoindex ) {
                    res += 'NoIndex: <span class="chrome-nofollow-text-' + noindex + '">' + noindex + '</span><br>';
                }
                if ( showNofollow ) {
                    res += 'NoFollow: <span class="chrome-nofollow-text-' + nofollow + '">' + nofollow + '</span><br>';
                }
                if ( showNone ) {
                    res += 'None: <span class="chrome-nofollow-text-' + none + '">' + none + '</span><br>';
                }
                if ( showNoArchive ) {
                    res += 'NoArchive: <span class="chrome-nofollow-text-' + noarchive + '">' + noarchive + '</span><br>';
                }
                if ( showNoSnippet ) {
                    res += 'NoSnippet: <span class="chrome-nofollow-text-' + nosnippet + '">' + nosnippet + '</span><br>';
                }
                if ( showNoImageIndex ) {
                    res += 'NoImageIndex: <span class="chrome-nofollow-text-' + noimageindex + '">' + noimageindex + '</span><br>';
                }
                if ( showAMP ) {
                    res += 'AMP: <span class="chrome-amp-' + ampEx + '">' + ampHtml + '</span><br>';
                }
                var content = $("<div></div>", {
                    "id": "chrome_nofollow_notify",
                    "html": res
                });
                $("body").append(content);
                if ( flgTagViewer ) {
                    $('#chrome_nofollow_notify').addClass('chrome-nofollow-box-open');
                }
            }

            $('#chrome_nofollow_notify, #chrome_nofollow_notify a').click(function(){
                var set_flg;
                $("#chrome_nofollow_notify").toggleClass("chrome-nofollow-box-open");
                if ( $('#chrome_nofollow_notify').hasClass('chrome-nofollow-box-open') ) {
                    set_flg = true;
                } else {
                    set_flg = false;
                }
                chrome.storage.sync.set({ TagViewerDisp : set_flg }, function() {});
            });

            $('a[rel*="nofollow"]').addClass('chrome-nofollow-link');
        }
    });

    function errorHandler(args) {
        var error;
        if (args[2]) {
            try {
                error = $.parseJSON(args[0].responseText).error.toString();
            } catch (e) {
                error = 'parsererror(' + args[2] + '): ' + args[0].responseText;
            }
        } else {
            error = args[1] + '(HTTP request failed)';
        }
        return error;
    }
});
