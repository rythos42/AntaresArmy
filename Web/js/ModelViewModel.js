var ModelViewModel = function(model, addedOptions) {
    var self = this,
        internalAddedOptions = ko.observableArray();
    
    self.name = ko.observable(model.name || model.n);
    self.points = ko.observable(model.points || model.p || 0);
    self.origin = ko.observable(model.origin || model.or);
    self.options = model.options || $.map(model.o, function(option) { return new Option(option.n, option.p); });
    self.addedOptions = ko.observableArray();
    
    self.currentOption = ko.observable();
    
    if(addedOptions) {
        self.addedOptions($.map(addedOptions, function(optionViewModelToAdd) {
            return new OptionViewModel(optionViewModelToAdd);
        }));
    }
    
    self.currentOption.subscribe(function() {
        var option = self.currentOption();
        if(!option)
            return;
        
        self.addedOptions.push(new OptionViewModel(option));
        self.currentOption(null);
    });
    
    self.totalPoints = ko.computed(function() {
        return self.addedOptions().reduce(function(acc, option) {
            return acc + option.points();
        }, self.points());
    });
    
    self.deleteOption = function(viewModel) {
        self.addedOptions.remove(viewModel);
    };
    
    self.hasOptions = ko.computed(function() {
        return self.addedOptions().length != 0;
    });
};