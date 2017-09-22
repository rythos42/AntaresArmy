var ApplicationViewModel = function(armyListXml) {
    var self = this,
        internalAddedModels = ko.observableArray(),
        armyListXml = ko.observable(),
        mapper = new ArmyListMapper();
    
    self.selectedModel = ko.observable();
    self.addedModels = ko.observableArray();
    self.loaded = ko.observable(false);
    self.selectedFaction = ko.observable();
    self.availableFactions = ko.observableArray(['Concord', 'Freeborn']);
    
    self.models = ko.computed(function() {
        var xml = armyListXml();
        if(!xml)
            return;
        
        return $(xml).find('section').find('model').map(function(index, modelXml) {
            var name = $(modelXml).children('name').html();
            var points = parseInt($(modelXml).children('points').html(), 10);
            var options = $(modelXml).find('option').map(function(index, optionXml) {
                var optionName = $(optionXml).children('name').html();
                var optionPoints = parseInt($(optionXml).children('points').html(), 10);
                return new Option(optionName, optionPoints);
            }); 
            
            return new Model(name, points, options);
        });
    });
    
    self.totalPoints = ko.computed(function() {
        return self.addedModels().reduce(function(acc, model) {
            return acc + model.totalPoints();
        }, 0);
    });
    
    self.deleteModel = function(modelViewModel) {
        internalAddedModels.remove(modelViewModel.model);
        self.addedModels.remove(modelViewModel);
    };
            
    self.selectedModel.subscribe(function(selectedModel) {
        if(!selectedModel)
            return;

        internalAddedModels.push(selectedModel);
        self.addedModels.push(new ModelViewModel(selectedModel));
        
        self.selectedModel(null);
    });
    
    self.selectedFaction.subscribe(function(selectedFaction) {
        mapper.load(selectedFaction, function(xml) {
            armyListXml(xml);
        });
    });
    
    // start off loading the first item in the list    
    mapper.load(self.availableFactions()[0], function(xml) {
        armyListXml(xml);
         self.loaded(true);
    });
};