export class ApiFeatures {
  constructor(mongooseQuery, queryData) {
    this.mongooseQuery = mongooseQuery;
    this.queryData = queryData;
  }

  paginate() {
    let { page = 1, size = 3 } = this.queryData;

    page = Math.max(parseInt(page, 10) || 1, 1); // Ensure valid positive integer
    size = Math.min(Math.max(parseInt(size, 10) || 3, 1), 10); // Limit between 1 and 10

    const skip = (page - 1) * size;
    this.mongooseQuery.limit(size).skip(skip);
    return this;
  }

  filter() {
    const excludeFields = ["page", "size", "limit", "fields", "search", "sort"];
    let filterQuery = { ...this.queryData };

    excludeFields.forEach((key) => delete filterQuery[key]);

    // Convert operators (gt, gte, lt, lte, in, nin, eq) to MongoDB syntax
    filterQuery = JSON.parse(
      JSON.stringify(filterQuery).replace(/\b(gt|gte|lt|lte|in|nin|eq)\b/g, (match) => `$${match}`)
    );

    this.mongooseQuery.find(filterQuery);
    return this;
  }

  search() {
    if (this.queryData.search) {
      const searchRegex = { $regex: this.queryData.search, $options: "i" }; // Case-insensitive search
      this.mongooseQuery.find({ $or: [{ title: searchRegex }, { description: searchRegex }] });
    }
    return this;
  }

  sort() {
    if (this.queryData.sort) {
      const sortBy = this.queryData.sort.split(",").join(" "); // Convert CSV to space-separated
      this.mongooseQuery.sort(sortBy);
    }
    return this;
  }

  select() {
    if (this.queryData.fields) {
      const selectedFields = this.queryData.fields.split(",").join(" "); // Convert CSV to space-separated
      this.mongooseQuery.select(selectedFields);
    }
    return this;
  }
}
