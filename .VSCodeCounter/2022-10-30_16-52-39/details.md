# Details

Date : 2022-10-30 16:52:39

Directory /media/tam/48955458-d4d5-4f63-b57b-bb4d87490c69/tam/git-repos/rayos/ecommerce-backend

Total : 56 files,  6237 codes, 2295 comments, 518 blanks, all 9050 lines

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [.templates.env](/.templates.env) | Environment Variables | 5 | 0 | 0 | 5 |
| [Dockerfile](/Dockerfile) | Docker | 8 | 2 | 7 | 17 |
| [app.js](/app.js) | JavaScript | 47 | 21 | 14 | 82 |
| [config/attachment.js](/config/attachment.js) | JavaScript | 11 | 0 | 2 | 13 |
| [config/database.js](/config/database.js) | JavaScript | 12 | 0 | 4 | 16 |
| [controllers/admin/index.js](/controllers/admin/index.js) | JavaScript | 56 | 11 | 15 | 82 |
| [controllers/attachment/index.js](/controllers/attachment/index.js) | JavaScript | 68 | 12 | 17 | 97 |
| [controllers/auth/index.js](/controllers/auth/index.js) | JavaScript | 136 | 18 | 30 | 184 |
| [controllers/bookmark/index.js](/controllers/bookmark/index.js) | JavaScript | 60 | 6 | 12 | 78 |
| [controllers/cart/index.js](/controllers/cart/index.js) | JavaScript | 120 | 8 | 19 | 147 |
| [controllers/category/index.js](/controllers/category/index.js) | JavaScript | 109 | 18 | 26 | 153 |
| [controllers/feed/index.js](/controllers/feed/index.js) | JavaScript | 74 | 12 | 13 | 99 |
| [controllers/order/index.js](/controllers/order/index.js) | JavaScript | 308 | 34 | 27 | 369 |
| [controllers/product/index.js](/controllers/product/index.js) | JavaScript | 217 | 30 | 38 | 285 |
| [controllers/product/variant.js](/controllers/product/variant.js) | JavaScript | 75 | 11 | 17 | 103 |
| [controllers/store/index.js](/controllers/store/index.js) | JavaScript | 112 | 18 | 26 | 156 |
| [controllers/subcategory/index.js](/controllers/subcategory/index.js) | JavaScript | 138 | 24 | 31 | 193 |
| [docker-compose.yml](/docker-compose.yml) | YAML | 14 | 12 | 1 | 27 |
| [middleware/auth.js](/middleware/auth.js) | JavaScript | 37 | 1 | 11 | 49 |
| [middleware/error.js](/middleware/error.js) | JavaScript | 19 | 1 | 3 | 23 |
| [middleware/query.js](/middleware/query.js) | JavaScript | 12 | 11 | 3 | 26 |
| [model/Address/index.js](/model/Address/index.js) | JavaScript | 0 | 30 | 1 | 31 |
| [model/Admin/index.js](/model/Admin/index.js) | JavaScript | 71 | 47 | 8 | 126 |
| [model/Attachment/index.js](/model/Attachment/index.js) | JavaScript | 22 | 18 | 4 | 44 |
| [model/Bookmark/index.js](/model/Bookmark/index.js) | JavaScript | 18 | 17 | 4 | 39 |
| [model/Cart/index.js](/model/Cart/index.js) | JavaScript | 23 | 20 | 3 | 46 |
| [model/Category/index.js](/model/Category/index.js) | JavaScript | 63 | 28 | 8 | 99 |
| [model/FeedImage/index.js](/model/FeedImage/index.js) | JavaScript | 14 | 13 | 4 | 31 |
| [model/Keyword/index.js](/model/Keyword/index.js) | JavaScript | 0 | 12 | 1 | 13 |
| [model/Order/index.js](/model/Order/index.js) | JavaScript | 63 | 44 | 5 | 112 |
| [model/OrderCache/index.js](/model/OrderCache/index.js) | JavaScript | 27 | 3 | 3 | 33 |
| [model/OrderLine/index.js](/model/OrderLine/index.js) | JavaScript | 39 | 0 | 3 | 42 |
| [model/Product/index.js](/model/Product/index.js) | JavaScript | 119 | 71 | 9 | 199 |
| [model/Review/index.js](/model/Review/index.js) | JavaScript | 0 | 25 | 1 | 26 |
| [model/Store/index.js](/model/Store/index.js) | JavaScript | 61 | 50 | 5 | 116 |
| [model/StoreImage/index.js](/model/StoreImage/index.js) | JavaScript | 0 | 17 | 1 | 18 |
| [model/Subcategory/index.js](/model/Subcategory/index.js) | JavaScript | 49 | 26 | 4 | 79 |
| [model/User/index.js](/model/User/index.js) | JavaScript | 108 | 70 | 17 | 195 |
| [model/Variant/index.js](/model/Variant/index.js) | JavaScript | 46 | 23 | 4 | 73 |
| [package-lock.json](/package-lock.json) | JSON | 3,542 | 0 | 1 | 3,543 |
| [package.json](/package.json) | JSON | 40 | 0 | 1 | 41 |
| [readme.md](/readme.md) | Markdown | 72 | 0 | 28 | 100 |
| [routes/admin.js](/routes/admin.js) | JavaScript | 10 | 75 | 5 | 90 |
| [routes/attachment.js](/routes/attachment.js) | JavaScript | 14 | 85 | 6 | 105 |
| [routes/auth.js](/routes/auth.js) | JavaScript | 21 | 188 | 10 | 219 |
| [routes/bookmark.js](/routes/bookmark.js) | JavaScript | 13 | 75 | 5 | 93 |
| [routes/cart.js](/routes/cart.js) | JavaScript | 14 | 95 | 6 | 115 |
| [routes/category.js](/routes/category.js) | JavaScript | 21 | 196 | 9 | 226 |
| [routes/feed.js](/routes/feed.js) | JavaScript | 17 | 83 | 6 | 106 |
| [routes/order.js](/routes/order.js) | JavaScript | 27 | 205 | 9 | 241 |
| [routes/product.js](/routes/product.js) | JavaScript | 17 | 126 | 7 | 150 |
| [routes/store.js](/routes/store.js) | JavaScript | 19 | 154 | 9 | 182 |
| [routes/subcategory.js](/routes/subcategory.js) | JavaScript | 19 | 165 | 8 | 192 |
| [routes/variant.js](/routes/variant.js) | JavaScript | 12 | 84 | 5 | 101 |
| [utils/errorResponse.js](/utils/errorResponse.js) | JavaScript | 7 | 0 | 1 | 8 |
| [utils/searchRegex.js](/utils/searchRegex.js) | JavaScript | 11 | 0 | 1 | 12 |

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)