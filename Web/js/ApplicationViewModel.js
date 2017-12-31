var ApplicationViewModel = function(armyListXml) {
    var self = this,
        internalAddedModels = ko.observableArray(),
        armyListXml = ko.observable(),
        mapper = new ArmyListMapper();
    
    self.selectedModel = ko.observable();
    self.addedModels = ko.observableArray();
    self.loaded = ko.observable(false);
    self.selectedFaction = ko.observable();
    self.availableFactions = ko.observableArray(['Concord', 'Freeborn', 'Algoryn', 'Isorian', 'Boromite', 'Ghar Empire', 'Ghar Rebel']);
    
    self.models = ko.computed(function() {
        var xml = armyListXml();
        if(!xml)
            return;
        
        var models = $(xml).find('section').find('model').map(function(index, modelXml) {
            var name = $(modelXml).children('name').html();
            var points = parseInt($(modelXml).children('points').html(), 10);
            var options = $(modelXml).find('option').map(function(index, optionXml) {
                var optionName = $(optionXml).children('name').html();
                var optionPoints = parseInt($(optionXml).children('points').html(), 10);
                return new Option(optionName, optionPoints);
            }); 
            
            return new Model(name, points, options);
        });
        
        var availableArmyOptions = [];
        availableArmyOptions.push(new Option('Block!', 5));
        availableArmyOptions.push(new Option('Extra Shot', 10));
        availableArmyOptions.push(new Option('Superior Shard', 15));
        availableArmyOptions.push(new Option('Well Prepared', 5));
        availableArmyOptions.push(new Option('Get Up!', 10));
        availableArmyOptions.push(new Option('Pull Yourself Together!', 15));
        availableArmyOptions.push(new Option('Marksman', 15));
        models = $(new Model('Army Options', 0, availableArmyOptions)).add(models);
        
        return models;
    });
    
    self.totalPoints = ko.computed(function() {
        return self.addedModels().reduce(function(acc, model) {
            return acc + model.totalPoints();
        }, 0);
    });
    
    self.hasModels = ko.computed(function() {
        return self.addedModels().length != 0;
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