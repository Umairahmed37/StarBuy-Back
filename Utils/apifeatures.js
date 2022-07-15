
class apifeature {
  constructor(query, querystr) {
    this.query = query;
    this.querystr = querystr;

  }
  search() {
    const keyword = this.querystr.keyword ? {
      name: {
        $regex: this.querystr.keyword,
        $options: 'i'
      }

    } : {}

    this.query = this.query.find({ ...keyword })
    return this;
  }

  filter() {
    const queryfilter = { ...this.querystr }
    const removefields = ['keyword', 'page', 'limit']
    removefields.forEach(el => delete queryfilter[el])

    let str = JSON.stringify(this.querystr)
    str = str.replace(/\b(gt|gte|lte|lt)\b/g, match => `$${match}`)

    this.query = this.query.find(JSON.parse(str))

    return this;
  }
  pagination(prodperpage){

    const currentpage=Number(this.querystr.page) || 1;
     const skip=prodperpage*(currentpage-1)
     this.query=this.query.limit(prodperpage).skip(skip)
    return this;
  }

}
module.exports = apifeature;