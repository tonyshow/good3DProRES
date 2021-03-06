require("shelljs/global");
var async = require("async");
var _ = require('underscore');
var fs = require('fs');
var path = require('path');
const xlsx = require('node-xlsx');
const { error } = require("console");
var app = module.exports = {}
app.mkdirsSync = function (dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  }
  else {
    if (this.mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
};

app.main = function () {
  let all = {
    time:currTime.toLocaleString()
  };
  app.mkdirsSync('./output/')
  var list = xlsx.parse("./关卡系统.xlsx");
  if (_.size(list) > 0) {
    _.each(list, (info, idx) => {
      error(info.name)
      let name = info.name;
      let data = info.data;

      let tbData = 0;
      if ("level" === name) {
        tbData = app.parsList(data, 5)
      } else if ("parameter" === name) {
        tbData = app.parsparameter(data)
      } else if ("passGold" === name) {
        tbData = app.parsList(data, 3)
      } else if ("passStar" === name) {
        tbData = app.parsList(data, 2)
      } else if ("buff" === name) {
        tbData = app.parsList(data, 2)
      }else if ("switch" === name) {
        tbData = app.needValueParsList(data, 1,2,3)
      }
      all[name] = tbData
    })
    fs.writeFileSync('./output/allconfig.json', JSON.stringify(all));
  }
}

app.parsparameter = function (list) {
  let data = {};
  _.each(list, (info, idx) => {
    if (idx >= 2 && info.length == 3) {
      data[info[0]] = info[1]
    }
  })
  return data
}
app.parsList = function (list, length) {
  let data = [];
  _.each(list, (info, idx) => {
    if (idx >= 2 && info.length == length) {
      data.push(info)
    }
  })
  return data
}
//valueStartIdx:0,1,2,... 通常为2
//valueColumn:值所在列
app.needValueParsList = function (list, valueColumn,valueStartIdx,length) {
  let data = [0];
  _.each(list, (info, idx) => {
    if (idx >= valueStartIdx && info.length == length) {
      data.push(info[valueColumn])
    }
  })
  return data
}
app.main();
