/**
 * This JS file is created via minimal changes of another library "diff-json" to meet the needs
 * https://github.com/viruschidai/diff-json/
 *
 */

(function() {
        var  addKeyValue, applyArrayChange, applyBranchChange, applyLeafChange, compare, compareArray, compareObject, comparePrimitives, convertArrayToObj, exports, getKey, getTypeOfObj, indexOfItemInArray, isEmbeddedKey, modifyKeyValue, parseEmbeddedKeyValue, removeKey, revertArrayChange, revertBranchChange, revertLeafChange, changeset;
        changeset = {
            VERSION: '0.1.4'
        };
        if (typeof module === 'object' && module.exports) {
            _ = require('lodash');
            module.exports = exports = changeset;
        } else {
            this.changeset = changeset;
        }
        getTypeOfObj = function(obj) {
            if (typeof obj === 'undefined') {
                return 'undefined';
            }
            if (obj === null) {
                return null;
            }
            return Object.prototype.toString.call(obj).match(/^\[object\s(.*)\]$/)[1];
        };
        getKey = function(path) {
            var ref;
            return (ref = path[path.length - 1]) != null ? ref : '$root';
        };
        compare = function(oldObj, newObj, path, embededObjKeys, keyPath) {
            var changes, diffs, typeOfNewObj, typeOfOldObj;
            changes = [];
            typeOfOldObj = getTypeOfObj(oldObj);
            typeOfNewObj = getTypeOfObj(newObj);
            if (typeOfOldObj !== typeOfNewObj) {
                changes.push({
                    type: changeset.op.REMOVE,
                    key: getKey(path),
                    value: oldObj
                });
                changes.push({
                    type: changeset.op.ADD,
                    key: getKey(path),
                    value: newObj
                });
                return changes;
            }
            switch (typeOfOldObj) {
                case 'Date':
                    changes = changes.concat(comparePrimitives(oldObj.getTime(), newObj.getTime(), path));
                    break;
                case 'Object':
                    diffs = compareObject(oldObj, newObj, path, embededObjKeys, keyPath);
                    if (diffs.length) {
                        if (path.length) {
                            changes.push({
                                type: changeset.op.UPDATE,
                                key: getKey(path),
                                changes: diffs
                            });
                        } else {
                            changes = changes.concat(diffs);
                        }
                    }
                    break;
                case 'Array':
                    changes = changes.concat(compareArray(oldObj, newObj, path, embededObjKeys, keyPath));
                    break;
                case 'Function':
                    break;
                default:
                    changes = changes.concat(comparePrimitives(oldObj, newObj, path));
            }
            return changes;
        };
        compareObject = function(oldObj, newObj, path, embededObjKeys, keyPath, skipPath) {
            var addedKeys, changes, deletedKeys, diffs, i, intersectionKeys, j, k, l, len, len1, len2, newKeyPath, newObjKeys, newPath, oldObjKeys;
            if (skipPath == null) {
                skipPath = false;
            }
            changes = [];
            oldObjKeys = Object.keys(oldObj);
            newObjKeys = Object.keys(newObj);
            intersectionKeys = _.intersection(oldObjKeys, newObjKeys);
            for (i = 0, len = intersectionKeys.length; i < len; i++) {
                k = intersectionKeys[i];
                newPath = path.concat([k]);
                newKeyPath = skipPath ? keyPath : keyPath.concat([k]);
                diffs = compare(oldObj[k], newObj[k], newPath, embededObjKeys, newKeyPath);
                if (diffs.length) {
                    changes = changes.concat(diffs);
                }
            }
            addedKeys = _.difference(newObjKeys, oldObjKeys);
            for (j = 0, len1 = addedKeys.length; j < len1; j++) {
                k = addedKeys[j];
                newPath = path.concat([k]);
                newKeyPath = skipPath ? keyPath : keyPath.concat([k]);
                changes.push({
                    type: changeset.op.ADD,
                    key: getKey(newPath),
                    value: newObj[k]
                });
            }
            deletedKeys = _.difference(oldObjKeys, newObjKeys);
            for (l = 0, len2 = deletedKeys.length; l < len2; l++) {
                k = deletedKeys[l];
                newPath = path.concat([k]);
                newKeyPath = skipPath ? keyPath : keyPath.concat([k]);
                changes.push({
                    type: changeset.op.REMOVE,
                    key: getKey(newPath),
                    value: oldObj[k]
                });
            }
            return changes;
        };
        compareArray = function(oldObj, newObj, path, embededObjKeys, keyPath) {
            var diffs, indexedNewObj, indexedOldObj, ref, uniqKey;
            uniqKey = (ref = embededObjKeys != null ? embededObjKeys[keyPath.join('.')] : void 0) != null ? ref : '$index';
            indexedOldObj = convertArrayToObj(oldObj, uniqKey);
            indexedNewObj = convertArrayToObj(newObj, uniqKey);
            diffs = compareObject(indexedOldObj, indexedNewObj, path, embededObjKeys, keyPath, true);
            if (diffs.length) {
                return [
                    {
                        type: changeset.op.UPDATE,
                        key: getKey(path),
                        embededKey: uniqKey,
                        changes: diffs
                    }
                ];
            } else {
                return [];
            }
        };
        convertArrayToObj = function(arr, uniqKey) {
            var index, obj, value;
            obj = {};
            if (uniqKey !== '$index') {
                obj = _.indexBy(arr, uniqKey);
            } else {
                for (index in arr) {
                    value = arr[index];
                    obj[index] = value;
                }
            }
            return obj;
        };
        comparePrimitives = function(oldObj, newObj, path) {
            var changes;
            changes = [];
            if (oldObj !== newObj) {
                changes.push({
                    type: changeset.op.UPDATE,
                    key: getKey(path),
                    value: newObj,
                    oldValue: oldObj
                });
            }
            return changes;
        };
        isEmbeddedKey = function(key) {
            return /\$.*=/gi.test(key);
        };
        removeKey = function(obj, key, embededKey) {
            var index;
            if (Array.isArray(obj)) {
                if (embededKey !== '$index' || !obj[key]) {
                    index = indexOfItemInArray(obj, embededKey, key);
                }
                return obj.splice(index != null ? index : key, 1);
            } else {
                return delete obj[key];
            }
        };
        indexOfItemInArray = function(arr, key, value) {
            var index, item;
            for (index in arr) {
                item = arr[index];
                if (key === '$index') {
                    if (item === value) {
                        return index;
                    }
                } else if (item[key] === value) {
                    return index;
                }
            }
            return -1;
        };
        modifyKeyValue = function(obj, key, value) {
            return obj[key] = value;
        };
        addKeyValue = function(obj, key, value) {
            if (Array.isArray(obj)) {
                return obj.push(value);
            } else {
                return obj[key] = value;
            }
        };
        parseEmbeddedKeyValue = function(key) {
            var uniqKey, value;
            uniqKey = key.substring(1, key.indexOf('='));
            value = key.substring(key.indexOf('=') + 1);
            return {
                uniqKey: uniqKey,
                value: value
            };
        };
        applyLeafChange = function(obj, change, embededKey) {
            var key, type, value;
            type = change.type, key = change.key, value = change.value;
            switch (type) {
                case changeset.op.ADD:
                    return addKeyValue(obj, key, value);
                case changeset.op.UPDATE:
                    return modifyKeyValue(obj, key, value);
                case changeset.op.REMOVE:
                    return removeKey(obj, key, embededKey);
            }
        };
        applyArrayChange = function(arr, change) {
            var element, i, len, ref, results, subchange;
            ref = change.changes;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
                subchange = ref[i];
                if ((subchange.value != null) || subchange.type === changeset.op.REMOVE) {
                    results.push(applyLeafChange(arr, subchange, change.embededKey));
                } else {
                    if (change.embededKey === '$index') {
                        element = arr[+subchange.key];
                    } else {
                        element = _.find(arr, function(el) {
                            return el[change.embededKey] === subchange.key;
                        });
                    }
                    results.push(changeset.applyChanges(element, subchange.changes));
                }
            }
            return results;
        };
        applyBranchChange = function(obj, change) {
            if (Array.isArray(obj)) {
                return applyArrayChange(obj, change);
            } else {
                return changeset.applyChanges(obj, change.changes);
            }
        };
        revertLeafChange = function(obj, change, embededKey) {
            var key, oldValue, type, value;
            type = change.type, key = change.key, value = change.value, oldValue = change.oldValue;
            switch (type) {
                case changeset.op.ADD:
                    return removeKey(obj, key, embededKey);
                case changeset.op.UPDATE:
                    return modifyKeyValue(obj, key, oldValue);
                case changeset.op.REMOVE:
                    return addKeyValue(obj, key, value);
            }
        };
        revertArrayChange = function(arr, change) {
            var element, i, len, ref, results, subchange;
            ref = change.changes;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
                subchange = ref[i];
                if ((subchange.value != null) || subchange.type === changeset.op.REMOVE) {
                    results.push(revertLeafChange(arr, subchange, change.embededKey));
                } else {
                    if (change.embededKey === '$index') {
                        element = arr[+subchange.key];
                    } else {
                        element = _.find(arr, function(el) {
                            return el[change.embededKey] === subchange.key;
                        });
                    }
                    results.push(changeset.revertChanges(element, subchange.changes));
                }
            }
            return results;
        };
        revertBranchChange = function(obj, change) {
            if (Array.isArray(obj)) {
                return revertArrayChange(obj, change);
            } else {
                return changeset.revertChanges(obj, change.changes);
            }
        };
        changeset.diff = function(oldObj, newObj, embededObjKeys) {
            return compare(oldObj, newObj, [], embededObjKeys, []);
        };
        changeset.applyChanges = function(obj, changesets) {
            var change, i, len, results;
            results = [];
            for (i = 0, len = changesets.length; i < len; i++) {
                change = changesets[i];
                if ((change.value != null) || change.type === changeset.op.REMOVE) {
                    results.push(applyLeafChange(obj, change, change.embededKey));
                } else {
                    results.push(applyBranchChange(obj[change.key], change));
                }
            }
            return results;
        };
        changeset.revertChanges = function(obj, changeset) {
            var change, i, len, ref, results;
            ref = changeset.reverse();
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
                change = ref[i];
                if (!change.changes) {
                    results.push(revertLeafChange(obj, change));
                } else {
                    results.push(revertBranchChange(obj[change.key], change));
                }
            }
            return results;
        };
        changeset.op = {
            ADD: 'Add',
            UPDATE: 'Update',
            REMOVE:'Remove'
        };

        changeset.calculateDiff= function(oldObj, newObj){
            return JSON.stringify( changeset.diff(oldObj, newObj, {children: 'name'}));
        };

    })();


