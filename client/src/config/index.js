export const registerFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your user name",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "blazers", label: "Blazers & Tailoring" },
      { id: "knitwear", label: "Knitwear" },
      { id: "shirts", label: "Shirts & Formals" },
      { id: "dresses", label: "Dresses & Skirts" },
      { id: "trousers", label: "Trousers & Chinos" },
      { id: "outerwear", label: "Coats & Outerwear" },
      { id: "accessories", label: "Luxury Accessories" },
      { id: "watches", label: "Luxury Watches" },
      { id: "shoes", label: "Shoes & Sneakers" },
      { id: "kids", label: "Kids Edit" },
      { id: "men", label: "Men's Edit" },
      { id: "women", label: "Women's Edit" },
    ],
  },
  {
    label: "Brand",
    name: "brand",
    componentType: "select",
    options: [
      { id: "raymond", label: "Raymond" },
      { id: "louis-philippe", label: "Louis Philippe" },
      { id: "allen-solly", label: "Allen Solly" },
      { id: "ralph-lauren", label: "Ralph Lauren" },
      { id: "hugo-boss", label: "Hugo Boss" },
      { id: "massimo-dutti", label: "Massimo Dutti" },
      { id: "gucci", label: "Gucci" },
      { id: "armani", label: "Armani Exchange" },
      { id: "fossil", label: "Fossil" },
      { id: "nike", label: "Nike" },
      { id: "tommy-hilfiger", label: "Tommy Hilfiger" },
      { id: "puma", label: "Puma" },
    ],
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price (optional)",
  },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock",
  },
];

export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/shop/home",
  },
  {
    id: "products",
    label: "Products",
    path: "/shop/listing",
  },
  {
    id: "blazers",
    label: "Blazers",
    path: "/shop/listing",
  },
  {
    id: "knitwear",
    label: "Knitwear",
    path: "/shop/listing",
  },
  {
    id: "shirts",
    label: "Shirts",
    path: "/shop/listing",
  },
  {
    id: "dresses",
    label: "Dresses",
    path: "/shop/listing",
  },
  {
    id: "trousers",
    label: "Trousers",
    path: "/shop/listing",
  },
  {
    id: "outerwear",
    label: "Coats",
    path: "/shop/listing",
  },
  {
    id: "accessories",
    label: "Accessories",
    path: "/shop/listing",
  },
  {
    id: "watches",
    label: "Watches",
    path: "/shop/listing",
  },
  {
    id: "shoes",
    label: "Shoes",
    path: "/shop/listing",
  },
  {
    id: "kids",
    label: "Kids",
    path: "/shop/listing",
  },
];

export const categoryOptionsMap = {
  blazers: "Blazers & Tailoring",
  knitwear: "Knitwear",
  shirts: "Shirts & Formals",
  dresses: "Dresses & Skirts",
  trousers: "Trousers & Chinos",
  outerwear: "Coats & Outerwear",
  accessories: "Luxury Accessories",
  watches: "Luxury Watches",
  shoes: "Shoes & Sneakers",
  kids: "Kids Edit",
  men: "Men's Edit",
  women: "Women's Edit",
};

export const brandOptionsMap = {
  raymond: "Raymond",
  "louis-philippe": "Louis Philippe",
  "allen-solly": "Allen Solly",
  "ralph-lauren": "Ralph Lauren",
  "hugo-boss": "Hugo Boss",
  "massimo-dutti": "Massimo Dutti",
  gucci: "Gucci",
  armani: "Armani Exchange",
  fossil: "Fossil",
  nike: "Nike",
  "tommy-hilfiger": "Tommy Hilfiger",
  puma: "Puma",
};

export const filterOptions = {
  category: [
    { id: "blazers", label: "Blazers & Tailoring" },
    { id: "knitwear", label: "Knitwear" },
    { id: "shirts", label: "Shirts & Formals" },
    { id: "dresses", label: "Dresses & Skirts" },
    { id: "trousers", label: "Trousers & Chinos" },
    { id: "outerwear", label: "Coats & Outerwear" },
    { id: "accessories", label: "Luxury Accessories" },
    { id: "watches", label: "Luxury Watches" },
    { id: "shoes", label: "Shoes & Sneakers" },
    { id: "kids", label: "Kids Edit" },
    { id: "men", label: "Men's Edit" },
    { id: "women", label: "Women's Edit" },
  ],
  brand: [
    { id: "raymond", label: "Raymond" },
    { id: "louis-philippe", label: "Louis Philippe" },
    { id: "allen-solly", label: "Allen Solly" },
    { id: "ralph-lauren", label: "Ralph Lauren" },
    { id: "hugo-boss", label: "Hugo Boss" },
    { id: "massimo-dutti", label: "Massimo Dutti" },
    { id: "gucci", label: "Gucci" },
    { id: "armani", label: "Armani Exchange" },
    { id: "fossil", label: "Fossil" },
    { id: "nike", label: "Nike" },
    { id: "tommy-hilfiger", label: "Tommy Hilfiger" },
    { id: "puma", label: "Puma" },
  ],
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

export const addressFormControls = [  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
  },
  {
    label: "Pincode",
    name: "pincode",
    componentType: "input",
    type: "text",
    placeholder: "Enter your pincode",
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter any additional notes",
  },
];

export const couponFormControls = [
  {
    label: "Coupon Code",
    name: "code",
    componentType: "input",
    type: "text",
    placeholder: "e.g. SUMMER20",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Coupon description",
  },
  {
    label: "Discount Type",
    name: "discountType",
    componentType: "select",
    options: [
      { id: "percent", label: "Percentage (%)" },
      { id: "fixed", label: "Fixed amount (₹)" },
    ],
  },
  {
    label: "Discount Value",
    name: "discountValue",
    componentType: "input",
    type: "number",
    placeholder: "e.g. 20 (for 20%)",
  },
  {
    label: "Minimum Cart Value",
    name: "minimumCartValue",
    componentType: "input",
    type: "number",
    placeholder: "Minimum cart total (0 = none)",
  },
  {
    label: "Expiration Date",
    name: "expirationDate",
    componentType: "input",
    type: "date",
    placeholder: "",
  },
  {
    label: "Usage Limit",
    name: "usageLimit",
    componentType: "input",
    type: "number",
    placeholder: "Max redemptions (0 = unlimited)",
  },
];
