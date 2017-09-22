var ArmyListMapper = function() {
    var self = this;
    
    self.load = function(handler) {
        $.ajax({
            url: 'php/ArmyListService.php?action=GetArmyList&army=Concord',
        }).then(function(xml) {
            handler(xml);
        });
    };
};