var AuditLog = function(params){
    var defaultOptions = {
      pathSeparator : ".",
      arrayIndicator: ["[", "]"],
      excludeProperties : [],
      deletedProperty:"deleted"
    };

    const options = Object.assign({}, defaultOptions, params);

    var generateLogs = function(json, path, allLogs) {
        for (var idx=0; json.length > idx; idx++){
            var obj = json[idx];
            buildLog(obj, path, allLogs);
        }
    };

    var buildLog = function(jsonObj, path, allLogs){
        if(hasChangesProp(jsonObj)){
            path = addKeyToPath(jsonObj,path) + options.pathSeparator;
            generateLogs(jsonObj.changes, path, allLogs);
        } else if(jsonObj){
            if(eligibleForAuditLog(jsonObj.key)){
                if(jsonObj.key == options.deletedProperty){
                    jsonObj.type = "Remove";
                }
                jsonObj.key = addKeyToPath(jsonObj,path);
                allLogs.push(jsonObj);
            }
        }
    };

    var addKeyToPath = function(jsonObj, path){
        if(_.isNaN(parseInt(jsonObj.key))) path += jsonObj.key;
        else {
            path = arrayIdentifier(jsonObj.key, path);
        }
        return path;
    };

    var arrayIdentifier = function(prop, path){
        if(_.isArray(options.arrayIndicator) && options.arrayIndicator.length === 2){
            if(_.lastIndexOf(path, options.pathSeparator) === (path.length-1)){
                path = path.substr(0,path.length-1);
            }
            prop = options.arrayIndicator[0] + prop + options.arrayIndicator[1];
        }
        return path + prop;
    };

    var hasChangesProp = function(obj){
        return  obj.hasOwnProperty("changes");
    };

    var eligibleForAuditLog = function(property){
        return ! _.contains(options.excludeProperties, property);
    };

    var generateLogTrail = function(oldObj, newObj){
        oldObj = JSON.parse(oldObj);
        newObj = JSON.parse(newObj);
        var diffJson = JSON.parse(changeset.calculateDiff(oldObj, newObj));
        var allLogs = [];
        generateLogs(diffJson,"", allLogs);
        return allLogs;
    };
    return { generateLogTrail:generateLogTrail};
}();