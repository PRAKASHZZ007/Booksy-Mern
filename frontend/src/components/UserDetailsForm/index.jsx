import { useState } from "react";
import "./index.css";

const UserDetailsForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    country: "",
  });

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="user-form">
      <h2>Delivery Address and Contact Info</h2>

      <form onSubmit={handleSubmit}>
        <label className="user-details-form-label">Name</label>
        <br />

        <div className="grid-container">
          <input
            className="user-details-form-name-input"
            type="text"
            name="firstName"
            required
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleInputChange}
          />

          <input
            className="user-details-form-name-input"
            type="text"
            name="lastName"
            required
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleInputChange}
          />
        </div>

        <label className="user-details-form-label">
          Email
          <br />
          <input
            className="user-details-form-input"
            type="email"
            name="email"
            required
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </label>

        <br />

        <label className="user-details-form-label">
          Phone Number
          <br />
          <input
            className="user-details-form-input"
            type="tel"
            name="phone"
            required
            placeholder="Phone"
            pattern="[0-9]{10}"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </label>

        <br />

        <label className="user-details-form-label">
          Address
          <br />
          <input
            className="user-details-form-input"
            type="text"
            name="address"
            required
            placeholder="Address"
            value={formData.address}
            onChange={handleInputChange}
          />
        </label>

        <br />

        <label className="user-details-form-label">
          Country
          <br />
          <input
            className="user-details-form-input"
            type="text"
            name="country"
            required
            value={formData.country}
            onChange={handleInputChange}
          />
        </label>

        <p className="user-details-form-label">
          Payment Method: <strong>Cash on Delivery (COD)</strong>
          </p>

        <br />

        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default UserDetailsForm;
