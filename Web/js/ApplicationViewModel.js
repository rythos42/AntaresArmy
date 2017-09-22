var ApplicationViewModel = function(armyListXml) {
    var self = this,
        internalAddedModels = ko.observableArray();
    
    self.currentModel = ko.observable();
    self.addedModels = ko.observableArray();
    
    self.models = ko.computed(function() {
        return $(armyListXml).find('section').find('model').map(function(index, modelXml) {
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
    
    self.currentModel.subscribe(function() {
        var model = self.currentModel();
        if(!model)
            return;

        internalAddedModels.push(model);
        self.addedModels.push(new ModelViewModel(model));
        
        self.currentModel(null);
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
};