var SharingManager = function() {
    var self = this;
    
    function createShareable(object) {
        var shareableClone = $.map(ko.toJS(object), function(model) {
            return {
                n: model.name,
                p: model.points,
                o: $.map(model.options, function(option) {
                    return {
                        n: option.name,
                        p: option.points
                    };
                }),
                ao: $.map(model.addedOptions, function(option) {
                    return {
                        n: option.name,
                        p: option.points
                    };
                })
            };
        });
        
        var json = ko.toJSON(shareableClone);
        return LZString.compressToEncodedURIComponent(json);
    }
    
    function getLink(compressedList) {
        return window.location.protocol + '//' + window.location.host + window.location.pathname + '?l=' + compressedList;
    }
    
    self.shareToFacebook = function(addedModels) {
        var compressedList = createShareable(addedModels());
        
        FB.ui({
            method: 'share',
            href: getLink(compressedList),
        }, function(response){});
    };
    
    self.shortenUrl = function(addedModels, callback) {
        var compressedList = createShareable(addedModels()),
            link = getLink(compressedList);
            
        gapi.client.urlshortener.url.insert({ 'longUrl': link }).execute(function (response) {
            callback(response.id);
        });
    };
        
    self.copyShortenedUrlToClipboard = function() {
        try {
            $('#ShortenedUrlTextArea').select();
            document.execCommand("copy");  // Security exception may be thrown by some browsers.
            toastr.success('Shareable link copied to clipboard.');
        } catch (ex) {
            toastr.error('Your browser does not support copying.');
        }
    };
    
    function copyToClipboard(text) {
        if (window.clipboardData && window.clipboardData.setData) {
            // IE specific code path to prevent textarea being shown while dialog is visible.
            return clipboardData.setData("Text", text); 

        } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
            var textarea = document.createElement("textarea");
            textarea.textContent = text;
            textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
            document.body.appendChild(textarea);
            textarea.select();
            try {
                return document.execCommand("copy");  // Security exception may be thrown by some browsers.
            } catch (ex) {
                console.warn("Copy to clipboard failed.", ex);
                return false;
            } finally {
                document.body.removeChild(textarea);
            }
        }
    }
    
    self.copyListToClipboard = function(addedModels) {
        var list = '', total = 0;
        var shareableClone = $.each(addedModels(), function(index, model) {
            list += model.name() + ' (' + model.points() + ')';
            
            $.each(model.addedOptions(), function(index, option) {
                list += ', ' + option.name() + ' (' + option.points() + ')';
            });
            
            list += ' == ' + model.totalPoints() + '\r\n';
            total += model.totalPoints();
        });
        list += 'Total: ' + total;
        copyToClipboard(list);
    };
    
    self.tryLoadFromSharingLink = function(addedModels) {
        var url = window.location.href;
            regex = new RegExp("[?&]l(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
            
        if (!results || !results[2]) 
            return;
      
        var compressedList = decodeURIComponent(results[2].replace(/\+/g, " "));
        var list = JSON.parse(LZString.decompressFromEncodedURIComponent(compressedList));
        
        addedModels($.map(list, function(modelViewModel) {
            return new ModelViewModel(modelViewModel, modelViewModel.ao);
        }));
    };
};