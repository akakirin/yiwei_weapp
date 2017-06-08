var xlsx = require("node-xlsx");
var excelPort = require('excel-export');

module.exports = app => {
  app.beforeStart(function* () {
    const ctx = app.createAnonymousContext(),
      Books = ctx.model.Books,
      Category = ctx.model.Category,
      booklist = xlsx.parse("./app/public/bookWithIsbnxx.xlsx")[0].data;
    const booksnow = yield Books.find();
    if(booksnow.length === 0) {
      for(let i=1;i<booklist.length;i++){
        const bookName = booklist[i][0],
          picUrl = booklist[i][1],
          ISBN = booklist[i][2],
          author = booklist[i][3],
          summary = booklist[i][4],
          category = booklist[i][5],
          bookObj = new Books({bookName,picUrl,ISBN,author,summary,category});
        yield bookObj.save();
      }
      const cats = yield Books.find({},{category:1,_id:0});
      var catset = new Set();
      for(let v of cats) {
        catset.add(v.category)
      }
      for(let c of catset) {
        const bookListByCat = yield Books.find({category:c},{_id:1}),
          books = bookListByCat.map(x=>x._id),
          name = c,
          catObj = new Category({name,books});
        yield catObj.save();
      }
    }else{
      console.log("Data is ready,let's do it yo~");
    }
  })
};
