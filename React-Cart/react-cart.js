const { useEffect, useState } = React;

const products = [
    {
        id: 1,
        name: "Classic Denim Jacket",
        category: "Outerwear",
        price: 1299,
    },
    {
        id: 2,
        name: "Minimal White Sneakers",
        category: "Footwear",
        price: 1899,
    },
    {
        id: 3,
        name: "Everyday Leather Wallet",
        category: "Accessories",
        price: 799,
    },
    {
        id: 4,
        name: "Cotton Printed Shirt",
        category: "Casual Wear",
        price: 999,
    },
];

function formatPrice(value) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(value);
}

function CartApp() {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("react-demo-cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem("react-demo-theme");

        if (savedTheme === "light" || savedTheme === "dark") {
            return savedTheme;
        }

        return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    });

    useEffect(() => {
        localStorage.setItem("react-demo-cart", JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        document.body.setAttribute("data-theme", theme);
        localStorage.setItem("react-demo-theme", theme);
    }, [theme]);

    function addToCart(product) {
        setCart((currentCart) => {
            const existingItem = currentCart.find(
                (item) => item.id === product.id,
            );

            if (existingItem) {
                return currentCart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item,
                );
            }

            return [...currentCart, { ...product, quantity: 1 }];
        });
    }

    function updateQuantity(productId, nextQuantity) {
        if (nextQuantity <= 0) {
            setCart((currentCart) =>
                currentCart.filter((item) => item.id !== productId),
            );
            return;
        }

        setCart((currentCart) =>
            currentCart.map((item) =>
                item.id === productId
                    ? { ...item, quantity: nextQuantity }
                    : item,
            ),
        );
    }

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );
    const deliveryFee = subtotal > 0 ? 99 : 0;
    const grandTotal = subtotal + deliveryFee;

    return (
        <div className="page">
            <div className="topbar">
                <button
                    className="button theme-toggle"
                    onClick={() =>
                        setTheme((currentTheme) =>
                            currentTheme === "light" ? "dark" : "light",
                        )
                    }
                >
                    Switch to {theme === "light" ? "dark" : "light"} mode
                </button>
            </div>

            <div className="layout">
                <section className="section">
                    <h2>Products</h2>
                    <div className="product-grid">
                        {products.map((product) => (
                            <article className="product-card" key={product.id}>
                                <h3>{product.name}</h3>
                                <p className="meta">{product.category}</p>
                                <div className="price">
                                    {formatPrice(product.price)}
                                </div>
                                <button
                                    className="button button-primary"
                                    onClick={() => addToCart(product)}
                                >
                                    Add to cart
                                </button>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="section">
                    <h2>Cart Summary</h2>

                    {cart.length === 0 ? (
                        <p className="empty-state">
                            Your cart is empty. Add a product to test quantity
                            updates and price calculation.
                        </p>
                    ) : (
                        <div className="cart-stack">
                            {cart.map((item) => (
                                <article className="cart-item" key={item.id}>
                                    <div className="cart-row">
                                        <div>
                                            <h3>{item.name}</h3>
                                            <p className="meta">
                                                {formatPrice(item.price)} each
                                            </p>
                                        </div>

                                        <div className="qty-controls">
                                            <button
                                                onClick={() =>
                                                    updateQuantity(
                                                        item.id,
                                                        item.quantity - 1,
                                                    )
                                                }
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                min="0"
                                                value={item.quantity}
                                                onChange={(event) =>
                                                    updateQuantity(
                                                        item.id,
                                                        Number(
                                                            event.target.value,
                                                        ),
                                                    )
                                                }
                                            />
                                            <button
                                                onClick={() =>
                                                    updateQuantity(
                                                        item.id,
                                                        item.quantity + 1,
                                                    )
                                                }
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <div className="summary-line">
                                        <span>Item total</span>
                                        <strong>
                                            {formatPrice(
                                                item.price * item.quantity,
                                            )}
                                        </strong>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}

                    <div className="summary-card" style={{ marginTop: "18px" }}>
                        <div className="summary-line">
                            <span>Total items</span>
                            <strong>{totalItems}</strong>
                        </div>
                        <div className="summary-line">
                            <span>Subtotal</span>
                            <strong>{formatPrice(subtotal)}</strong>
                        </div>
                        <div className="summary-line">
                            <span>Delivery fee</span>
                            <strong>{formatPrice(deliveryFee)}</strong>
                        </div>
                        <div className="summary-total">
                            <span>Grand total</span>
                            <span>{formatPrice(grandTotal)}</span>
                        </div>
                    </div>

                    <button
                        className="button button-secondary"
                        onClick={() => setCart([])}
                    >
                        Clear cart
                    </button>
                </section>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<CartApp />);
