// ❗ The ✨ TASKS inside this component are NOT IN ORDER.
// ❗ Check the README for the appropriate sequence to follow.
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as Yup from 'yup';

const App = () => {
  const [formData, setFormData] = useState({
    username: '',
    favLanguage: '',
    favFood: '',
    agreement: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    favLanguage: Yup.string().required('Favorite language is required'),
    favFood: Yup.string().required('Favorite food is required'),
    agreement: Yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
  });

  useEffect(() => {
    const validateForm = async () => {
      try {
        await validationSchema.validate(formData, { abortEarly: false });
        setErrors({});
        setIsSubmitDisabled(false);
      } catch (err) {
        const validationErrors = {};
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
        setIsSubmitDisabled(true);
      }
    };

    validateForm();
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('YOUR_API_ENDPOINT', formData);
      setSuccessMessage('Form submitted successfully!');
      setErrorMessage('');
      setFormData({
        username: '',
        favLanguage: '',
        favFood: '',
        agreement: false,
      });
    } catch (error) {
      setSuccessMessage('');
      setErrorMessage('Form submission failed.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && <p>{errors.username}</p>}
        </div>
        <div>
          <label>Favorite Language:</label>
          <input
            type="text"
            name="favLanguage"
            value={formData.favLanguage}
            onChange={handleChange}
          />
          {errors.favLanguage && <p>{errors.favLanguage}</p>}
        </div>
        <div>
          <label>Favorite Food:</label>
          <input
            type="text"
            name="favFood"
            value={formData.favFood}
            onChange={handleChange}
          />
          {errors.favFood && <p>{errors.favFood}</p>}
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="agreement"
              checked={formData.agreement}
              onChange={handleChange}
            />
            I agree to the terms and conditions
          </label>
          {errors.agreement && <p>{errors.agreement}</p>}
        </div>
        <button type="submit" disabled={isSubmitDisabled}>Submit</button>
      </form>
      {successMessage && <p>{successMessage}</p>}
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default App;
