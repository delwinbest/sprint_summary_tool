import React, { useState } from "react";

const useRequest = ({ url, method, body, onSuccess = () => {} }) => {
  const [errors, setErrors] = useState(null);
  const clearErrors = () => {
    setErrors(null);
  };

  const doRequest = async (props = {}) => {
    const devUrlPrefix = "http://localhost";
    let fetchUrl = "";
    if (props.url !== undefined) {
      url = props.url;
    }
    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
      fetchUrl = devUrlPrefix + url;
    } else {
      fetchUrl = url;
    }
    const requestOptions = {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, ...props.body }),
    };

    console.log(fetchUrl);
    try {
      setErrors(null);
      const response = await fetch(fetchUrl, requestOptions);
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
