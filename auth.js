(function () {
    var passwordRegex =
        /^(?=.*[0-9])(?=.*[!@#$%^&*()\-_=+\[\]{}|;:'",.<>?\/\\`~]).{5,}$/;

    function showError(id, msg) {
        var el = document.getElementById(id);
        if (!el) return;
        var inputId = id.replace(/-err$/, "");
        var input = document.getElementById(inputId);
        if (msg) {
            el.textContent = msg;
            el.style.display = "block";
            if (input) {
                input.classList.add("input-error");
                input.classList.remove("input-valid");
            }
        } else {
            el.textContent = "";
            el.style.display = "none";
            if (input) {
                input.classList.remove("input-error");
            }
        }
    }

    function clearErrors(ids) {
        ids.forEach(function (id) {
            showError(id, "");
            var inputId = id.replace(/-err$/, "");
            var input = document.getElementById(inputId);
            if (input) input.classList.remove("input-valid");
        });
    }

    function markValidInputs(errorIds) {
        errorIds.forEach(function (errId) {
            var errEl = document.getElementById(errId);
            var input = document.getElementById(errId.replace(/-err$/, ""));
            if (input && errEl && errEl.style.display === "none") {
                input.classList.add("input-valid");
            }
        });
    }

    function isAbove15(dateValue) {
        if (!dateValue) return false;
        var birth = new Date(dateValue);
        var today = new Date();
        var age = today.getFullYear() - birth.getFullYear();
        var m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age >= 15;
    }

    function setLoggedInUser(username) {
        localStorage.setItem("loggedInUser", username);
    }

    function getLoggedInUser() {
        return localStorage.getItem("loggedInUser");
    }

    function signOut() {
        localStorage.removeItem("loggedInUser");
        window.location.href = "signin.html";
    }

    function escapeHtml(str) {
        return (str + "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    document.addEventListener("DOMContentLoaded", function () {
        var signupForm = document.getElementById("signupForm");
        if (signupForm) {
            signupForm.addEventListener("submit", function (e) {
                e.preventDefault();
                var errorIds = [
                    "su-username-err",
                    "su-password-err",
                    "su-confirm-err",
                    "su-birthdate-err",
                    "su-mobile-err",
                ];
                clearErrors(errorIds);

                var username = document
                    .getElementById("su-username")
                    .value.trim();
                var password = document.getElementById("su-password").value;
                var confirm = document.getElementById("su-confirm").value;
                var birthdate = document.getElementById("su-birthdate").value;
                var mobile = document.getElementById("su-mobile").value.trim();
                var valid = true;

                if (!username) {
                    showError(
                        "su-username-err",
                        "Please enter a valid username.",
                    );
                    valid = false;
                }

                if (!passwordRegex.test(password)) {
                    showError(
                        "su-password-err",
                        "Password must be at least 5 characters and include at least 1 number and 1 special character.",
                    );
                    valid = false;
                }

                if (password !== confirm || !confirm) {
                    showError("su-confirm-err", "Passwords do not match.");
                    valid = false;
                }

                if (!birthdate) {
                    showError(
                        "su-birthdate-err",
                        "Please enter your birth date.",
                    );
                    valid = false;
                } else if (!isAbove15(birthdate)) {
                    showError(
                        "su-birthdate-err",
                        "You are not eligible because you are below 15 years of age.",
                    );
                    valid = false;
                }

                if (!/^[0-9]{10}$/.test(mobile)) {
                    showError(
                        "su-mobile-err",
                        "Mobile number must be exactly 10 digits.",
                    );
                    valid = false;
                }

                markValidInputs(errorIds);

                if (valid) {
                    setLoggedInUser(username);
                    window.location.href =
                        "index.html?username=" + encodeURIComponent(username);
                }
            });

            var mobileInput = document.getElementById("su-mobile");
            if (mobileInput) {
                mobileInput.addEventListener("input", function () {
                    this.value = this.value.replace(/\D/g, "").slice(0, 10);
                });
            }
        }

        var signinForm = document.getElementById("signinForm");
        if (signinForm) {
            signinForm.addEventListener("submit", function (e) {
                e.preventDefault();
                clearErrors(["si-username-err", "si-password-err"]);

                var username = document
                    .getElementById("si-username")
                    .value.trim();
                var password = document.getElementById("si-password").value;
                var valid = true;

                if (!username) {
                    showError(
                        "si-username-err",
                        "Please enter a valid username.",
                    );
                    valid = false;
                }

                if (!passwordRegex.test(password)) {
                    showError(
                        "si-password-err",
                        "Password must be at least 5 characters and include at least 1 number and 1 special character.",
                    );
                    valid = false;
                }

                markValidInputs(["si-username-err", "si-password-err"]);

                if (valid) {
                    setLoggedInUser(username);
                    window.location.href =
                        "index.html?username=" + encodeURIComponent(username);
                }
            });
        }

        var authArea = document.getElementById("authArea");
        if (authArea) {
            var userSpan = document.getElementById("authUser");
            var signoutLink = document.getElementById("signoutLink");
            var logged = getLoggedInUser();

            var params = new URLSearchParams(window.location.search);
            var userFromUrl = params.get("username");
            if (userFromUrl) {
                var decoded = decodeURIComponent(
                    userFromUrl.replace(/\+/g, " "),
                );
                setLoggedInUser(decoded);
                logged = decoded;
            }

            if (userSpan) {
                if (logged) {
                    userSpan.innerHTML = "<b>" + escapeHtml(logged) + "</b>";
                } else {
                    userSpan.innerHTML =
                        '<a href="signin.html"><b>Sign in</b></a>';
                }
            }

            if (signoutLink) {
                signoutLink.addEventListener("click", function (ev) {
                    ev.preventDefault();
                    signOut();
                });
            }

            class Cart {
                constructor(user = "Guest") {
                    this.user = user || "Guest";
                    this.storageKey = "siteCart_" + (this.user || "Guest");
                    this.items = [];
                    this.load();
                }

                load() {
                    try {
                        const raw = localStorage.getItem(this.storageKey);
                        if (raw) this.items = JSON.parse(raw) || [];
                    } catch (e) {
                        this.items = [];
                    }
                    this.count = this.items.length;
                    this.updateHeaderCount();
                }

                save() {
                    try {
                        localStorage.setItem(
                            this.storageKey,
                            JSON.stringify(this.items),
                        );
                    } catch (e) {}
                    this.count = this.items.length;
                    this.updateHeaderCount();
                }

                addItem(item) {
                    this.items.push(item);
                    this.save();
                    return this;
                }

                removeItem(index) {
                    if (index >= 0 && index < this.items.length) {
                        this.items.splice(index, 1);
                        this.save();
                    }
                    return this;
                }

                clear() {
                    this.items = [];
                    this.save();
                    return this;
                }

                getItems() {
                    return this.items.slice();
                }

                updateHeaderCount() {
                    const cartEl = document.getElementById("cart");
                    if (cartEl)
                        cartEl.textContent = "Cart (" + (this.count || 0) + ")";
                }
            }

            function CartConstructor(user) {
                return new Cart(user);
            }

            function createDiscount(rate = 0.1) {
                return function (price = 0) {
                    return Math.max(0, price - price * rate);
                };
            }

            function createQuantityLimiter(max = 20) {
                var limit = Number(max) || 0;
                return function (cart) {
                    if (!cart) return false;
                    var current = cart.count || 0;
                    return current < limit;
                };
            }

            function logUserAction(action, item) {
                var name = this && this.user ? this.user : "Guest";
                console.log(name + " " + action + (item ? ": " + item : ""));
            }

            function createItem(name, price = 0) {
                return { name: name, price: price };
            }

            function parsePriceFromCard(card) {
                if (!card) return 0;
                var details = card.querySelector(".details");
                if (!details) return 0;
                var txt = details.textContent || "";
                var m = txt.match(/₹\s*([0-9,]+)/);
                if (m && m[1]) return parseInt(m[1].replace(/,/g, ""), 10) || 0;
                var n = txt.match(/([0-9,]{2,})/);
                return n ? parseInt(n[1].replace(/,/g, ""), 10) || 0 : 0;
            }

            function renderCartModal(cart) {
                var existing = document.getElementById("cart-modal-overlay");
                if (existing) existing.remove();

                var overlay = document.createElement("div");
                overlay.id = "cart-modal-overlay";
                overlay.style.position = "fixed";
                overlay.style.inset = "0";
                overlay.style.background = "rgba(0,0,0,0.45)";
                overlay.style.display = "flex";
                overlay.style.alignItems = "center";
                overlay.style.justifyContent = "center";
                overlay.style.zIndex = "2000";

                var modal = document.createElement("div");
                modal.style.width = "min(900px, 95%)";
                modal.style.maxHeight = "80%";
                modal.style.overflow = "auto";
                modal.style.background = "white";
                modal.style.borderRadius = "12px";
                modal.style.padding = "18px";
                modal.style.boxShadow = "0 8px 40px rgba(2,6,23,0.3)";

                var title = document.createElement("h3");
                title.textContent = "Your Cart";
                modal.appendChild(title);

                var list = document.createElement("div");
                list.style.marginTop = "8px";

                var items = cart.getItems();
                var total = 0;
                items.forEach(function (it, idx) {
                    var row = document.createElement("div");
                    row.style.display = "flex";
                    row.style.justifyContent = "space-between";
                    row.style.alignItems = "center";
                    row.style.padding = "8px 0";
                    row.style.borderBottom = "1px solid #eee";

                    var left = document.createElement("div");
                    left.textContent = it.name || "Item";
                    left.style.flex = "1";

                    var mid = document.createElement("div");
                    mid.textContent = "₹" + (it.price || 0);
                    mid.style.width = "120px";
                    mid.style.textAlign = "right";

                    var removeBtn = document.createElement("button");
                    removeBtn.textContent = "Remove";
                    removeBtn.style.marginLeft = "12px";
                    removeBtn.style.background = "#ef4444";
                    removeBtn.style.color = "white";
                    removeBtn.style.border = "none";
                    removeBtn.style.padding = "6px 10px";
                    removeBtn.style.borderRadius = "6px";
                    removeBtn.addEventListener("click", function () {
                        cart.removeItem(idx);
                        renderCartModal(cart);
                    });

                    row.appendChild(left);
                    row.appendChild(mid);
                    row.appendChild(removeBtn);
                    list.appendChild(row);

                    total += Number(it.price || 0);
                });

                modal.appendChild(list);

                var footer = document.createElement("div");
                footer.style.display = "flex";
                footer.style.justifyContent = "space-between";
                footer.style.alignItems = "center";
                footer.style.marginTop = "12px";

                var totalEl = document.createElement("div");
                totalEl.textContent = "Total: ₹" + total;
                totalEl.style.fontWeight = "700";

                var rightGroup = document.createElement("div");

                var clearBtn = document.createElement("button");
                clearBtn.className = "cart-clear-btn";
                clearBtn.textContent = "Clear";
                clearBtn.addEventListener("click", function () {
                    cart.clear.apply(cart);
                    renderCartModal(cart);
                });

                var checkoutBtn = document.createElement("button");
                checkoutBtn.className = "cart-checkout-btn";
                checkoutBtn.textContent = "Checkout";
                checkoutBtn.addEventListener("click", function () {
                    if (cart.count === 0) {
                        alert("Your cart is empty.");
                        return;
                    }
                    alert("Checkout successful. Total: ₹" + total);
                    cart.clear.apply(cart);
                    renderCartModal(cart);
                });

                rightGroup.appendChild(clearBtn);
                rightGroup.appendChild(checkoutBtn);

                footer.appendChild(totalEl);
                footer.appendChild(rightGroup);

                modal.appendChild(footer);

                overlay.addEventListener("click", function (ev) {
                    if (ev.target === overlay) overlay.remove();
                });

                overlay.appendChild(modal);
                document.body.appendChild(overlay);
            }

            var demoUser = logged ? logged : "Guest";
            var demoCart = new Cart(demoUser);
            window.demoCart = demoCart;

            var tenOff = createDiscount(0.1);

            var cartHeader = document.getElementById("cart");
            if (cartHeader) {
                cartHeader.addEventListener("click", function (e) {
                    e.preventDefault();
                    renderCartModal(demoCart);
                });
            }

            document.querySelectorAll(".product-card").forEach(function (card) {
                if (!card) return;
                var buyBtn = card.querySelector(".buy-now-btn");

                var addBtn = card.querySelector(".add-to-cart-btn");
                if (!addBtn) {
                    addBtn = document.createElement("button");
                    addBtn.type = "button";
                    addBtn.className = "add-to-cart-btn";
                    addBtn.textContent = "Add to Cart";
                    if (buyBtn && buyBtn.parentNode) {
                        buyBtn.parentNode.insertBefore(addBtn, buyBtn);
                    } else {
                        card.appendChild(addBtn);
                    }
                }

                var addLimiter = createQuantityLimiter(20);

                function addItemFromCard() {
                    var titleEl = card.querySelector(".details b");
                    var title = titleEl ? titleEl.textContent.trim() : "Item";
                    var price = parsePriceFromCard(card) || 0;
                    var item = createItem(title, price);

                    if (!addLimiter(demoCart)) {
                        alert("Cannot add more items — limit reached.");
                        return;
                    }

                    demoCart.addItem.call(demoCart, item);
                    addBtn.textContent = "Added";
                    addBtn.disabled = true;
                    setTimeout(function () {
                        addBtn.textContent = "Add to Cart";
                        addBtn.disabled = false;
                    }, 1200);
                    console.log("Added to cart:", item.name, "₹" + item.price);
                }

                addBtn.addEventListener("click", function (e) {
                    e.preventDefault();
                    addItemFromCard();
                });

                if (buyBtn) {
                    if (!buyBtn._cartBound) {
                        buyBtn.addEventListener("click", function (e) {
                            var titleEl = card.querySelector(".details b");
                            var title = titleEl
                                ? titleEl.textContent.trim()
                                : "Item";
                            var price = parsePriceFromCard(card) || 0;
                            var item = createItem(title, price);
                            var boundLog = logUserAction.bind(
                                demoCart,
                                "purchased",
                            );
                            boundLog(item.name);
                            console.log(
                                "Discounted (10%):",
                                tenOff(item.price),
                            );
                        });
                        buyBtn._cartBound = true;
                    }
                }
            });
        }
    });
})();
