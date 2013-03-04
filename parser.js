// Format
// 作者: [Requered]
// 标题: [Required]
// 序言: [Optional]
// 正文: [Required,multiline]
//
// Example 
// 作者: 李白
// 标题: 静夜思
// 序言: 
// 正文:
// 床前明月光，疑是地上霜。
// 举头望明月，低头思故乡。
//
// # Comment



// Requires
var log4js = require('log4js');
var S = require('string');
var lineReader = require('line-reader');

// Constants 
var logger = log4js.getLogger();
logger.setLevel('ERROR');
var filename = 'tangshi.txt';
var verse_splitters = ['，', "。"];
var format_splittes = ['：'];
var COMMENT_PREFIX = '#';

// Vars
var currentStatus = -1;
var enumStatus = {
    // -1 for not started yet
    '标题': 0,
    '作者': 1,
    '序言': 2,
    '正文': 3,
}

// Functions
var clone = function (a) {
    return JSON.parse(JSON.stringify(a));
}

var preprocess = function (l) {
    function clone(a) {
        return JSON.parse(JSON.stringify(a));
    }
    var line = clone(l);
    var preprocessedLine = '';
    
    // Preprocess comments
    preprocessedLine = line.trim('');
    preprocessedLine = preprocessedLine.split(COMMENT_PREFIX)[0];
        
    return preprocessedLine;
}

var transit = function (lastStatus, nextStatus) {
    if (nextStatus > lastStatus) {
        return nextStatus;
    } else {
        if (nextStatus == 0 && lastStatus == 3) {
            return nextStatus
        }
        throw 'Status transistion error! was ' + lastStatus + ', but next is ' + nextStatus;
    }
}
splitString = function(string, splitters) {
    var list = [string];
    for(var i=0, len=splitters.length; i<len; i++) {
        traverseList(list, splitters[i], 0);
    }
    return flatten(list);
}

traverseList = function(list, splitter, index) {
    if(list[index]) {
        if((list.constructor !== String) && (list[index].constructor === String))
            (list[index] != list[index].split(splitter)) ? list[index] = list[index].split(splitter) : null;
        (list[index].constructor === Array) ? traverseList(list[index], splitter, 0) : null;
        (list.constructor === Array) ? traverseList(list, splitter, index+1) : null;    
    }
}

flatten = function(arr) {
    return arr.reduce(function(acc, val) {
        return acc.concat(val.constructor === Array ? flatten(val) : val);
    },[]);
}

// Main
var parsed = [];
var poem = null;
lineReader.eachLine(filename, function(line, last) {
  preprocessedLine = preprocess(line);
  if (preprocessedLine.length == 0) {
    logger.debug('Empty line: ' + line + '\n');
    // Skipped
  } else {
    lineSplit = line.split('：');
    
    if (lineSplit.length == 2) {
        // Contains head
        head = lineSplit[0];
        currentStatus = transit(currentStatus, enumStatus[head]);
        logger.debug('status: ' + currentStatus)
        if (currentStatus == 0) {
            // A new poem
            poem = {};
            parsed.push(poem);
            poem['正文'] = [];
 
        }
        if (currentStatus !=3 ) {
            console.log('peom is ' + poem + ',when processing' + line);
            poem[head] = lineSplit[1];
        } 
    } else {
        if (currentStatus != 3) {
            throw 'Current status is not 3, is ' + currentStatus + ', but input a line without head:' + line;
        } else {
            verses =  splitString(lineSplit[0], verse_splitters);
            for (i in verses) {
                if (verses[i].length>0) poem['正文'].push(verses[i]);
            }
        }
    }
  }

  if(last){
    console.log("Done!");
    console.log("Parsed:" + JSON.stringify(parsed, null, 4));
  }
});

