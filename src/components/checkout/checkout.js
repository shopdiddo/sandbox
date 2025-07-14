"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

import { useCart } from "@/providers/cart";

import { variants } from "@/utils/animation-variants";
import { sleep } from "@/utils/helpers";

import s from "./checkout.module.css";

export function Checkout({ checkoutBtnText = "Place Order", onOrderComplete = () => {} }) {
  const cart = useCart((s) => s.cart);
  const cartId = useCart((s) => s.cartId);
  const total = useCart((s) => s.cost.total);
  const clearCart = useCart((s) => s.clearCart);
  const isCartLoading = useCart((s) => s.isLoading);
  const isCartError = useCart((s) => s.isError);
  const cartError = useCart((s) => s.error);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    provinceCode: "",
    countryCode: "",
    postalCode: "",
    email: "",
    phone: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);

  const [orderComplete, setOrderComplete] = useState(false);
  const [errors, setErrors] = useState({});

  const validateField = useCallback((name, value) => {
    switch (name) {
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Please enter a valid email address";
      case "firstName":
      case "lastName":
        return value.trim().length >= 2 ? "" : "Must be at least 2 characters";
      case "address":
        return value.trim().length >= 5 ? "" : "Please enter a valid address";
      case "city":
        return value.trim().length >= 2 ? "" : "Please enter a valid city";
      case "postalCode":
        return /^[A-Za-z0-9\s-]{3,10}$/.test(value) ? "" : "Please enter a valid postal code";
      case "country":
        return value.trim().length >= 2 ? "" : "Please enter a valid country";
    }
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);

      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }, [formData, validateField]);

  const onInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      setFormData((prev) => ({ ...prev, [name]: value }));

      if (errors[name]) {
        const error = validateField(name, value);

        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [errors, validateField]
  );

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      validateForm();
      setIsLoading(true);

      try {
        const res = await fetch("http://localhost:8080/cart/customer", {
          method: "POST",
          body: JSON.stringify({
            cart_id: cartId,
            buyer_identity: {
              firstName: formData.firstName,
              lastName: formData.lastName,
              address1: formData.address1,
              address2: formData.address2,
              city: formData.city,
              provinceCode: formData.provinceCode,
              countryCode: formData.countryCode,
              postalCode: formData.postalCode,
              email: formData.email,
              phone: formData.phone,
            },
          }),
        });

        const data = await res.json();
      } catch (err) {
        setIsError(true);
        setError(err);
      } finally {
        setIsLoading(false);
      }

      setIsLoading(false);
    },
    [cartId, formData, clearCart, validateForm, onOrderComplete]
  );

  return (
    <AnimatePresence mode="wait">
      {orderComplete ? (
        <motion.div
          key="order-confirmation"
          className={s.orderConfirmation}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <motion.div
            className={s.confirmationIcon}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 200 }}
          >
            ✓
          </motion.div>

          <motion.h2
            className={s.confirmationTitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            Order Confirmed!
          </motion.h2>

          <motion.p
            className={s.confirmationMessage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            Thank you for your purchase. Your order has been successfully placed and you'll receive a confirmation email
            shortly.
          </motion.p>

          <motion.div
            className={s.confirmationTotal}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.8 }}
          >
            Total: {total}
          </motion.div>
        </motion.div>
      ) : (
        <>
          <motion.div className={s.checkoutForm}>
            {isCartLoading && <div className={s.loadingOverlay}>Letting cart update...</div>}

            {!isCartLoading && isCartError && (
              <div className={s.errorOverlay}>
                <code>error: {cartError?.toString()}</code>
              </div>
            )}
            <motion.div
              className={s.checkoutSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className={s.checkoutSectionTitle}>Contact Information</div>

              <div className={s.formRow}>
                <div className={s.formGroup}>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={onInputChange}
                    autoComplete="noautocomplete"
                    required
                    className={`${s.formInput} ${errors.email ? s.formInputError : ""}`}
                  />
                  {errors.email && <div className={s.error}>{errors.email}</div>}
                </div>

                <div className={s.formGroup}>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={onInputChange}
                    autoComplete="noautocomplete"
                    required
                    className={`${s.formInput} ${errors.phone ? s.formInputError : ""}`}
                  />
                  {errors.phone && <div className={s.error}>{errors.phone}</div>}
                </div>
              </div>
            </motion.div>

            <motion.div
              className={s.checkoutSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className={s.checkoutSectionTitle}>Shipping Address</div>

              <div className={s.formRow}>
                <div className={s.formGroup}>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={onInputChange}
                    required
                    className={`${s.formInput} ${errors.firstName ? s.formInputError : ""}`}
                    autoComplete="noautocomplete"
                  />
                  {errors.firstName && <div className={s.error}>{errors.firstName}</div>}
                </div>

                <div className={s.formGroup}>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={onInputChange}
                    required
                    className={`${s.formInput} ${errors.lastName ? s.formInputError : ""}`}
                    autoComplete="noautocomplete"
                  />
                  {errors.lastName && <div className={s.error}>{errors.lastName}</div>}
                </div>
              </div>

              <div className={s.formGroup}>
                <input
                  type="text"
                  name="address1"
                  placeholder="Address 1"
                  value={formData.address1}
                  onChange={onInputChange}
                  required
                  className={`${s.formInput} ${errors.address1 ? s.formInputError : ""}`}
                  autoComplete="noautocomplete"
                />
                {errors.address1 && <div className={s.error}>{errors.address1}</div>}
              </div>

              <div className={s.formRow}>
                <div className={s.formGroup}>
                  <input
                    type="text"
                    name="address2"
                    placeholder="Address 2"
                    value={formData.address2}
                    onChange={onInputChange}
                    required
                    className={`${s.formInput} ${errors.address2 ? s.formInputError : ""}`}
                    autoComplete="noautocomplete"
                  />
                  {errors.address2 && <div className={s.error}>{errors.address2}</div>}
                </div>

                <div className={s.formGroup}>
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={onInputChange}
                    required
                    className={`${s.formInput} ${errors.city ? s.formInputError : ""}`}
                    autoComplete="noautocomplete"
                  />
                  {errors.city && <div className={s.error}>{errors.city}</div>}
                </div>
              </div>

              <div className={s.formRow}>
                <div className={s.formGroup}>
                  <input
                    type="text"
                    name="provinceCode"
                    placeholder="Province"
                    value={formData.provinceCode}
                    onChange={onInputChange}
                    required
                    className={`${s.formInput} ${errors.provinceCode ? s.formInputError : ""}`}
                    autoComplete="noautocomplete"
                  />
                  {errors.provinceCode && <div className={s.error}>{errors.provinceCode}</div>}
                </div>

                <div className={s.formGroup}>
                  <input
                    type="text"
                    name="postalCode"
                    placeholder="Postal Code"
                    value={formData.postalCode}
                    onChange={onInputChange}
                    required
                    className={`${s.formInput} ${errors.postalCode ? s.formInputError : ""}`}
                    autoComplete="noautocomplete"
                  />
                  {errors.postalCode && <div className={s.error}>{errors.postalCode}</div>}
                </div>
                <div className={s.formGroup}>
                  <input
                    type="text"
                    name="countryCode"
                    placeholder="Country code"
                    value={formData.country}
                    onChange={onInputChange}
                    required
                    className={`${s.formInput} ${errors.countryCode ? s.formInputError : ""}`}
                    autoComplete="noautocomplete"
                  />
                  {errors.countryCode && <div className={s.error}>{errors.countryCode}</div>}
                </div>
              </div>
            </motion.div>

            <motion.div
              className={s.checkoutSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <div className={s.checkoutSectionTitle}>Order Summary</div>

              <div className={s.orderSummary}>
                {cart.map((item) => (
                  <div key={item.id} className={s.orderItem}>
                    <div className={s.orderItemImage}>
                      <img src={item.image} alt={item.title} />
                    </div>

                    <div className={s.orderItemDetails}>
                      <span className={s.orderItemName}>{item.title}</span>
                      <div className={s.orderItemMeta}>
                        <div className={s.orderColorSwatch} style={{ "--color": "#6b7280" }} />
                        <span>
                          <span className={s.orderClothingSize}>{item.size} </span> • Qty: {item.quantity}
                        </span>
                      </div>
                    </div>

                    <div className={s.orderItemPrice}> {item.price}</div>
                  </div>
                ))}

                <div className={s.orderTotal}>
                  <div className={s.orderTotalLabel}>Total</div>
                  <div className={s.orderTotalPrice}>{total}</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className={s.footer}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <motion.button
              type="submit"
              className={s.placeOrderBtn}
              disabled={isLoading}
              onClick={onSubmit}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? "Loading..." : checkoutBtnText}
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
