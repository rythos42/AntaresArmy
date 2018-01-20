var ArmyListMapper = function() {
    var self = this;
    
    self.load = function(factionName, handler) {
        $.ajax({
            url: 'php/ArmyListService.php?action=GetArmyList&army=' + factionName,
        }).then(function(xml) {
            handler(parseArmyListXml(factionName, xml));
        });
    };
    
    function parseArmyListXml(factionName, armyListXml) {
        var models = $(armyListXml).find('section').find('model').map(function(index, modelXml) {
            var name = $(modelXml).children('name').html();
            var points = parseInt($(modelXml).children('points').html(), 10);
            var options = $.map($(modelXml).find('option'), function(optionXml) {
                var optionName = $(optionXml).children('name').html();
                var optionPoints = parseInt($(optionXml).children('points').html(), 10);
                return new Option(optionName, optionPoints);
            });
            
            return new Model(name, points, options, factionName);
        });
        
        var availableArmyOptions = [];
        availableArmyOptions.push(new Option('Block!', 5));
        availableArmyOptions.push(new Option('Extra Shot', 10));
        availableArmyOptions.push(new Option('Superior Shard', 15));
        availableArmyOptions.push(new Option('Well Prepared', 5));
        availableArmyOptions.push(new Option('Get Up!', 10));
        availableArmyOptions.push(new Option('Pull Yourself Together!', 15));
        availableArmyOptions.push(new Option('Marksman', 15));
        models = $(new Model('Army Options', 0, availableArmyOptions, factionName)).add(models);
        
        return models;
    }
};