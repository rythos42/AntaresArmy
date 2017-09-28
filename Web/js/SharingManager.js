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