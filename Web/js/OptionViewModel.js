var OptionViewModel = function(option) {
    var self = this;
    
    self.name = ko.observable(option.name || option.n);
    self.points = ko.observable(option.points || option.p || 0);
};