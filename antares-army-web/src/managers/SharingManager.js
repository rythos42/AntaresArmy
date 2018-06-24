var SharingManager = function() {
    var self = this,
        mapper = new ArmyListMapper();
    
    function createShareable(object) {
        var shareableClone = $.map(ko.toJS(object), function(model) {
            var addedOptions = $.map(model.addedOptions, function(option) { return option.name; });
            
            return {
                or: model.origin,
                n: model.name,
                ao: addedOptions.length ? addedOptions : undefined
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
        toastr.success('Text list copied to clipboard.');
    };
    
    
    // TODO: do the original loading too!!
    self.tryLoadFromSharingLink = function(addedModels, loadedFromOldSharingLink) {
        var url = window.location.href;
            regex = new RegExp("[?&]l(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
            
        if (!results || !results[2]) 
            return;
      
        var compressedList = decodeURIComponent(results[2].replace(/\+/g, " "));
        var shareableList = JSON.parse(LZString.decompressFromEncodedURIComponent(compressedList));
        
        // if there is no origin on the decompressed list, load it the old way.
        if(shareableList.length && !shareableList[0].or) {
            addedModels($.map(shareableList, function(modelViewModel) {
                return new ModelViewModel(modelViewModel, modelViewModel.ao);
            }));
            loadedFromOldSharingLink(true);
            return;
        }       
        
        // if there is an origin, load it the new way -- new way saves a lot of space in the URL
        var cachedModelsFromXml;
        var cachedFactionName;
        $.each(shareableList, function(index, shareableModel) {
            // shareableModel is like -- {"or":"Concord","n":"C3 STRIKE SQUAD","ao":["Spotter Drone"]}
            
            // load a new faction from server if not the one we have already
            var armyListLoadingDeferred = $.Deferred();
            if(cachedFactionName !== shareableModel.or) {
                mapper.load(shareableModel.or, function(models) {
                    cachedModelsFromXml = models;
                    armyListLoadingDeferred.resolve(cachedModelsFromXml);
                    cachedFactionName = shareableModel.or;
                });
            } else {
                armyListLoadingDeferred.resolve(cachedModelsFromXml);
            }
            
            armyListLoadingDeferred.then(function(modelsFromXml) {
                var addedViewModel;
                $.each(modelsFromXml, function(index, modelFromXml) {
                    if(modelFromXml.name === shareableModel.n) {
                        // get added options, based on available options from XML
                        var addedOptions = $.map(shareableModel.ao, function(shareableOptionName) {
                            var option;
                            $.each(modelFromXml.options, function(index, optionFromXml) {
                                if(optionFromXml.name === shareableOptionName) {
                                    option = optionFromXml;
                                    return false;
                                }
                                return true;
                            });
                            return option;                        
                        });
                        
                        addedViewModel = new ModelViewModel(modelFromXml, addedOptions);
                        return false;
                    }
                    return true;
                });
                
                // finally, add the created viewmodel to the list
                addedModels.push(addedViewModel);
            });
        });
    };
};