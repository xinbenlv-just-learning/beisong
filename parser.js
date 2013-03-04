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

var filename = 'tangshi.txt';
var verse_splitters = ['，', "。"];

var lineReader = require('line-reader');

lineReader.eachLine(filename, function(line, last) {
  console.log(line);
  if(last){
    console.log("Done!");
  }
});
