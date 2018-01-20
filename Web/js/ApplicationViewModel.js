var ApplicationViewModel = function(gapiLoaded) {
    var self = this,
        armyList = ko.observable(),
        mapper = new ArmyListMapper(),
        sharing = new SharingManager();
    
    self.selectedModel = ko.observable();
    self.addedModels = ko.observableArray();
    self.loaded = ko.observable(false);
    self.selectedFaction = ko.observable();
    self.availableFactions = ko.observableArray(['Concord', 'Freeborn', 'Algoryn', 'Isorian', 'Boromite', 'Ghar Empire', 'Ghar Rebel']);
    self.shortenedUrl = ko.observable(null);
    self.showLinkSharing = ko.observable(false);
    self.loadedFromOldSharingLink = ko.observable(false);
    
    self.models = ko.computed(function() {
        var models = armyList();
        return models ? models : undefined;
    });
    
    self.totalPoints = ko.computed(function() {
        return self.addedModels().reduce(function(acc, model) {
            return acc + model.totalPoints();
        }, 0);
    });
    
    self.hasModels = ko.computed(function() {
        return self.addedModels().length != 0;
    });
        
    self.hasShortenedUrl = ko.computed(function() {
        return self.shortenedUrl() !== null;
    });
    
    self.deleteModel = function(modelViewModel) {
        self.addedModels.remove(modelViewModel);
    };
    
    self.facebookShareList = function() {
        sharing.shareToFacebook(self.addedModels);
    };
    
    self.shortenUrl = function() {
        sharing.shortenUrl(self.addedModels, function(shortenedUrl) {
            self.shortenedUrl(shortenedUrl);
        });
    };
    
    self.copyUrlToClipboard = function() {
        sharing.copyShortenedUrlToClipboard();
    };
    
    self.copyListToClipboard = function() {
        sharing.copyListToClipboard(self.addedModels);
    };
            
    self.selectedModel.subscribe(function(selectedModel) {
        if(!selectedModel)
            return;

        var modelViewModel = new ModelViewModel(selectedModel);
        modelViewModel.currentOption.subscribe(function() {
            self.shortenedUrl(null);
        });
        
        self.addedModels.push(modelViewModel);
        
        self.selectedModel(null);
        self.shortenedUrl(null);
    });
    
    self.selectedFaction.subscribe(function(selectedFaction) {
        mapper.load(selectedFaction, function(parsedArmyList) {
            armyList(parsedArmyList);
            self.loaded(true);
        });
        
        if(self.loadedFromOldSharingLink()) {
            // set origin on existing models
            $.each(self.addedModels(), function(index, addedModel) {
                addedModel.origin(selectedFaction);
            });
        }
    });
    
    gapiLoaded.subscribe(function(isLoaded) {
        if(isLoaded)
            self.showLinkSharing(true);
    });
    
    // start off loading the first item in the list    
    self.selectedFaction(self.availableFactions()[0]);
    
    sharing.tryLoadFromSharingLink(self.addedModels, self.loadedFromOldSharingLink);
};