var ArmyListMapper = function() {
    var self = this;
    
    self.load = function(factionName, handler) {
        $.ajax({
            url: 'php/ArmyListService.php?action=GetArmyList&army=' + factionName,
        }).then(function(xml) {
            handler(xml);
        });
    };
};