class APIFeatures {

    constructor(query, queryString) {
        this.query = query
        this.queryString = queryString
    }
    filter() {
        const queryObj = { ...this.queryString }
        const excludedFields = ['page', 'sort', 'limit', 'fields']
        excludedFields.forEach((ele) => delete queryObj[ele])

        // 1b. Advanced Filtering
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)/g, match => `$${match}`)
        this.query = this.query.find(JSON.parse(queryStr))
        return this
    }
    sort() {

        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.replace(',', ' ')
            this.query = this.query.sort(sortBy)
        }
        else {
            this.query = this.query.sort('-createdAt')
        }
        return this
    }
    //3. Field Limiting
    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.replace(',', ' ')
            this.query = this.query.select(fields)
        }
        else {
            // - means excluding them it will not send __v other then that all data will get send to client
            this.query = this.query.select('-__v')
        }
        return this
    }

    // 4. Pagination
   async paginate() {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 100
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this
    }

}
module.exports = APIFeatures