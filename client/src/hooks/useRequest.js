import React, { useState } from "react";

const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const clearErrors = () => {
    setErrors(null);
  };

  const doRequest = async (props = {}) => {
    const requestOptions = {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, ...props }),
    };

    try {
      setErrors(null);
      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        throw response;
      }
      const responseData = await response.json();
      // console.log(responseData);
      if (onSuccess) {
        onSuccess(responseData);
      }
      return responseData;
    } catch (err) {
      const { errors } = await err.json();
      setErrors(
        <p>
          {errors.map((err) => {
            return err.message + ". ";
          })}
        </p>
      );
    }
  };

  return { doRequest, clearErrors, errors };
};

export default useRequest;
