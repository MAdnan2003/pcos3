import React from "react";

export default function UploadForm({ onChange, label }) {
  return (
    <div>
      <label>{label}</label>
      <input type="text" onChange={onChange} placeholder={`Enter ${label} URL`} />
    </div>
  );
}
