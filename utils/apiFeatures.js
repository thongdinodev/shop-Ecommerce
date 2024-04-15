class APIFeature {
    constructor (query, queryString) {
        this.query = query;
        this.queryString = queryString;
    };

    // 1A) Filtering
    filter() {

        const queryObj = {...this.queryString};
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]); // to delete exclude fields
    
        // 1B) Advanced filtering 
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    // 2) Sorting
    sort() {
        if (this.queryString.sort) {
            const sortBy = (this.queryString.sort).split(',').join(' ');
            this.query = this.query.sort(sortBy)
        } else {
            this.query = this.query.sort("-createdAt");
        };
        return this;
    }

    limitFields() {
        // 3) Limiting
        if (this.queryString.fields) {
            const limitFields = (this.queryString.fields).split(',').join(' ');
            this.query = this.query.select(limitFields);
        } else {
            this.query = this.query.select('-__v');
        };
        return this;
    }

    // 4) Pagination
    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 50;
        const skip = (page - 1) * limit;

        // page=3&limit=10, 1-10, page 1, 11-20, page 2, 21-30, page 3
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
};

module.exports = APIFeature;