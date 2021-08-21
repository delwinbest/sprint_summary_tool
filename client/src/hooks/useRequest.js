import React, { useState } from "react";

const useRequest = ({ url, method, body, onSuccess = () => {} }) => {
  const [errors, setErrors] = useState(null);
  const clearErrors = () => {
    setErrors(null);
  };

  const doRequest = async (props = {}) => {
    try {
      setErrors(null);
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
      let requestOptions = {
        method: method,
        headers: { "Content-Type": "application/json" },
      };
      if (method.toUpperCase() !== "GET") {
        requestOptions.body = JSON.stringify({ ...body, ...props.body });
      }
      // console.log(fetchUrl, requestOptions);
      const response = await fetch(fetchUrl, requestOptions);
      if (!response.ok) {
        throw response;
      }
      const responseData = await response.json();
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
