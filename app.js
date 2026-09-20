document.addEventListener("DOMContentLoaded", function () {

    const users =
        JSON.parse(localStorage.getItem("harvestlinkUsers")) || [];

    const currentUser =
        JSON.parse(localStorage.getItem("harvestlinkCurrentUser")) || null;

    function saveUsers(users) {
        localStorage.setItem(
            "harvestlinkUsers",
            JSON.stringify(users)
        );
    }

    function getCurrentUser() {
        return JSON.parse(
            localStorage.getItem("harvestlinkCurrentUser")
        );
    }

    function getListings() {
        return JSON.parse(
            localStorage.getItem("harvestlinkListings")
        ) || [];
    }

    function saveListings(listings) {
        localStorage.setItem(
            "harvestlinkListings",
            JSON.stringify(listings)
        );
    }

    function getOrders() {
        return JSON.parse(
            localStorage.getItem("harvestlinkOrders")
        ) || [];
    }

    function saveOrders(orders) {
        localStorage.setItem(
            "harvestlinkOrders",
            JSON.stringify(orders)
        );
    }

    function getCart() {
        return JSON.parse(
            localStorage.getItem("harvestlinkCart")
        ) || [];
    }

    function saveCart(cart) {
        localStorage.setItem(
            "harvestlinkCart",
            JSON.stringify(cart)
        );

        updateCartNavigation();
    }

    function updateCartNavigation() {
        const cart = getCart();

        const count = cart.reduce(function (total, item) {
            return total + Number(item.quantity || 0);
        }, 0);

        document.querySelectorAll(
            "[data-hl-cart-count]"
        ).forEach(function (element) {
            element.textContent = count;
        });
    }

    function setupGlobalNavigation() {
        const path =
            window.location.pathname.toLowerCase();

        if (
            path.endsWith("login.html") ||
            path.endsWith("signup.html")
        ) {
            return;
        }

        const navList =
            document.querySelector(".navbar-nav");

        if (!navList) {
            return;
        }

        if (
            !navList.querySelector(
                'a[href="cart.html"]'
            )
        ) {
            const cartItem =
                document.createElement("li");

            cartItem.className =
                "nav-item";

            cartItem.innerHTML = `
                <a
                    class="nav-link"
                    href="cart.html"
                >
                    🛒 Cart
                    <span
                        data-hl-cart-count
                        class="badge bg-success ms-1"
                    >
                        0
                    </span>
                </a>
            `;

            navList.appendChild(cartItem);
        }

        if (
            !navList.querySelector(
                'a[href="admin.html"]'
            )
        ) {
            const adminItem =
                document.createElement("li");

            adminItem.className =
                "nav-item";

            adminItem.innerHTML = `
                <a
                    class="nav-link"
                    href="admin.html"
                >
                    Admin Dashboard
                </a>
            `;

            navList.appendChild(adminItem);
        }

        updateCartNavigation();
    }

    setupGlobalNavigation();

    const signupForm =
        document.getElementById("signupForm");

    if (signupForm) {

        signupForm.addEventListener(
            "submit",
            function (e) {

                e.preventDefault();

                const firstName =
                    document
                        .getElementById("signupFirstName")
                        .value
                        .trim();

                const lastName =
                    document
                        .getElementById("signupLastName")
                        .value
                        .trim();

                const email =
                    document
                        .getElementById("signupEmail")
                        .value
                        .trim();

                const phone =
                    document
                        .getElementById("signupPhone")
                        .value
                        .trim();

                const role =
                    document
                        .getElementById("signupRole")
                        .value;

                const city =
                    document
                        .getElementById("signupCity")
                        .value
                        .trim();

                const state =
                    document
                        .getElementById("signupState")
                        .value
                        .trim();

                const password =
                    document
                        .getElementById("signupPassword")
                        .value;

                const confirmPassword =
                    document
                        .getElementById("signupConfirmPassword")
                        .value;

                const terms =
                    document.getElementById("termsCheck");

                const message =
                    document.getElementById("signupMessage");

                if (
                    password !== confirmPassword
                ) {
                    message.innerHTML =
                        '<div class="alert alert-danger">Passwords do not match.</div>';

                    return;
                }

                if (
                    terms &&
                    !terms.checked
                ) {
                    message.innerHTML =
                        '<div class="alert alert-danger">Please accept the terms.</div>';

                    return;
                }

                const existingUser =
                    users.find(function (user) {
                        return user.email === email;
                    });

                if (existingUser) {
                    message.innerHTML =
                        '<div class="alert alert-danger">An account with this email already exists.</div>';

                    return;
                }

                const newUser = {
                    id: Date.now(),
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    phone: phone,
                    role: role,
                    city: city,
                    state: state,
                    password: password,
                    createdAt:
                        new Date().toISOString()
                };

                users.push(newUser);

                saveUsers(users);

                message.innerHTML =
                    '<div class="alert alert-success">Account created successfully. Redirecting to login...</div>';

                setTimeout(
                    function () {
                        window.location.href =
                            "login.html";
                    },
                    900
                );
            }
        );
    }

    const loginForm =
        document.getElementById("loginForm");

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            function (e) {

                e.preventDefault();

                const email =
                    document
                        .getElementById("loginEmail")
                        .value
                        .trim();

                const password =
                    document
                        .getElementById("loginPassword")
                        .value;

                const role =
                    document
                        .getElementById("loginRole")
                        .value;

                const message =
                    document.getElementById(
                        "loginMessage"
                    );

                const user =
                    users.find(function (item) {

                        return (
                            item.email === email &&
                            item.password === password &&
                            item.role === role
                        );
                    });

                if (!user) {

                    message.innerHTML =
                        '<div class="alert alert-danger">Invalid email, password or role.</div>';

                    return;
                }

                localStorage.setItem(
                    "harvestlinkCurrentUser",
                    JSON.stringify(user)
                );

                message.innerHTML =
                    '<div class="alert alert-success">Login successful. Redirecting...</div>';

                setTimeout(
                    function () {

                        if (role === "farmer") {
                            window.location.href =
                                "seller.html";
                        }

                        else if (role === "ngo") {
                            window.location.href =
                                "ngo.html";
                        }

                        else {
                            window.location.href =
                                "listings.html";
                        }

                    },
                    500
                );
            }
        );
    }

    const loggedInName =
        document.getElementById("loggedInName");

    if (
        loggedInName &&
        currentUser
    ) {
        loggedInName.textContent =
            currentUser.firstName +
            " " +
            currentUser.lastName;
    }

    document
        .querySelectorAll("[data-logout]")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    localStorage.removeItem(
                        "harvestlinkCurrentUser"
                    );

                    window.location.href =
                        "login.html";
                }
            );
        });

    const builtInListings = [
        {
            id: "1",
            productName: "Fresh Tomatoes",
            category: "Vegetables",
            quantity: "50",
            unit: "kg",
            price: "32",
            location: "Satara",
            contactName: "Rajesh Patil",
            status: "Active",
            createdAt: "2026-01-01T10:00:00"
        },
        {
            id: "2",
            productName: "Alphonso Mangoes",
            category: "Fruits",
            quantity: "100",
            unit: "kg",
            price: "180",
            location: "Ratnagiri",
            contactName: "Rajesh Patil",
            status: "Active",
            createdAt: "2026-01-02T10:00:00"
        },
        {
            id: "3",
            productName: "Organic Wheat",
            category: "Grains",
            quantity: "250",
            unit: "kg",
            price: "48",
            location: "Nashik",
            contactName: "Rajesh Patil",
            status: "Active",
            createdAt: "2026-01-03T10:00:00"
        },
        {
            id: "4",
            productName: "Fresh Spinach",
            category: "Vegetables",
            quantity: "35",
            unit: "kg",
            price: "28",
            location: "Pune",
            contactName: "Rajesh Patil",
            status: "Active",
            createdAt: "2026-01-04T10:00:00"
        },
        {
            id: "5",
            productName: "Farm Fresh Milk",
            category: "Dairy",
            quantity: "40",
            unit: "L",
            price: "62",
            location: "Kolhapur",
            contactName: "Rajesh Patil",
            status: "Active",
            createdAt: "2026-01-05T10:00:00"
        },
        {
            id: "6",
            productName: "Red Onions",
            category: "Vegetables",
            quantity: "180",
            unit: "kg",
            price: "36",
            location: "Ahmednagar",
            contactName: "Rajesh Patil",
            status: "Active",
            createdAt: "2026-01-06T10:00:00"
        }
    ];

    window.harvestLinkBuiltInListings =
        builtInListings;

    const productData = {

        "1": {
            name: "Fresh Tomatoes",
            category: "Vegetables",
            price: "₹32/kg",
            quantity: "50 kg",
            location: "Satara",
            seller: "Rajesh Patil",
            description:
                "Freshly harvested tomatoes available directly from the farm.",
            image:
                "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=1000&q=80"
        },

        "2": {
            name: "Alphonso Mangoes",
            category: "Fruits",
            price: "₹180/kg",
            quantity: "100 kg",
            location: "Ratnagiri",
            seller: "Rajesh Patil",
            description:
                "Fresh Alphonso mangoes sourced directly from farms in Ratnagiri.",
            image:
                "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=1000&q=80"
        },

        "3": {
            name: "Organic Wheat",
            category: "Grains",
            price: "₹48/kg",
            quantity: "250 kg",
            location: "Nashik",
            seller: "Rajesh Patil",
            description:
                "Quality organic wheat sourced directly from local farmers in Nashik.",
            image:
                "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80"
        },

        "4": {
            name: "Fresh Spinach",
            category: "Vegetables",
            price: "₹28/kg",
            quantity: "35 kg",
            location: "Pune",
            seller: "Rajesh Patil",
            description:
                "Fresh green spinach harvested from local farms in Pune.",
            image:
                "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=1000&q=80"
        },

        "5": {
            name: "Farm Fresh Milk",
            category: "Dairy",
            price: "₹62/L",
            quantity: "40 L",
            location: "Kolhapur",
            seller: "Rajesh Patil",
            description:
                "Fresh farm milk supplied directly from dairy farmers in Kolhapur.",
            image:
                "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1000&q=80"
        },

        "6": {
            name: "Red Onions",
            category: "Vegetables",
            price: "₹36/kg",
            quantity: "180 kg",
            location: "Ahmednagar",
            seller: "Rajesh Patil",
            description:
                "Fresh red onions harvested from farms in Ahmednagar.",
            image:
                "https://images.unsplash.com/photo-1683355739329-cea18ba93f02?auto=format&fit=crop&w=1000&q=80"
        }
    };

    function getAllListings() {

        const customListings =
            getListings();

        const allListings =
            builtInListings.concat(
                customListings.map(function (listing) {
                    return {
                        ...listing,
                        id:
                            "custom-" +
                            listing.id
                    };
                })
            );

        return allListings;
    }

    const listingGrid =
        document.getElementById("listingGrid");

    if (listingGrid) {

        const allListings =
            getAllListings();

        allListings.forEach(
            function (listing) {

                const item =
                    document.createElement("div");

                item.className =
                    "col-md-6 col-lg-4 listing-item";

                const productId =
                    String(listing.id);

                const builtInProduct =
                    productData[
                        String(listing.id)
                    ];

                const image =
                    listing.image ||
                    (
                        builtInProduct
                            ? builtInProduct.image
                            : "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1000&q=80"
                    );

                item.dataset.name =
                    (
                        listing.productName ||
                        ""
                    ).toLowerCase();

                item.dataset.category =
                    (
                        listing.category ||
                        ""
                    ).toLowerCase();

                item.dataset.location =
                    listing.location ||
                    "";

                item.dataset.price =
                    parseFloat(
                        listing.price
                    ) || 0;

                item.dataset.date =
                    listing.createdAt ||
                    "";

                item.innerHTML = `
                    <div class="card h-100 border-0 shadow-sm">

                        <img
                            src="${image}"
                            class="card-img-top"
                            alt="${listing.productName}"
                            style="height:220px;object-fit:cover;"
                        >

                        <div class="card-body">

                            <span class="badge bg-success mb-2">
                                ${listing.category || "Produce"}
                            </span>

                            <h5 class="card-title">
                                ${listing.productName}
                            </h5>

                            <p class="text-muted mb-2">
                                ${listing.location || "Location not specified"}
                            </p>

                            <p class="mb-2">
                                <strong>
                                    ₹${listing.price}/${listing.unit || "unit"}
                                </strong>
                            </p>

                            <p class="small text-muted">
                                Available:
                                ${listing.quantity || 0}
                                ${listing.unit || ""}
                            </p>

                            <a
                                href="product.html?id=${productId}"
                                class="btn btn-success w-100"
                            >
                                View Listing
                            </a>

                        </div>

                    </div>
                `;

                listingGrid.appendChild(item);
            }
        );

        const searchInput =
            document.getElementById(
                "searchInput"
            );

        const locationFilter =
            document.getElementById(
                "locationFilter"
            );

        const sortFilter =
            document.getElementById(
                "sortFilter"
            );

        const resetFilters =
            document.getElementById(
                "resetFilters"
            );

        const categoryFilters =
            document.getElementById(
                "categoryFilters"
            );

        const resultCount =
            document.getElementById(
                "resultCount"
            );

        const noResults =
            document.getElementById(
                "noResults"
            );

        function filterListings() {

            const search =
                searchInput
                    ? searchInput.value
                        .toLowerCase()
                        .trim()
                    : "";

            const location =
                locationFilter
                    ? locationFilter.value
                        .toLowerCase()
                    : "all";

            const sort =
                sortFilter
                    ? sortFilter.value
                    : "default";

            const activeCategory =
                categoryFilters
                    ? categoryFilters.querySelector(
                        ".active"
                    )
                    : null;

            const category =
                activeCategory
                    ? activeCategory.dataset.category
                    : "all";

            const items =
                Array.from(
                    listingGrid.querySelectorAll(
                        ".listing-item"
                    )
                );

            let visibleItems =
                items.filter(
                    function (item) {

                        const name =
                            item.dataset.name ||
                            "";

                        const itemCategory =
                            item.dataset.category ||
                            "";

                        const itemLocation =
                            (
                                item.dataset.location ||
                                ""
                            ).toLowerCase();

                        const matchesSearch =
                            !search ||
                            name.includes(search);

                        const matchesLocation =
                            location === "all" ||
                            itemLocation ===
                                location;

                        const matchesCategory =
                            category === "all" ||
                            itemCategory.includes(
                                category
                            );

                        return (
                            matchesSearch &&
                            matchesLocation &&
                            matchesCategory
                        );
                    }
                );

            if (sort === "price-low") {

                visibleItems.sort(
                    function (a, b) {

                        return (
                            Number(
                                a.dataset.price
                            ) -
                            Number(
                                b.dataset.price
                            )
                        );
                    }
                );
            }

            if (sort === "price-high") {

                visibleItems.sort(
                    function (a, b) {

                        return (
                            Number(
                                b.dataset.price
                            ) -
                            Number(
                                a.dataset.price
                            )
                        );
                    }
                );
            }

            if (sort === "newest") {

                visibleItems.sort(
                    function (a, b) {

                        return (
                            new Date(
                                b.dataset.date ||
                                0
                            ) -
                            new Date(
                                a.dataset.date ||
                                0
                            )
                        );
                    }
                );
            }

            items.forEach(
                function (item) {
                    item.style.display =
                        "none";
                }
            );

            visibleItems.forEach(
                function (item) {

                    item.style.display =
                        "";

                    listingGrid.appendChild(
                        item
                    );
                }
            );

            if (resultCount) {
                resultCount.textContent =
                    visibleItems.length;
            }

            if (noResults) {
                noResults.style.display =
                    visibleItems.length === 0
                        ? "block"
                        : "none";
            }
        }

        if (searchInput) {
            searchInput.addEventListener(
                "input",
                filterListings
            );
        }

        if (locationFilter) {
            locationFilter.addEventListener(
                "change",
                filterListings
            );
        }

        if (sortFilter) {
            sortFilter.addEventListener(
                "change",
                filterListings
            );
        }

        if (categoryFilters) {

            categoryFilters
                .querySelectorAll(
                    "[data-category]"
                )
                .forEach(
                    function (button) {

                        button.addEventListener(
                            "click",
                            function () {

                                categoryFilters
                                    .querySelectorAll(
                                        "[data-category]"
                                    )
                                    .forEach(
                                        function (item) {
                                            item.classList.remove(
                                                "active"
                                            );
                                        }
                                    );

                                button.classList.add(
                                    "active"
                                );

                                filterListings();
                            }
                        );
                    }
                );
        }

        if (resetFilters) {

            resetFilters.addEventListener(
                "click",
                function () {

                    if (searchInput) {
                        searchInput.value = "";
                    }

                    if (locationFilter) {
                        locationFilter.value =
                            "all";
                    }

                    if (sortFilter) {
                        sortFilter.value =
                            "default";
                    }

                    if (categoryFilters) {

                        categoryFilters
                            .querySelectorAll(
                                "[data-category]"
                            )
                            .forEach(
                                function (item) {
                                    item.classList.remove(
                                        "active"
                                    );
                                }
                            );

                        const allButton =
                            categoryFilters.querySelector(
                                '[data-category="all"]'
                            );

                        if (allButton) {
                            allButton.classList.add(
                                "active"
                            );
                        }
                    }

                    filterListings();
                }
            );
        }

        filterListings();
    }

    const productId =
        new URLSearchParams(
            window.location.search
        ).get("id");

    if (
        productId &&
        document.getElementById(
            "productName"
        )
    ) {

        let product =
            productData[productId];

        if (
            !product &&
            productId.startsWith("custom-")
        ) {

            const customId =
                productId.replace(
                    "custom-",
                    ""
                );

            const listing =
                getListings().find(
                    function (item) {
                        return String(item.id) ===
                            customId;
                    }
                );

            if (listing) {

                product = {
                    name:
                        listing.productName,

                    category:
                        listing.category,

                    price:
                        "₹" +
                        listing.price +
                        "/" +
                        listing.unit,

                    quantity:
                        listing.quantity +
                        " " +
                        listing.unit,

                    location:
                        listing.location,

                    seller:
                        listing.contactName ||
                        "HarvestLink Farmer",

                    description:
                        listing.description ||
                        "Fresh produce listed directly on HarvestLink.",

                    image:
                        listing.image ||
                        "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1000&q=80"
                };
            }
        }

        if (product) {

            document.getElementById(
                "productName"
            ).textContent =
                product.name;

            document.getElementById(
                "productCategory"
            ).textContent =
                product.category;

            document.getElementById(
                "productPrice"
            ).textContent =
                product.price;

            document.getElementById(
                "productQuantity"
            ).textContent =
                product.quantity;

            document.getElementById(
                "productLocation"
            ).textContent =
                product.location;

            document.getElementById(
                "productSeller"
            ).textContent =
                product.seller;

            const description =
                document.getElementById(
                    "productDescription"
                );

            if (description) {
                description.textContent =
                    product.description;
            }

            const productImage =
                document.getElementById(
                    "productImage"
                );

            if (productImage) {

                productImage.src =
                    product.image;

                productImage.alt =
                    product.name;
            }

            const addToCart =
                document.getElementById(
                    "addToCart"
                );

            if (addToCart) {
                addToCart.dataset.productId =
                    productId;
            }
        }
    }

    const addToCart =
        document.getElementById(
            "addToCart"
        );

    if (addToCart) {

        addToCart.addEventListener(
            "click",
            function () {

                const quantityInput =
                    document.getElementById(
                        "orderQuantity"
                    );

                const cartMessage =
                    document.getElementById(
                        "cartMessage"
                    );

                const quantity =
                    Number(
                        quantityInput
                            ? quantityInput.value
                            : 1
                    );

                if (
                    !quantity ||
                    quantity < 1
                ) {

                    if (cartMessage) {
                        cartMessage.innerHTML =
                            '<div class="alert alert-danger">Please enter a valid quantity.</div>';
                    }

                    return;
                }

                const id =
                    addToCart.dataset.productId;

                let product =
                    productData[id];

                if (
                    !product &&
                    id &&
                    id.startsWith("custom-")
                ) {

                    const customId =
                        id.replace(
                            "custom-",
                            ""
                        );

                    const listing =
                        getListings().find(
                            function (item) {
                                return String(
                                    item.id
                                ) === customId;
                            }
                        );

                    if (listing) {

                        product = {
                            name:
                                listing.productName,

                            category:
                                listing.category,

                            price:
                                "₹" +
                                listing.price +
                                "/" +
                                listing.unit,

                            location:
                                listing.location,

                            seller:
                                listing.contactName ||
                                "HarvestLink Farmer"
                        };
                    }
                }

                if (!product) {
                    return;
                }

                let cart =
                    getCart();

                const existingItem =
                    cart.find(
                        function (item) {
                            return String(
                                item.id
                            ) === String(id);
                        }
                    );

                if (existingItem) {

                    existingItem.quantity +=
                        quantity;

                } else {

                    cart.push({

                        id: id,

                        name:
                            product.name,

                        price:
                            product.price,

                        quantity:
                            quantity,

                        location:
                            product.location,

                        seller:
                            product.seller
                    });
                }

                saveCart(cart);

                if (cartMessage) {

                    cartMessage.innerHTML =
                        '<div class="alert alert-success">' +
                        product.name +
                        ' added to your cart. ' +
                        '<a href="cart.html" class="fw-bold">View Cart</a>' +
                        '</div>';
                }
            }
        );
    }

    const cartItems =
        document.getElementById(
            "cartItems"
        );

    if (cartItems) {

        const emptyCart =
            document.getElementById(
                "emptyCart"
            );

        const cartItemCount =
            document.getElementById(
                "cartItemCount"
            );

        const summaryItems =
            document.getElementById(
                "summaryItems"
            );

        const cartSubtotal =
            document.getElementById(
                "cartSubtotal"
            );

        const deliveryCharge =
            document.getElementById(
                "deliveryCharge"
            );

        const cartTotal =
            document.getElementById(
                "cartTotal"
            );

        const placeOrderBtn =
            document.getElementById(
                "placeOrderBtn"
            );

        const cartMessage =
            document.getElementById(
                "cartMessage"
            );

        function getNumericPrice(price) {

            return Number(
                String(price)
                    .replace(
                        /[₹,]/g,
                        ""
                    )
                    .match(
                        /[0-9]+(\.[0-9]+)?/
                    )?.[0] || 0
            );
        }

        function renderCart() {

            const cart =
                getCart();

            cartItems.innerHTML = "";

            let subtotal = 0;

            let totalQuantity = 0;

            cart.forEach(
                function (item, index) {

                    const price =
                        getNumericPrice(
                            item.price
                        );

                    const total =
                        price *
                        item.quantity;

                    subtotal += total;

                    totalQuantity +=
                        Number(
                            item.quantity
                        );

                    const row =
                        document.createElement(
                            "div"
                        );

                    row.className =
                        "border-bottom py-3";

                    row.innerHTML = `
                        <div class="row align-items-center g-3">

                            <div class="col-md-4">

                                <h6 class="mb-1">
                                    ${item.name}
                                </h6>

                                <small class="text-muted">
                                    ${item.location || ""}
                                </small>

                            </div>

                            <div class="col-md-2">

                                <small class="text-muted">
                                    Price
                                </small>

                                <div>
                                    ${item.price}
                                </div>

                            </div>

                            <div class="col-md-3">

                                <label class="form-label small">
                                    Quantity
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    value="${item.quantity}"
                                    class="form-control cart-quantity"
                                    data-index="${index}"
                                >

                            </div>

                            <div class="col-md-2">

                                <small class="text-muted">
                                    Total
                                </small>

                                <div class="fw-bold">
                                    ₹${total.toFixed(2)}
                                </div>

                            </div>

                            <div class="col-md-1 text-end">

                                <button
                                    type="button"
                                    class="btn btn-sm btn-outline-danger remove-cart-item"
                                    data-index="${index}"
                                >
                                    ×
                                </button>

                            </div>

                        </div>
                    `;

                    cartItems.appendChild(row);
                }
            );

            if (cartItemCount) {
                cartItemCount.textContent =
                    totalQuantity;
            }

            if (summaryItems) {
                summaryItems.textContent =
                    cart.length;
            }

            if (cartSubtotal) {
                cartSubtotal.textContent =
                    "₹" +
                    subtotal.toFixed(2);
            }

            const delivery =
                cart.length > 0
                    ? 50
                    : 0;

            if (deliveryCharge) {
                deliveryCharge.textContent =
                    "₹" +
                    delivery.toFixed(2);
            }

            if (cartTotal) {
                cartTotal.textContent =
                    "₹" +
                    (
                        subtotal +
                        delivery
                    ).toFixed(2);
            }

            if (emptyCart) {
                emptyCart.style.display =
                    cart.length === 0
                        ? "block"
                        : "none";
            }

            if (placeOrderBtn) {
                placeOrderBtn.disabled =
                    cart.length === 0;
            }

            updateCartNavigation();
        }

        cartItems.addEventListener(
            "change",
            function (e) {

                if (
                    e.target.classList.contains(
                        "cart-quantity"
                    )
                ) {

                    const index =
                        Number(
                            e.target.dataset.index
                        );

                    const quantity =
                        Number(
                            e.target.value
                        );

                    const cart =
                        getCart();

                    if (
                        cart[index] &&
                        quantity > 0
                    ) {

                        cart[index].quantity =
                            quantity;

                        saveCart(cart);

                        renderCart();
                    }
                }
            }
        );

        cartItems.addEventListener(
            "click",
            function (e) {

                if (
                    e.target.classList.contains(
                        "remove-cart-item"
                    )
                ) {

                    const index =
                        Number(
                            e.target.dataset.index
                        );

                    const cart =
                        getCart();

                    cart.splice(
                        index,
                        1
                    );

                    saveCart(cart);

                    renderCart();
                }
            }
        );

        if (placeOrderBtn) {

            placeOrderBtn.addEventListener(
                "click",
                function () {

                    const cart =
                        getCart();

                    if (!cart.length) {
                        return;
                    }

                    const orders =
                        getOrders();

                    cart.forEach(
                        function (item) {

                            const price =
                                getNumericPrice(
                                    item.price
                                );

                            orders.push({

                                id:
                                    "ORD-" +
                                    Date.now() +
                                    "-" +
                                    Math.floor(
                                        Math.random() *
                                        1000
                                    ),

                                productId:
                                    item.id,

                                product:
                                    item.name,

                                productName:
                                    item.name,

                                quantity:
                                    item.quantity,

                                price:
                                    price,

                                total:
                                    price *
                                    item.quantity,

                                location:
                                    item.location,

                                seller:
                                    item.seller,

                                status:
                                    "Pending",

                                date:
                                    new Date()
                                        .toISOString()
                            });
                        }
                    );

                    saveOrders(
                        orders
                    );

                    localStorage.removeItem(
                        "harvestlinkCart"
                    );

                    if (cartMessage) {

                        cartMessage.innerHTML =
                            '<div class="alert alert-success">Order placed successfully.</div>';
                    }

                    renderCart();

                    setTimeout(
                        function () {
                            window.location.href =
                                "orders.html";
                        },
                        700
                    );
                }
            );
        }

        renderCart();
    }

});

document.addEventListener("DOMContentLoaded", function () {

    function getOrders() {
        return JSON.parse(
            localStorage.getItem(
                "harvestlinkOrders"
            )
        ) || [];
    }

    function saveOrders(orders) {
        localStorage.setItem(
            "harvestlinkOrders",
            JSON.stringify(orders)
        );
    }

    function getListings() {
        return JSON.parse(
            localStorage.getItem(
                "harvestlinkListings"
            )
        ) || [];
    }

    function saveListings(listings) {
        localStorage.setItem(
            "harvestlinkListings",
            JSON.stringify(listings)
        );
    }

    const ordersTable =
        document.getElementById(
            "ordersTable"
        );

    if (ordersTable) {

        const orderSearch =
            document.getElementById(
                "orderSearch"
            );

        const orderStatusFilter =
            document.getElementById(
                "orderStatusFilter"
            );

        const orderDateFilter =
            document.getElementById(
                "orderDateFilter"
            );

        const resetOrderFilters =
            document.getElementById(
                "resetOrderFilters"
            );

        const noOrders =
            document.getElementById(
                "noOrders"
            );

        const orderResultCount =
            document.getElementById(
                "orderResultCount"
            );

        const allOrdersCount =
            document.getElementById(
                "allOrdersCount"
            );

        const pendingOrders =
            document.getElementById(
                "pendingOrders"
            );

        const progressOrders =
            document.getElementById(
                "progressOrders"
            );

        const completedOrders =
            document.getElementById(
                "completedOrders"
            );

        function getTableBody(element) {

            if (
                element.tagName &&
                element.tagName.toLowerCase() ===
                    "tbody"
            ) {
                return element;
            }

            return (
                element.querySelector("tbody") ||
                element
            );
        }

        function normalizeOrder(order) {

            return {

                id:
                    order.id ||
                    "ORD-" +
                    Date.now(),

                product:
                    order.productName ||
                    order.product ||
                    "Unknown Product",

                quantity:
                    Number(
                        order.quantity
                    ) || 0,

                price:
                    Number(
                        order.price
                    ) || 0,

                total:
                    Number(
                        order.total
                    ) ||
                    (
                        Number(
                            order.price || 0
                        ) *
                        Number(
                            order.quantity || 0
                        )
                    ),

                date:
                    order.date ||
                    order.createdAt ||
                    new Date().toISOString(),

                status:
                    order.status ||
                    "Pending",

                seller:
                    order.seller ||
                    "Rajesh Patil",

                location:
                    order.location ||
                    ""
            };
        }

        function renderOrders() {

            let orders =
                getOrders().map(
                    normalizeOrder
                );

            const search =
                orderSearch
                    ? orderSearch.value
                        .toLowerCase()
                        .trim()
                    : "";

            const status =
                orderStatusFilter
                    ? orderStatusFilter.value
                    : "all";

            const dateValue =
                orderDateFilter
                    ? orderDateFilter.value
                    : "all";

            orders =
                orders.filter(
                    function (order) {

                        const matchesSearch =
                            !search ||
                            order.id
                                .toLowerCase()
                                .includes(search) ||
                            order.product
                                .toLowerCase()
                                .includes(search);

                        const matchesStatus =
                            status === "all" ||
                            order.status
                                .toLowerCase() ===
                            status.toLowerCase();

                        let matchesDate =
                            true;

                        if (
                            dateValue !== "all"
                        ) {

                            const orderDate =
                                new Date(
                                    order.date
                                );

                            const today =
                                new Date();

                            if (
                                dateValue ===
                                "today"
                            ) {

                                matchesDate =
                                    orderDate
                                        .toDateString() ===
                                    today
                                        .toDateString();
                            }

                            if (
                                dateValue ===
                                "week"
                            ) {

                                const weekAgo =
                                    new Date();

                                weekAgo.setDate(
                                    today.getDate() -
                                    7
                                );

                                matchesDate =
                                    orderDate >=
                                    weekAgo;
                            }

                            if (
                                dateValue ===
                                "month"
                            ) {

                                const monthAgo =
                                    new Date();

                                monthAgo.setMonth(
                                    today.getMonth() -
                                    1
                                );

                                matchesDate =
                                    orderDate >=
                                    monthAgo;
                            }
                        }

                        return (
                            matchesSearch &&
                            matchesStatus &&
                            matchesDate
                        );
                    }
                );

            orders.sort(
                function (a, b) {

                    return (
                        new Date(b.date) -
                        new Date(a.date)
                    );
                }
            );

            const body =
                getTableBody(
                    ordersTable
                );

            body.innerHTML = "";

            orders.forEach(
                function (order) {

                    const row =
                        document.createElement(
                            "tr"
                        );

                    row.innerHTML = `
                        <td>
                            ${order.id}
                        </td>

                        <td>
                            ${order.product}
                        </td>

                        <td>
                            ${order.quantity}
                        </td>

                        <td>
                            ₹${order.price}
                        </td>

                        <td>
                            ₹${order.total.toFixed(2)}
                        </td>

                        <td>
                            ${new Date(
                                order.date
                            ).toLocaleDateString(
                                "en-IN"
                            )}
                        </td>

                        <td>
                            <span class="badge ${
                                order.status ===
                                "Completed"
                                    ? "bg-success"
                                    : order.status ===
                                      "Cancelled"
                                        ? "bg-danger"
                                        : order.status ===
                                          "In Progress"
                                            ? "bg-warning text-dark"
                                            : "bg-secondary"
                            }">
                                ${order.status}
                            </span>
                        </td>
                    `;

                    body.appendChild(
                        row
                    );
                }
            );

            if (orderResultCount) {
                orderResultCount.textContent =
                    orders.length;
            }

            if (noOrders) {
                noOrders.style.display =
                    orders.length === 0
                        ? "block"
                        : "none";
            }

            const all =
                getOrders().map(
                    normalizeOrder
                );

            if (allOrdersCount) {
                allOrdersCount.textContent =
                    all.length;
            }

            if (pendingOrders) {
                pendingOrders.textContent =
                    all.filter(
                        function (order) {
                            return (
                                order.status ===
                                "Pending"
                            );
                        }
                    ).length;
            }

            if (progressOrders) {
                progressOrders.textContent =
                    all.filter(
                        function (order) {
                            return (
                                order.status ===
                                "In Progress"
                            );
                        }
                    ).length;
            }

            if (completedOrders) {
                completedOrders.textContent =
                    all.filter(
                        function (order) {
                            return (
                                order.status ===
                                "Completed"
                            );
                        }
                    ).length;
            }
        }

        if (orderSearch) {
            orderSearch.addEventListener(
                "input",
                renderOrders
            );
        }

        if (orderStatusFilter) {
            orderStatusFilter.addEventListener(
                "change",
                renderOrders
            );
        }

        if (orderDateFilter) {
            orderDateFilter.addEventListener(
                "change",
                renderOrders
            );
        }

        if (resetOrderFilters) {

            resetOrderFilters.addEventListener(
                "click",
                function () {

                    if (orderSearch) {
                        orderSearch.value = "";
                    }

                    if (orderStatusFilter) {
                        orderStatusFilter.value =
                            "all";
                    }

                    if (orderDateFilter) {
                        orderDateFilter.value =
                            "all";
                    }

                    renderOrders();
                }
            );
        }

        renderOrders();
    }

    const createListingForm =
        document.getElementById(
            "createListingForm"
        );

    if (createListingForm) {

        const listingMessage =
            document.getElementById(
                "listingMessage"
            );

        const saveDraft =
            document.getElementById(
                "saveDraft"
            );

        const publishListing =
            document.getElementById(
                "publishListing"
            );

        function getListingFormData() {

            return {

                productName:
                    document
                        .getElementById(
                            "productName"
                        )
                        ?.value
                        .trim() || "",

                category:
                    document
                        .getElementById(
                            "productCategory"
                        )
                        ?.value || "",

                quantity:
                    document
                        .getElementById(
                            "productQuantity"
                        )
                        ?.value || "",

                unit:
                    document
                        .getElementById(
                            "productUnit"
                        )
                        ?.value || "",

                price:
                    document
                        .getElementById(
                            "productPrice"
                        )
                        ?.value || "",

                harvestDate:
                    document
                        .getElementById(
                            "harvestDate"
                        )
                        ?.value || "",

                location:
                    document
                        .getElementById(
                            "productLocation"
                        )
                        ?.value
                        .trim() || "",

                productionType:
                    document
                        .getElementById(
                            "productionType"
                        )
                        ?.value || "",

                description:
                    document
                        .getElementById(
                            "productDescription"
                        )
                        ?.value
                        .trim() || "",

                fulfilment:
                    document
                        .getElementById(
                            "fulfilmentMethod"
                        )
                        ?.value || "",

                availableFrom:
                    document
                        .getElementById(
                            "availableFrom"
                        )
                        ?.value || "",

                contactName:
                    document
                        .getElementById(
                            "contactName"
                        )
                        ?.value
                        .trim() || "",

                contactPhone:
                    document
                        .getElementById(
                            "contactPhone"
                        )
                        ?.value
                        .trim() || ""
            };
        }

        function readListingImage(
            callback
        ) {

            const imageInput =
                document.getElementById(
                    "productImage"
                );

            if (
                !imageInput ||
                !imageInput.files ||
                !imageInput.files[0]
            ) {
                callback("");
                return;
            }

            const file =
                imageInput.files[0];

            const reader =
                new FileReader();

            reader.onload =
                function (event) {

                    const image =
                        new Image();

                    image.onload =
                        function () {

                            const canvas =
                                document.createElement(
                                    "canvas"
                                );

                            const maxWidth =
                                1200;

                            const scale =
                                Math.min(
                                    1,
                                    maxWidth /
                                    image.width
                                );

                            canvas.width =
                                image.width *
                                scale;

                            canvas.height =
                                image.height *
                                scale;

                            const context =
                                canvas.getContext(
                                    "2d"
                                );

                            context.drawImage(
                                image,
                                0,
                                0,
                                canvas.width,
                                canvas.height
                            );

                            callback(
                                canvas.toDataURL(
                                    "image/jpeg",
                                    0.82
                                )
                            );
                        };

                    image.src =
                        event.target.result;
                };

            reader.readAsDataURL(file);
        }

        if (saveDraft) {

            saveDraft.addEventListener(
                "click",
                function () {

                    const listing =
                        getListingFormData();

                    localStorage.setItem(
                        "harvestlinkDraftListing",
                        JSON.stringify(
                            listing
                        )
                    );

                    if (listingMessage) {
                        listingMessage.innerHTML =
                            '<div class="alert alert-info">Listing saved as a draft.</div>';
                    }
                }
            );
        }

        if (publishListing) {

            publishListing.addEventListener(
                "click",
                function () {

                    if (
                        !createListingForm.checkValidity()
                    ) {
                        createListingForm.reportValidity();
                        return;
                    }

                    const listing =
                        getListingFormData();

                    const currentUser =
                        JSON.parse(
                            localStorage.getItem(
                                "harvestlinkCurrentUser"
                            )
                        );

                    listing.id =
                        Date.now();

                    listing.status =
                        "Active";

                    listing.createdAt =
                        new Date().toISOString();

                    listing.sellerId =
                        currentUser
                            ? currentUser.id
                            : null;

                    readListingImage(
                        function (imageData) {

                            listing.image =
                                imageData;

                            let listings =
                                getListings();

                            listings.push(
                                listing
                            );

                            saveListings(
                                listings
                            );

                            if (listingMessage) {
                                listingMessage.innerHTML =
                                    '<div class="alert alert-success"><strong>Listing published successfully.</strong> Your produce has been added to the marketplace.</div>';
                            }

                            createListingForm.reset();

                            setTimeout(
                                function () {
                                    window.location.href =
                                        "listings.html";
                                },
                                700
                            );
                        }
                    );
                }
            );
        }
    }

    const profileForm =
        document.getElementById(
            "profileForm"
        );

    if (profileForm) {

        const currentUser =
            JSON.parse(
                localStorage.getItem(
                    "harvestlinkCurrentUser"
                )
            );

        if (currentUser) {

            const firstName =
                document.getElementById(
                    "profileFirstName"
                );

            const lastName =
                document.getElementById(
                    "profileLastName"
                );

            const email =
                document.getElementById(
                    "profileEmail"
                );

            const phone =
                document.getElementById(
                    "profilePhone"
                );

            const city =
                document.getElementById(
                    "profileCityInput"
                );

            const state =
                document.getElementById(
                    "profileStateInput"
                );

            if (firstName) {
                firstName.value =
                    currentUser.firstName ||
                    "";
            }

            if (lastName) {
                lastName.value =
                    currentUser.lastName ||
                    "";
            }

            if (email) {
                email.value =
                    currentUser.email ||
                    "";
            }

            if (phone) {
                phone.value =
                    currentUser.phone ||
                    "";
            }

            if (city) {
                city.value =
                    currentUser.city ||
                    "";
            }

            if (state) {
                state.value =
                    currentUser.state ||
                    "";
            }
        }

        const saveProfile =
            document.getElementById(
                "saveProfile"
            );

        const profileMessage =
            document.getElementById(
                "profileMessage"
            );

        if (saveProfile) {

            saveProfile.addEventListener(
                "click",
                function () {

                    const firstName =
                        document
                            .getElementById(
                                "profileFirstName"
                            )
                            ?.value
                            .trim() || "";

                    const lastName =
                        document
                            .getElementById(
                                "profileLastName"
                            )
                            ?.value
                            .trim() || "";

                    const email =
                        document
                            .getElementById(
                                "profileEmail"
                            )
                            ?.value
                            .trim() || "";

                    const phone =
                        document
                            .getElementById(
                                "profilePhone"
                            )
                            ?.value
                            .trim() || "";

                    const city =
                        document
                            .getElementById(
                                "profileCityInput"
                            )
                            ?.value
                            .trim() || "";

                    const state =
                        document
                            .getElementById(
                                "profileStateInput"
                            )
                            ?.value
                            .trim() || "";

                    const user =
                        JSON.parse(
                            localStorage.getItem(
                                "harvestlinkCurrentUser"
                            )
                        );

                    if (!user) {
                        return;
                    }

                    const updatedUser = {
                        ...user,
                        firstName,
                        lastName,
                        email,
                        phone,
                        city,
                        state
                    };

                    localStorage.setItem(
                        "harvestlinkCurrentUser",
                        JSON.stringify(
                            updatedUser
                        )
                    );

                    let users =
                        JSON.parse(
                            localStorage.getItem(
                                "harvestlinkUsers"
                            )
                        ) || [];

                    users =
                        users.map(
                            function (item) {

                                return item.id ===
                                    user.id
                                    ? updatedUser
                                    : item;
                            }
                        );

                    localStorage.setItem(
                        "harvestlinkUsers",
                        JSON.stringify(
                            users
                        )
                    );

                    if (profileMessage) {
                        profileMessage.innerHTML =
                            '<div class="alert alert-success">Profile updated successfully.</div>';
                    }
                }
            );
        }

        const changePasswordBtn =
            document.getElementById(
                "changePasswordBtn"
            );

        if (changePasswordBtn) {

            changePasswordBtn.addEventListener(
                "click",
                function () {

                    alert(
                        "Password change is available as a frontend demo feature."
                    );
                }
            );
        }
    }

});

document.addEventListener("DOMContentLoaded", function () {

    function getListings() {
        return JSON.parse(
            localStorage.getItem(
                "harvestlinkListings"
            )
        ) || [];
    }

    function getOrders() {
        return JSON.parse(
            localStorage.getItem(
                "harvestlinkOrders"
            )
        ) || [];
    }

    function saveOrders(orders) {
        localStorage.setItem(
            "harvestlinkOrders",
            JSON.stringify(
                orders
            )
        );
    }

    function getUsers() {
        return JSON.parse(
            localStorage.getItem(
                "harvestlinkUsers"
            )
        ) || [];
    }

    function getAllSellerListings() {

        const builtIns =
            window.harvestLinkBuiltInListings ||
            [];

        const custom =
            getListings();

        return builtIns.concat(
            custom
        );
    }

    function getTableBody(element) {

        if (!element) {
            return null;
        }

        if (
            element.tagName &&
            element.tagName.toLowerCase() ===
                "tbody"
        ) {
            return element;
        }

        return (
            element.querySelector("tbody") ||
            element
        );
    }

    const sellerListingsTable =
        document.getElementById(
            "sellerListingsTable"
        );

    const recentOrdersTable =
        document.getElementById(
            "recentOrdersTable"
        );

    if (
        sellerListingsTable ||
        recentOrdersTable
    ) {

        const listings =
            getAllSellerListings();

        const orders =
            getOrders();

        const activeListingsCount =
            document.getElementById(
                "activeListingsCount"
            );

        const pendingOrdersCount =
            document.getElementById(
                "pendingOrdersCount"
            );

        const completedOrdersCount =
            document.getElementById(
                "completedOrdersCount"
            );

        const totalSales =
            document.getElementById(
                "totalSales"
            );

        if (activeListingsCount) {

            activeListingsCount.textContent =
                listings.filter(
                    function (item) {
                        return (
                            item.status !==
                            "Inactive"
                        );
                    }
                ).length;
        }

        if (pendingOrdersCount) {

            pendingOrdersCount.textContent =
                orders.filter(
                    function (order) {

                        return (
                            String(
                                order.status
                            ).toLowerCase() ===
                            "pending"
                        );
                    }
                ).length;
        }

        if (completedOrdersCount) {

            completedOrdersCount.textContent =
                orders.filter(
                    function (order) {

                        return (
                            String(
                                order.status
                            ).toLowerCase() ===
                            "completed"
                        );
                    }
                ).length;
        }

        if (totalSales) {

            const sales =
                orders
                    .filter(
                        function (order) {

                            return (
                                String(
                                    order.status
                                ).toLowerCase() ===
                                "completed"
                            );
                        }
                    )
                    .reduce(
                        function (
                            sum,
                            order
                        ) {

                            return (
                                sum +
                                Number(
                                    order.total ||
                                    0
                                )
                            );
                        },
                        0
                    );

            totalSales.textContent =
                "₹" +
                sales.toFixed(2);
        }

        if (sellerListingsTable) {

            const body =
                getTableBody(
                    sellerListingsTable
                );

            body.innerHTML = "";

            listings.forEach(
                function (listing) {

                    const row =
                        document.createElement(
                            "tr"
                        );

                    row.innerHTML = `
                        <td>
                            ${listing.productName || "Unnamed Product"}
                        </td>

                        <td>
                            ${listing.category || "-"}
                        </td>

                        <td>
                            ${listing.quantity || 0}
                            ${listing.unit || ""}
                        </td>

                        <td>
                            ₹${listing.price || 0}/${listing.unit || ""}
                        </td>

                        <td>
                            ${listing.location || "-"}
                        </td>

                        <td>
                            <span class="badge ${
                                listing.status ===
                                "Active"
                                    ? "bg-success"
                                    : "bg-secondary"
                            }">
                                ${listing.status || "Active"}
                            </span>
                        </td>
                    `;

                    body.appendChild(
                        row
                    );
                }
            );

            if (!listings.length) {

                body.innerHTML = `
                    <tr>
                        <td
                            colspan="6"
                            class="text-center text-muted py-4"
                        >
                            No listings created yet.
                        </td>
                    </tr>
                `;
            }
        }

        if (recentOrdersTable) {

            const body =
                getTableBody(
                    recentOrdersTable
                );

            body.innerHTML = "";

            const recentOrders =
                orders
                    .slice()
                    .sort(
                        function (a, b) {

                            return (
                                new Date(
                                    b.date ||
                                    b.createdAt ||
                                    0
                                ) -
                                new Date(
                                    a.date ||
                                    a.createdAt ||
                                    0
                                )
                            );
                        }
                    )
                    .slice(
                        0,
                        5
                    );

            recentOrders.forEach(
                function (order) {

                    const row =
                        document.createElement(
                            "tr"
                        );

                    row.innerHTML = `
                        <td>
                            ${order.id || "-"}
                        </td>

                        <td>
                            ${
                                order.productName ||
                                order.product ||
                                "-"
                            }
                        </td>

                        <td>
                            ${order.quantity || 0}
                        </td>

                        <td>
                            ₹${Number(
                                order.total || 0
                            ).toFixed(2)}
                        </td>

                        <td>
                            <span class="badge ${
                                order.status ===
                                "Completed"
                                    ? "bg-success"
                                    : order.status ===
                                      "In Progress"
                                        ? "bg-warning text-dark"
                                        : "bg-secondary"
                            }">
                                ${order.status || "Pending"}
                            </span>
                        </td>
                    `;

                    body.appendChild(
                        row
                    );
                }
            );

            if (!recentOrders.length) {

                body.innerHTML = `
                    <tr>
                        <td
                            colspan="5"
                            class="text-center text-muted py-4"
                        >
                            No orders yet.
                        </td>
                    </tr>
                `;
            }
        }
    }

    const adminUsers =
        document.getElementById(
            "adminUsers"
        );

    const adminListings =
        document.getElementById(
            "adminListings"
        );

    const adminOrders =
        document.getElementById(
            "adminOrders"
        );

    const adminPending =
        document.getElementById(
            "adminPending"
        );

    const usersTable =
        document.getElementById(
            "usersTable"
        );

    const adminListingsTable =
        document.getElementById(
            "adminListingsTable"
        );

    const adminOrdersTable =
        document.getElementById(
            "adminOrdersTable"
        );

    if (
        adminUsers ||
        adminListings ||
        adminOrders ||
        adminPending ||
        usersTable ||
        adminListingsTable ||
        adminOrdersTable
    ) {

        function renderAdminDashboard() {

            const users =
                getUsers();

            const listings =
                getAllSellerListings();

            const orders =
                getOrders();

            if (adminUsers) {
                adminUsers.textContent =
                    users.length;
            }

            if (adminListings) {
                adminListings.textContent =
                    listings.length;
            }

            if (adminOrders) {
                adminOrders.textContent =
                    orders.length;
            }

            if (adminPending) {

                adminPending.textContent =
                    orders.filter(
                        function (order) {

                            return (
                                String(
                                    order.status
                                ).toLowerCase() ===
                                "pending"
                            );
                        }
                    ).length;
            }

            if (usersTable) {

                const body =
                    getTableBody(
                        usersTable
                    );

                body.innerHTML = "";

                users
                    .slice()
                    .reverse()
                    .slice(
                        0,
                        8
                    )
                    .forEach(
                        function (user) {

                            const row =
                                document.createElement(
                                    "tr"
                                );

                            row.innerHTML = `
                                <td>
                                    ${
                                        user.firstName ||
                                        ""
                                    }
                                    ${
                                        user.lastName ||
                                        ""
                                    }
                                </td>

                                <td>
                                    ${user.email || "-"}
                                </td>

                                <td>
                                    <span class="badge bg-secondary">
                                        ${user.role || "-"}
                                    </span>
                                </td>

                                <td>
                                    ${user.city || "-"}
                                </td>
                            `;

                            body.appendChild(
                                row
                            );
                        }
                    );

                if (!users.length) {

                    body.innerHTML = `
                        <tr>
                            <td
                                colspan="4"
                                class="text-center text-muted py-4"
                            >
                                No registered users yet.
                            </td>
                        </tr>
                    `;
                }
            }

            if (adminListingsTable) {

                const body =
                    getTableBody(
                        adminListingsTable
                    );

                body.innerHTML = "";

                listings
                    .slice()
                    .reverse()
                    .slice(
                        0,
                        8
                    )
                    .forEach(
                        function (listing) {

                            const row =
                                document.createElement(
                                    "tr"
                                );

                            row.innerHTML = `
                                <td>
                                    ${
                                        listing.productName ||
                                        "-"
                                    }
                                </td>

                                <td>
                                    ${
                                        listing.category ||
                                        "-"
                                    }
                                </td>

                                <td>
                                    ${
                                        listing.location ||
                                        "-"
                                    }
                                </td>

                                <td>
                                    ₹${
                                        listing.price ||
                                        0
                                    }/${
                                        listing.unit ||
                                        ""
                                    }
                                </td>

                                <td>
                                    <span class="badge ${
                                        listing.status ===
                                        "Active"
                                            ? "bg-success"
                                            : "bg-secondary"
                                    }">
                                        ${
                                            listing.status ||
                                            "Active"
                                        }
                                    </span>
                                </td>
                            `;

                            body.appendChild(
                                row
                            );
                        }
                    );

                if (!listings.length) {

                    body.innerHTML = `
                        <tr>
                            <td
                                colspan="5"
                                class="text-center text-muted py-4"
                            >
                                No listings available.
                            </td>
                        </tr>
                    `;
                }
            }

            if (adminOrdersTable) {

                const body =
                    getTableBody(
                        adminOrdersTable
                    );

                body.innerHTML = "";

                orders
                    .slice()
                    .sort(
                        function (a, b) {

                            return (
                                new Date(
                                    b.date ||
                                    b.createdAt ||
                                    0
                                ) -
                                new Date(
                                    a.date ||
                                    a.createdAt ||
                                    0
                                )
                            );
                        }
                    )
                    .slice(
                        0,
                        10
                    )
                    .forEach(
                        function (order) {

                            const row =
                                document.createElement(
                                    "tr"
                                );

                            const currentStatus =
                                order.status ||
                                "Pending";

                            row.innerHTML = `
                                <td>
                                    ${order.id || "-"}
                                </td>

                                <td>
                                    ${
                                        order.productName ||
                                        order.product ||
                                        "-"
                                    }
                                </td>

                                <td>
                                    ${order.quantity || 0}
                                </td>

                                <td>
                                    ₹${Number(
                                        order.total ||
                                        0
                                    ).toFixed(2)}
                                </td>

                                <td>

                                    <select
                                        class="form-select form-select-sm order-status-control"
                                        data-order-id="${order.id}"
                                    >

                                        <option
                                            value="Pending"
                                            ${
                                                currentStatus ===
                                                "Pending"
                                                    ? "selected"
                                                    : ""
                                            }
                                        >
                                            Pending
                                        </option>

                                        <option
                                            value="In Progress"
                                            ${
                                                currentStatus ===
                                                "In Progress"
                                                    ? "selected"
                                                    : ""
                                            }
                                        >
                                            In Progress
                                        </option>

                                        <option
                                            value="Completed"
                                            ${
                                                currentStatus ===
                                                "Completed"
                                                    ? "selected"
                                                    : ""
                                            }
                                        >
                                            Completed
                                        </option>

                                        <option
                                            value="Cancelled"
                                            ${
                                                currentStatus ===
                                                "Cancelled"
                                                    ? "selected"
                                                    : ""
                                            }
                                        >
                                            Cancelled
                                        </option>

                                    </select>

                                </td>
                            `;

                            body.appendChild(
                                row
                            );
                        }
                    );

                if (!orders.length) {

                    body.innerHTML = `
                        <tr>
                            <td
                                colspan="5"
                                class="text-center text-muted py-4"
                            >
                                No orders available.
                            </td>
                        </tr>
                    `;
                }
            }
        }

        if (adminOrdersTable) {

            adminOrdersTable.addEventListener(
                "change",
                function (e) {

                    if (
                        !e.target.classList.contains(
                            "order-status-control"
                        )
                    ) {
                        return;
                    }

                    const orderId =
                        e.target.dataset.orderId;

                    const newStatus =
                        e.target.value;

                    const orders =
                        getOrders();

                    const order =
                        orders.find(
                            function (item) {

                                return (
                                    String(
                                        item.id
                                    ) ===
                                    String(
                                        orderId
                                    )
                                );
                            }
                        );

                    if (order) {

                        order.status =
                            newStatus;

                        saveOrders(
                            orders
                        );

                        renderAdminDashboard();
                    }
                }
            );
        }

        renderAdminDashboard();
    }

    const manageListings =
        document.getElementById(
            "manageListings"
        );

    const manageOrders =
        document.getElementById(
            "manageOrders"
        );

    const manageUsers =
        document.getElementById(
            "manageUsers"
        );

    if (manageListings) {

        manageListings.addEventListener(
            "click",
            function () {

                window.location.href =
                    "listings.html";
            }
        );
    }

    if (manageOrders) {

        manageOrders.addEventListener(
            "click",
            function () {

                window.location.href =
                    "orders.html";
            }
        );
    }

    if (manageUsers) {

        manageUsers.addEventListener(
            "click",
            function () {

                const table =
                    document.getElementById(
                        "usersTable"
                    );

                if (table) {

                    table.scrollIntoView({
                        behavior:
                            "smooth"
                    });
                }
            }
        );
    }

    const sellerCreateListing =
        document.getElementById(
            "sellerCreateListing"
        );

    if (sellerCreateListing) {

        sellerCreateListing.addEventListener(
            "click",
            function () {

                window.location.href =
                    "create-listing.html";
            }
        );
    }

    document
        .querySelectorAll(
            '[href="admin.html"]'
        )
        .forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        window.location.href =
                            "admin.html";
                    }
                );
            }
        );

    updateCartNavigation();
});