var ModelViewModel = function(model) {
    var self = this,
        internalAddedOptions = ko.observableArray();
    
    self.name = ko.observable(model.name);
    self.points = ko.observable(model.points);
    self.options = model.options;
    self.model = model;
    
    self.currentOption = ko.observable();
    
    self.addedOptions = ko.computed(function() {
        return $.map(internalAddedOptions(), function(option) {
            return new OptionViewModel(option);
        });
    });
    
    self.currentOption.subscribe(function() {
        var option = self.currentOption();
        if(!option)
            return;
        
        internalAddedOptions.push(self.currentOption());
        self.currentOption(null);
    });
    
    self.totalPoints = ko.computed(function() {
        return internalAddedOptions().reduce(function(acc, option) {
            return acc + option.points;
        }, model.points);
    });
    
    self.deleteOption = function(viewModel) {
        internalAddedOptions.remove(viewModel.option);
    };
    
    self.hasOptions = ko.computed(function() {
        return self.addedOptions().length != 0;
    });
};